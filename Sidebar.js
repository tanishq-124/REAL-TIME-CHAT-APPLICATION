import React from "react";

export default function Sidebar() {
  const chats = [
    { name: "User 1", lastMsg: "Hey there!", img: "https://via.placeholder.com/40" },
    { name: "User 2", lastMsg: "How's it going?", img: "https://via.placeholder.com/40" }
  ];

  return (
    <div className="sidebar">
      <h2>Chats</h2>
      {chats.map((chat, i) => (
        <div className="chat-item" key={i}>
          <img src={chat.img} alt="Profile" />
          <div>
            <strong>{chat.name}</strong>
            <p>{chat.lastMsg}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
