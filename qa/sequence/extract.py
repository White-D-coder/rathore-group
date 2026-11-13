"""Extract licensed filmed footage. Requires ffmpeg and Pillow; see footage-sources.json."""
from pathlib import Path
from PIL import Image
import subprocess
import sys

source = sys.argv[1]
for variant, count, width, height in [('desktop', 180, 1920, 1080), ('retina', 180, 3840, 2160), ('mobile', 120, 1080, 1920)]:
    folder = Path('public/film-hq') / variant
    folder.mkdir(parents=True, exist_ok=True)
    args = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', '0.25', '-i', source,
            '-vf', f'fps={count}/10,scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height}',
            '-frames:v', str(count), '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1']
    process = subprocess.Popen(args, stdout=subprocess.PIPE)
    try:
        for index in range(count):
            data = process.stdout.read(width * height * 3)
            if len(data) != width * height * 3:
                raise RuntimeError(f'Missing {variant} frame {index}')
            image = Image.frombytes('RGB', (width, height), data)
            image.save(folder / f'{index:03}.webp', 'WEBP', quality=86, method=5)
        if process.wait() != 0:
            raise RuntimeError('ffmpeg failed')
    finally:
        process.stdout.close()
        if process.poll() is None:
            process.kill()
            process.wait()
    print(f'{variant}: extracted {count} frames from real filmed footage', flush=True)
