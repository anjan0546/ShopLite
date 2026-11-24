import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { API_BASE_URL } from "../config";
const QUICK_CHIPS = [
  "📦 Track Order",
  "🎉 Coupon Code",
  "🔄 Return Policy",
  "⚡ Delivery Time",
  "🎧 Top Electronics"
];

function formatMessageText(text) {
  if (!text) return "";
  // Simple bold markdown parser: **text** -> <strong>text</strong>
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 Welcome to ShopLite. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const sendQuery = async (queryText) => {
    const textToSend = (queryText || message).trim();
    if (!textToSend || loading) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: textToSend },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I'm here to assist you with ShopLite orders, shipping, and products!",
        },
      ]);
    } catch (error) {
      console.warn("Chatbot network note:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm here to help! You can explore our catalog, track orders in 'My Orders', or use code **SHOPLITE10** for 10% off. For support, reach us at support@shoplite.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle ShopLite Assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-brand">
              <img src="/logo.svg" alt="ShopLite Logo" className="chatbot-logo" />
              <div>
                <h3>ShopLite Assistant</h3>
                <span>● Online • Instant Help</span>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                {formatMessageText(msg.text)}
              </div>
            ))}

            {loading && (
              <div className="chat-message bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="chatbot-quick-chips">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="chatbot-chip-btn"
                onClick={() => sendQuery(chip.replace(/^[^\w\s]+/, "").trim())}
                disabled={loading}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask anything about ShopLite..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendQuery();
              }}
            />

            <button
              onClick={() => sendQuery()}
              disabled={loading || !message.trim()}
              aria-label="Send Message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
