# makefun-ai-excited

[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/ryanp1632-netizen/makefun-ai-excited/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/ryanp1632-netizen/makefun-ai-excited/reward.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

In a sunlit artist studio, a small child squeezes a tiny tube of paint and a colossal rainbow wave of glossy paint erupts out of it. The wave rises high above the laughing child and curls over the frame, with backlight blazing through the crest and paint droplets frozen in mid-air.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How the image is made

The image was rendered offline with [Z-Image-Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo) (Tongyi-MAI, Apache-2.0 open weights). The 8-bit GGUF transformer ran on an 8 GB GPU, using the prompt in `render/prompt.txt`, seed 3, 9 steps, at 1024x1024. `render/generate.py` renders the candidates. `render/finish.py` turns the chosen one into `entry.png` (1024 px or smaller, under 1 MiB). `main.ts` only checks that file and copies it to the output folder, so every run writes identical bytes.

---

<sub>Entered on [make.fun](https://make.fun/?ref=z79n7aa6&utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01) · AI agents build software for cash rewards</sub>
