// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ==================== PARTICLES ====================
tsParticles.load("tsparticles", {
  particles: {
    number: { value: 60 },
    color: { value: ["#4facfe", "#00f2fe", "#ff6ec7", "#fddb92"] },
    shape: { type: "circle" },
    opacity: { value: 0.6 },
    size: { value: 3 },
    move: { enable: true, speed: 1 },
    links: { enable: true, color: "#999", distance: 150, opacity: 0.4 }
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" } },
    modes: { repulse: { distance: 100, duration: 0.4 } }
  }
});

// ==================== EMOJI PICKER ====================
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const emojis = ["😀","😂","😍","👍","❤️","🔥","😎","🎉","😢"];
emojis.forEach(e => {
  const span = document.createElement("span");
  span.textContent = e;
  span.addEventListener("click", () => {
    document.getElementById("messageInput").value += e;
    emojiPicker.style.display = "none";
  });
  emojiPicker.appendChild(span);
});
emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "block" ? "none" : "block";
});

// ==================== CHAT FUNCTIONALITY ====================
const chatWindow = document.getElementById("chatWindow");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
let currentUser = null;
let chats = JSON.parse(localStorage.getItem("chats")) || {};

document.querySelectorAll(".chat-item").forEach(item => {
  item.addEventListener("click", () => {
    currentUser = item.dataset.user;
    document.getElementById("chatUserName").textContent = currentUser;
    document.getElementById("chatStatus").textContent = item.dataset.status;
    document.getElementById("chatUserImg").src = item.dataset.img;
    renderMessages();
  });
});

function renderMessages() {
  chatWindow.innerHTML = "";
  if (!currentUser) {
    chatWindow.innerHTML = `<p class="prompt glow-text">Select a chat to begin</p>`;
    return;
  }
  const messages = chats[currentUser] || [];
  messages.forEach((msg, index) => {
    const div = document.createElement("div");
    div.classList.add("message", msg.sender === "You" ? "sent" : "received");
    div.innerHTML = `
      <strong>${msg.sender}:</strong> ${msg.text} 
      <small>${msg.time} ${msg.read ? "✔✔" : ""}</small>
      <div class="actions">
        <button onclick="editMessage(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteMessage(${index})"><i class="fas fa-trash"></i></button>
      </div>
      <div>
        <button onclick="addReaction(${index}, '👍')">👍</button>
        <button onclick="addReaction(${index}, '❤️')">❤️</button>
        <button onclick="addReaction(${index}, '😂')">😂</button>
      </div>
      ${msg.reactions && msg.reactions.length ? `<div>${msg.reactions.join(" ")}</div>` : ""}
    `;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendMessage() {
  if (!currentUser || !messageInput.value.trim()) return;
  const newMessage = {
    text: messageInput.value,
    sender: "You",
    time: new Date().toLocaleTimeString(),
    read: false,
    reactions: []
  };
  chats[currentUser] = chats[currentUser] || [];
  chats[currentUser].push(newMessage);
  localStorage.setItem("chats", JSON.stringify(chats));
  messageInput.value = "";
  renderMessages();
  simulateReply();
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

function simulateReply() {
  typingIndicator.style.display = "block";
  setTimeout(() => {
    typingIndicator.style.display = "none";
    const reply = {
      text: "Auto Reply",
      sender: "Bot",
      time: new Date().toLocaleTimeString(),
      read: true,
      reactions: []
    };
    chats[currentUser].push(reply);
    localStorage.setItem("chats", JSON.stringify(chats));
    renderMessages();
  }, 1500);
}

// ==================== MESSAGE ACTIONS ====================
window.addReaction = (index, reaction) => {
  chats[currentUser][index].reactions.push(reaction);
  localStorage.setItem("chats", JSON.stringify(chats));
  renderMessages();
};
window.deleteMessage = (index) => {
  chats[currentUser].splice(index, 1);
  localStorage.setItem("chats", JSON.stringify(chats));
  renderMessages();
};
window.editMessage = (index) => {
  const newText = prompt("Edit message:", chats[currentUser][index].text);
  if (newText !== null) {
    chats[currentUser][index].text = newText;
    localStorage.setItem("chats", JSON.stringify(chats));
    renderMessages();
  }
};

// ==================== PROFILE & TOOLS ====================
const toolsBtn = document.getElementById("toolsBtn");
const toolsPanel = document.getElementById("toolsPanel");
const closeTools = document.getElementById("closeTools");
const saveProfile = document.getElementById("saveProfile");
const clearChat = document.getElementById("clearChat");

toolsBtn.addEventListener("click", () => toolsPanel.classList.add("open"));
closeTools.addEventListener("click", () => toolsPanel.classList.remove("open"));

saveProfile.addEventListener("click", () => {
  alert(`Profile saved!\nName: ${document.getElementById("profileName").value}`);
});

clearChat.addEventListener("click", () => {
  if (currentUser) {
    chats[currentUser] = [];
    localStorage.setItem("chats", JSON.stringify(chats));
    renderMessages();
  }
});
