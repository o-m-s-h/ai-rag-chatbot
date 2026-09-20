from io import BytesIO

from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE


def _extract_shapes(shapes):
    for shape in shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.GROUP:
            yield from _extract_shapes(shape.shapes)
        elif shape.has_table:
            for row in shape.table.rows:
                # Only the merge origin contains text; retain blank positions.
                cells = [
                    "" if cell.is_spanned else " ; ".join(cell.text.splitlines()).strip()
                    for cell in row.cells
                ]
                if any(cells):
                    yield " | ".join(cells)
        elif shape.has_text_frame and shape.text.strip():
            yield shape.text.strip()


def parse_pptx(file_bytes):
    prs = Presentation(BytesIO(file_bytes))
    slides = []
    for number, slide in enumerate(prs.slides, start=1):
        content = "\n".join(_extract_shapes(slide.shapes))
        if content:
            slides.append(f"Slide {number}\n{content}")
    return "\n\n".join(slides)
