from sentence_transformers import CrossEncoder

rerank_model = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)

def rerank_chunks(
    query,
    chunks
):

    pairs = []

    for chunk in chunks:

        pairs.append([
            query,
            chunk["content"]
        ])

    scores = rerank_model.predict(
        pairs
    )

    for chunk, score in zip(
        chunks,
        scores
    ):

        chunk["rerank_score"] = float(score)

    reranked = sorted(
        chunks,
        key=lambda x: x["rerank_score"],
        reverse=True
    )

    return reranked