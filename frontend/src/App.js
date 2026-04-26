import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome! Ask me anything about college rules, fees, attendance, exams, hostel, placements, scholarships, or upload a PDF/TXT document.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");

  const features = [
    { label: "Semantic Retrieval", value: "FAISS + Embeddings" },
    { label: "LLM Engine", value: "Llama 3.2 (Ollama)" },
    { label: "Doc Support", value: "PDF / TXT Upload" },
    { label: "Response Style", value: "Grounded with RAG" },
  ];

  const quickPrompts = [
    "What is the minimum attendance required?",
    "Are mobile phones allowed in exams?",
    "How can I get a bonafide certificate?",
    "What are the hostel rules?",
  ];

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const formData = new FormData();
    formData.append("question", question);
    formData.append("embedding_model", "all-MiniLM-L6-v2");
    formData.append("top_k", "3");
    formData.append("chunk_size", "300");
    formData.append("temperature", "0.3");

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.answer },
        ]);
        setContext(data.context || "");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to backend." },
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  const handleQuickPrompt = (prompt) => {
    setQuestion(prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b18] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,76,255,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(0,209,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(104,255,167,0.14),transparent_20%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#060816_0%,#0b1226_35%,#0a1324_100%)] opacity-95" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <header className="mb-8 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-lg shadow-violet-900/30">
              <span className="text-lg font-bold">✦</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white/90">CampusAI</div>
              <div className="text-xs text-white/50">RAG Chatbot Interface</div>
            </div>
          </div>

          <button className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/15">
            Live Demo
          </button>
        </header>

        <section className="grid items-stretch gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Next-Gen College Assistant
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white lg:text-7xl">
              Premium AI Chatbot
              <span className="block bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                for Smart Campus Support
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 lg:text-lg">
              Ask questions from the default dataset or upload your own PDF/TXT document for grounded answers.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">{item.label}</div>
                  <div className="mt-3 text-sm font-semibold text-white/95">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="text-lg font-semibold text-white">Quick Prompts</div>
            <div className="mt-4 grid gap-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-fuchsia-400/30 hover:bg-white/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">Upload Knowledge Source</div>
              <div className="mt-2 text-sm text-white/50">
                Upload PDF or TXT to ask questions from your own document.
              </div>

              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="mt-4 block w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900"
              />

              {selectedFile && (
                <div className="mt-3 text-sm text-cyan-300">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-white">Conversation Interface</div>
              <div className="mt-1 text-sm text-white/50">Premium chatbot panel with grounded answers</div>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    role: "bot",
                    text: "Welcome! Ask me anything about college rules, fees, attendance, exams, hostel, placements, scholarships, or upload a PDF/TXT document.",
                  },
                ]);
                setContext("");
                setSelectedFile(null);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Clear Chat
            </button>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#091121]/80 p-5 shadow-inner shadow-black/20">
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-[22px] px-5 py-4 text-sm leading-7 shadow-lg ${
                      msg.role === "user"
                        ? "border border-white/10 bg-white/10 text-white"
                        : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                    }`}
                  >
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                      {msg.role === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="max-w-[78%] rounded-[22px] bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-4 text-sm text-white shadow-lg">
                    AI Assistant is typing...
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 p-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
                placeholder="Ask about admissions, exams, hostel rules, placements..."
              />
              <button
                onClick={handleSend}
                className="rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02]"
              >
                Send
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold text-white">Retrieved Context</div>
              <div className="mt-2 text-sm leading-7 text-white/60 whitespace-pre-wrap">
                {context || "Relevant context will appear here after asking a question."}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold text-white">Status</div>
              <div className="mt-2 text-sm leading-7 text-white/60">
                Backend: FastAPI<br />
                Model: Ollama Llama 3.2<br />
                Upload: {selectedFile ? selectedFile.name : "Default dataset"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}