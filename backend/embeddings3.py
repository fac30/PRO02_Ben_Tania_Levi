from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv('BC_OPENAI_API_KEY'))
pinecone_api_key = os.getenv('PINECONE_API_KEY')
pinecone_environment = os.getenv('PINECONE_ENVIRONMENT')

def load_documents(folder_path):
    documents = {}
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            with open(os.path.join(folder_path, filename), 'r', encoding='utf-8') as file:
                documents[filename] = file.read()
    return documents


def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")  # Clean text
    return client.embeddings.create(input=[text], model=model).data[0].embedding


def embed_documents(documents):
    document_embeddings = {}
    for doc_id, content in documents.items():
        embedding = get_embedding(content)
        document_embeddings[doc_id] = embedding
    return document_embeddings


folder_path = './data'

documents = load_documents(folder_path)
document_embeddings = embed_documents(documents)

# Initialize Pinecone
pc = Pinecone(
    api_key=pinecone_api_key
)

index_name = "test-index"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name, 
        dimension=1536,
        metric='cosine',
        spec=ServerlessSpec(
            cloud='aws',
            region=pinecone_environment
        )
    )  # Dimension 1536 for OpenAI embeddings

index = pc.Index(index_name)

# Insert embeddings into Pinecone
# vectors = [(doc_id, embedding) for doc_id, embedding in document_embeddings.items()]
# index.upsert(vectors)

vectors = [
    (doc_id, embedding, {'content': documents[doc_id]})  
    for doc_id, embedding in document_embeddings.items()
]
index.upsert(vectors)



print(f"Inserted {len(vectors)} documents into Pinecone index '{index_name}'")
