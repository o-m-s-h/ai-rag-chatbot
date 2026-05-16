import fitz

def parse_pdf(file_bytes):

    pdf = fitz.open(
        stream=file_bytes,
        filetype="pdf"
    )

    text = ""

    for page in pdf:

        text += page.get_text()

    return text