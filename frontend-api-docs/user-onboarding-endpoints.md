# Kullanıcı Onboarding Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/user-onboarding
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Onboarding Süreci Başlatma

### Endpoint
```
POST /user-onboarding/start
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
  "userProfile": {
    "educationLevel": "high_school",
    "subjects": ["matematik", "fizik"],
    "learningGoals": ["exam_preparation", "concept_understanding"],
    "preferredLearningStyle": "visual",
    "availableTime": "2-4_hours_daily",
    "currentKnowledgeLevel": "intermediate"
  },
  "preferences": {
    "language": "tr",
    "difficulty": "adaptive",
    "notifications": true,
    "studyReminders": true
  }
}
```

### Response (201 Created)
```json
{
  "onboardingId": "onboarding_123456",
  "userId": 789,
  "status": "in_progress",
  "currentStep": 1,
  "totalSteps": 5,
  "userProfile": {
    "educationLevel": "high_school",
    "subjects": ["matematik", "fizik"],
    "learningGoals": ["exam_preparation", "concept_understanding"],
    "preferredLearningStyle": "visual",
    "availableTime": "2-4_hours_daily",
    "currentKnowledgeLevel": "intermediate"
  },
  "recommendations": {
    "suggestedCourses": [
      {
        "id": "course_001",
        "title": "Matematik Temelleri",
        "difficulty": "intermediate",
        "estimatedDuration": "4 hafta",
        "matchScore": 0.92
      }
    ],
    "studyPlan": {
      "dailyStudyTime": 180,
      "weeklyGoals": [
        "Türev konusunu tamamla",
        "5 pratik soru çöz"
      ],
      "milestones": [
        {
          "week": 1,
          "goal": "Temel kavramları öğren",
          "tasks": ["Video izle", "Notları oku", "Quiz çöz"]
        }
      ]
    }
  },
  "nextSteps": [
    {
      "step": 2,
      "title": "Seviye Belirleme Testi",
      "description": "Mevcut bilgi seviyenizi belirlemek için kısa bir test",
      "estimatedTime": "15 dakika"
    }
  ],
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

### Frontend Kullanımı
```javascript
const startOnboarding = async (onboardingData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/user-onboarding/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(onboardingData)
    });
    
    if (!response.ok) {
      throw new Error('Onboarding başlatılamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Start onboarding error:', error);
    throw error;
  }
};
```

## 2. Seviye Belirleme Testi

### Endpoint
```
POST /user-onboarding/:onboardingId/assessment
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
  "subject": "matematik",
  "answers": [
    {
      "questionId": "q1",
      "answer": "B",
      "timeSpent": 45
    },
    {
      "questionId": "q2",
      "answer": "A",
      "timeSpent": 60
    }
  ],
  "totalTime": 900
}
```

### Response (200 OK)
```json
{
  "assessmentId": "assessment_456",
  "subject": "matematik",
  "results": {
    "score": 75,
    "level": "intermediate",
    "correctAnswers": 6,
    "totalQuestions": 8,
    "timeEfficiency": 0.85,
    "strengths": [
      "Temel işlemler",
      "Geometri"
    ],
    "weaknesses": [
      "Türev",
      "İntegral"
    ],
    "recommendations": [
      "Türev konusuna odaklan",
      "Daha fazla pratik yap"
    ]
  },
  "levelDetails": {
    "currentLevel": "intermediate",
    "nextLevel": "advanced",
    "progressToNext": 0.6,
    "requiredSkills": [
      "İleri türev kuralları",
      "İntegral hesaplama"
    ]
  },
  "personalizedPlan": {
    "focusAreas": ["Türev", "İntegral"],
    "suggestedLessons": [
      {
        "id": "lesson_101",
        "title": "Türev Kuralları",
        "priority": "high",
        "estimatedTime": "2 saat"
      }
    ],
    "practiceQuestions": 15,
    "estimatedCompletionTime": "3 hafta"
  },
  "completedAt": "2025-01-30T10:45:00Z"
}
```

### Frontend Kullanımı
```javascript
const submitAssessment = async (onboardingId, assessmentData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/user-onboarding/${onboardingId}/assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assessmentData)
    });
    
    if (!response.ok) {
      throw new Error('Değerlendirme gönderilemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Submit assessment error:', error);
    throw error;
  }
};
```

## 3. Kişiselleştirilmiş Öneriler Alma

### Endpoint
```
GET /user-onboarding/:onboardingId/recommendations
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?subject=matematik&type=courses&limit=10
```

### Response (200 OK)
```json
{
  "recommendations": {
    "courses": [
      {
        "id": "course_001",
        "title": "Matematik Temelleri",
        "description": "Temel matematik kavramlarını öğrenin",
        "difficulty": "intermediate",
        "duration": "4 hafta",
        "rating": 4.8,
        "enrolledStudents": 1250,
        "matchScore": 0.92,
        "reasons": [
          "Seviyenize uygun",
          "Zayıf olduğunuz konuları kapsıyor",
          "Yüksek başarı oranı"
        ],
        "prerequisites": [],
        "learningOutcomes": [
          "Türev hesaplama",
          "İntegral çözme",
          "Grafik analizi"
        ]
      }
    ],
    "lessons": [
      {
        "id": "lesson_101",
        "title": "Türev Kuralları",
        "type": "video",
        "duration": "45 dakika",
        "difficulty": "intermediate",
        "priority": "high",
        "matchScore": 0.95
      }
    ],
    "practiceQuestions": [
      {
        "id": "quiz_201",
        "title": "Türev Pratik Soruları",
        "questionCount": 10,
        "difficulty": "intermediate",
        "estimatedTime": "20 dakika",
        "topics": ["Türev kuralları", "Zincir kuralı"]
      }
    ],
    "studyMaterials": [
      {
        "id": "material_301",
        "title": "Türev Formül Kartları",
        "type": "pdf",
        "size": "2.5 MB",
        "downloadUrl": "/downloads/turev-formuller.pdf"
      }
    ]
  },
  "studyPlan": {
    "totalDuration": "6 hafta",
    "dailyStudyTime": 120,
    "weeklySchedule": [
      {
        "week": 1,
        "focus": "Temel Kavramlar",
        "activities": [
          {
            "day": "Pazartesi",
            "tasks": [
              "Türev tanımı videosunu izle",
              "5 pratik soru çöz"
            ],
            "estimatedTime": 90
          }
        ]
      }
    ],
    "milestones": [
      {
        "week": 2,
        "title": "Temel türev kurallarını öğren",
        "criteria": "Quiz'de %80 başarı"
      }
    ]
  },
  "adaptiveSettings": {
    "difficultyAdjustment": "auto",
    "paceControl": "user_controlled",
    "reminderFrequency": "daily",
    "feedbackLevel": "detailed"
  }
}
```

### Frontend Kullanımı
```javascript
const getRecommendations = async (onboardingId, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { subject, type, limit = 10 } = options;
    
    let url = `http://localhost:3000/user-onboarding/${onboardingId}/recommendations?limit=${limit}`;
    if (subject) url += `&subject=${subject}`;
    if (type) url += `&type=${type}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Öneriler alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get recommendations error:', error);
    throw error;
  }
};
```

## 4. Onboarding Adımını Tamamlama

### Endpoint
```
POST /user-onboarding/:onboardingId/complete-step
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
  "stepNumber": 2,
  "stepData": {
    "assessmentCompleted": true,
    "selectedCourses": ["course_001", "course_002"],
    "preferences": {
      "studyTime": "evening",
      "reminderEnabled": true
    }
  },
  "feedback": {
    "rating": 5,
    "comment": "Çok faydalı bir değerlendirmeydi"
  }
}
```

### Response (200 OK)
```json
{
  "stepCompleted": 2,
  "nextStep": 3,
  "progress": {
    "completedSteps": 2,
    "totalSteps": 5,
    "progressPercentage": 40
  },
  "nextStepInfo": {
    "stepNumber": 3,
    "title": "Öğrenme Planı Oluşturma",
    "description": "Kişiselleştirilmiş öğrenme planınızı oluşturun",
    "estimatedTime": "10 dakika",
    "requirements": ["Kurs seçimi tamamlanmış olmalı"]
  },
  "rewards": {
    "pointsEarned": 50,
    "badgesUnlocked": [
      {
        "id": "assessment_master",
        "name": "Değerlendirme Ustası",
        "description": "İlk seviye testini başarıyla tamamladın"
      }
    ]
  },
  "updatedAt": "2025-01-30T11:00:00Z"
}
```

## 5. Onboarding Durumu Sorgulama

### Endpoint
```
GET /user-onboarding/:onboardingId/status
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
  "onboardingId": "onboarding_123456",
  "userId": 789,
  "status": "in_progress",
  "currentStep": 3,
  "totalSteps": 5,
  "progress": {
    "completedSteps": 2,
    "progressPercentage": 40,
    "estimatedTimeToComplete": "25 dakika"
  },
  "completedSteps": [
    {
      "stepNumber": 1,
      "title": "Profil Oluşturma",
      "completedAt": "2025-01-30T10:30:00Z",
      "data": {...}
    },
    {
      "stepNumber": 2,
      "title": "Seviye Belirleme",
      "completedAt": "2025-01-30T10:45:00Z",
      "data": {...}
    }
  ],
  "currentStepInfo": {
    "stepNumber": 3,
    "title": "Öğrenme Planı Oluşturma",
    "description": "Kişiselleştirilmiş öğrenme planınızı oluşturun",
    "requirements": [],
    "estimatedTime": "10 dakika"
  },
  "userProfile": {
    "educationLevel": "high_school",
    "subjects": ["matematik", "fizik"],
    "currentLevel": "intermediate",
    "learningStyle": "visual"
  },
  "analytics": {
    "timeSpent": 900,
    "assessmentScore": 75,
    "engagementLevel": "high"
  }
}
```

## 6. Onboarding Tamamlama

### Endpoint
```
POST /user-onboarding/:onboardingId/complete
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
  "finalFeedback": {
    "overallRating": 5,
    "mostHelpfulStep": "assessment",
    "suggestions": "Daha fazla örnek soru olabilir",
    "wouldRecommend": true
  },
  "selectedPlan": {
    "courseIds": ["course_001", "course_002"],
    "studySchedule": "evening",
    "dailyGoal": 120,
    "notifications": true
  }
}
```

### Response (200 OK)
```json
{
  "onboardingId": "onboarding_123456",
  "status": "completed",
  "completedAt": "2025-01-30T11:30:00Z",
  "summary": {
    "totalTimeSpent": 1800,
    "stepsCompleted": 5,
    "assessmentScore": 75,
    "selectedCourses": 2,
    "personalizedRecommendations": 8
  },
  "userJourney": {
    "startLevel": "beginner",
    "currentLevel": "intermediate",
    "targetLevel": "advanced",
    "estimatedTimeToTarget": "3 ay"
  },
  "activatedFeatures": [
    "personalized_dashboard",
    "adaptive_learning",
    "progress_tracking",
    "smart_notifications"
  ],
  "nextActions": [
    {
      "action": "start_first_course",
      "title": "İlk dersini başlat",
      "url": "/courses/course_001",
      "priority": "high"
    },
    {
      "action": "setup_study_schedule",
      "title": "Çalışma programını ayarla",
      "url": "/schedule",
      "priority": "medium"
    }
  ],
  "rewards": {
    "totalPointsEarned": 200,
    "badgesUnlocked": [
      {
        "id": "onboarding_complete",
        "name": "Başlangıç Tamamlandı",
        "description": "Onboarding sürecini başarıyla tamamladın"
      }
    ],
    "unlockables": [
      "advanced_analytics",
      "priority_support"
    ]
  }
}
```

## 7. Onboarding Yeniden Başlatma

### Endpoint
```
POST /user-onboarding/restart
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
  "reason": "profile_changed",
  "keepData": {
    "assessmentResults": true,
    "preferences": false,
    "courseSelections": false
  }
}
```

### Response (201 Created)
```json
{
  "newOnboardingId": "onboarding_789012",
  "previousOnboardingId": "onboarding_123456",
  "status": "restarted",
  "preservedData": {
    "assessmentResults": {...},
    "userProfile": {...}
  },
  "message": "Onboarding süreci yeniden başlatıldı"
}
```

## 8. Onboarding Analytics

### Endpoint
```
GET /user-onboarding/analytics
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
  "userAnalytics": {
    "totalOnboardings": 1,
    "completionRate": 100,
    "averageTimeToComplete": 1800,
    "mostDifficultStep": "assessment",
    "preferredLearningStyle": "visual",
    "subjectInterests": [
      {
        "subject": "matematik",
        "interest": 0.9
      },
      {
        "subject": "fizik",
        "interest": 0.7
      }
    ]
  },
  "progressMetrics": {
    "skillLevelProgression": [
      {
        "subject": "matematik",
        "startLevel": "beginner",
        "currentLevel": "intermediate",
        "progressPercentage": 60
      }
    ],
    "learningVelocity": 0.8,
    "engagementScore": 85,
    "retentionRate": 92
  },
  "recommendations": {
    "nextSteps": [
      "İleri seviye matematik kursuna geç",
      "Fizik konularını güçlendir"
    ],
    "studyTips": [
      "Görsel öğrenme materyallerini tercih et",
      "Kısa ve sık çalışma seansları yap"
    ]
  }
}
```

## React Hook Örneği

```javascript
import { useState, useCallback, useEffect } from 'react';

const useOnboarding = () => {
  const [onboarding, setOnboarding] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startOnboarding = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await startOnboarding(profileData);
      setOnboarding(result);
      setCurrentStep(result.currentStep);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeStep = useCallback(async (stepNumber, stepData) => {
    if (!onboarding) return;
    
    setLoading(true);
    try {
      const result = await completeStep(onboarding.onboardingId, {
        stepNumber,
        stepData
      });
      
      setCurrentStep(result.nextStep);
      setOnboarding(prev => ({
        ...prev,
        currentStep: result.nextStep,
        progress: result.progress
      }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onboarding]);

  const submitAssessment = useCallback(async (assessmentData) => {
    if (!onboarding) return;
    
    setLoading(true);
    try {
      const result = await submitAssessment(onboarding.onboardingId, assessmentData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onboarding]);

  const getRecommendations = useCallback(async (options) => {
    if (!onboarding) return;
    
    setLoading(true);
    try {
      const result = await getRecommendations(onboarding.onboardingId, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onboarding]);

  const completeOnboarding = useCallback(async (finalData) => {
    if (!onboarding) return;
    
    setLoading(true);
    try {
      const result = await completeOnboarding(onboarding.onboardingId, finalData);
      setOnboarding(prev => ({ ...prev, status: 'completed' }));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onboarding]);

  const checkStatus = useCallback(async () => {
    if (!onboarding) return;
    
    try {
      const status = await checkOnboardingStatus(onboarding.onboardingId);
      setOnboarding(status);
      setCurrentStep(status.currentStep);
      return status;
    } catch (err) {
      setError(err.message);
    }
  }, [onboarding]);

  return {
    onboarding,
    currentStep,
    loading,
    error,
    startOnboarding,
    completeStep,
    submitAssessment,
    getRecommendations,
    completeOnboarding,
    checkStatus
  };
};

export default useOnboarding;
```

## Onboarding Adımları

1. **Profil Oluşturma**: Kullanıcı bilgileri ve tercihler
2. **Seviye Belirleme**: Bilgi seviyesi değerlendirmesi
3. **Öğrenme Planı**: Kişiselleştirilmiş plan oluşturma
4. **Kurs Seçimi**: Önerilen kursları seçme
5. **Tamamlama**: Final ayarları ve başlangıç

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Onboarding bulunamadı
- **409**: Çakışma (zaten tamamlanmış)
- **422**: İşlenemeyen varlık
- **500**: Sunucu hatası

## Eğitim Seviyeleri

- **elementary**: İlkokul
- **middle_school**: Ortaokul
- **high_school**: Lise
- **university**: Üniversite
- **graduate**: Lisansüstü
- **professional**: Profesyonel

## Öğrenme Stilleri

- **visual**: Görsel
- **auditory**: İşitsel
- **kinesthetic**: Kinestetik
- **reading**: Okuma/Yazma
- **mixed**: Karma

## Zorluk Seviyeleri

- **beginner**: Başlangıç
- **intermediate**: Orta
- **advanced**: İleri
- **expert**: Uzman
- **adaptive**: Uyarlanabilir