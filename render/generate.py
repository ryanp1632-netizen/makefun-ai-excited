# SPDX-License-Identifier: MIT
"""Render candidate images with Z-Image-Turbo (Q8_0 GGUF) on an 8 GB GPU, offline.

Example:
  python -I render/generate.py --base-dir MODELS/zimage --gguf MODELS/z-image-turbo-Q8_0.gguf \
      --prompt-file render/prompt.txt --seeds 1 2 3 --out-dir ../cand
"""
import argparse
import gc
import os
import time

os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

import torch
from accelerate import cpu_offload
from diffusers import GGUFQuantizationConfig, ZImagePipeline, ZImageTransformer2DModel


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-dir", required=True, help="diffusers folder of the base model")
    ap.add_argument("--gguf", required=True, help="GGUF transformer weights")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--prompt")
    g.add_argument("--prompt-file")
    ap.add_argument("--seeds", type=int, nargs="+", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--steps", type=int, default=9)
    ap.add_argument("--size", type=int, default=1024)
    args = ap.parse_args()

    if args.prompt_file:
        with open(args.prompt_file, encoding="utf-8") as f:
            prompt = f.read().strip()
    else:
        prompt = args.prompt.strip()
    os.makedirs(args.out_dir, exist_ok=True)
    cuda = torch.device("cuda")

    pipe = ZImagePipeline.from_pretrained(
        args.base_dir, transformer=None, torch_dtype=torch.bfloat16, local_files_only=True
    )

    # Encode the prompt once with the text encoder offloaded, then free it.
    cpu_offload(pipe.text_encoder, execution_device=cuda)
    with torch.no_grad():
        embeds = pipe.encode_prompt(prompt=prompt, device="cuda", do_classifier_free_guidance=False)
    if isinstance(embeds, tuple):
        embeds = embeds[0]
    embeds = [e.detach().to(cuda) for e in embeds]
    pipe.text_encoder = None
    gc.collect()
    torch.cuda.empty_cache()

    transformer = ZImageTransformer2DModel.from_single_file(
        args.gguf,
        quantization_config=GGUFQuantizationConfig(compute_dtype=torch.bfloat16),
        config=args.base_dir,
        subfolder="transformer",
        torch_dtype=torch.bfloat16,
    )
    transformer.enable_group_offload(
        onload_device=cuda,
        offload_device=torch.device("cpu"),
        offload_type="block_level",
        num_blocks_per_group=4,
        use_stream=True,
        low_cpu_mem_usage=True,
    )
    pipe.transformer = transformer
    pipe.vae.to(cuda)

    for seed in args.seeds:
        t0 = time.time()
        gen = torch.Generator("cuda").manual_seed(seed)
        image = pipe(
            prompt_embeds=embeds,
            num_inference_steps=args.steps,
            guidance_scale=0.0,
            height=args.size,
            width=args.size,
            generator=gen,
        ).images[0]
        path = os.path.join(args.out_dir, f"seed{seed:04d}.png")
        image.save(path)
        print(f"seed {seed}: {path} ({time.time() - t0:.1f}s)", flush=True)


if __name__ == "__main__":
    main()
