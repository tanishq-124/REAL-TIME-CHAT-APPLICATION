// src/utils/chatUtils.js
export const generateDisplayId = (uid) => uid.slice(0, 6).toUpperCase();

export const getDuoChatContext = (id1, id2) => {
  return [id1, id2].sort().join('_');
};
