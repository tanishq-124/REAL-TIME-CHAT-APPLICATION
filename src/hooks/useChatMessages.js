import { useState, useEffect } from "react";

export default function useChatMessages() {
  const [messages, setMessages] = useState(() => {
    // Load saved messages from localStorage
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const sendMessage = (text, sender = "You") => {
    const newMessage = { id: Date.now(), sender, text };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
  };

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  return { messages, sendMessage };
}
