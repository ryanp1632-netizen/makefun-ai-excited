# SPDX-License-Identifier: MIT
"""Turn a chosen candidate into the repository's entry.png (<= 1024 px, < 1 MiB).

Writes PNG if it fits under 1 MiB, otherwise a high-quality JPEG (still named entry.png).
Usage: python -I render/finish.py CANDIDATE.png [--out entry.png]
"""
import argparse
import io
import os

from PIL import Image

MAX_BYTES = 1024 * 1024
MAX_SIDE = 1024


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("candidate")
    default_out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "entry.png")
    ap.add_argument("--out", default=default_out)
    args = ap.parse_args()

    img = Image.open(args.candidate).convert("RGB")
    if max(img.size) > MAX_SIDE:
        img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    fmt = "PNG"
    if buf.tell() >= MAX_BYTES:
        for q in (95, 94, 93, 92, 91, 90):
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=q, subsampling=0, optimize=True)
            fmt = f"JPEG q{q}"
            if buf.tell() < MAX_BYTES:
                break
        else:
            raise SystemExit("could not fit image under 1 MiB at JPEG q90")

    data = buf.getvalue()
    with open(args.out, "wb") as f:
        f.write(data)
    print(f"{args.out}: {len(data)} bytes, {fmt}, {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main()
