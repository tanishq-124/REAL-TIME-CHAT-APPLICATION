// Function to copy text to clipboard with visual feedback
export const copyToClipboard = (text, messageType, setCopiedMessage) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    setCopiedMessage(`${messageType} copied!`);
    setTimeout(() => setCopiedMessage(''), 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    setCopiedMessage('Copy failed!');
    setTimeout(() => setCopiedMessage(''), 2000);
  }
  document.body.removeChild(textarea);
};
