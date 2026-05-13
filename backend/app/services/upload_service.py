import os
import shutil
import uuid

from datetime import datetime

from fastapi import UploadFile, HTTPException

from bson import ObjectId

from app.parsers.pdf_parser import parse_pdf
from app.parsers.docx_parser import parse_docx
from app.parsers.pptx_parser import parse_pptx
from app.parsers.txt_parser import parse_txt
from app.utils.text_cleaner import clean_text

from app.utils.chunking import chunk_text

from app.services.embedding_service import (
    generate_embedding
)

from app.database.chroma_db import collection

from app.database.mongodb import (
    conversations_collection
)

UPLOAD_DIR = "app/uploads"

async def upload_document(
    conversation_id,
    current_user,
    file: UploadFile
):

    # DUPLICATE CHECK

    conversation = await conversations_collection.find_one({
        "_id": ObjectId(conversation_id)
    })

    existing_docs = conversation.get("documents", [])

    for doc in existing_docs:

        if doc["filename"] == file.filename:

            raise HTTPException(
                status_code=400,
                detail="File already uploaded"
            )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extension = file.filename.split(".")[-1].lower()

    if extension == "pdf":
        extracted_text = parse_pdf(file_path)

    elif extension == "docx":
        extracted_text = parse_docx(file_path)

    elif extension == "pptx":
        extracted_text = parse_pptx(file_path)

    elif extension == "txt":
        extracted_text = parse_txt(file_path)

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    extracted_text = clean_text(extracted_text)

    chunks = chunk_text(extracted_text)

    document_id = str(uuid.uuid4())

    for index, chunk in enumerate(chunks):

        embedding = generate_embedding(chunk)

        chunk_id = str(uuid.uuid4())

        collection.add(
            ids=[chunk_id],

            embeddings=[embedding],

            documents=[chunk],

            metadatas=[{
                "conversation_id": conversation_id,
                "user_id": current_user["user_id"],
                "filename": file.filename,
                "chunk_index": index
            }]
        )

    # DOCUMENT METADATA

    document_data = {
        "document_id": document_id,
        "filename": file.filename,
        "uploaded_at": datetime.utcnow(),
        "chunk_count": len(chunks),
        "file_size": os.path.getsize(file_path),
        "file_type": extension
    }

    await conversations_collection.update_one(
        {
            "_id": ObjectId(
                conversation_id
            )
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
        "chunks_stored": len(chunks)
    }