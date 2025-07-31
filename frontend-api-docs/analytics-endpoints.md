# Analytics Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/analytics
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Kullanıcı Aktivite Analizi

### Endpoint
```
GET /analytics/user-activity
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?startDate=2025-01-01&endDate=2025-01-31&userId=user_123&granularity=daily
```

### Response (200 OK)
```json
{
  "userActivity": {
    "userId": "user_123",
    "userName": "Ahmet Yılmaz",
    "period": {
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-01-31T23:59:59Z",
      "granularity": "daily"
    },
    "totalStats": {
      "totalLoginDays": 25,
      "totalStudyHours": 45.5,
      "totalLessonsCompleted": 12,
      "totalQuizzesTaken": 8,
      "totalMessagesExchanged": 156,
      "averageSessionDuration": 108,
      "streakDays": 7
    },
    "dailyActivity": [
      {
        "date": "2025-01-01",
        "loginCount": 3,
        "studyHours": 2.5,
        "lessonsCompleted": 1,
        "quizzesTaken": 0,
        "messagesExchanged": 8,
        "sessionDuration": 150,
        "firstLogin": "2025-01-01T09:00:00Z",
        "lastActivity": "2025-01-01T16:30:00Z"
      },
      {
        "date": "2025-01-02",
        "loginCount": 2,
        "studyHours": 1.8,
        "lessonsCompleted": 0,
        "quizzesTaken": 1,
        "messagesExchanged": 5,
        "sessionDuration": 108,
        "firstLogin": "2025-01-02T10:15:00Z",
        "lastActivity": "2025-01-02T15:45:00Z"
      }
    ],
    "weeklyTrends": {
      "mostActiveDay": "Monday",
      "leastActiveDay": "Sunday",
      "averageWeeklyHours": 12.3,
      "weeklyGrowth": 15.2
    },
    "achievements": [
      {
        "id": "streak_7",
        "name": "7 Günlük Seri",
        "earnedAt": "2025-01-07T18:00:00Z"
      }
    ]
  }
}
```

### Frontend Kullanımı
```javascript
const getUserActivity = async (options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { startDate, endDate, userId, granularity = 'daily' } = options;
    
    let url = `http://localhost:3000/analytics/user-activity?granularity=${granularity}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (userId) url += `&userId=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Kullanıcı aktivite analizi alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user activity error:', error);
    throw error;
  }
};
```

## 2. Ders Performans Analizi

### Endpoint
```
GET /analytics/lesson-performance
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?lessonId=lesson_456&userId=user_123&timeframe=30d
```

### Response (200 OK)
```json
{
  "lessonPerformance": {
    "lessonId": "lesson_456",
    "lessonTitle": "Matematik Temelleri",
    "userId": "user_123",
    "timeframe": "30d",
    "overallStats": {
      "completionRate": 85.5,
      "averageScore": 78.2,
      "totalTimeSpent": 180,
      "attemptsCount": 3,
      "lastAttemptDate": "2025-01-30T14:30:00Z",
      "bestScore": 92,
      "improvementRate": 15.3
    },
    "attempts": [
      {
        "attemptNumber": 1,
        "startedAt": "2025-01-15T10:00:00Z",
        "completedAt": "2025-01-15T11:30:00Z",
        "duration": 90,
        "score": 65,
        "completionRate": 70,
        "exercisesCompleted": 7,
        "totalExercises": 10,
        "correctAnswers": 5,
        "wrongAnswers": 2,
        "skippedQuestions": 3
      },
      {
        "attemptNumber": 2,
        "startedAt": "2025-01-20T14:00:00Z",
        "completedAt": "2025-01-20T15:15:00Z",
        "duration": 75,
        "score": 78,
        "completionRate": 90,
        "exercisesCompleted": 9,
        "totalExercises": 10,
        "correctAnswers": 7,
        "wrongAnswers": 2,
        "skippedQuestions": 1
      },
      {
        "attemptNumber": 3,
        "startedAt": "2025-01-30T14:00:00Z",
        "completedAt": "2025-01-30T14:45:00Z",
        "duration": 45,
        "score": 92,
        "completionRate": 100,
        "exercisesCompleted": 10,
        "totalExercises": 10,
        "correctAnswers": 9,
        "wrongAnswers": 1,
        "skippedQuestions": 0
      }
    ],
    "weakAreas": [
      {
        "topic": "Kesirler",
        "accuracy": 45,
        "timeSpent": 25,
        "needsImprovement": true
      },
      {
        "topic": "Geometri",
        "accuracy": 60,
        "timeSpent": 20,
        "needsImprovement": true
      }
    ],
    "strongAreas": [
      {
        "topic": "Toplama İşlemi",
        "accuracy": 95,
        "timeSpent": 15,
        "mastered": true
      },
      {
        "topic": "Çıkarma İşlemi",
        "accuracy": 88,
        "timeSpent": 18,
        "mastered": true
      }
    ],
    "recommendations": [
      {
        "type": "practice",
        "topic": "Kesirler",
        "message": "Kesirler konusunda daha fazla pratik yapmanız önerilir",
        "suggestedLessons": ["lesson_789", "lesson_790"]
      },
      {
        "type": "review",
        "topic": "Geometri",
        "message": "Geometri temellerini tekrar gözden geçirin",
        "suggestedLessons": ["lesson_791"]
      }
    ]
  }
}
```

### Frontend Kullanımı
```javascript
const getLessonPerformance = async (lessonId, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { userId, timeframe = '30d' } = options;
    
    let url = `http://localhost:3000/analytics/lesson-performance?lessonId=${lessonId}&timeframe=${timeframe}`;
    if (userId) url += `&userId=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Ders performans analizi alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get lesson performance error:', error);
    throw error;
  }
};
```

## 3. Quiz Analizi

### Endpoint
```
GET /analytics/quiz-performance
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?quizId=quiz_789&userId=user_123&includeDetails=true
```

### Response (200 OK)
```json
{
  "quizPerformance": {
    "quizId": "quiz_789",
    "quizTitle": "Matematik Quiz 1",
    "userId": "user_123",
    "overallStats": {
      "totalAttempts": 3,
      "bestScore": 85,
      "averageScore": 72.3,
      "lastScore": 85,
      "totalTimeSpent": 45,
      "averageTimePerQuestion": 1.5,
      "improvementRate": 25.7,
      "passRate": 66.7
    },
    "attempts": [
      {
        "attemptId": "attempt_001",
        "attemptNumber": 1,
        "startedAt": "2025-01-15T10:00:00Z",
        "completedAt": "2025-01-15T10:20:00Z",
        "duration": 20,
        "score": 60,
        "totalQuestions": 20,
        "correctAnswers": 12,
        "wrongAnswers": 6,
        "skippedQuestions": 2,
        "passed": false,
        "timePerQuestion": 1.0
      },
      {
        "attemptId": "attempt_002",
        "attemptNumber": 2,
        "startedAt": "2025-01-20T14:00:00Z",
        "completedAt": "2025-01-20T14:15:00Z",
        "duration": 15,
        "score": 72,
        "totalQuestions": 20,
        "correctAnswers": 14,
        "wrongAnswers": 5,
        "skippedQuestions": 1,
        "passed": true,
        "timePerQuestion": 0.75
      },
      {
        "attemptId": "attempt_003",
        "attemptNumber": 3,
        "startedAt": "2025-01-30T16:00:00Z",
        "completedAt": "2025-01-30T16:10:00Z",
        "duration": 10,
        "score": 85,
        "totalQuestions": 20,
        "correctAnswers": 17,
        "wrongAnswers": 3,
        "skippedQuestions": 0,
        "passed": true,
        "timePerQuestion": 0.5
      }
    ],
    "questionAnalysis": [
      {
        "questionId": "q_001",
        "questionText": "2 + 2 = ?",
        "topic": "Toplama",
        "difficulty": "easy",
        "correctRate": 100,
        "averageTime": 0.5,
        "attempts": [
          {
            "attemptNumber": 1,
            "isCorrect": true,
            "timeSpent": 0.3,
            "selectedAnswer": "4",
            "correctAnswer": "4"
          },
          {
            "attemptNumber": 2,
            "isCorrect": true,
            "timeSpent": 0.2,
            "selectedAnswer": "4",
            "correctAnswer": "4"
          },
          {
            "attemptNumber": 3,
            "isCorrect": true,
            "timeSpent": 0.1,
            "selectedAnswer": "4",
            "correctAnswer": "4"
          }
        ]
      }
    ],
    "topicPerformance": [
      {
        "topic": "Toplama",
        "accuracy": 95,
        "questionsCount": 5,
        "averageTime": 0.8,
        "mastery": "excellent"
      },
      {
        "topic": "Çıkarma",
        "accuracy": 80,
        "questionsCount": 5,
        "averageTime": 1.2,
        "mastery": "good"
      },
      {
        "topic": "Çarpma",
        "accuracy": 60,
        "questionsCount": 5,
        "averageTime": 2.0,
        "mastery": "needs_improvement"
      },
      {
        "topic": "Bölme",
        "accuracy": 70,
        "questionsCount": 5,
        "averageTime": 1.8,
        "mastery": "fair"
      }
    ],
    "recommendations": [
      {
        "type": "practice_more",
        "topic": "Çarpma",
        "message": "Çarpma işlemlerinde daha fazla pratik yapın",
        "priority": "high"
      },
      {
        "type": "speed_up",
        "topic": "Bölme",
        "message": "Bölme işlemlerinde hızınızı artırın",
        "priority": "medium"
      }
    ]
  }
}
```

### Frontend Kullanımı
```javascript
const getQuizPerformance = async (quizId, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { userId, includeDetails = true } = options;
    
    let url = `http://localhost:3000/analytics/quiz-performance?quizId=${quizId}&includeDetails=${includeDetails}`;
    if (userId) url += `&userId=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Quiz performans analizi alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get quiz performance error:', error);
    throw error;
  }
};
```

## 4. Genel İstatistikler

### Endpoint
```
GET /analytics/dashboard-stats
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?period=7d&userId=user_123
```

### Response (200 OK)
```json
{
  "dashboardStats": {
    "userId": "user_123",
    "period": "7d",
    "generatedAt": "2025-01-30T12:00:00Z",
    "summary": {
      "totalStudyTime": 12.5,
      "lessonsCompleted": 3,
      "quizzesCompleted": 2,
      "averageScore": 78.5,
      "streakDays": 5,
      "rank": 15,
      "totalUsers": 150,
      "improvementRate": 12.3
    },
    "weeklyProgress": {
      "studyTimeGoal": 15,
      "studyTimeAchieved": 12.5,
      "goalProgress": 83.3,
      "lessonsGoal": 5,
      "lessonsAchieved": 3,
      "quizzesGoal": 3,
      "quizzesAchieved": 2
    },
    "recentAchievements": [
      {
        "id": "streak_5",
        "name": "5 Günlük Seri",
        "description": "5 gün üst üste çalıştınız",
        "icon": "🔥",
        "earnedAt": "2025-01-30T10:00:00Z",
        "points": 50
      },
      {
        "id": "quiz_master",
        "name": "Quiz Ustası",
        "description": "10 quiz tamamladınız",
        "icon": "🏆",
        "earnedAt": "2025-01-29T15:30:00Z",
        "points": 100
      }
    ],
    "upcomingGoals": [
      {
        "id": "streak_7",
        "name": "7 Günlük Seri",
        "description": "2 gün daha çalışarak bu başarıyı kazanın",
        "progress": 71.4,
        "daysLeft": 2,
        "reward": 75
      }
    ],
    "subjectProgress": [
      {
        "subject": "Matematik",
        "completedLessons": 8,
        "totalLessons": 15,
        "progress": 53.3,
        "averageScore": 82,
        "timeSpent": 8.5,
        "lastActivity": "2025-01-30T10:30:00Z"
      },
      {
        "subject": "Fen Bilgisi",
        "completedLessons": 5,
        "totalLessons": 12,
        "progress": 41.7,
        "averageScore": 75,
        "timeSpent": 4.0,
        "lastActivity": "2025-01-29T14:15:00Z"
      }
    ],
    "weeklyComparison": {
      "thisWeek": {
        "studyTime": 12.5,
        "lessonsCompleted": 3,
        "averageScore": 78.5
      },
      "lastWeek": {
        "studyTime": 10.2,
        "lessonsCompleted": 2,
        "averageScore": 72.1
      },
      "improvement": {
        "studyTime": 22.5,
        "lessonsCompleted": 50.0,
        "averageScore": 8.9
      }
    }
  }
}
```

### Frontend Kullanımı
```javascript
const getDashboardStats = async (options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { period = '7d', userId } = options;
    
    let url = `http://localhost:3000/analytics/dashboard-stats?period=${period}`;
    if (userId) url += `&userId=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Dashboard istatistikleri alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};
```

## 5. Sınıf/Grup Analizi (Öğretmenler için)

### Endpoint
```
GET /analytics/class-performance
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?classId=class_456&period=30d&metric=all
```

### Response (200 OK)
```json
{
  "classPerformance": {
    "classId": "class_456",
    "className": "5-A Sınıfı",
    "teacherId": "teacher_123",
    "period": "30d",
    "totalStudents": 25,
    "activeStudents": 23,
    "overallStats": {
      "averageScore": 76.8,
      "completionRate": 82.4,
      "totalStudyHours": 312.5,
      "averageStudyTimePerStudent": 13.6,
      "totalLessonsCompleted": 156,
      "totalQuizzesCompleted": 89
    },
    "studentRankings": [
      {
        "rank": 1,
        "studentId": "student_001",
        "studentName": "Ahmet Yılmaz",
        "averageScore": 92.5,
        "studyHours": 18.5,
        "lessonsCompleted": 8,
        "streak": 12
      },
      {
        "rank": 2,
        "studentId": "student_002",
        "studentName": "Ayşe Kaya",
        "averageScore": 89.2,
        "studyHours": 16.2,
        "lessonsCompleted": 7,
        "streak": 8
      }
    ],
    "subjectPerformance": [
      {
        "subject": "Matematik",
        "averageScore": 78.5,
        "completionRate": 85.2,
        "studentsAboveAverage": 15,
        "studentsNeedingHelp": 3,
        "topPerformers": ["student_001", "student_002"],
        "strugglingStudents": ["student_023", "student_024"]
      },
      {
        "subject": "Fen Bilgisi",
        "averageScore": 75.1,
        "completionRate": 79.6,
        "studentsAboveAverage": 12,
        "studentsNeedingHelp": 5,
        "topPerformers": ["student_003", "student_001"],
        "strugglingStudents": ["student_020", "student_021"]
      }
    ],
    "engagementMetrics": {
      "dailyActiveUsers": 18.5,
      "weeklyActiveUsers": 23,
      "averageSessionDuration": 45.2,
      "messageExchangeRate": 156,
      "helpRequestsCount": 12
    },
    "progressTrends": {
      "improvingStudents": 18,
      "decliningStudents": 2,
      "stableStudents": 5,
      "weeklyGrowthRate": 8.5
    },
    "recommendations": [
      {
        "type": "individual_attention",
        "studentIds": ["student_023", "student_024"],
        "subject": "Matematik",
        "message": "Bu öğrenciler matematik konusunda ek desteğe ihtiyaç duyuyor",
        "priority": "high"
      },
      {
        "type": "group_activity",
        "subject": "Fen Bilgisi",
        "message": "Fen bilgisi dersinde grup çalışması önerilir",
        "priority": "medium"
      }
    ]
  }
}
```

### Frontend Kullanımı
```javascript
const getClassPerformance = async (classId, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { period = '30d', metric = 'all' } = options;
    
    const response = await fetch(`http://localhost:3000/analytics/class-performance?classId=${classId}&period=${period}&metric=${metric}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Sınıf performans analizi alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get class performance error:', error);
    throw error;
  }
};
```

## React Hook Örneği

```javascript
import { useState, useCallback, useEffect } from 'react';

const useAnalytics = () => {
  const [userActivity, setUserActivity] = useState(null);
  const [lessonPerformance, setLessonPerformance] = useState(null);
  const [quizPerformance, setQuizPerformance] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [classPerformance, setClassPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserActivity = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserActivity(options);
      setUserActivity(response.userActivity);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLessonPerformance = useCallback(async (lessonId, options = {}) => {
    setLoading(true);
    try {
      const response = await getLessonPerformance(lessonId, options);
      setLessonPerformance(response.lessonPerformance);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizPerformance = useCallback(async (quizId, options = {}) => {
    setLoading(true);
    try {
      const response = await getQuizPerformance(quizId, options);
      setQuizPerformance(response.quizPerformance);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async (options = {}) => {
    setLoading(true);
    try {
      const response = await getDashboardStats(options);
      setDashboardStats(response.dashboardStats);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClassPerformance = useCallback(async (classId, options = {}) => {
    setLoading(true);
    try {
      const response = await getClassPerformance(classId, options);
      setClassPerformance(response.classPerformance);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Otomatik dashboard güncellemesi
  useEffect(() => {
    fetchDashboardStats();
    
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 300000); // 5 dakikada bir güncelle

    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

  return {
    userActivity,
    lessonPerformance,
    quizPerformance,
    dashboardStats,
    classPerformance,
    loading,
    error,
    fetchUserActivity,
    fetchLessonPerformance,
    fetchQuizPerformance,
    fetchDashboardStats,
    fetchClassPerformance
  };
};

export default useAnalytics;
```

## Analiz Türleri

- **user-activity**: Kullanıcı aktivite analizi
- **lesson-performance**: Ders performans analizi
- **quiz-performance**: Quiz performans analizi
- **dashboard-stats**: Genel istatistikler
- **class-performance**: Sınıf performans analizi

## Zaman Aralıkları

- **1d**: Son 1 gün
- **7d**: Son 7 gün
- **30d**: Son 30 gün
- **90d**: Son 90 gün
- **1y**: Son 1 yıl
- **custom**: Özel tarih aralığı

## Granularite Seçenekleri

- **hourly**: Saatlik
- **daily**: Günlük
- **weekly**: Haftalık
- **monthly**: Aylık

## Performans Seviyeleri

- **excellent**: Mükemmel (90-100%)
- **good**: İyi (75-89%)
- **fair**: Orta (60-74%)
- **needs_improvement**: Geliştirilmeli (0-59%)

## Hata Kodları

- **200**: Başarılı
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Veri bulunamadı
- **429**: Çok fazla istek
- **500**: Sunucu hatası

## Güvenlik ve Performans

1. **Data Privacy**: Kişisel verilerin korunması
2. **Role-based Access**: Rol tabanlı erişim kontrolü
3. **Caching**: Performans optimizasyonu
4. **Rate Limiting**: İstek sınırlaması
5. **Data Aggregation**: Veri toplama optimizasyonu
6. **Real-time Updates**: Gerçek zamanlı güncellemeler