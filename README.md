# college-ai-chatbot
# 🎓 College AI Chatbot (RAG Based)

A domain-specific AI chatbot built using Retrieval-Augmented Generation (RAG).

## 🚀 Tech Stack
- Frontend: React + Tailwind CSS
- Backend: FastAPI
- LLM: Ollama (Llama 3.2)
- Vector DB: FAISS
- Embeddings: Sentence Transformers

## ✨ Features
- Ask questions from college dataset
- Upload PDF/TXT documents
- Semantic search with embeddings
- Human-like AI responses
- Clean modern UI

## 🧠 How it works
1. User asks a question
2. System retrieves relevant chunks using FAISS
3. Context passed to LLM
4. LLM generates grounded answer

## ▶️ Run Locally

### Backend
```bash
cd backend_api
source venv/bin/activate
uvicorn main:app --reload
===================================================================================================================================
Frontend
cd frontend
npm start
====================================================================================================================================
URL's
Frontend: http://localhost:3000
Backend: http://127.0.0.1:8000
