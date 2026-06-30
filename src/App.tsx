/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send recent history context
        body: JSON.stringify({ messages: newMessages.slice(-10) }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.text }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Failed to fetch response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <h1 className="text-xl font-semibold tracking-tight text-white">Unrestricted AI</h1>
        </div>
        <span className="bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-500/20 font-medium">
          Unfiltered Mode Active
        </span>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 pb-20">
            <span className="text-5xl mb-4">✨</span>
            <p className="text-lg">What do you want to talk about?</p>
            <p className="text-sm opacity-60">I'm set to respond candidly without standard conversational filters.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-sm'
              }`}>
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className="mb-2 last:mb-0 break-words whitespace-pre-wrap">{line}</p>
                ))}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
             <div className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700/50 rounded-bl-sm flex gap-1.5 items-center h-12">
               <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-slate-800 bg-slate-900 pb-8">
        <div className="max-w-4xl w-full mx-auto relative flex items-center shadow-lg">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message... (Shift+Enter for newline)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 pr-16 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '160px' }}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors h-10 w-10 flex items-center justify-center"
          >
            <span className="text-xl leading-none">➤</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
