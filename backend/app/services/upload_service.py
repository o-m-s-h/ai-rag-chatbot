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
    generate_embedding
)

from app.services.supabase_service import (
    upload_file_to_supabase,
    download_file_from_supabase,
    delete_file_from_supabase
)

from app.database.chroma_db import collection

from app.database.mongodb import (
    conversations_collection
)

async def upload_document(
    conversation_id,
    current_user,
    file: UploadFile
):

    conversation = await conversations_collection.find_one({
        "_id": ObjectId(conversation_id)
    })

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

    supabase_path = upload_file_to_supabase(
        file.filename,
        file_bytes
    )

    downloaded_bytes = download_file_from_supabase(
        supabase_path
    )

    extension = file.filename.split(".")[-1].lower()

    if extension == "pdf":

        extracted_text = parse_pdf(
            downloaded_bytes
        )

    elif extension == "docx":

        extracted_text = parse_docx(
            downloaded_bytes
        )

    elif extension == "pptx":

        extracted_text = parse_pptx(
            downloaded_bytes
        )

    elif extension == "txt":

        extracted_text = parse_txt(
            downloaded_bytes
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

    for index, chunk in enumerate(chunks):

        embedding = generate_embedding(
            chunk
        )

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

    delete_file_from_supabase(
        supabase_path
    )

    return {
        "success": True,
        "filename": file.filename,
        "chunks_stored": len(chunks)
    }