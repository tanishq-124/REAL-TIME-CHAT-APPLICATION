// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Golden Background Particles
tsParticles.load("tsparticles", {
  particles: {
    number: { value: 50 },
    shape: { type: ["circle", "star"] },
    color: { value: ["#ffd700", "#ffae42"] },
    opacity: { value: 0.7 },
    size: { value: { min: 2, max: 4 } },
    move: { enable: true, speed: 1.5 },
    links: { enable: false }
  }
});

// Chat Logic
const chatWindow = document.getElementById("chatWindow");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
let currentUser = null;
let chats = JSON.parse(localStorage.getItem("chats")) || {};

// Chat selection
document.querySelectorAll(".chat-item").forEach(item => {
  item.addEventListener("click", () => {
    currentUser = item.dataset.user;
    document.getElementById("chatUserName").textContent = currentUser;
    document.getElementById("chatStatus").textContent = item.dataset.status;
    document.getElementById("chatUserImg").textContent = currentUser[0];
    renderMessages();
  });
});

// Render messages
function renderMessages() {
  chatWindow.innerHTML = "";
  if (!currentUser) {
    chatWindow.innerHTML = `<p class="prompt glow-text">✨ Select a chat to begin ✨</p>`;
    return;
  }
  (chats[currentUser] || []).forEach(msg => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text} <small>${msg.time}</small>`;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send messages
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

// Simulated reply
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

// Emoji Picker
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const emojis = ["😀","😂","😍","😎","👍","🔥","❤️","🎉"];

emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "block" ? "none" : "block";
  if (!emojiPicker.innerHTML) {
    emojis.forEach(e => {
      const span = document.createElement("span");
      span.textContent = e;
      span.addEventListener("click", () => {
        messageInput.value += e;
        emojiPicker.style.display = "none";
      });
      emojiPicker.appendChild(span);
    });
  }
});

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
