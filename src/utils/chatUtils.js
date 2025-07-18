// Helper function to get a consistent chat context ID for duo chats
export const getDuoChatContext = (userId1, userId2) => {
  // Sort IDs to ensure a consistent chat context regardless of who initiates
  const sortedIds = [userId1, userId2].sort();
  return `duo_${sortedIds[0]}_${sortedIds[1]}`;
};

// Function to generate a consistent 8-character display ID from the full UUID
export const generateDisplayId = (fullUserId) => {
  if (!fullUserId || fullUserId.length < 32) {
    // Return as is or a placeholder if userId is not a full UUID yet
    return fullUserId || 'Loading...';
  }
  // Take characters from different parts of the UUID to make it "shuffled-like"
  // This is deterministic for a given UUID and ensures it's always 8 characters
  return (
    fullUserId.substring(0, 2) +   // First 2 chars
    fullUserId.substring(9, 11) +  // Chars from the second segment
    fullUserId.substring(19, 21) + // Chars from the fourth segment
    fullUserId.substring(30, 32)   // Last 2 chars
  );
};
