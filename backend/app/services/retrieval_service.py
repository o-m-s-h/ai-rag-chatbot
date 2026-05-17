from rank_bm25 import BM25Okapi
import re
import json
from typing import List

from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from langchain_core.callbacks import CallbackManagerForRetrieverRun

from app.services.embedding_service import generate_embedding
from app.database.chroma_db import collection
from app.services.rerank_service import rerank_chunks
from app.utils.redis_client import redis_client

BM25_CACHE_TTL = 3600  # 1 hour


def tokenize(text):
    return re.findall(r"\w+", text.lower())


def get_bm25_data(conversation_id):

    cache_key = f"bm25:{conversation_id}"

    # -----------------------------
    # TRY REDIS CACHE
    # -----------------------------

    cached = redis_client.get(cache_key)

    if cached:

        data = json.loads(cached)

        return (
            data["documents"],
            data["metadatas"],
            data["tokenized_corpus"]
        )

    # -----------------------------
    # CACHE MISS → FETCH FROM CHROMADB
    # -----------------------------

    all_docs = collection.get(

        where={
            "conversation_id": conversation_id
        }
    )

    documents = all_docs["documents"]

    metadatas = all_docs["metadatas"]

    tokenized_corpus = [

        tokenize(doc)

        for doc in documents
    ]

    # -----------------------------
    # STORE IN REDIS
    # -----------------------------

    redis_client.setex(

        cache_key,

        BM25_CACHE_TTL,

        json.dumps({
            "documents": documents,
            "metadatas": metadatas,
            "tokenized_corpus": tokenized_corpus
        })
    )

    return documents, metadatas, tokenized_corpus


class HybridRetriever(BaseRetriever):
    """
    LangChain retriever combining vector search (ChromaDB) and
    BM25 with Redis caching, deduplication, and reranking.
    """

    conversation_id: str
    top_k: int = 10

    def _get_relevant_documents(
        self,
        query: str,
        *,
        run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:

        # -----------------------------
        # VECTOR SEARCH
        # -----------------------------

        query_embedding = generate_embedding(query)

        vector_results = collection.query(

            query_embeddings=[query_embedding],

            n_results=self.top_k,

            where={
                "conversation_id": self.conversation_id
            }
        )

        vector_documents = vector_results["documents"][0]

        vector_metadatas = vector_results["metadatas"][0]

        # -----------------------------
        # GET BM25 DATA
        # (CACHE AWARE)
        # -----------------------------

        all_documents, all_metadatas, tokenized_corpus = get_bm25_data(
            self.conversation_id
        )

        # -----------------------------
        # BM25 SEARCH
        # -----------------------------

        bm25 = BM25Okapi(tokenized_corpus)

        tokenized_query = tokenize(query)

        bm25_scores = bm25.get_scores(tokenized_query)

        # -----------------------------
        # GET TOP BM25 RESULTS
        # -----------------------------

        bm25_ranked = sorted(

            zip(
                all_documents,
                all_metadatas,
                bm25_scores
            ),

            key=lambda x: x[2],

            reverse=True

        )[:self.top_k]

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

        # -----------------------------
        # RETURN AS LANGCHAIN DOCUMENTS
        # -----------------------------

        return [
            Document(
                page_content=result["content"],
                metadata={"source": result["source"]}
            )
            for result in reranked_results[:5]
        ]


def retrieve_relevant_chunks(
    query,
    conversation_id,
    top_k=10
):
    retriever = HybridRetriever(
        conversation_id=conversation_id,
        top_k=top_k
    )

    return retriever.invoke(query)