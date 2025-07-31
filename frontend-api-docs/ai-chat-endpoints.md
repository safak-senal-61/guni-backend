# AI Chat Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/ai-chat
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Sohbet Başlatma

### Endpoint
```
POST /ai-chat/start
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
  "title": "Matematik Dersi Yardımı",
  "initialMessage": "Merhaba, matematik konularında yardıma ihtiyacım var."
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "title": "Matematik Dersi Yardımı",
  "userId": 123,
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z",
  "messages": [
    {
      "id": 1,
      "content": "Merhaba, matematik konularında yardıma ihtiyacım var.",
      "role": "user",
      "timestamp": "2025-01-30T10:30:00Z"
    },
    {
      "id": 2,
      "content": "Merhaba! Matematik konularında size yardımcı olmaktan mutluluk duyarım. Hangi konuda yardıma ihtiyacınız var?",
      "role": "assistant",
      "timestamp": "2025-01-30T10:30:05Z"
    }
  ]
}
```

### Frontend Kullanımı
```javascript
const startChat = async (chatData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/ai-chat/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(chatData)
    });
    
    if (!response.ok) {
      throw new Error('Sohbet başlatılamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Start chat error:', error);
    throw error;
  }
};
```

## 2. Mesaj Gönderme

### Endpoint
```
POST /ai-chat/:chatId/message
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
  "content": "Türev konusunda yardıma ihtiyacım var. f(x) = x² + 3x fonksiyonunun türevini nasıl alırım?",
  "attachments": [
    {
      "type": "image",
      "url": "/uploads/math-problem.jpg",
      "name": "matematik-problemi.jpg"
    }
  ]
}
```

### Response (200 OK)
```json
{
  "userMessage": {
    "id": 3,
    "content": "Türev konusunda yardıma ihtiyacım var. f(x) = x² + 3x fonksiyonunun türevini nasıl alırım?",
    "role": "user",
    "timestamp": "2025-01-30T10:35:00Z",
    "attachments": [
      {
        "type": "image",
        "url": "/uploads/math-problem.jpg",
        "name": "matematik-problemi.jpg"
      }
    ]
  },
  "aiResponse": {
    "id": 4,
    "content": "f(x) = x² + 3x fonksiyonunun türevini almak için güç kuralını kullanacağız:\n\nf'(x) = 2x + 3\n\nAdım adım açıklama:\n1. x² teriminin türevi: 2x¹ = 2x\n2. 3x teriminin türevi: 3\n3. Sonuç: f'(x) = 2x + 3",
    "role": "assistant",
    "timestamp": "2025-01-30T10:35:05Z",
    "metadata": {
      "model": "gpt-4",
      "tokens_used": 150,
      "processing_time": 2.3
    }
  }
}
```

### Frontend Kullanımı
```javascript
const sendMessage = async (chatId, messageData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/ai-chat/${chatId}/message`, {
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

## 3. Sohbet Geçmişi Getirme

### Endpoint
```
GET /ai-chat/:chatId
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?page=1&limit=50&messageId=123
```

### Response (200 OK)
```json
{
  "id": 1,
  "title": "Matematik Dersi Yardımı",
  "userId": 123,
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:35:05Z",
  "messages": [
    {
      "id": 1,
      "content": "Merhaba, matematik konularında yardıma ihtiyacım var.",
      "role": "user",
      "timestamp": "2025-01-30T10:30:00Z"
    },
    {
      "id": 2,
      "content": "Merhaba! Matematik konularında size yardımcı olmaktan mutluluk duyarım. Hangi konuda yardıma ihtiyacınız var?",
      "role": "assistant",
      "timestamp": "2025-01-30T10:30:05Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalMessages": 25,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Frontend Kullanımı
```javascript
const getChatHistory = async (chatId, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { page = 1, limit = 50, messageId } = options;
    
    let url = `http://localhost:3000/ai-chat/${chatId}?page=${page}&limit=${limit}`;
    if (messageId) {
      url += `&messageId=${messageId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Sohbet geçmişi alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get chat history error:', error);
    throw error;
  }
};
```

## 4. Kullanıcının Tüm Sohbetlerini Listeleme

### Endpoint
```
GET /ai-chat/chats
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?page=1&limit=20&search=matematik
```

### Response (200 OK)
```json
{
  "chats": [
    {
      "id": 1,
      "title": "Matematik Dersi Yardımı",
      "lastMessage": {
        "content": "f'(x) = 2x + 3",
        "timestamp": "2025-01-30T10:35:05Z",
        "role": "assistant"
      },
      "messageCount": 8,
      "createdAt": "2025-01-30T10:30:00Z",
      "updatedAt": "2025-01-30T10:35:05Z"
    },
    {
      "id": 2,
      "title": "Fizik Problemleri",
      "lastMessage": {
        "content": "Hareket denklemleri hakkında soru sormak istiyorum",
        "timestamp": "2025-01-29T15:20:00Z",
        "role": "user"
      },
      "messageCount": 12,
      "createdAt": "2025-01-29T15:00:00Z",
      "updatedAt": "2025-01-29T15:20:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalChats": 15,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Frontend Kullanımı
```javascript
const getUserChats = async (options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { page = 1, limit = 20, search } = options;
    
    let url = `http://localhost:3000/ai-chat/chats?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Sohbetler alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user chats error:', error);
    throw error;
  }
};
```

## 5. Sohbet Silme

### Endpoint
```
DELETE /ai-chat/:chatId
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
  "message": "Sohbet başarıyla silindi",
  "deletedChatId": 1
}
```

### Frontend Kullanımı
```javascript
const deleteChat = async (chatId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/ai-chat/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Sohbet silinemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete chat error:', error);
    throw error;
  }
};
```

## 6. Sohbet Başlığını Güncelleme

### Endpoint
```
PUT /ai-chat/:chatId/title
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
  "title": "Yeni Sohbet Başlığı"
}
```

### Response (200 OK)
```json
{
  "id": 1,
  "title": "Yeni Sohbet Başlığı",
  "updatedAt": "2025-01-30T11:00:00Z"
}
```

## 7. Mesaj Silme

### Endpoint
```
DELETE /ai-chat/:chatId/message/:messageId
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
  "message": "Mesaj başarıyla silindi",
  "deletedMessageId": 5
}
```

## 8. Dosya Yükleme (Sohbet İçin)

### Endpoint
```
POST /ai-chat/upload
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Request Body (FormData)
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('chatId', '1');
```

### Response (200 OK)
```json
{
  "message": "Dosya başarıyla yüklendi",
  "file": {
    "id": "upload_123456",
    "originalName": "matematik-problemi.jpg",
    "fileName": "chat-file-123456.jpg",
    "filePath": "/uploads/chat-files/chat-file-123456.jpg",
    "fileType": "image/jpeg",
    "fileSize": 1024000,
    "uploadedAt": "2025-01-30T11:05:00Z"
  }
}
```

### Frontend Kullanımı
```javascript
const uploadChatFile = async (file, chatId) => {
  try {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);
    
    const response = await fetch('http://localhost:3000/ai-chat/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Dosya yüklenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};
```

## 9. Streaming Chat (WebSocket)

### WebSocket Endpoint
```
ws://localhost:3000/ai-chat/stream
```

### Bağlantı Kurma
```javascript
const connectChatStream = (chatId, token) => {
  const ws = new WebSocket(`ws://localhost:3000/ai-chat/stream?chatId=${chatId}&token=${token}`);
  
  ws.onopen = () => {
    console.log('Chat stream bağlantısı kuruldu');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleStreamMessage(data);
  };
  
  ws.onclose = () => {
    console.log('Chat stream bağlantısı kapandı');
  };
  
  ws.onerror = (error) => {
    console.error('Chat stream hatası:', error);
  };
  
  return ws;
};
```

### Mesaj Gönderme (WebSocket)
```javascript
const sendStreamMessage = (ws, message) => {
  ws.send(JSON.stringify({
    type: 'message',
    content: message,
    timestamp: new Date().toISOString()
  }));
};
```

### Stream Mesaj Formatları
```javascript
// Kullanıcı mesajı
{
  "type": "user_message",
  "content": "Merhaba AI",
  "messageId": 123,
  "timestamp": "2025-01-30T11:10:00Z"
}

// AI yanıtı (streaming)
{
  "type": "ai_response_chunk",
  "content": "Merhaba! Size nasıl",
  "messageId": 124,
  "isComplete": false
}

// AI yanıtı tamamlandı
{
  "type": "ai_response_complete",
  "messageId": 124,
  "totalTokens": 150,
  "processingTime": 2.5
}

// Hata mesajı
{
  "type": "error",
  "message": "Bağlantı hatası",
  "code": "CONNECTION_ERROR"
}
```

## 10. Chat Analytics

### Endpoint
```
GET /ai-chat/analytics
```

### Response (200 OK)
```json
{
  "totalChats": 25,
  "totalMessages": 150,
  "averageMessagesPerChat": 6,
  "totalTokensUsed": 15000,
  "mostActiveDay": "2025-01-30",
  "topTopics": [
    {
      "topic": "matematik",
      "count": 12
    },
    {
      "topic": "fizik",
      "count": 8
    }
  ],
  "weeklyStats": [
    {
      "date": "2025-01-24",
      "messageCount": 15,
      "chatCount": 3
    }
  ]
}
```

## React Hook Örneği

```javascript
import { useState, useEffect } from 'react';

const useAIChat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startNewChat = async (title, initialMessage) => {
    setLoading(true);
    try {
      const chat = await startChat({ title, initialMessage });
      setChats(prev => [chat, ...prev]);
      setCurrentChat(chat);
      return chat;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (chatId, content, attachments = []) => {
    setLoading(true);
    try {
      const response = await sendMessage(chatId, { content, attachments });
      
      // Mevcut sohbeti güncelle
      if (currentChat?.id === chatId) {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...prev.messages, response.userMessage, response.aiResponse]
        }));
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadChats = async () => {
    setLoading(true);
    try {
      const response = await getUserChats();
      setChats(response.chats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async (chatId) => {
    setLoading(true);
    try {
      const chat = await getChatHistory(chatId);
      setCurrentChat(chat);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return {
    chats,
    currentChat,
    loading,
    error,
    startNewChat,
    sendChatMessage,
    loadChats,
    loadChatHistory,
    setCurrentChat
  };
};

export default useAIChat;
```

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Sohbet bulunamadı
- **413**: Dosya çok büyük
- **429**: Çok fazla istek
- **500**: Sunucu hatası

## Güvenlik ve Performans Notları

1. **Rate Limiting**: API'de dakikada maksimum 60 istek sınırı vardır
2. **Dosya Boyutu**: Maksimum 10MB dosya yüklenebilir
3. **Token Yönetimi**: Token'ları güvenli saklayın
4. **WebSocket**: Bağlantı koptuğunda otomatik yeniden bağlanma implementasyonu yapın
5. **Caching**: Sohbet listesini local storage'da cache'leyebilirsiniz
6. **Pagination**: Büyük sohbet geçmişleri için pagination kullanın