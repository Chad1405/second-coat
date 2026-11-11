"""Turns a word into SVG outlines from a font file, so a wordmark needs no font installed.

usage: uv run --with fonttools python outline.py <font.ttf> "<text>" <out.svg>
           [--weight 600] [--width 100] [--tracking -0.02] [--size 100] [--fill "#111111"]

--weight and --width pick an instance of a variable font. --tracking is extra space
between letters as a fraction of the size (negative tightens). Prints the width and height.
"""
import argparse

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


def num(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def outline(font_path, text, weight=None, width=None, tracking=0.0, size=100.0):
    font = TTFont(font_path)
    if "fvar" in font:
        from fontTools.varLib.instancer import instantiateVariableFont
        location = {a.axisTag: a.defaultValue for a in font["fvar"].axes}
        if weight is not None and "wght" in location:
            location["wght"] = weight
        if width is not None and "wdth" in location:
            location["wdth"] = width
        font = instantiateVariableFont(font, location)
    scale = size / font["head"].unitsPerEm
    ascent, descent = font["hhea"].ascent, font["hhea"].descent  # descent is negative
    cmap, glyphs, hmtx = font.getBestCmap(), font.getGlyphSet(), font["hmtx"]
    pen = SVGPathPen(glyphs, ntos=num)
    x = 0.0
    # ponytail: no kerning or shaping (ligatures, complex scripts); fix awkward pairs by hand or with --tracking
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            raise SystemExit(f"The font has no glyph for {ch!r}.")
        # font units point up; SVG points down, so flip and drop to the baseline
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, ascent * scale)))
        x += hmtx[name][0] * scale + tracking * size
    return pen.getCommands(), x - tracking * size, (ascent - descent) * scale


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("font"); p.add_argument("text"); p.add_argument("out")
    p.add_argument("--weight", type=float); p.add_argument("--width", type=float)
    p.add_argument("--tracking", type=float, default=0.0); p.add_argument("--size", type=float, default=100.0)
    p.add_argument("--fill", default="#111111")
    a = p.parse_args()
    d, w, h = outline(a.font, a.text, a.weight, a.width, a.tracking, a.size)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(w)} {num(h)}" '
           f'width="{num(w)}" height="{num(h)}" role="img" aria-label="{a.text}">'
           f'<path fill="{a.fill}" d="{d}"/></svg>\n')
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"{a.out}: {num(w)} by {num(h)}")


if __name__ == "__main__":
    main()
