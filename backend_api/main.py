import os
import tempfile
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
import ollama

app = FastAPI()

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Load text file
# -----------------------------
def load_text_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


# -----------------------------
# Load PDF file
# -----------------------------
def load_pdf_file(file_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(file_bytes)
        tmp_path = tmp_file.name

    loader = PyPDFLoader(tmp_path)
    documents = loader.load()
    pdf_text = "\n".join([doc.page_content for doc in documents])

    os.remove(tmp_path)
    return pdf_text


# -----------------------------
# Create vector store
# -----------------------------
def create_vectorstore(text, model_name="all-MiniLM-L6-v2", chunk_size=300):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=50
    )
    chunks = splitter.split_text(text)

    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    vectorstore = FAISS.from_texts(chunks, embedding=embeddings)
    return vectorstore


# -----------------------------
# Generate answer
# -----------------------------
def generate_answer(context, question, temperature=0.3):
    prompt = f"""
You are a helpful college assistant.
Answer ONLY from the provided context.
If the answer is not available in the context, say:
"I could not find that information in the provided dataset."

Context:
{context}

Question:
{question}

Answer:
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": temperature}
    )

    return response["message"]["content"]


# -----------------------------
# Test route
# -----------------------------
@app.get("/")
def root():
    return {"message": "Backend API is running"}


# -----------------------------
# Main API endpoint
# -----------------------------
@app.post("/ask")
async def ask_question(
    question: str = Form(...),
    embedding_model: str = Form("all-MiniLM-L6-v2"),
    top_k: int = Form(3),
    chunk_size: int = Form(300),
    temperature: float = Form(0.3),
    file: UploadFile = File(None)
):
    try:
        # Load file or default dataset
        if file:
            content = await file.read()

            if file.filename.lower().endswith(".pdf"):
                text = load_pdf_file(content)

            elif file.filename.lower().endswith(".txt"):
                text = content.decode("utf-8")

            else:
                return {"error": "Unsupported file type. Use PDF or TXT."}

        else:
            default_path = os.path.join(os.path.dirname(__file__), "college_faq.txt")

            if not os.path.exists(default_path):
                return {"error": "Default dataset file not found"}

            text = load_text_file(default_path)

        # Create vector DB
        vectorstore = create_vectorstore(text, embedding_model, chunk_size)

        # Retrieve context
        docs = vectorstore.similarity_search(question, k=top_k)
        context = "\n\n".join([doc.page_content for doc in docs])

        # Generate answer
        answer = generate_answer(context, question, temperature)

        return {
            "question": question,
            "answer": answer,
            "context": context
        }

    except Exception as e:
        return {"error": str(e)}