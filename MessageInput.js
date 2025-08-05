import React, { useState } from "react";

export default function MessageInput({ addMessage }) {
  const [text, setText] = useState("");

  const send = () => {
    if (text.trim()) {
      addMessage(text);
      setText("");
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
