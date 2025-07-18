import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils'; // Import copyToClipboard

const ShareModal = ({ setShowShareModal, chatMode, userId, copiedMessage, setCopiedMessage, generateDisplayId }) => {
  const appUrlFromIframe = window.location.href; // This will be the iframe URL

  let shareMessageBase = '';
  if (chatMode === 'public') {
    shareMessageBase = `Join my public chat room! Open the app (copy the URL from your browser's address bar) and select 'Join Public Chat'.`;
  } else if (chatMode === 'duo') {
    shareMessageBase = `Let's chat privately! Open the app (copy the URL from your browser's address bar) and enter my User ID: ${userId} in the 'Start Duo Chat' section.`;
  }

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareMessageBase)}`;
  const telegramLink = `https://t.me/share/url?text=${encodeURIComponent(shareMessageBase)}`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-out">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full text-center transform scale-95 opacity-0 animate-scale-in">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Share Room Link</h3>
        <p className="text-red-600 font-semibold mb-4">
          IMPORTANT: For reliable sharing, please copy the URL directly from your browser's address bar.
          The "Copy Application Link" button below copies the internal Canvas URL which may not work outside this environment.
        </p>
        <p className="text-gray-700 mb-6">{shareMessageBase}</p>

        <div className="flex flex-col space-y-3 mb-6">
          <button
            onClick={() => copyToClipboard(appUrlFromIframe, "Application link", setCopiedMessage)}
            className="relative w-full bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-semibold py-2 px-4 rounded-full transition-colors duration-200"
          >
            Copy Application Link (May not work outside Canvas)
            {copiedMessage.includes("Application link") && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-600 font-bold">
                {copiedMessage}
              </span>
            )}
          </button>
          {chatMode === 'duo' && (
            <button
              onClick={() => copyToClipboard(userId, "Your User ID", setCopiedMessage)}
              className="relative w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-colors duration-200"
            >
              Copy Your User ID ({generateDisplayId(userId)})
              {copiedMessage.includes("Your User ID") && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-600 font-bold">
                  {copiedMessage}
                </span>
              )}
            </button>
          )}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.04 2C7.03 2 3 6.03 3 11.04c0 1.74.5 3.37 1.37 4.79L3 21l5.44-1.45c1.36.74 2.91 1.15 4.16 1.15 5.01 0 9.04-4.03 9.04-9.04C21.08 6.03 17.05 2 12.04 2zm3.64 14.64c-.23.23-.5.34-.78.34-.28 0-.55-.11-.78-.34l-.4-.4c-.11-.11-.22-.16-.34-.16-.12 0-.23.05-.34.16-.67.67-1.56 1.04-2.52 1.04-.96 0-1.85-.37-2.52-1.04-.67-.67-1.04-1.56-1.04-2.52 0-.96.37-1.85 1.04-2.52.11-.11.16-.22.16-.34 0-.12-.05-.23-.16-.34l-.4-.4c-.23-.23-.34-.5-.34-.78 0-.28.11-.55.34-.78l.8-.8c.23-.23.5-.34.78-.34.28 0 .55.11.78.34l.4.4c.11.11.22.16.34.16.12 0 .23-.05.34-.16.67-.67 1.56-1.04 2.52-1.04.96 0 1.85.37 2.52 1.04.67.67 1.04 1.56 1.04 2.52 0 .96-.37 1.85-1.04 2.52-.11.11-.22.16-.34.16-.12 0-.23-.05-.34-.16l-.4-.4c-.23-.23-.34-.5-.34-.78 0-.28.11-.55.34-.78z"/>
            </svg>
            Share on WhatsApp
          </a>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.71 7.21l-2.83 8.16c-.19.55-.74.9-1.33.9-.16 0-.32-.03-.47-.09L9.1 15.65l-2.45-2.35c-.2-.19-.27-.47-.2-.73.07-.26.27-.46.54-.53l8.16-2.83c.55-.19.9.36.71.91z"/>
            </svg>
            Share on Telegram
          </a>
        </div>
        <button
          onClick={() => setShowShareModal(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
