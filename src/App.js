import React, { useState, useEffect, useRef } from 'react';

// Import components, hooks, and utilities
import SelectionScreen from './components/SelectionScreen';
import ChatInterface from './components/ChatInterface';
import ShareModal from './components/ShareModal';
import { useFirebase } from './hooks/useFirebase';
import { useChatMessages } from './hooks/useChatMessages';
import { generateDisplayId, getDuoChatContext } from './utils/chatUtils';
import { copyToClipboard } from './utils/clipboardUtils';
import { toggleVoiceInput as voiceInputToggleFunction } from './utils/speechRecognition'; // Renamed import
import { emojis } from './constants/emojis';


const App = () => {
  // State variables for Firebase instances, user ID, messages, and input
  const { db, auth, userId, loading, error, setError } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // States for chat mode selection
  const [chatMode, setChatMode] = useState('selection'); // 'selection', 'public', 'duo'
  const [duoPartnerId, setDuoPartnerId] = useState('');
  const [tempDuoPartnerInput, setTempDuoPartnerInput] = useState('');

  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message
  const recognitionRef = useRef(null); // Ref for SpeechRecognition

  // Custom hook to manage chat messages
  useChatMessages(db, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError);

  // Handle sending a new message (text or image URL)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((newMessage.trim() === '' && imageURL.trim() === '') || !db || !userId) return;

    let messageData = {
      senderId: userId, // Store full UUID
      timestamp: (await import('firebase/firestore')).serverTimestamp(),
    };

    // Determine message type and content
    if (imageURL.trim() !== '') {
      messageData.type = 'image';
      messageData.content = imageURL.trim();
    } else {
      messageData.type = 'text';
      messageData.content = newMessage.trim();
    }

    if (chatMode === 'public') {
      messageData.chatContext = 'public';
    } else if (chatMode === 'duo' && duoPartnerId) {
      messageData.chatContext = getDuoChatContext(userId, duoPartnerId);
    } else {
      setError("Cannot send message: Invalid chat mode or missing partner ID.");
      return;
    }

    try {
      await (await import('firebase/firestore')).addDoc(
        (await import('firebase/firestore')).collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/chatMessages`),
        messageData
      );
      setNewMessage('');
      setImageURL(''); // Clear image URL input after sending
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    }
  };

  // Handle generating a reply using Gemini API (only for public chat)
  const handleSuggestReply = async () => {
    if (!db || !userId || isGeneratingReply || chatMode !== 'public') return;

    setIsGeneratingReply(true);
    try {
      const lastPublicMessages = messages.filter(msg => msg.chatContext === 'public' && msg.type === 'text').slice(-5);
      const chatHistoryText = lastPublicMessages.map(msg =>
        `${msg.senderId === userId ? 'You' : (msg.senderId === 'gemini-assistant' ? 'Gemini Assistant' : `User ${generateDisplayId(msg.senderId)}`)}: ${msg.content}`
      ).join('\n');

      const prompt = `Based on the following chat conversation, suggest a concise and relevant reply. Keep it under 100 words:\n\n${chatHistoryText}\n\nSuggested Reply:`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;

        await (await import('firebase/firestore')).addDoc(
          (await import('firebase/firestore')).collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/chatMessages`),
          {
            senderId: 'gemini-assistant',
            type: 'text',
            content: text.trim(),
            timestamp: (await import('firebase/firestore')).serverTimestamp(),
            chatContext: 'public',
          }
        );
      } else {
        console.warn("Gemini API did not return a valid response structure.");
        setError("Gemini could not generate a reply.");
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError("Failed to get a reply from Gemini.");
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMsg) => prevMsg + emoji);
    setShowEmojiPicker(false); // Close picker after selection
  };

  // Wrapper for toggleVoiceInput to pass necessary states
  const toggleVoiceInput = () => {
    voiceInputToggleFunction({
      recognitionRef,
      setIsListening,
      setNewMessage,
      setError
    });
  };

  // Render loading or error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700 animate-pulse">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 text-red-700 p-4 rounded-lg animate-fade-in">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  // Render selection screen
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

  // Render chat interface
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
        toggleVoiceInput={toggleVoiceInput} // Pass the wrapper function
        handleEmojiSelect={handleEmojiSelect}
        emojis={emojis} // Pass emojis array
        messagesEndRef={messagesEndRef} // Pass the ref
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
