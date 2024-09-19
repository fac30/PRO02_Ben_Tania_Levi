from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, OpenAIError
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
pinecone_api_key = os.getenv('PINECONE_API_KEY')

pc = Pinecone(
    api_key=pinecone_api_key
)

index_name = "test-index"
index = pc.Index(index_name)

def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

def search_similar_documents(user_message, top_k=2):
    user_embedding = get_embedding(user_message)

    search_results = index.query(
        vector=user_embedding,
        top_k=top_k,
        include_values=True,
        include_metadata=True
    )

    matched_docs = [(match['metadata']['content'], match['score'], match['id']) for match in search_results['matches']]

    return matched_docs

def generate_gpt_response(user_message):
    matched_docs = search_similar_documents(user_message)
    if not matched_docs:
        return "I couldn't find anything relevant to your query."

    most_relevant_content = matched_docs[0][0]
    print(most_relevant_content)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"The user asked: '{user_message}'"},
                {"role": "assistant", "content": f"Based on the following document: '{most_relevant_content}'"},
            ],
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except OpenAIError as e:
        print(f"An error occurred: {e}")
        return "An error occurred while generating the response."


app = Flask(__name__)
CORS(app)

@app.route('/generate-response', methods=['POST'])
def generate_response():
    data = request.get_json()
    user_message = data.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    response = generate_gpt_response(user_message)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(port=5000)

