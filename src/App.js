import React, { useState, useEffect, useRef } from 'react';

// Import components, hooks, and utilities
import SelectionScreen from './components/SelectionScreen';
import ChatInterface from './components/ChatInterface';
import ShareModal from './components/ShareModal';
import { useFirebase } from './hooks/useFirebase'; // Now returns dummy values (offline mode)
import useChatMessages from './hooks/useChatMessages';
import { generateDisplayId, getDuoChatContext } from './utils/chatUtils';
import { toggleVoiceInput as voiceInputToggleFunction } from './utils/speechRecognition'; 
import { emojis } from './constants/emojis';

const App = () => {
  // State variables (no real Firebase)
  const { userId, error, setError } = useFirebase(); // db/auth removed
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Chat mode selection
  const [chatMode, setChatMode] = useState('selection'); // 'selection', 'public', 'duo'
  const [duoPartnerId, setDuoPartnerId] = useState('');
  const [tempDuoPartnerInput, setTempDuoPartnerInput] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Custom hook for managing messages (local only)
  useChatMessages(null, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError);

  // Send a message (local only now)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && imageURL.trim() === '') return;

    const messageData = {
      senderId: userId,
      type: imageURL.trim() ? 'image' : 'text',
      content: imageURL.trim() || newMessage.trim(),
      timestamp: new Date().toISOString(),
      chatContext: chatMode === 'public' ? 'public' : getDuoChatContext(userId, duoPartnerId),
    };

    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
    setImageURL('');
  };

  // Suggest a reply (still uses Gemini API if you add a key)
  const handleSuggestReply = async () => {
    if (isGeneratingReply || chatMode !== 'public') return;

    setIsGeneratingReply(true);
    try {
      const lastPublicMessages = messages
        .filter((msg) => msg.chatContext === 'public' && msg.type === 'text')
        .slice(-5);

      const chatHistoryText = lastPublicMessages
        .map(
          (msg) =>
            `${msg.senderId === userId ? 'You' : `User ${generateDisplayId(msg.senderId)}`}: ${msg.content}`
        )
        .join('\n');

      const prompt = `Based on the following chat, suggest a short reply:\n\n${chatHistoryText}\n\nSuggested Reply:`;

      const apiKey = ''; // Add your Gemini API key if needed
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
      });

      const result = await response.json();
      const reply =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion available.';

      setMessages((prev) => [
        ...prev,
        { senderId: 'gemini-assistant', type: 'text', content: reply.trim(), chatContext: 'public' },
      ]);
    } catch (err) {
      console.error('Gemini error:', err);
      setError('Failed to fetch AI reply.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const toggleVoiceInput = () => {
    voiceInputToggleFunction({
      recognitionRef,
      setIsListening,
      setNewMessage,
      setError,
    });
  };

  // Error screen
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 text-red-700 p-4 rounded-lg animate-fade-in">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  // Selection screen
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

  // Chat interface
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-sans antialiased animate-gradient-shift">
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
