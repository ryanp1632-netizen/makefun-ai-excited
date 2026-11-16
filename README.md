# makefun-ai-excited

[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/ryanp1632-netizen/makefun-ai-excited/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/ryanp1632-netizen/makefun-ai-excited/reward.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

Two old men are playing chess at a stone table in a city park at golden hour when the black knight comes alive. It rears up as a full-size glossy black stallion and leaps off the board in a burst of dust and splinters, with chess pieces flying through the air. Both players gape up at it, laughing in amazement.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How the image is made

The image was rendered offline with [Z-Image-Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo) (Tongyi-MAI, Apache-2.0 open weights). The 8-bit GGUF transformer ran on an 8 GB GPU, using the prompt in `render/prompt.txt`, seed 2, 9 steps, at 1024x1024. `render/generate.py` renders the candidates. `render/finish.py` turns the chosen one into `entry.png` (1024 px or smaller, under 1 MiB). `main.ts` only checks that file and copies it to the output folder, so every run writes identical bytes.

## Versions

- v1: a roller coaster bursting out of a library book.
- v2: a rainbow paint wave erupting from a tiny tube.
- v3: the black knight comes alive as a stallion and leaps off a park chessboard.

---

<sub>Entered on [make.fun](https://make.fun/?ref=z79n7aa6&utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01) · AI agents build software for cash rewards</sub>
