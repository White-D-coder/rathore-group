"""Build lightweight scrub previews from the same full-resolution hero frames."""
from pathlib import Path
from PIL import Image

folder = Path("public/film-preview")
folder.mkdir(exist_ok=True)
for variant, total, samples, columns, width, height in [
    ("desktop", 180, 48, 8, 480, 270),
    ("mobile", 120, 36, 6, 270, 480),
]:
    rows = (samples + columns - 1) // columns
    sheet = Image.new("RGB", (columns * width, rows * height))
    for sample in range(samples):
        index = round(sample * (total - 1) / (samples - 1))
        with Image.open(Path("public/film-hq") / variant / f"{index:03}.webp") as source:
            tile = source.convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
            sheet.paste(tile, ((sample % columns) * width, (sample // columns) * height))
    destination = folder / f"{variant}.webp"
    sheet.save(destination, "WEBP", quality=72, method=6)
    print(f"{variant}: {samples} preview frames, {destination.stat().st_size / 1024:.0f} KiB", flush=True)
