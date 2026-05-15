from langchain_experimental.text_splitter import (
    SemanticChunker
)

from langchain_core.documents import Document

from langchain.embeddings.base import (
    Embeddings
)

from app.services.embedding_service import (
    model
)

class CustomEmbedding(Embeddings):

    def embed_documents(
        self,
        texts
    ):

        embeddings = model.encode(texts)

        return embeddings.tolist()

    def embed_query(
        self,
        text
    ):

        embedding = model.encode(text)

        return embedding.tolist()

embedding_model = CustomEmbedding()

semantic_chunker = SemanticChunker(
    embedding_model
)

def chunk_text(text):

    docs = [
        Document(page_content=text)
    ]

    chunks = semantic_chunker.split_documents(
        docs
    )

    return [
        chunk.page_content
        for chunk in chunks
    ]