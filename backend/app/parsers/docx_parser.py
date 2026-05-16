from io import BytesIO

from docx import Document

def parse_docx(file_bytes):

    doc = Document(
        BytesIO(file_bytes)
    )

    text = "\n".join([
        para.text
        for para in doc.paragraphs
    ])

    return text