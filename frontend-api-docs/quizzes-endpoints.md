# Quiz Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/quizzes
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Quiz Oluşturma

### Endpoint
```
POST /quizzes
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
  "title": "Türev Kuralları Quiz",
  "description": "Türev kuralları konusundaki bilginizi test edin",
  "subject": "matematik",
  "grade": "11",
  "difficulty": "intermediate",
  "timeLimit": 30,
  "passingScore": 70,
  "maxAttempts": 3,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "showCorrectAnswers": true,
  "showScoreImmediately": true,
  "tags": ["türev", "matematik", "test"],
  "questions": [
    {
      "type": "multiple_choice",
      "question": "f(x) = x³ fonksiyonunun türevi nedir?",
      "options": [
        {
          "text": "3x²",
          "isCorrect": true
        },
        {
          "text": "x²",
          "isCorrect": false
        },
        {
          "text": "3x",
          "isCorrect": false
        },
        {
          "text": "x³",
          "isCorrect": false
        }
      ],
      "explanation": "Güç kuralına göre, x^n'nin türevi n*x^(n-1)'dir.",
      "points": 10,
      "difficulty": "easy"
    },
    {
      "type": "true_false",
      "question": "Sabit bir sayının türevi sıfırdır.",
      "correctAnswer": true,
      "explanation": "Sabit fonksiyonların türevi her zaman sıfırdır.",
      "points": 5,
      "difficulty": "easy"
    },
    {
      "type": "fill_blank",
      "question": "f(x) = 5x² + 3x - 7 fonksiyonunun türevi f'(x) = _____ + _____ dir.",
      "correctAnswers": ["10x", "3"],
      "explanation": "Her terimin türevini ayrı ayrı alırız.",
      "points": 15,
      "difficulty": "medium"
    }
  ],
  "isPublished": true
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "title": "Türev Kuralları Quiz",
  "description": "Türev kuralları konusundaki bilginizi test edin",
  "subject": "matematik",
  "grade": "11",
  "difficulty": "intermediate",
  "timeLimit": 30,
  "passingScore": 70,
  "maxAttempts": 3,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "showCorrectAnswers": true,
  "showScoreImmediately": true,
  "tags": ["türev", "matematik", "test"],
  "questions": [...],
  "isPublished": true,
  "authorId": 123,
  "author": {
    "id": 123,
    "name": "Öğretmen Adı",
    "email": "ogretmen@example.com"
  },
  "stats": {
    "totalQuestions": 3,
    "totalPoints": 30,
    "averageScore": 0,
    "attemptCount": 0,
    "completionRate": 0
  },
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

### Frontend Kullanımı
```javascript
const createQuiz = async (quizData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quizData)
    });
    
    if (!response.ok) {
      throw new Error('Quiz oluşturulamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create quiz error:', error);
    throw error;
  }
};
```

## 2. Tüm Quizleri Listeleme

### Endpoint
```
GET /quizzes
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?page=1&limit=20&subject=matematik&grade=11&difficulty=intermediate&search=türev&sortBy=createdAt&sortOrder=desc&isPublished=true
```

### Response (200 OK)
```json
{
  "quizzes": [
    {
      "id": 1,
      "title": "Türev Kuralları Quiz",
      "description": "Türev kuralları konusundaki bilginizi test edin",
      "subject": "matematik",
      "grade": "11",
      "difficulty": "intermediate",
      "timeLimit": 30,
      "passingScore": 70,
      "maxAttempts": 3,
      "tags": ["türev", "matematik", "test"],
      "author": {
        "id": 123,
        "name": "Öğretmen Adı"
      },
      "stats": {
        "totalQuestions": 3,
        "totalPoints": 30,
        "averageScore": 75,
        "attemptCount": 25,
        "completionRate": 88
      },
      "userStats": {
        "hasAttempted": false,
        "bestScore": null,
        "attemptCount": 0,
        "lastAttempt": null
      },
      "thumbnail": "/images/quiz-thumb.jpg",
      "createdAt": "2025-01-30T10:30:00Z",
      "updatedAt": "2025-01-30T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalQuizzes": 45,
    "hasNext": true,
    "hasPrevious": false
  },
  "filters": {
    "subjects": ["matematik", "fizik", "kimya"],
    "grades": ["9", "10", "11", "12"],
    "difficulties": ["beginner", "intermediate", "advanced"]
  }
}
```

### Frontend Kullanımı
```javascript
const getQuizzes = async (options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const {
      page = 1,
      limit = 20,
      subject,
      grade,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isPublished = true
    } = options;
    
    let url = `http://localhost:3000/quizzes?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isPublished=${isPublished}`;
    if (subject) url += `&subject=${subject}`;
    if (grade) url += `&grade=${grade}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Quizler alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get quizzes error:', error);
    throw error;
  }
};
```

## 3. Tek Quiz Detayı

### Endpoint
```
GET /quizzes/:id
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
  "id": 1,
  "title": "Türev Kuralları Quiz",
  "description": "Türev kuralları konusundaki bilginizi test edin",
  "subject": "matematik",
  "grade": "11",
  "difficulty": "intermediate",
  "timeLimit": 30,
  "passingScore": 70,
  "maxAttempts": 3,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "showCorrectAnswers": true,
  "showScoreImmediately": true,
  "tags": ["türev", "matematik", "test"],
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "f(x) = x³ fonksiyonunun türevi nedir?",
      "options": [
        {
          "id": "a",
          "text": "3x²",
          "isCorrect": true
        },
        {
          "id": "b",
          "text": "x²",
          "isCorrect": false
        },
        {
          "id": "c",
          "text": "3x",
          "isCorrect": false
        },
        {
          "id": "d",
          "text": "x³",
          "isCorrect": false
        }
      ],
      "explanation": "Güç kuralına göre, x^n'nin türevi n*x^(n-1)'dir.",
      "points": 10,
      "difficulty": "easy",
      "order": 1
    }
  ],
  "author": {
    "id": 123,
    "name": "Öğretmen Adı",
    "email": "ogretmen@example.com",
    "avatar": "/images/teacher-avatar.jpg"
  },
  "stats": {
    "totalQuestions": 3,
    "totalPoints": 30,
    "averageScore": 75,
    "attemptCount": 25,
    "completionRate": 88,
    "averageTime": 22
  },
  "userStats": {
    "hasAttempted": true,
    "bestScore": 85,
    "attemptCount": 2,
    "lastAttempt": "2025-01-29T14:30:00Z",
    "remainingAttempts": 1,
    "isPassed": true
  },
  "relatedQuizzes": [
    {
      "id": 2,
      "title": "İntegral Hesaplama Quiz",
      "difficulty": "intermediate",
      "totalQuestions": 5
    }
  ],
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

### Frontend Kullanımı
```javascript
const getQuizById = async (quizId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Quiz detayları alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get quiz error:', error);
    throw error;
  }
};
```

## 4. Quiz Başlatma

### Endpoint
```
POST /quizzes/:id/start
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Response (201 Created)
```json
{
  "attemptId": "attempt_123456",
  "quizId": 1,
  "userId": 456,
  "startedAt": "2025-01-30T11:00:00Z",
  "timeLimit": 30,
  "expiresAt": "2025-01-30T11:30:00Z",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "f(x) = x³ fonksiyonunun türevi nedir?",
      "options": [
        {
          "id": "a",
          "text": "3x²"
        },
        {
          "id": "b",
          "text": "x²"
        },
        {
          "id": "c",
          "text": "3x"
        },
        {
          "id": "d",
          "text": "x³"
        }
      ],
      "points": 10,
      "order": 1
    }
  ],
  "currentQuestion": 1,
  "totalQuestions": 3,
  "totalPoints": 30,
  "status": "in_progress"
}
```

### Frontend Kullanımı
```javascript
const startQuiz = async (quizId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Quiz başlatılamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Start quiz error:', error);
    throw error;
  }
};
```

## 5. Cevap Gönderme

### Endpoint
```
POST /quizzes/:id/attempts/:attemptId/answer
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
  "questionId": 1,
  "answer": "a",
  "timeSpent": 45
}
```

### Response (200 OK)
```json
{
  "questionId": 1,
  "isCorrect": true,
  "points": 10,
  "feedback": "Doğru cevap! Güç kuralını doğru uyguladınız.",
  "explanation": "Güç kuralına göre, x^n'nin türevi n*x^(n-1)'dir.",
  "nextQuestion": {
    "id": 2,
    "type": "true_false",
    "question": "Sabit bir sayının türevi sıfırdır.",
    "order": 2
  },
  "progress": {
    "currentQuestion": 2,
    "totalQuestions": 3,
    "answeredQuestions": 1,
    "currentScore": 10,
    "maxScore": 30,
    "timeRemaining": 1650
  }
}
```

### Frontend Kullanımı
```javascript
const submitAnswer = async (quizId, attemptId, answerData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(answerData)
    });
    
    if (!response.ok) {
      throw new Error('Cevap gönderilemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Submit answer error:', error);
    throw error;
  }
};
```

## 6. Quiz Tamamlama

### Endpoint
```
POST /quizzes/:id/attempts/:attemptId/complete
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
  "attemptId": "attempt_123456",
  "quizId": 1,
  "userId": 456,
  "status": "completed",
  "startedAt": "2025-01-30T11:00:00Z",
  "completedAt": "2025-01-30T11:22:00Z",
  "timeSpent": 1320,
  "results": {
    "totalQuestions": 3,
    "correctAnswers": 2,
    "incorrectAnswers": 1,
    "score": 20,
    "maxScore": 30,
    "percentage": 67,
    "isPassed": false,
    "passingScore": 70
  },
  "questionResults": [
    {
      "questionId": 1,
      "question": "f(x) = x³ fonksiyonunun türevi nedir?",
      "userAnswer": "a",
      "correctAnswer": "a",
      "isCorrect": true,
      "points": 10,
      "timeSpent": 45
    },
    {
      "questionId": 2,
      "question": "Sabit bir sayının türevi sıfırdır.",
      "userAnswer": true,
      "correctAnswer": true,
      "isCorrect": true,
      "points": 5,
      "timeSpent": 30
    },
    {
      "questionId": 3,
      "question": "f(x) = 5x² + 3x - 7 fonksiyonunun türevi f'(x) = _____ + _____ dir.",
      "userAnswer": ["10x", "2"],
      "correctAnswer": ["10x", "3"],
      "isCorrect": false,
      "points": 0,
      "timeSpent": 120
    }
  ],
  "feedback": {
    "overall": "İyi bir performans sergilediz! Türev kurallarını genel olarak anlıyorsunuz.",
    "strengths": ["Temel türev kuralları", "Sabit fonksiyon türevi"],
    "improvements": ["Çoklu terim türevleri", "Dikkatli hesaplama"],
    "recommendations": [
      "Daha fazla pratik yapın",
      "Türev formüllerini tekrar gözden geçirin"
    ]
  },
  "nextSteps": {
    "canRetake": true,
    "remainingAttempts": 2,
    "suggestedStudyMaterials": [
      {
        "type": "lesson",
        "title": "Türev Kuralları Dersi",
        "url": "/lessons/1"
      }
    ]
  }
}
```

## 7. Quiz Sonuçları

### Endpoint
```
GET /quizzes/:id/attempts/:attemptId/results
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
  "attemptId": "attempt_123456",
  "quizTitle": "Türev Kuralları Quiz",
  "results": {...},
  "questionResults": [...],
  "feedback": {...},
  "analytics": {
    "timeDistribution": [
      {
        "questionId": 1,
        "timeSpent": 45,
        "averageTime": 60
      }
    ],
    "difficultyAnalysis": {
      "easy": {
        "attempted": 2,
        "correct": 2,
        "accuracy": 100
      },
      "medium": {
        "attempted": 1,
        "correct": 0,
        "accuracy": 0
      }
    },
    "comparisonWithOthers": {
      "betterThan": 45,
      "averageScore": 75,
      "rank": 15,
      "totalParticipants": 25
    }
  }
}
```

## 8. Kullanıcının Quiz Geçmişi

### Endpoint
```
GET /quizzes/my-attempts
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?status=completed&page=1&limit=20&subject=matematik
```

### Response (200 OK)
```json
{
  "attempts": [
    {
      "attemptId": "attempt_123456",
      "quiz": {
        "id": 1,
        "title": "Türev Kuralları Quiz",
        "subject": "matematik",
        "difficulty": "intermediate"
      },
      "status": "completed",
      "score": 20,
      "maxScore": 30,
      "percentage": 67,
      "isPassed": false,
      "timeSpent": 1320,
      "startedAt": "2025-01-30T11:00:00Z",
      "completedAt": "2025-01-30T11:22:00Z"
    }
  ],
  "stats": {
    "totalAttempts": 15,
    "completedAttempts": 12,
    "averageScore": 78,
    "bestScore": 95,
    "totalTimeSpent": 18000,
    "passedQuizzes": 10
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalAttempts": 15
  }
}
```

## 9. Quiz Güncelleme

### Endpoint
```
PUT /quizzes/:id
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
  "title": "Güncellenmiş Türev Quiz",
  "description": "Güncellenmiş açıklama",
  "timeLimit": 45,
  "passingScore": 75,
  "questions": [...]
}
```

### Response (200 OK)
```json
{
  "id": 1,
  "title": "Güncellenmiş Türev Quiz",
  "description": "Güncellenmiş açıklama",
  "timeLimit": 45,
  "passingScore": 75,
  "updatedAt": "2025-01-30T12:00:00Z"
}
```

## 10. Quiz Silme

### Endpoint
```
DELETE /quizzes/:id
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
  "message": "Quiz başarıyla silindi",
  "deletedQuizId": 1
}
```

## 11. Quiz İstatistikleri

### Endpoint
```
GET /quizzes/:id/statistics
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
  "quizId": 1,
  "title": "Türev Kuralları Quiz",
  "generalStats": {
    "totalAttempts": 50,
    "uniqueParticipants": 35,
    "averageScore": 75,
    "highestScore": 100,
    "lowestScore": 30,
    "passRate": 68,
    "averageTimeSpent": 1800,
    "completionRate": 92
  },
  "questionStats": [
    {
      "questionId": 1,
      "question": "f(x) = x³ fonksiyonunun türevi nedir?",
      "correctAnswers": 45,
      "totalAnswers": 50,
      "accuracy": 90,
      "averageTimeSpent": 60,
      "difficulty": "easy"
    }
  ],
  "timeAnalysis": {
    "averageCompletionTime": 1800,
    "fastestCompletion": 900,
    "slowestCompletion": 2700,
    "timeDistribution": {
      "0-15min": 20,
      "15-30min": 25,
      "30-45min": 5
    }
  },
  "scoreDistribution": {
    "0-20": 2,
    "21-40": 5,
    "41-60": 8,
    "61-80": 20,
    "81-100": 15
  }
}
```

## React Hook Örneği

```javascript
import { useState, useCallback, useEffect } from 'react';

const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizzes = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQuizzes(options);
      setQuizzes(response.quizzes);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizById = useCallback(async (quizId) => {
    setLoading(true);
    try {
      const quiz = await getQuizById(quizId);
      setCurrentQuiz(quiz);
      return quiz;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startQuizAttempt = useCallback(async (quizId) => {
    setLoading(true);
    try {
      const attempt = await startQuiz(quizId);
      setCurrentAttempt(attempt);
      return attempt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuizAnswer = useCallback(async (quizId, attemptId, answerData) => {
    try {
      const result = await submitAnswer(quizId, attemptId, answerData);
      
      // Mevcut denemede ilerlemeyi güncelle
      if (currentAttempt?.attemptId === attemptId) {
        setCurrentAttempt(prev => ({
          ...prev,
          progress: result.progress,
          currentQuestion: result.progress.currentQuestion
        }));
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentAttempt]);

  const completeQuizAttempt = useCallback(async (quizId, attemptId) => {
    setLoading(true);
    try {
      const result = await completeQuiz(quizId, attemptId);
      setCurrentAttempt(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyAttempts = useCallback(async (options = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const { status, page = 1, limit = 20, subject } = options;
      
      let url = `http://localhost:3000/quizzes/my-attempts?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (subject) url += `&subject=${subject}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Quiz geçmişi alınamadı');
      }
      
      const data = await response.json();
      setMyAttempts(data.attempts);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuizResults = useCallback(async (quizId, attemptId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:3000/quizzes/${quizId}/attempts/${attemptId}/results`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Quiz sonuçları alınamadı');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    quizzes,
    currentQuiz,
    currentAttempt,
    myAttempts,
    loading,
    error,
    fetchQuizzes,
    fetchQuizById,
    startQuizAttempt,
    submitQuizAnswer,
    completeQuizAttempt,
    fetchMyAttempts,
    getQuizResults,
    setCurrentQuiz,
    setCurrentAttempt
  };
};

export default useQuizzes;
```

## Quiz Timer Component Örneği

```javascript
import React, { useState, useEffect } from 'react';

const QuizTimer = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // dakika to saniye

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (timeLimit * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`font-mono text-lg font-bold ${getTimeColor()}`}>
      ⏰ {formatTime(timeRemaining)}
    </div>
  );
};

export default QuizTimer;
```

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Quiz bulunamadı
- **409**: Çakışma (zaten başlatılmış)
- **410**: Süre dolmuş
- **422**: İşlenemeyen varlık
- **429**: Çok fazla deneme
- **500**: Sunucu hatası

## Soru Türleri

- **multiple_choice**: Çoktan seçmeli
- **true_false**: Doğru/Yanlış
- **fill_blank**: Boşluk doldurma
- **short_answer**: Kısa cevap
- **essay**: Uzun cevap
- **matching**: Eşleştirme
- **ordering**: Sıralama

## Quiz Durumları

- **draft**: Taslak
- **published**: Yayınlanmış
- **archived**: Arşivlenmiş
- **under_review**: İnceleme altında

## Deneme Durumları

- **not_started**: Başlatılmamış
- **in_progress**: Devam ediyor
- **completed**: Tamamlanmış
- **expired**: Süresi dolmuş
- **abandoned**: Terk edilmiş

## Performans ve Sınırlar

- **Maksimum soru sayısı**: 100
- **Maksimum süre**: 180 dakika
- **Maksimum deneme sayısı**: 10
- **Maksimum seçenek sayısı**: 8 (çoktan seçmeli)
- **Otomatik kaydetme**: Her 30 saniyede bir