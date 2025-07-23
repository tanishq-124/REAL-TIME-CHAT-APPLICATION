// src/utils/speechRecognition.js
let isListening = false;

export const toggleVoiceInput = ({ recognitionRef, setIsListening, setNewMessage, setError }) => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    setError("Speech recognition is not supported in your browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!recognitionRef.current) {
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      isListening = true;
      setIsListening(true);
      setNewMessage('');
      setError(null);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
      isListening = false;
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      setError(`Voice input error: ${event.error}`);
      isListening = false;
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      isListening = false;
      setIsListening(false);
    };
  }

  if (isListening) {
    recognitionRef.current.stop();
  } else {
    recognitionRef.current.start();
  }
};
