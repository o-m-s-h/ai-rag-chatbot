from app.services.embedding_service import (
    generate_embedding
)

from app.database.chroma_db import collection


def retrieve_relevant_chunks(
    query,
    conversation_id,
    top_k=8
):

    query_embedding = generate_embedding(query)

    results = collection.query(

        query_embeddings=[query_embedding],

        n_results=top_k,

        where={
            "conversation_id": conversation_id
        }
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    seen = set()

    filtered_chunks = []

    for doc, meta in zip(
        documents,
        metadatas
    ):

        if doc not in seen:

            seen.add(doc)

            filtered_chunks.append({
                "content": doc,
                "source": meta["filename"]
            })

    return filtered_chunks[:5]