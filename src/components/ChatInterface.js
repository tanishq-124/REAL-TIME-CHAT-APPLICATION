// src/components/ChatInterface.js
import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';

const ChatInterface = ({
  userId, chatMode, duoPartnerId, messages,
  newMessage, setNewMessage, imageURL, setImageURL,
  handleSendMessage, handleSuggestReply,
  isGeneratingReply, setShowShareModal,
  generateDisplayId, showEmojiPicker,
  setShowEmojiPicker, isListening,
  toggleVoiceInput, handleEmojiSelect,
  emojis, messagesEndRef
}) => {
  return (
    <div className="flex flex-col flex-1 p-4 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {chatMode === 'public' ? 'Public Chat' : `Duo Chat (${generateDisplayId(duoPartnerId)})`}
        </h2>
        <button
          onClick={() => setShowShareModal(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          Share Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              msg.senderId === userId ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
            }`}
          >
            {msg.type === 'image' ? (
              <img src={msg.content} alt="sent" className="max-w-full rounded" />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="flex flex-wrap gap-2 mt-2 border p-2 rounded bg-gray-100">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              className="text-xl hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2"
        />
        <input
          type="url"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder="Image URL"
          className="flex-1 border rounded p-2"
        />
        <button type="button" onClick={toggleVoiceInput} className="px-3 py-2 bg-gray-300 rounded">
          {isListening ? '🎤 Stop' : '🎙️ Speak'}
        </button>
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="px-3 py-2 bg-yellow-300 rounded">
          😀
        </button>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Send
        </button>
      </form>

      {/* Suggest Reply */}
      {chatMode === 'public' && (
        <button
          onClick={handleSuggestReply}
          disabled={isGeneratingReply}
          className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {isGeneratingReply ? 'Generating...' : 'Suggest Reply (Gemini AI)'}
        </button>
      )}
    </div>
  );
};

export default ChatInterface;


// src/components/SelectionScreen.js
import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';

const SelectionScreen = ({
  userId, setChatMode, duoPartnerId, setDuoPartnerId,
  tempDuoPartnerInput, setTempDuoPartnerInput,
  setError, generateDisplayId
}) => {
  const handleStartDuo = () => {
    if (!tempDuoPartnerInput.trim()) {
      setError("Enter partner ID first.");
      return;
    }
    setDuoPartnerId(tempDuoPartnerInput.trim());
    setChatMode('duo');
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-200 to-pink-200">
      <h1 className="text-3xl font-bold mb-6">Welcome to Real-Time Chat</h1>
      <p className="mb-4 text-gray-700">
        Your ID: <strong>{generateDisplayId(userId)}</strong>
      </p>
      <button
        onClick={() => setChatMode('public')}
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Join Public Chat
      </button>
      <input
        type="text"
        value={tempDuoPartnerInput}
        onChange={(e) => setTempDuoPartnerInput(e.target.value)}
        placeholder="Enter Partner ID"
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={handleStartDuo}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Start Duo Chat
      </button>
    </div>
  );
};

export default SelectionScreen;


// src/components/ShareModal.js
import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';

const ShareModal = ({ setShowShareModal, chatMode, userId, copiedMessage, setCopiedMessage, generateDisplayId }) => {
  const shareLink = `${window.location.origin}?chat=${chatMode}&id=${generateDisplayId(userId)}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(shareLink);
    setCopiedMessage(success ? "Link copied!" : "Failed to copy.");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-3">Share this chat</h3>
        <p className="mb-2">{shareLink}</p>
        <button onClick={handleCopy} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Copy Link
        </button>
        <p className="text-green-600 mt-2">{copiedMessage}</p>
        <button
          onClick={() => setShowShareModal(false)}
          className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;


// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// src/styles/index.css
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: #f8fafc;
}
* {
  box-sizing: border-box;
}
button {
  transition: all 0.2s ease-in-out;
}


// public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Real-Time Chat App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>


// package.json
{
  "name": "real-time-chat-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "firebase": "^10.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://tanishq-124.github.io/REAL-TIME-CHAT-APPLICATION",
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
