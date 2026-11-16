# makefun-ai-excited

[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/ryanp1632-netizen/makefun-ai-excited/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/ryanp1632-netizen/makefun-ai-excited/reward.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

A storm breaks over a park chess game and the black knight comes alive. It bursts out of a cracked hole in the board as a real black stallion and charges straight at the camera, hooves flying toward the lens, while chess pieces and splinters blast outward and lightning splits the sky behind it. The two old players are thrown back on their benches, howling with laughter.

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
- v4: same idea, made ferocious. The judge found v3 "calmer and more staged", a contained burst in warm, calm light. So the golden hour became a lightning storm, and the stallion now bursts out of a hole in the board and charges straight at the lens while the players are flung back.

---

<sub>Entered on [make.fun](https://make.fun/?ref=z79n7aa6&utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01) · AI agents build software for cash rewards</sub>
