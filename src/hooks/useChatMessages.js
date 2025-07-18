import { useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { getDuoChatContext } from '../utils/chatUtils'; // Import utility

export const useChatMessages = (db, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError) => {
  useEffect(() => {
    if (db && userId && chatMode !== 'selection') {
      const messagesCollectionRef = collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/chatMessages`);
      let q;

      if (chatMode === 'public') {
        q = query(messagesCollectionRef, where('chatContext', '==', 'public'));
      } else if (chatMode === 'duo' && duoPartnerId) {
        const chatContextId = getDuoChatContext(userId, duoPartnerId);
        q = query(messagesCollectionRef, where('chatContext', '==', chatContextId));
      } else {
        setMessages([]);
        return;
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        fetchedMessages.sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
          return timeA - timeB;
        });
        setMessages(fetchedMessages);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, (err) => {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages.");
      });

      return () => unsubscribe();
    } else if (chatMode === 'selection') {
      setMessages([]);
    }
  }, [db, userId, chatMode, duoPartnerId, setMessages, messagesEndRef, setError]);
};
