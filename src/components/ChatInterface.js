import React from 'react';

const ChatInterface = ({
  userId,
  chatMode,
  duoPartnerId,
  messages,
  newMessage,
  setNewMessage,
  imageURL,
  setImageURL,
  handleSendMessage,
  handleSuggestReply,
  isGeneratingReply,
  setShowShareModal,
  generateDisplayId,
  showEmojiPicker,
  setShowEmojiPicker,
  isListening,
  toggleVoiceInput, // Receive the wrapper function
  handleEmojiSelect,
  emojis, // Receive emojis array
  messagesEndRef // Receive the ref
}) => {
  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {chatMode === 'public' ? 'Public Chat' : `Duo Chat with ${generateDisplayId(duoPartnerId)}`}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm opacity-90">
              Your User ID: <span className="font-mono bg-blue-700 px-2 py-1 rounded-md text-xs">{generateDisplayId(userId)}</span>
            </div>
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200 transform active:scale-95"
            >
              Share Room Link
            </button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-grow container mx-auto p-4 flex flex-col bg-white bg-opacity-90 shadow-2xl rounded-xl my-4 overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-lg mt-10">
              {chatMode === 'public' ? 'No public messages yet. Start the conversation!' : 'No messages in this duo chat. Say hello!'}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === userId
                    ? 'justify-end'
                    : msg.senderId === 'gemini-assistant'
                    ? 'justify-center'
                    : 'justify-start'
                } animate-fade-in-up`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md relative transition-all duration-300 ease-in-out ${
                    msg.senderId === userId
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : msg.senderId === 'gemini-assistant'
                      ? 'bg-purple-200 text-purple-900 rounded-lg text-center'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="font-semibold text-sm mb-1">
                    {msg.senderId === userId ? 'You' : (msg.senderId === 'gemini-assistant' ? '✨ Gemini Assistant' : `User: ${generateDisplayId(msg.senderId)}`)}
                  </p>
                  {msg.type === 'text' && <p className="text-base break-words">{msg.content}</p>}
                  {msg.type === 'image' && (
                    <img
                      src={msg.content}
                      alt="Shared"
                      className="max-w-full h-auto rounded-lg mt-2"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x100/FF0000/FFFFFF?text=Image+Error"; }}
                    />
                  )}
                  <span className="block text-xs mt-1 opacity-75">
                    {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : 'Sending...'}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col space-y-3">
            {/* Text Message Input */}
            <div className="flex space-x-3 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
                className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                disabled={!userId || isGeneratingReply || isListening}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-3 rounded-full shadow-md transition-all duration-200 transform active:scale-95 ${
                  isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
                } text-white`}
                disabled={!userId || isGeneratingReply}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.2-3c0 3.53-2.9 6.43-6.2 6.43S5.6 14.53 5.6 11H4c0 3.98 3.15 7.22 7 7.74V22h2v-3.26c3.85-.52 7-3.76 7-7.74h-1.2z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-md transition-colors duration-200 transform active:scale-95"
                disabled={!userId || isGeneratingReply}
              >
                😊
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                disabled={!userId || (newMessage.trim() === '' && imageURL.trim() === '') || isGeneratingReply}
              >
                Send
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg shadow-inner animate-fade-in">
                {emojis.map((emoji, index) => (
                  <span
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="cursor-pointer text-2xl hover:scale-110 transition-transform duration-150"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Image URL Input */}
            <div className="flex space-x-3 items-center">
              <input
                type="text"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="Paste Image URL (e.g., .jpg, .png)"
                className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                disabled={!userId || isGeneratingReply}
              />
              <button
                type="button"
                onClick={handleSuggestReply}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                disabled={!userId || isGeneratingReply || messages.length === 0 || chatMode !== 'public'}
              >
                {isGeneratingReply ? 'Generating...' : 'Suggest Reply ✨'}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-3 mt-auto rounded-t-xl">
        <div className="container mx-auto text-center text-xs opacity-80">
          <p>&copy; {new Date().getFullYear()} Real-Time Chat App. All rights reserved.</p>
          <p>Developed by <a href="https://www.linkedin.com/in/tanishq-agrawal-91a505335?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Tanishq Agrawal</a></p>
          <p>Powered by React & Firestore</p>
        </div>
      </footer>
    </>
  );
};

export default ChatInterface;
