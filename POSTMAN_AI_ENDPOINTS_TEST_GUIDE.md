# Yapay Zeka Endpointleri Postman Test Rehberi

Bu dokümantasyon, guni-backend projesindeki yapay zeka endpointlerini Postman ile test etmek için detaylı bir rehber sunmaktadır.

## 📋 İçindekiler

1. [Genel Kurulum](#genel-kurulum)
2. [Authentication](#authentication)
3. [AI Chat Endpointleri](#ai-chat-endpointleri)
4. [Content Analysis Endpointleri](#content-analysis-endpointleri)
5. [User Onboarding Endpointleri](#user-onboarding-endpointleri)
6. [Test Senaryoları](#test-senaryoları)
7. [Hata Durumları](#hata-durumları)

## 🚀 Genel Kurulum

### Base URL
```
http://localhost:3000
```

### Headers (Tüm istekler için)
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 🔐 Authentication

### 1. Kullanıcı Girişi
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Postman Test Script:**
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response).to.have.property('access_token');
    pm.globals.set("jwt_token", response.access_token);
});
```

## 🤖 AI Chat Endpointleri

### 1. Mesaj Gönderme
**Endpoint:** `POST /ai-chat/send-message`

**Headers:**
```json
{
  "Authorization": "Bearer {{jwt_token}}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "message": "Matematik konusunda yardıma ihtiyacım var",
  "context": "algebra",
  "userId": 1
}
```

**Expected Response:**
```json
{
  "response": "Merhaba! Matematik konusunda size yardımcı olmaktan mutluluk duyarım. Hangi algebra konusunda yardıma ihtiyacınız var?",
  "conversationId": "conv_123456",
  "timestamp": "2025-01-30T10:30:00Z"
}
```

**Postman Test Script:**
```javascript
pm.test("AI Chat response received", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response).to.have.property('response');
    pm.expect(response.response).to.be.a('string');
    pm.expect(response.response.length).to.be.above(0);
});
```

### 2. Konuşma Geçmişi
**Endpoint:** `GET /ai-chat/conversation-history?userId=1&limit=10`

**Expected Response:**
```json
{
  "conversations": [
    {
      "id": "conv_123456",
      "messages": [
        {
          "role": "user",
          "content": "Matematik konusunda yardıma ihtiyacım var",
          "timestamp": "2025-01-30T10:30:00Z"
        },
        {
          "role": "assistant",
          "content": "Merhaba! Size nasıl yardımcı olabilirim?",
          "timestamp": "2025-01-30T10:30:05Z"
        }
      ]
    }
  ]
}
```

### 3. Çalışma Önerileri
**Endpoint:** `POST /ai-chat/get-study-suggestions`

**Request Body:**
```json
{
  "subject": "Matematik",
  "currentLevel": "intermediate",
  "weakAreas": ["algebra", "geometry"],
  "userId": 1
}
```

**Expected Response:**
```json
{
  "suggestions": [
    {
      "topic": "Doğrusal Denklemler",
      "difficulty": "intermediate",
      "estimatedTime": "30 dakika",
      "resources": [
        "Video: Doğrusal Denklemler Temelleri",
        "Quiz: Doğrusal Denklem Çözme"
      ]
    }
  ],
  "studyPlan": {
    "dailyGoal": "2 saat",
    "weeklyTopics": ["algebra", "geometry"]
  }
}
```

### 4. Konu Açıklaması
**Endpoint:** `POST /ai-chat/explain-topic`

**Request Body:**
```json
{
  "topic": "Kuadratik Denklemler",
  "level": "beginner",
  "language": "tr",
  "userId": 1
}
```

### 5. Motivasyonel Destek
**Endpoint:** `POST /ai-chat/motivational-support`

**Request Body:**
```json
{
  "mood": "frustrated",
  "subject": "Matematik",
  "recentPerformance": "low",
  "userId": 1
}
```

## 📊 Content Analysis Endpointleri

### 1. İçerik Analizi
**Endpoint:** `POST /content-analysis/analyze`

**Request Body:**
```json
{
  "text": "Matematik, sayılar, şekiller ve desenlerle ilgilenen bir bilim dalıdır. Temel matematik işlemleri toplama, çıkarma, çarpma ve bölmedir.",
  "userId": 1,
  "subject": "Matematik",
  "learningObjectives": "Temel matematik kavramlarını öğrenmek"
}
```

**Expected Response:**
```json
{
  "analysis": {
    "difficulty": "beginner",
    "keyTopics": ["temel işlemler", "sayılar", "matematik temelleri"],
    "estimatedReadingTime": "2 dakika",
    "comprehensionLevel": "easy"
  },
  "recommendations": [
    "Bu içerik matematik temellerini öğrenmek için uygun",
    "Sonraki adım: Dört işlem uygulamaları"
  ]
}
```

**Postman Test Script:**
```javascript
pm.test("Content analysis successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response).to.have.property('analysis');
    pm.expect(response.analysis).to.have.property('difficulty');
    pm.expect(response.analysis).to.have.property('keyTopics');
});
```

### 2. Quiz Soruları Oluşturma
**Endpoint:** `POST /content-analysis/generate-quiz`

**Request Body:**
```json
{
  "text": "Matematik temel işlemler konusu",
  "numberOfQuestions": 5,
  "difficulty": "intermediate",
  "subject": "Matematik",
  "keyTopics": "toplama, çıkarma, çarpma, bölme",
  "learningObjectives": "Dört işlemi öğrenmek"
}
```

**Expected Response:**
```json
{
  "quiz": {
    "title": "Matematik Temel İşlemler Quiz",
    "questions": [
      {
        "id": 1,
        "question": "15 + 23 işleminin sonucu nedir?",
        "options": ["38", "35", "40", "33"],
        "correctAnswer": "38",
        "explanation": "15 + 23 = 38"
      }
    ],
    "estimatedTime": "10 dakika"
  }
}
```

### 3. İçerik Özetleme
**Endpoint:** `POST /content-analysis/summarize`

**Request Body:**
```json
{
  "text": "Uzun matematik metni...",
  "maxLength": 200,
  "userId": 1
}
```

## 👤 User Onboarding Endpointleri

### 1. Onboarding Quiz Gönderme
**Endpoint:** `POST /user-onboarding/submit-quiz`

**Request Body:**
```json
{
  "userId": 1,
  "answers": {
    "favoriteSubjects": ["Matematik", "Fen"],
    "learningStyle": "visual",
    "currentLevel": "intermediate",
    "goals": ["exam_prep", "skill_improvement"]
  }
}
```

**Expected Response:**
```json
{
  "profile": {
    "learningStyle": "visual",
    "recommendedSubjects": ["Matematik", "Fen"],
    "difficultyLevel": "intermediate"
  },
  "recommendations": [
    "Görsel öğrenme materyalleri kullanın",
    "Matematik konularında pratik yapın"
  ]
}
```

### 2. Zayıflık Analizi
**Endpoint:** `GET /user-onboarding/weakness-analysis?userId=1`

**Expected Response:**
```json
{
  "weaknesses": [
    {
      "subject": "Matematik",
      "topic": "Algebra",
      "score": 65,
      "recommendations": [
        "Daha fazla algebra pratiği yapın",
        "Temel kavramları tekrar edin"
      ]
    }
  ],
  "overallScore": 75
}
```

## 🧪 Test Senaryoları

### Senaryo 1: Tam AI Chat Akışı
1. **Login** → JWT token al
2. **Send Message** → AI'dan yanıt al
3. **Get Conversation History** → Geçmişi kontrol et
4. **Get Study Suggestions** → Öneriler al

### Senaryo 2: İçerik Analizi Akışı
1. **Login** → JWT token al
2. **Analyze Content** → İçerik analizi yap
3. **Generate Quiz** → Quiz oluştur
4. **Summarize** → Özet çıkar

### Senaryo 3: Onboarding Akışı
1. **Login** → JWT token al
2. **Submit Quiz** → Onboarding quiz gönder
3. **Get Weakness Analysis** → Zayıflık analizi al

## ❌ Hata Durumları

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "JWT token gerekli"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "message field is required"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "AI service temporarily unavailable"
}
```

## 📝 Postman Collection Kurulumu

### Environment Variables
```json
{
  "base_url": "http://localhost:3000",
  "jwt_token": "",
  "user_id": "1"
}
```

### Pre-request Script (Collection Level)
```javascript
// JWT token kontrolü
if (!pm.globals.get("jwt_token")) {
    console.log("JWT token bulunamadı. Önce login yapın.");
}
```

### Test Script Template
```javascript
// Response time kontrolü
pm.test("Response time is less than 5000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});

// Status code kontrolü
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Response format kontrolü
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});
```

## 🔧 Debugging İpuçları

1. **Console Logs:** Postman Console'u açık tutun
2. **Network Tab:** Browser dev tools ile istekleri izleyin
3. **Server Logs:** Backend terminal çıktısını kontrol edin
4. **JWT Expiry:** Token süresi dolmuş olabilir, yeniden login yapın

## 📚 Ek Kaynaklar

- [Postman Documentation](https://learning.postman.com/)
- [JWT.io](https://jwt.io/) - JWT token decode etmek için
- [JSON Formatter](https://jsonformatter.org/) - JSON formatını kontrol etmek için

---

**Not:** Bu dokümantasyon, backend API'sinin mevcut durumuna göre hazırlanmıştır. API değişiklikleri durumunda güncellenmelidir.