// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Floating Particles
tsParticles.load("tsparticles", {
  particles: {
    number: { value: 60 },
    shape: { type: ["circle", "star", "polygon"] },
    color: { value: ["#4facfe", "#00f2fe", "#ff6ec7"] },
    opacity: { value: 0.6 },
    size: { value: { min: 2, max: 5 } },
    move: { enable: true, speed: 1.2 },
    rotate: { value: 45, animation: { enable: true, speed: 5 } },
    links: { enable: true, color: "#555", distance: 150, opacity: 0.3 }
  }
});

// Chat Logic
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
    chatWindow.innerHTML = `<p class="prompt glow-text">✨ Select a chat to begin ✨</p>`;
    return;
  }
  const messages = chats[currentUser] || [];
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text} <small>${msg.time}</small>`;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendMessage() {
  if (!currentUser || !messageInput.value.trim()) return;
  const newMessage = { text: messageInput.value, sender: "You", time: new Date().toLocaleTimeString() };
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
    const reply = { text: "Auto Reply", sender: "Bot", time: new Date().toLocaleTimeString() };
    chats[currentUser].push(reply);
    localStorage.setItem("chats", JSON.stringify(chats));
    renderMessages();
  }, 1500);
}

// Tools Panel
document.getElementById("toolsBtn").addEventListener("click", () => document.getElementById("toolsPanel").classList.add("open"));
document.getElementById("closeTools").addEventListener("click", () => document.getElementById("toolsPanel").classList.remove("open"));
document.getElementById("saveProfile").addEventListener("click", () => alert("Profile saved!"));
document.getElementById("clearChat").addEventListener("click", () => {
  if (currentUser) {
    chats[currentUser] = [];
    localStorage.setItem("chats", JSON.stringify(chats));
    renderMessages();
  }
});
