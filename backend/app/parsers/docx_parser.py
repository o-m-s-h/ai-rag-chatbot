from io import BytesIO

from docx import Document
from docx.table import Table


def _extract_blocks(container):
    """Read paragraphs and tables in their original document/cell order."""
    for block in container.iter_inner_content():
        if isinstance(block, Table):
            yield from _extract_table(block)
        elif block.text.strip():
            yield block.text.strip()


def _extract_table(table):
    # Word can expose the same XML cell at multiple positions for merged cells.
    seen_cells = set()
    for row in table.rows:
        cells = []
        for cell in row.cells:
            if cell._tc in seen_cells:
                cells.append("")
                continue
            seen_cells.add(cell._tc)
            # Recursion includes nested tables, which cell.text omits.
            cells.append(" ; ".join(_extract_blocks(cell)))
        if any(cells):
            yield " | ".join(cells)


def parse_docx(file_bytes):
    doc = Document(BytesIO(file_bytes))
    return "\n".join(_extract_blocks(doc))
