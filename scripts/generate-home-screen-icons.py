#!/usr/bin/env python3
"""Generate opaque installed-app icons from the approved Pick5Go SVG logo.

This does not change the transparent favicon or website header logo.
Requires Pillow and CairoSVG. Deterministic source: icons/pick5go-mark.svg.
"""
from io import BytesIO
from pathlib import Path
import cairosvg
from PIL import Image

root=Path(__file__).resolve().parents[1]
svg=(root/'icons/pick5go-mark.svg').read_bytes()
out=root/'icons'
cream=(244,240,230)  # #F4F0E6, same on light and dark iOS home screens

def generate(name, size, logo_width_fraction):
    # Render at 2x then downsample to protect the fine motion lines.
    multiplier=3 if size<=192 else 2
    canvas_size=size*multiplier
    logo_width=round(canvas_size*logo_width_fraction)
    logo_height=round(logo_width*192/280)
    raw=cairosvg.svg2png(bytestring=svg,output_width=logo_width,output_height=logo_height)
    logo=Image.open(BytesIO(raw)).convert('RGBA')
    canvas=Image.new('RGBA',(canvas_size,canvas_size),(*cream,255))
    canvas.alpha_composite(logo,((canvas_size-logo_width)//2,(canvas_size-logo_height)//2))
    img=canvas.resize((size,size),Image.Resampling.LANCZOS).convert('RGB')
    path=out/name
    img.save(path,format='PNG',optimize=True)
    loaded=Image.open(path)
    loaded.load()
    assert loaded.size==(size,size) and loaded.mode=='RGB', path
    assert loaded.getpixel((0,0))==cream
    print(name,loaded.size,loaded.mode,path.stat().st_size,'bytes')

# iOS uses apple-touch-icon, while Chromium uses the manifest.
generate('apple-touch-icon.png',180,0.86)
generate('home-192.png',192,0.86)
generate('home-512.png',512,0.86)
# Maskable icons can be cropped by Android; keep the logo in the central safe zone.
generate('home-maskable-512.png',512,0.60)
