// Handles voice input using Web Speech API
export const toggleVoiceInput = ({ recognitionRef, setIsListening, setNewMessage, setError }) => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    setError("Speech recognition is not supported in your browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!recognitionRef.current) {
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; // Listen for a single phrase
    recognitionRef.current.interimResults = false; // Only return final results
    recognitionRef.current.lang = 'en-US'; // Set language

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setNewMessage(''); // Clear current message when starting voice input
      setError(null); // Clear any previous errors
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Voice input error: ${event.error}. Please try again.`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }

  if (setIsListening) { // If currently listening, stop
    recognitionRef.current.stop();
  } else { // Otherwise, start
    recognitionRef.current.start();
  }
};
