from rank_bm25 import BM25Okapi
import re

from app.services.embedding_service import (
    generate_embedding
)

from app.database.chroma_db import collection

from app.services.rerank_service import (
    rerank_chunks
)


def tokenize(text):
    return re.findall(r"\w+", text.lower())


def retrieve_relevant_chunks(
    query,
    conversation_id,
    top_k=10
):

    # -----------------------------
    # VECTOR SEARCH
    # -----------------------------

    query_embedding = generate_embedding(query)

    vector_results = collection.query(

        query_embeddings=[query_embedding],

        n_results=top_k,

        where={
            "conversation_id": conversation_id
        }
    )

    vector_documents = vector_results["documents"][0]
    vector_metadatas = vector_results["metadatas"][0]

    # -----------------------------
    # GET ALL DOCUMENTS
    # FOR BM25 SEARCH
    # -----------------------------

    all_docs = collection.get(

        where={
            "conversation_id": conversation_id
        }
    )

    all_documents = all_docs["documents"]
    all_metadatas = all_docs["metadatas"]

    # -----------------------------
    # BM25 SEARCH
    # -----------------------------

    tokenized_corpus = [
        tokenize(doc)
        for doc in all_documents
    ]

    bm25 = BM25Okapi(tokenized_corpus)

    tokenized_query = tokenize(query)

    bm25_scores = bm25.get_scores(
        tokenized_query
    )

    # Get top BM25 results
    bm25_ranked = sorted(

        zip(
            all_documents,
            all_metadatas,
            bm25_scores
        ),

        key=lambda x: x[2],

        reverse=True
    )[:top_k]

    # -----------------------------
    # MERGE VECTOR + BM25 RESULTS
    # -----------------------------

    combined_results = []

    seen = set()

    # Add vector search results
    for doc, meta in zip(
        vector_documents,
        vector_metadatas
    ):

        if doc not in seen:

            seen.add(doc)

            combined_results.append({
                "content": doc,
                "source": meta["filename"]
            })

    # Add BM25 results
    for doc, meta, score in bm25_ranked:

        if doc not in seen:

            seen.add(doc)

            combined_results.append({
                "content": doc,
                "source": meta["filename"]
            })

    # -----------------------------
    # RERANK
    # -----------------------------

    reranked_results = rerank_chunks(
        query,
        combined_results
    )

    return reranked_results[:5]