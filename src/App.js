// src/App.js
import React, { useState, useRef } from 'react';
import SelectionScreen from './components/SelectionScreen';
import ChatInterface from './components/ChatInterface';
import ShareModal from './components/ShareModal';
import { useFirebase } from './hooks/useFirebase';
import useChatMessages from './hooks/useChatMessages';
import { generateDisplayId, getDuoChatContext } from './utils/chatUtils';
import { toggleVoiceInput as voiceInputToggleFunction } from './utils/speechRecognition';
import { emojis } from './constants/emojis';

const App = () => {
  const { db, auth, userId, loading, error, setError } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [chatMode, setChatMode] = useState('selection');
  const [duoPartnerId, setDuoPartnerId] = useState('');
  const [tempDuoPartnerInput, setTempDuoPartnerInput] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useChatMessages(db, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((newMessage.trim() === '' && imageURL.trim() === '') || !db || !userId) return;

    const { serverTimestamp, addDoc, collection } = await import('firebase/firestore');

    const messageData = {
      senderId: userId,
      timestamp: serverTimestamp(),
      type: imageURL.trim() ? 'image' : 'text',
      content: imageURL.trim() || newMessage.trim(),
      chatContext: chatMode === 'public'
        ? 'public'
        : getDuoChatContext(userId, duoPartnerId)
    };

    try {
      await addDoc(collection(db, 'chatMessages'), messageData);
      setNewMessage('');
      setImageURL('');
    } catch (err) {
      setError("Failed to send message.");
    }
  };

  const handleSuggestReply = async () => {
    if (!db || !userId || isGeneratingReply || chatMode !== 'public') return;

    setIsGeneratingReply(true);
    try {
      const lastMsgs = messages.filter(m => m.chatContext === 'public' && m.type === 'text').slice(-5);
      const chatText = lastMsgs.map(m =>
        `${m.senderId === userId ? 'You' : `User ${generateDisplayId(m.senderId)}`}: ${m.content}`
      ).join('\n');

      const prompt = `Suggest a concise reply (under 40 words) based on:\n${chatText}\nReply:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
      });

      const result = await response.json();
      const suggestion = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Couldn't generate reply.";

      const { serverTimestamp, addDoc, collection } = await import('firebase/firestore');
      await addDoc(collection(db, 'chatMessages'), {
        senderId: 'gemini-assistant',
        type: 'text',
        content: suggestion,
        timestamp: serverTimestamp(),
        chatContext: 'public'
      });
    } catch (err) {
      setError("AI reply failed.");
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const toggleVoiceInput = () => {
    voiceInputToggleFunction({ recognitionRef, setIsListening, setNewMessage, setError });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading Chat...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  }

  if (chatMode === 'selection') {
    return (
      <SelectionScreen
        userId={userId}
        setChatMode={setChatMode}
        duoPartnerId={duoPartnerId}
        setDuoPartnerId={setDuoPartnerId}
        tempDuoPartnerInput={tempDuoPartnerInput}
        setTempDuoPartnerInput={setTempDuoPartnerInput}
        setError={setError}
        generateDisplayId={generateDisplayId}
      />
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-purple-100'} flex flex-col h-screen`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <ChatInterface
        userId={userId}
        chatMode={chatMode}
        duoPartnerId={duoPartnerId}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        imageURL={imageURL}
        setImageURL={setImageURL}
        handleSendMessage={handleSendMessage}
        handleSuggestReply={handleSuggestReply}
        isGeneratingReply={isGeneratingReply}
        setShowShareModal={setShowShareModal}
        generateDisplayId={generateDisplayId}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        isListening={isListening}
        toggleVoiceInput={toggleVoiceInput}
        handleEmojiSelect={handleEmojiSelect}
        emojis={emojis}
        messagesEndRef={messagesEndRef}
      />
      {showShareModal && (
        <ShareModal
          setShowShareModal={setShowShareModal}
          chatMode={chatMode}
          userId={userId}
          copiedMessage={copiedMessage}
          setCopiedMessage={setCopiedMessage}
          generateDisplayId={generateDisplayId}
        />
      )}
    </div>
  );
};

export default App;
