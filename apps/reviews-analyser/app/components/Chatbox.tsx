'use client';

import { useChat } from '@repo/shared/ai-sdk';
import { useState, useRef, useEffect } from 'react';
import { CiChat2 } from 'react-icons/ci';
import { HiOutlineXMark } from 'react-icons/hi2';
import { FaSpinner } from 'react-icons/fa';
import { BiSend } from 'react-icons/bi';
import { GrGoogle } from 'react-icons/gr';

const REVEAL_INTERVAL_MS = 65; // slower = higher (e.g. 80–100)
const CHARS_PER_TICK = 2;

const Chatbox = () => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [input, setInput] = useState('');
  const [revealedLengths, setRevealedLengths] = useState<
    Record<string, number>
  >({});
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || status !== 'ready') return;
    sendMessage({ text });
    setInput('');
  };

  const isStreaming = status === 'streaming';
  const lastMessage = messages[messages.length - 1];
  const lastIsAssistant = lastMessage?.role === 'assistant';

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastContentLength =
    messages[messages.length - 1]?.parts?.reduce(
      (sum, p) =>
        sum + ('text' in p && typeof p.text === 'string' ? p.text.length : 0),
      0,
    ) ?? 0;

  // ARTIFICIALLY SLOW CHARACTER-BY-CHARACTER REVEAL FOR ASSISTANT TEXT
  useEffect(() => {
    const id = setInterval(() => {
      setRevealedLengths(prev => {
        let next = prev;
        let hasChange = false;
        messages.forEach(msg => {
          if (msg.role !== 'assistant') return;
          msg.parts.forEach((p, pi) => {
            if (!('text' in p) || typeof p.text !== 'string') return;
            const key = `${msg.id}-${pi}`;
            const target = p.text.length;
            const cur = prev[key] ?? 0;
            if (cur < target) {
              if (!hasChange) {
                next = { ...prev };
                hasChange = true;
              }
              next[key] = Math.min(cur + CHARS_PER_TICK, target);
            }
          });
        });
        return hasChange ? next : prev;
      });
    }, REVEAL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [messages]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, lastContentLength, revealedLengths]);

  const renderStreamedText = (text: string) =>
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((segment, j) => (
        <span key={j} className="inline">
          {segment}
        </span>
      ));

  return (
    <div className="fixed z-50 bottom-10 right-10">
      {!isInputOpen && (
        <button
          onClick={() => setIsInputOpen(true)}
          aria-label="Open chat"
          className="rounded-full p-3 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_24px_rgba(168,85,247,0.25)] transition-all duration-300"
        >
          <CiChat2 className="w-10 h-10 pt-1 text-white" />
        </button>
      )}

      {isInputOpen && (
        <div className="w-72 min-h-[40vh] max-h-[50vh] flex flex-col rounded-2xl shadow-2xl backdrop-blur-xl bg-gray-900/95 border border-white/20 overflow-hidden animate-fade-in">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-white/5">
            <span className="text-sm font-semibold text-white flex items-center justify-center gap-2">
              Reviews Analyser AI Chat
              <GrGoogle className="w-3 h-3 inline-block align-middle" />
            </span>
            <button
              type="button"
              onClick={() => setIsInputOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
          >
            {messages.length === 0 && (
              <div className="flex flex-col h-full items-center justify-between gap-4">
                <p className="text-center text-gray-500 text-sm py-4">
                  Ask me anything <br /> about customer reviews.
                  <br />
                </p>
                <span className="flex items-center justify-center text-gray-400 text-xs gap-2 text-center mt-18">
                  Powered by Gemini{' '}
                  <GrGoogle className="w-4 h-4 inline-block align-middle" />
                </span>
              </div>
            )}
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-purple-500/25 border border-purple-400/30 text-white'
                      : 'bg-white/10 border border-white/10 text-gray-200'
                  }`}
                >
                  {message.parts.map((part, i) => {
                    const key = `${message.id}-${i}`;
                    const revealed = revealedLengths[key] ?? 0;

                    if (part.type === 'text') {
                      return (
                        <span key={i}>
                          {message.role === 'assistant'
                            ? renderStreamedText(
                                part.text.slice(0, Math.max(0, revealed)),
                              )
                            : part.text}
                        </span>
                      );
                    }
                    if (part.type === 'reasoning') {
                      return (
                        <span
                          key={i}
                          className="italic text-gray-400 block mt-1"
                        >
                          {renderStreamedText(
                            part.text.slice(0, Math.max(0, revealed)),
                          )}
                        </span>
                      );
                    }
                    return null;
                  })}
                  {lastIsAssistant &&
                    message.id === lastMessage?.id &&
                    isStreaming && (
                      <span className="inline-block w-0.5 h-4 ml-0.5 bg-purple-400/80 animate-pulse align-middle" />
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-white/10 bg-white/5 flex gap-2"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={status !== 'ready'}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={status !== 'ready' || !input.trim()}
              className="bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium px-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isStreaming ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <BiSend className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
