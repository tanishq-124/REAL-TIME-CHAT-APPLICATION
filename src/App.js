import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import components, hooks, and utilities
import SelectionScreen from './components/SelectionScreen';
import ChatInterface from './components/ChatInterface';
import ShareModal from './components/ShareModal';
import { useFirebase } from './hooks/useFirebase';
import { useChatMessages } from './hooks/useChatMessages';
import { generateDisplayId } from './utils/chatUtils';

import './App.css'; // Import the main CSS file

const App = () => {
  // State variables for Firebase instances, user ID, messages, and input
  const { db, auth, userId, loading, error, setError } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState('');

  // States for chat mode selection
  const [chatMode, setChatMode] = useState('selection'); // 'selection', 'public', 'duo'
  const [duoPartnerId, setDuoPartnerId] = useState('');
  const [tempDuoPartnerInput, setTempDuoPartnerInput] = useState('');

  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  // Custom hook to manage chat messages
  useChatMessages(db, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError);

  // Scroll to the bottom of the messages list whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        setIsListening={setIsListening}
        setError={setError}
        recognitionRef={recognitionRef}
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
