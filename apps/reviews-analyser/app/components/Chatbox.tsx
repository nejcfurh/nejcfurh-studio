'use client';

import { useChat } from '@repo/shared/ai-sdk';
import { useEffect, useRef, useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { CiChat2 } from 'react-icons/ci';
import { FaSpinner } from 'react-icons/fa';
import { GrGoogle } from 'react-icons/gr';
import { HiOutlineXMark } from 'react-icons/hi2';

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
      0
    ) ?? 0;

  // ARTIFICIALLY SLOW CHARACTER-BY-CHARACTER REVEAL FOR ASSISTANT TEXT
  useEffect(() => {
    const id = setInterval(() => {
      setRevealedLengths((prev) => {
        let next = prev;
        let hasChange = false;
        messages.forEach((msg) => {
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
    <div className="fixed right-10 bottom-10 z-50">
      {!isInputOpen && (
        <button
          onClick={() => setIsInputOpen(true)}
          aria-label="Open chat"
          className="rounded-full border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]"
        >
          <CiChat2 className="h-10 w-10 pt-1 text-white" />
        </button>
      )}

      {isInputOpen && (
        <div className="animate-fade-in flex max-h-[50vh] min-h-[40vh] w-72 flex-col overflow-hidden rounded-2xl border border-white/20 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-4">
            <span className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
              Reviews Analyser AI Chat
              <GrGoogle className="inline-block h-3 w-3 align-middle" />
            </span>
            <button
              type="button"
              onClick={() => setIsInputOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <HiOutlineXMark className="h-5 w-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={messagesContainerRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3"
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-between gap-4">
                <p className="py-4 text-center text-sm text-gray-500">
                  Ask me anything <br /> about customer reviews.
                  <br />
                </p>
                <span className="mt-18 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                  Powered by Gemini{' '}
                  <GrGoogle className="inline-block h-4 w-4 align-middle" />
                </span>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'border border-purple-400/30 bg-purple-500/25 text-white'
                      : 'border border-white/10 bg-white/10 text-gray-200'
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
                                part.text.slice(0, Math.max(0, revealed))
                              )
                            : part.text}
                        </span>
                      );
                    }
                    if (part.type === 'reasoning') {
                      return (
                        <span
                          key={i}
                          className="mt-1 block text-gray-400 italic"
                        >
                          {renderStreamedText(
                            part.text.slice(0, Math.max(0, revealed))
                          )}
                        </span>
                      );
                    }
                    return null;
                  })}
                  {lastIsAssistant &&
                    message.id === lastMessage?.id &&
                    isStreaming && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-purple-400/80 align-middle" />
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-white/10 bg-white/5 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={status !== 'ready'}
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-500 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== 'ready' || !input.trim()}
              className="flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-3 font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isStreaming ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <BiSend className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
