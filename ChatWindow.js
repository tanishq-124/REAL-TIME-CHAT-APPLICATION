import React from "react";

export default function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <div className="message" key={i}>
          <span><strong>{msg.sender}:</strong> {msg.text}</span>
          <small>{msg.time}</small>
        </div>
      ))}
    </div>
  );
}
