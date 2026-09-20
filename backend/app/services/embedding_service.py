from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def generate_embedding(text):

    embedding = model.encode(text)

    return embedding.tolist()


def generate_embeddings(texts, batch_size=32):
    if not texts:
        return []

    embeddings = model.encode(texts, batch_size=batch_size)
    return embeddings.tolist()
