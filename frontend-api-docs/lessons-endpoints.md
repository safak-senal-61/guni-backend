# Dersler Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/lessons
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Ders Oluşturma

### Endpoint
```
POST /lessons
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
  "title": "Türev Kuralları",
  "description": "Temel türev kurallarını öğrenin ve uygulayın",
  "content": "Bu derste türev kurallarını detaylı olarak inceleyeceğiz...",
  "subject": "matematik",
  "grade": "11",
  "difficulty": "intermediate",
  "duration": 45,
  "objectives": [
    "Temel türev kurallarını öğrenmek",
    "Zincir kuralını uygulayabilmek",
    "Türev problemlerini çözebilmek"
  ],
  "prerequisites": [
    "Fonksiyon kavramı",
    "Limit bilgisi"
  ],
  "tags": ["türev", "matematik", "analiz"],
  "materials": [
    {
      "type": "video",
      "title": "Türev Kuralları Videosu",
      "url": "/videos/turev-kurallari.mp4",
      "duration": 20
    },
    {
      "type": "pdf",
      "title": "Türev Formülleri",
      "url": "/documents/turev-formuller.pdf",
      "size": "2.5 MB"
    }
  ],
  "exercises": [
    {
      "question": "f(x) = x³ + 2x² - 5x + 1 fonksiyonunun türevini bulunuz.",
      "answer": "f'(x) = 3x² + 4x - 5",
      "explanation": "Güç kuralını her terime ayrı ayrı uygularız.",
      "difficulty": "easy"
    }
  ],
  "isPublished": true
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "title": "Türev Kuralları",
  "description": "Temel türev kurallarını öğrenin ve uygulayın",
  "content": "Bu derste türev kurallarını detaylı olarak inceleyeceğiz...",
  "subject": "matematik",
  "grade": "11",
  "difficulty": "intermediate",
  "duration": 45,
  "objectives": [
    "Temel türev kurallarını öğrenmek",
    "Zincir kuralını uygulayabilmek",
    "Türev problemlerini çözebilmek"
  ],
  "prerequisites": [
    "Fonksiyon kavramı",
    "Limit bilgisi"
  ],
  "tags": ["türev", "matematik", "analiz"],
  "materials": [...],
  "exercises": [...],
  "isPublished": true,
  "authorId": 123,
  "author": {
    "id": 123,
    "name": "Öğretmen Adı",
    "email": "ogretmen@example.com"
  },
  "stats": {
    "viewCount": 0,
    "enrollmentCount": 0,
    "averageRating": 0,
    "completionRate": 0
  },
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

### Frontend Kullanımı
```javascript
const createLesson = async (lessonData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/lessons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(lessonData)
    });
    
    if (!response.ok) {
      throw new Error('Ders oluşturulamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create lesson error:', error);
    throw error;
  }
};
```

## 2. Tüm Dersleri Listeleme

### Endpoint
```
GET /lessons
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
  "lessons": [
    {
      "id": 1,
      "title": "Türev Kuralları",
      "description": "Temel türev kurallarını öğrenin ve uygulayın",
      "subject": "matematik",
      "grade": "11",
      "difficulty": "intermediate",
      "duration": 45,
      "tags": ["türev", "matematik", "analiz"],
      "author": {
        "id": 123,
        "name": "Öğretmen Adı"
      },
      "stats": {
        "viewCount": 150,
        "enrollmentCount": 45,
        "averageRating": 4.7,
        "completionRate": 85
      },
      "thumbnail": "/images/turev-kurallari-thumb.jpg",
      "isEnrolled": false,
      "progress": 0,
      "createdAt": "2025-01-30T10:30:00Z",
      "updatedAt": "2025-01-30T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalLessons": 95,
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
const getLessons = async (options = {}) => {
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
    
    let url = `http://localhost:3000/lessons?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isPublished=${isPublished}`;
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
      throw new Error('Dersler alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get lessons error:', error);
    throw error;
  }
};
```

## 3. Tek Ders Detayı

### Endpoint
```
GET /lessons/:id
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
  "title": "Türev Kuralları",
  "description": "Temel türev kurallarını öğrenin ve uygulayın",
  "content": "Bu derste türev kurallarını detaylı olarak inceleyeceğiz...",
  "subject": "matematik",
  "grade": "11",
  "difficulty": "intermediate",
  "duration": 45,
  "objectives": [
    "Temel türev kurallarını öğrenmek",
    "Zincir kuralını uygulayabilmek",
    "Türev problemlerini çözebilmek"
  ],
  "prerequisites": [
    "Fonksiyon kavramı",
    "Limit bilgisi"
  ],
  "tags": ["türev", "matematik", "analiz"],
  "materials": [
    {
      "id": 1,
      "type": "video",
      "title": "Türev Kuralları Videosu",
      "url": "/videos/turev-kurallari.mp4",
      "duration": 20,
      "thumbnail": "/images/video-thumb.jpg",
      "isWatched": false,
      "watchProgress": 0
    },
    {
      "id": 2,
      "type": "pdf",
      "title": "Türev Formülleri",
      "url": "/documents/turev-formuller.pdf",
      "size": "2.5 MB",
      "isDownloaded": false
    }
  ],
  "exercises": [
    {
      "id": 1,
      "question": "f(x) = x³ + 2x² - 5x + 1 fonksiyonunun türevini bulunuz.",
      "answer": "f'(x) = 3x² + 4x - 5",
      "explanation": "Güç kuralını her terime ayrı ayrı uygularız.",
      "difficulty": "easy",
      "isCompleted": false,
      "userAnswer": null
    }
  ],
  "author": {
    "id": 123,
    "name": "Öğretmen Adı",
    "email": "ogretmen@example.com",
    "avatar": "/images/teacher-avatar.jpg",
    "bio": "Matematik öğretmeni, 10 yıllık deneyim"
  },
  "stats": {
    "viewCount": 150,
    "enrollmentCount": 45,
    "averageRating": 4.7,
    "completionRate": 85,
    "totalRatings": 23
  },
  "userProgress": {
    "isEnrolled": true,
    "progress": 65,
    "completedMaterials": 2,
    "totalMaterials": 3,
    "completedExercises": 3,
    "totalExercises": 5,
    "timeSpent": 1800,
    "lastAccessed": "2025-01-30T09:15:00Z",
    "isCompleted": false,
    "completedAt": null
  },
  "relatedLessons": [
    {
      "id": 2,
      "title": "İntegral Hesaplama",
      "difficulty": "intermediate",
      "duration": 50
    }
  ],
  "reviews": [
    {
      "id": 1,
      "userId": 456,
      "userName": "Öğrenci Adı",
      "rating": 5,
      "comment": "Çok açıklayıcı bir ders",
      "createdAt": "2025-01-29T14:30:00Z"
    }
  ],
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

### Frontend Kullanımı
```javascript
const getLessonById = async (lessonId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/lessons/${lessonId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Ders detayları alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get lesson error:', error);
    throw error;
  }
};
```

## 4. Ders Güncelleme

### Endpoint
```
PUT /lessons/:id
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
  "title": "Güncellenmiş Türev Kuralları",
  "description": "Güncellenmiş açıklama",
  "content": "Güncellenmiş içerik...",
  "difficulty": "advanced",
  "duration": 60,
  "objectives": [
    "Gelişmiş türev kurallarını öğrenmek",
    "Karmaşık fonksiyonların türevini alabilmek"
  ]
}
```

### Response (200 OK)
```json
{
  "id": 1,
  "title": "Güncellenmiş Türev Kuralları",
  "description": "Güncellenmiş açıklama",
  "content": "Güncellenmiş içerik...",
  "difficulty": "advanced",
  "duration": 60,
  "objectives": [
    "Gelişmiş türev kurallarını öğrenmek",
    "Karmaşık fonksiyonların türevini alabilmek"
  ],
  "updatedAt": "2025-01-30T11:00:00Z"
}
```

## 5. Ders Silme

### Endpoint
```
DELETE /lessons/:id
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
  "message": "Ders başarıyla silindi",
  "deletedLessonId": 1
}
```

## 6. Derse Kayıt Olma

### Endpoint
```
POST /lessons/:id/enroll
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
  "message": "Derse başarıyla kayıt oldunuz",
  "enrollment": {
    "lessonId": 1,
    "userId": 456,
    "enrolledAt": "2025-01-30T11:15:00Z",
    "progress": 0,
    "isCompleted": false
  }
}
```

## 7. Ders Kaydını İptal Etme

### Endpoint
```
DELETE /lessons/:id/enroll
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
  "message": "Ders kaydınız iptal edildi",
  "lessonId": 1
}
```

## 8. Ders İlerlemesini Güncelleme

### Endpoint
```
PUT /lessons/:id/progress
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
  "materialId": 1,
  "materialType": "video",
  "progress": 75,
  "timeSpent": 900,
  "isCompleted": false
}
```

### Response (200 OK)
```json
{
  "message": "İlerleme güncellendi",
  "userProgress": {
    "lessonId": 1,
    "userId": 456,
    "progress": 45,
    "completedMaterials": 1,
    "totalMaterials": 3,
    "timeSpent": 2700,
    "lastAccessed": "2025-01-30T11:30:00Z"
  }
}
```

## 9. Egzersiz Cevabı Gönderme

### Endpoint
```
POST /lessons/:id/exercises/:exerciseId/submit
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
  "answer": "f'(x) = 3x² + 4x - 5",
  "timeSpent": 300
}
```

### Response (200 OK)
```json
{
  "exerciseId": 1,
  "isCorrect": true,
  "score": 100,
  "feedback": "Mükemmel! Doğru cevap.",
  "correctAnswer": "f'(x) = 3x² + 4x - 5",
  "explanation": "Güç kuralını her terime ayrı ayrı uygularız.",
  "hints": [],
  "nextExercise": {
    "id": 2,
    "question": "g(x) = sin(x) + cos(x) fonksiyonunun türevini bulunuz."
  }
}
```

## 10. Ders Değerlendirme

### Endpoint
```
POST /lessons/:id/review
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
  "rating": 5,
  "comment": "Çok faydalı bir ders, açıklamalar çok net",
  "aspects": {
    "content": 5,
    "clarity": 5,
    "difficulty": 4,
    "materials": 5
  }
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "lessonId": 1,
  "userId": 456,
  "rating": 5,
  "comment": "Çok faydalı bir ders, açıklamalar çok net",
  "aspects": {
    "content": 5,
    "clarity": 5,
    "difficulty": 4,
    "materials": 5
  },
  "createdAt": "2025-01-30T11:45:00Z",
  "updatedAt": "2025-01-30T11:45:00Z"
}
```

## 11. Kullanıcının Kayıtlı Dersleri

### Endpoint
```
GET /lessons/my-lessons
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?status=in_progress&page=1&limit=20
```

### Response (200 OK)
```json
{
  "lessons": [
    {
      "id": 1,
      "title": "Türev Kuralları",
      "subject": "matematik",
      "difficulty": "intermediate",
      "duration": 45,
      "progress": 65,
      "isCompleted": false,
      "enrolledAt": "2025-01-29T10:00:00Z",
      "lastAccessed": "2025-01-30T09:15:00Z",
      "timeSpent": 1800,
      "nextMaterial": {
        "id": 3,
        "title": "Zincir Kuralı Videosu",
        "type": "video"
      }
    }
  ],
  "stats": {
    "totalEnrolled": 5,
    "completed": 2,
    "inProgress": 3,
    "totalTimeSpent": 7200,
    "averageProgress": 72
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalLessons": 5
  }
}
```

## 12. Ders Arama

### Endpoint
```
GET /lessons/search
```

### Query Parameters
```
?q=türev&subject=matematik&difficulty=intermediate&page=1&limit=20
```

### Response (200 OK)
```json
{
  "results": [
    {
      "id": 1,
      "title": "Türev Kuralları",
      "description": "Temel türev kurallarını öğrenin",
      "subject": "matematik",
      "difficulty": "intermediate",
      "matchScore": 0.95,
      "highlightedTitle": "<mark>Türev</mark> Kuralları",
      "highlightedDescription": "Temel <mark>türev</mark> kurallarını öğrenin"
    }
  ],
  "totalResults": 15,
  "searchTime": 0.05,
  "suggestions": [
    "türev kuralları",
    "türev uygulamaları",
    "türev problemleri"
  ]
}
```

## React Hook Örneği

```javascript
import { useState, useCallback, useEffect } from 'react';

const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [myLessons, setMyLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLessons(options);
      setLessons(response.lessons);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLessonById = useCallback(async (lessonId) => {
    setLoading(true);
    try {
      const lesson = await getLessonById(lessonId);
      setCurrentLesson(lesson);
      return lesson;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollInLesson = useCallback(async (lessonId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/lessons/${lessonId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Derse kayıt olunamadı');
      }
      
      const result = await response.json();
      
      // Mevcut dersi güncelle
      if (currentLesson?.id === lessonId) {
        setCurrentLesson(prev => ({
          ...prev,
          userProgress: {
            ...prev.userProgress,
            isEnrolled: true,
            progress: 0
          }
        }));
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentLesson]);

  const updateProgress = useCallback(async (lessonId, progressData) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/lessons/${lessonId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });
      
      if (!response.ok) {
        throw new Error('İlerleme güncellenemedi');
      }
      
      const result = await response.json();
      
      // Mevcut dersi güncelle
      if (currentLesson?.id === lessonId) {
        setCurrentLesson(prev => ({
          ...prev,
          userProgress: result.userProgress
        }));
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentLesson]);

  const submitExercise = useCallback(async (lessonId, exerciseId, answer) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/lessons/${lessonId}/exercises/${exerciseId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answer, timeSpent: 300 })
      });
      
      if (!response.ok) {
        throw new Error('Cevap gönderilemedi');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchMyLessons = useCallback(async (options = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const { status, page = 1, limit = 20 } = options;
      
      let url = `http://localhost:3000/lessons/my-lessons?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Derslerim alınamadı');
      }
      
      const data = await response.json();
      setMyLessons(data.lessons);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    lessons,
    currentLesson,
    myLessons,
    loading,
    error,
    fetchLessons,
    fetchLessonById,
    enrollInLesson,
    updateProgress,
    submitExercise,
    fetchMyLessons,
    setCurrentLesson
  };
};

export default useLessons;
```

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim (sadece öğretmenler ders oluşturabilir)
- **404**: Ders bulunamadı
- **409**: Çakışma (zaten kayıtlı)
- **422**: İşlenemeyen varlık
- **500**: Sunucu hatası

## Ders Zorluk Seviyeleri

- **beginner**: Başlangıç
- **intermediate**: Orta
- **advanced**: İleri
- **expert**: Uzman

## Desteklenen Materyaller

- **video**: Video içerik
- **pdf**: PDF doküman
- **audio**: Ses dosyası
- **interactive**: Etkileşimli içerik
- **quiz**: Quiz/Test
- **assignment**: Ödev

## Ders Durumları

- **draft**: Taslak
- **published**: Yayınlanmış
- **archived**: Arşivlenmiş
- **under_review**: İnceleme altında

## Performans ve Sınırlar

- **Maksimum ders süresi**: 180 dakika
- **Maksimum materyal sayısı**: 50
- **Maksimum egzersiz sayısı**: 100
- **Video dosya boyutu**: Maksimum 500MB
- **PDF dosya boyutu**: Maksimum 50MB