def chunk_text(
    text,
    chunk_size=800,
    overlap=150
):

    paragraphs = text.split("\n")

    chunks = []

    current_chunk = ""

    for para in paragraphs:

        para = para.strip()

        if not para:
            continue

        if len(current_chunk) + len(para) < chunk_size:

            current_chunk += "\n" + para

        else:

            chunks.append(
                current_chunk.strip()
            )

            overlap_text = current_chunk[-overlap:]

            current_chunk = overlap_text + "\n" + para

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks