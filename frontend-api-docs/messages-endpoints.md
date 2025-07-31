# Messages Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/messages
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Mesaj Gönderme

### Endpoint
```
POST /messages
```

### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Request Body
```json
{
  "receiverId": "user_123",
  "content": "Merhaba, nasılsın?",
  "type": "text",
  "attachments": [
    {
      "type": "image",
      "url": "/uploads/image123.jpg",
      "name": "resim.jpg",
      "size": 1024000
    }
  ],
  "metadata": {
    "priority": "normal",
    "category": "general"
  }
}
```

### Response (201 Created)
```json
{
  "id": "msg_456",
  "senderId": "user_789",
  "receiverId": "user_123",
  "content": "Merhaba, nasılsın?",
  "type": "text",
  "attachments": [
    {
      "type": "image",
      "url": "/uploads/image123.jpg",
      "name": "resim.jpg",
      "size": 1024000
    }
  ],
  "metadata": {
    "priority": "normal",
    "category": "general"
  },
  "isRead": false,
  "createdAt": "2025-01-30T12:00:00Z",
  "updatedAt": "2025-01-30T12:00:00Z",
  "sender": {
    "id": "user_789",
    "name": "Ahmet Yılmaz",
    "avatar": "/uploads/avatar789.jpg",
    "role": "student"
  },
  "receiver": {
    "id": "user_123",
    "name": "Mehmet Demir",
    "avatar": "/uploads/avatar123.jpg",
    "role": "teacher"
  }
}
```

### Frontend Kullanımı
```javascript
const sendMessage = async (messageData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      throw new Error('Mesaj gönderilemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};
```

## 2. Kullanıcının Konuşmalarını Listeleme

### Endpoint
```
GET /messages/conversations
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?page=1&limit=20
```

### Response (200 OK)
```json
{
  "conversations": [
    {
      "id": "conv_123",
      "participant": {
        "id": "user_456",
        "name": "Ayşe Kaya",
        "avatar": "/uploads/avatar456.jpg",
        "role": "teacher",
        "isOnline": true,
        "lastSeen": "2025-01-30T11:55:00Z"
      },
      "lastMessage": {
        "id": "msg_789",
        "content": "Ödevini teslim etmeyi unutma",
        "type": "text",
        "senderId": "user_456",
        "createdAt": "2025-01-30T11:50:00Z",
        "isRead": false
      },
      "unreadCount": 3,
      "totalMessages": 25,
      "createdAt": "2025-01-25T10:00:00Z",
      "updatedAt": "2025-01-30T11:50:00Z"
    },
    {
      "id": "conv_124",
      "participant": {
        "id": "user_789",
        "name": "Mehmet Özkan",
        "avatar": "/uploads/avatar789.jpg",
        "role": "student",
        "isOnline": false,
        "lastSeen": "2025-01-30T09:30:00Z"
      },
      "lastMessage": {
        "id": "msg_790",
        "content": "Teşekkürler öğretmenim",
        "type": "text",
        "senderId": "user_789",
        "createdAt": "2025-01-30T09:30:00Z",
        "isRead": true
      },
      "unreadCount": 0,
      "totalMessages": 12,
      "createdAt": "2025-01-28T14:00:00Z",
      "updatedAt": "2025-01-30T09:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalConversations": 15,
    "hasNext": true,
    "hasPrevious": false
  },
  "totalUnreadMessages": 3
}
```

### Frontend Kullanımı
```javascript
const getConversations = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/messages/conversations?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Konuşmalar alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get conversations error:', error);
    throw error;
  }
};
```

## 3. Belirli Bir Konuşmayı Getirme

### Endpoint
```
GET /messages/conversation/:userId
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?page=1&limit=50&before=2025-01-30T12:00:00Z&after=2025-01-29T12:00:00Z
```

### Response (200 OK)
```json
{
  "conversation": {
    "id": "conv_123",
    "participant": {
      "id": "user_456",
      "name": "Ayşe Kaya",
      "avatar": "/uploads/avatar456.jpg",
      "role": "teacher",
      "isOnline": true,
      "lastSeen": "2025-01-30T11:55:00Z",
      "bio": "Matematik öğretmeni",
      "department": "Matematik"
    },
    "messages": [
      {
        "id": "msg_789",
        "senderId": "user_456",
        "receiverId": "user_current",
        "content": "Ödevini teslim etmeyi unutma",
        "type": "text",
        "attachments": [],
        "metadata": {
          "priority": "high",
          "category": "homework"
        },
        "isRead": false,
        "createdAt": "2025-01-30T11:50:00Z",
        "updatedAt": "2025-01-30T11:50:00Z",
        "reactions": [
          {
            "userId": "user_current",
            "emoji": "👍",
            "createdAt": "2025-01-30T11:51:00Z"
          }
        ],
        "replyTo": null
      },
      {
        "id": "msg_788",
        "senderId": "user_current",
        "receiverId": "user_456",
        "content": "Tamam öğretmenim, bugün teslim edeceğim",
        "type": "text",
        "attachments": [],
        "metadata": {
          "priority": "normal",
          "category": "response"
        },
        "isRead": true,
        "createdAt": "2025-01-30T11:45:00Z",
        "updatedAt": "2025-01-30T11:45:00Z",
        "reactions": [],
        "replyTo": {
          "messageId": "msg_787",
          "content": "Ödevin ne zaman teslim?",
          "senderId": "user_456"
        }
      }
    ],
    "totalMessages": 25,
    "unreadCount": 1
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Frontend Kullanımı
```javascript
const getConversation = async (userId, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { page = 1, limit = 50, before, after } = options;
    
    let url = `http://localhost:3000/messages/conversation/${userId}?page=${page}&limit=${limit}`;
    if (before) url += `&before=${before}`;
    if (after) url += `&after=${after}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Konuşma alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get conversation error:', error);
    throw error;
  }
};
```

## 4. Okunmamış Mesaj Sayısı

### Endpoint
```
GET /messages/unread-count
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Response (200 OK)
```json
{
  "totalUnreadCount": 7,
  "conversationCounts": [
    {
      "userId": "user_456",
      "userName": "Ayşe Kaya",
      "unreadCount": 3
    },
    {
      "userId": "user_789",
      "userName": "Mehmet Özkan",
      "unreadCount": 4
    }
  ],
  "lastUpdated": "2025-01-30T12:00:00Z"
}
```

### Frontend Kullanımı
```javascript
const getUnreadCount = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/messages/unread-count', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Okunmamış mesaj sayısı alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get unread count error:', error);
    throw error;
  }
};
```

## 5. Mesajları Okundu Olarak İşaretleme

### Endpoint
```
POST /messages/mark-read/:senderId
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "markedCount": 3,
  "senderId": "user_456",
  "markedAt": "2025-01-30T12:05:00Z",
  "message": "3 mesaj okundu olarak işaretlendi"
}
```

### Frontend Kullanımı
```javascript
const markMessagesAsRead = async (senderId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/messages/mark-read/${senderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Mesajlar okundu olarak işaretlenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};
```

## 6. Mesaj Silme

### Endpoint
```
DELETE /messages/:messageId
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "deletedMessageId": "msg_789",
  "deletedAt": "2025-01-30T12:10:00Z",
  "message": "Mesaj başarıyla silindi"
}
```

### Frontend Kullanımı
```javascript
const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Mesaj silinemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete message error:', error);
    throw error;
  }
};
```

## React Hook Örneği

```javascript
import { useState, useCallback, useEffect } from 'react';

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getConversations(page, limit);
      setConversations(response.conversations);
      setUnreadCount(response.totalUnreadMessages);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConversation = useCallback(async (userId, options = {}) => {
    setLoading(true);
    try {
      const response = await getConversation(userId, options);
      setCurrentConversation(response.conversation);
      setMessages(response.conversation.messages);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendNewMessage = useCallback(async (messageData) => {
    try {
      const newMessage = await sendMessage(messageData);
      
      // Mevcut mesajlara ekle
      setMessages(prev => [newMessage, ...prev]);
      
      // Konuşma listesini güncelle
      setConversations(prev => 
        prev.map(conv => 
          conv.participant.id === messageData.receiverId
            ? { ...conv, lastMessage: newMessage, updatedAt: newMessage.createdAt }
            : conv
        )
      );
      
      return newMessage;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (senderId) => {
    try {
      const result = await markMessagesAsRead(senderId);
      
      // Mesajları okundu olarak işaretle
      setMessages(prev => 
        prev.map(msg => 
          msg.senderId === senderId ? { ...msg, isRead: true } : msg
        )
      );
      
      // Konuşma listesindeki okunmamış sayısını güncelle
      setConversations(prev => 
        prev.map(conv => 
          conv.participant.id === senderId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      // Toplam okunmamış sayısını güncelle
      setUnreadCount(prev => prev - result.markedCount);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeMessage = useCallback(async (messageId) => {
    try {
      const result = await deleteMessage(messageId);
      
      // Mesajı listeden kaldır
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.totalUnreadCount);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Gerçek zamanlı güncellemeler için polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 saniyede bir kontrol et

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    loading,
    error,
    fetchConversations,
    fetchConversation,
    sendNewMessage,
    markAsRead,
    removeMessage,
    fetchUnreadCount,
    setCurrentConversation,
    setMessages
  };
};

export default useMessages;
```

## WebSocket Entegrasyonu

```javascript
import { useEffect, useRef } from 'react';
import useMessages from './useMessages';

const useRealtimeMessages = () => {
  const ws = useRef(null);
  const { 
    conversations, 
    setMessages, 
    setConversations, 
    fetchUnreadCount 
  } = useMessages();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    // WebSocket bağlantısı kur
    ws.current = new WebSocket(`ws://localhost:3000/messages?token=${token}`);
    
    ws.current.onopen = () => {
      console.log('WebSocket bağlantısı kuruldu');
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'new_message':
          // Yeni mesaj geldi
          setMessages(prev => [data.message, ...prev]);
          setConversations(prev => 
            prev.map(conv => 
              conv.participant.id === data.message.senderId
                ? { 
                    ...conv, 
                    lastMessage: data.message, 
                    unreadCount: conv.unreadCount + 1,
                    updatedAt: data.message.createdAt 
                  }
                : conv
            )
          );
          fetchUnreadCount();
          break;
          
        case 'message_read':
          // Mesaj okundu
          setMessages(prev => 
            prev.map(msg => 
              data.messageIds.includes(msg.id) 
                ? { ...msg, isRead: true }
                : msg
            )
          );
          break;
          
        case 'user_typing':
          // Kullanıcı yazıyor
          console.log(`${data.userName} yazıyor...`);
          break;
          
        case 'user_online':
          // Kullanıcı çevrimiçi
          setConversations(prev => 
            prev.map(conv => 
              conv.participant.id === data.userId
                ? { ...conv, participant: { ...conv.participant, isOnline: true } }
                : conv
            )
          );
          break;
          
        case 'user_offline':
          // Kullanıcı çevrimdışı
          setConversations(prev => 
            prev.map(conv => 
              conv.participant.id === data.userId
                ? { 
                    ...conv, 
                    participant: { 
                      ...conv.participant, 
                      isOnline: false, 
                      lastSeen: data.lastSeen 
                    } 
                  }
                : conv
            )
          );
          break;
      }
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket hatası:', error);
    };
    
    ws.current.onclose = () => {
      console.log('WebSocket bağlantısı kapandı');
      // Yeniden bağlanmayı dene
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CLOSED) {
          // Yeniden bağlan
        }
      }, 5000);
    };
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendTypingIndicator = (receiverId, isTyping) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'typing',
        receiverId,
        isTyping
      }));
    }
  };

  return {
    sendTypingIndicator,
    isConnected: ws.current?.readyState === WebSocket.OPEN
  };
};

export default useRealtimeMessages;
```

## Mesaj Türleri

- **text**: Metin mesajı
- **image**: Resim
- **file**: Dosya
- **audio**: Ses kaydı
- **video**: Video
- **location**: Konum
- **system**: Sistem mesajı

## Mesaj Öncelikleri

- **low**: Düşük öncelik
- **normal**: Normal öncelik
- **high**: Yüksek öncelik
- **urgent**: Acil

## Mesaj Kategorileri

- **general**: Genel
- **homework**: Ödev
- **announcement**: Duyuru
- **question**: Soru
- **response**: Cevap
- **reminder**: Hatırlatma

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Mesaj/Kullanıcı bulunamadı
- **429**: Çok fazla istek
- **500**: Sunucu hatası

## Güvenlik ve Performans

1. **Rate Limiting**: Spam koruması
2. **Message Encryption**: Uçtan uca şifreleme
3. **File Scanning**: Zararlı dosya kontrolü
4. **Content Filtering**: İçerik filtreleme
5. **Pagination**: Büyük konuşmalar için sayfalama
6. **Caching**: Performans optimizasyonu