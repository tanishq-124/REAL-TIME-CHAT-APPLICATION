import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import ThemeToggle from "./ThemeToggle";
import Footer from "./Footer";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState([]);

  const addMessage = (text) => {
    setMessages([...messages, { text, sender: "You", time: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className={`app ${theme}`}>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="main-layout">
        <Sidebar />
        <div className="chat-section">
          <ChatWindow messages={messages} />
          <MessageInput addMessage={addMessage} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
