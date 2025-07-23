// src/utils/speechRecognition.js
let isListening = false;

export const toggleVoiceInput = ({ recognitionRef, setIsListening, setNewMessage, setError }) => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    setError("Speech recognition is not supported.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!recognitionRef.current) {
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      isListening = true;
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setNewMessage(transcript);
      isListening = false;
      setIsListening(false);
    };

    recognitionRef.current.onerror = (e) => {
      setError(`Voice input error: ${e.error}`);
      isListening = false;
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      isListening = false;
      setIsListening(false);
    };
  }

  if (isListening) recognitionRef.current.stop();
  else recognitionRef.current.start();
};
