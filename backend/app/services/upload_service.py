import uuid

from datetime import datetime

from fastapi import (
    UploadFile,
    HTTPException
)

from bson import ObjectId

from app.parsers.pdf_parser import parse_pdf
from app.parsers.docx_parser import parse_docx
from app.parsers.pptx_parser import parse_pptx
from app.parsers.txt_parser import parse_txt

from app.utils.chunking import chunk_text

from app.utils.text_cleaner import clean_text

from app.services.embedding_service import (
    generate_embeddings
)

from app.database.chroma_db import collection

from app.database.mongodb import (
    conversations_collection
)

CHROMA_BATCH_SIZE = 100

async def upload_document(
    conversation_id,
    current_user,
    file: UploadFile
):

    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation = await conversations_collection.find_one({
        "_id": ObjectId(conversation_id),
        "user_id": current_user["user_id"]
    })

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    existing_docs = conversation.get(
        "documents",
        []
    )

    for doc in existing_docs:

        if doc["filename"] == file.filename:

            raise HTTPException(
                status_code=400,
                detail="File already uploaded"
            )

    file_bytes = await file.read()

    extension = file.filename.split(".")[-1].lower()

    if extension == "pdf":

        extracted_text = parse_pdf(
            file_bytes
        )

    elif extension == "docx":

        extracted_text = parse_docx(
            file_bytes
        )

    elif extension == "pptx":

        extracted_text = parse_pptx(
            file_bytes
        )

    elif extension == "txt":

        extracted_text = parse_txt(
            file_bytes
        )

    else:

        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    extracted_text = clean_text(
        extracted_text
    )

    chunks = chunk_text(
        extracted_text
    )

    for start in range(0, len(chunks), CHROMA_BATCH_SIZE):
        batch = chunks[start:start + CHROMA_BATCH_SIZE]
        embeddings = generate_embeddings(batch)

        collection.add(
            ids=[str(uuid.uuid4()) for _ in batch],
            embeddings=embeddings,
            documents=batch,
            metadatas=[{
                "conversation_id": conversation_id,
                "user_id": current_user["user_id"],
                "filename": file.filename,
                "chunk_index": start + offset
            } for offset in range(len(batch))]
        )

    document_data = {

        "document_id": str(uuid.uuid4()),

        "filename": file.filename,

        "uploaded_at": datetime.utcnow(),

        "chunk_count": len(chunks),

        "file_type": extension
    }

    await conversations_collection.update_one(
        {
            "_id": ObjectId(conversation_id)
        },
        {
            "$push": {
                "documents": document_data
            }
        }
    )

    return {
        "success": True,
        "filename": file.filename,
        "document": document_data,
        "chunks_stored": len(chunks)
    }
