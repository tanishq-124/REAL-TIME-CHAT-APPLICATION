// src/hooks/useChatMessages.js
import { useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { getDuoChatContext } from '../utils/chatUtils';

const useChatMessages = (db, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError) => {
  useEffect(() => {
    if (!db || !userId || chatMode === 'selection') return;

    const chatPath =
      chatMode === 'public'
        ? query(collection(db, 'chatMessages'), where('chatContext', '==', 'public'), orderBy('timestamp', 'asc'))
        : query(
            collection(db, 'chatMessages'),
            where('chatContext', '==', getDuoChatContext(userId, duoPartnerId)),
            orderBy('timestamp', 'asc')
          );

    const unsubscribe = onSnapshot(chatPath, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      if (messagesEndRef?.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, (err) => {
      setError("Failed to load chat messages.");
    });

    return () => unsubscribe();
  }, [db, userId, chatMode, duoPartnerId]);
};

export default useChatMessages;
