# Achievements Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/achievements
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Başarım Oluşturma (ADMIN)

### Endpoint
```
POST /achievements
```

### Yetkilendirme
- **Rol**: ADMIN
- **JWT Token**: Gerekli

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
  "name": "İlk Ders Tamamlama",
  "description": "İlk dersinizi başarıyla tamamladınız",
  "icon": "🎓",
  "type": "lesson_completion",
  "criteria": {
    "lessonCount": 1,
    "subject": "any",
    "minScore": 70
  },
  "points": 50,
  "rarity": "common",
  "category": "education",
  "isActive": true,
  "requirements": [
    {
      "type": "lesson_completed",
      "value": 1,
      "operator": ">="
    }
  ],
  "rewards": {
    "points": 50,
    "badge": "first_lesson",
    "title": "Öğrenci"
  }
}
```

### Response (201 Created)
```json
{
  "id": "achievement_123",
  "name": "İlk Ders Tamamlama",
  "description": "İlk dersinizi başarıyla tamamladınız",
  "icon": "🎓",
  "type": "lesson_completion",
  "criteria": {
    "lessonCount": 1,
    "subject": "any",
    "minScore": 70
  },
  "points": 50,
  "rarity": "common",
  "category": "education",
  "isActive": true,
  "requirements": [
    {
      "type": "lesson_completed",
      "value": 1,
      "operator": ">="
    }
  ],
  "rewards": {
    "points": 50,
    "badge": "first_lesson",
    "title": "Öğrenci"
  },
  "createdAt": "2025-01-30T12:00:00Z",
  "updatedAt": "2025-01-30T12:00:00Z",
  "createdBy": "admin_456",
  "totalUnlocked": 0
}
```

### Frontend Kullanımı
```javascript
const createAchievement = async (achievementData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(achievementData)
    });
    
    if (!response.ok) {
      throw new Error('Başarım oluşturulamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create achievement error:', error);
    throw error;
  }
};
```

## 2. Tüm Başarımları Listeleme

### Endpoint
```
GET /achievements
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
  "achievements": [
    {
      "id": "achievement_123",
      "name": "İlk Ders Tamamlama",
      "description": "İlk dersinizi başarıyla tamamladınız",
      "icon": "🎓",
      "type": "lesson_completion",
      "points": 50,
      "rarity": "common",
      "category": "education",
      "isActive": true,
      "totalUnlocked": 156,
      "unlockRate": 78.5,
      "createdAt": "2025-01-15T10:00:00Z"
    },
    {
      "id": "achievement_124",
      "name": "Quiz Ustası",
      "description": "10 quiz'i başarıyla tamamladınız",
      "icon": "🏆",
      "type": "quiz_completion",
      "points": 100,
      "rarity": "rare",
      "category": "assessment",
      "isActive": true,
      "totalUnlocked": 45,
      "unlockRate": 22.5,
      "createdAt": "2025-01-10T14:30:00Z"
    },
    {
      "id": "achievement_125",
      "name": "Haftalık Seri",
      "description": "7 gün üst üste çalıştınız",
      "icon": "🔥",
      "type": "streak",
      "points": 75,
      "rarity": "uncommon",
      "category": "engagement",
      "isActive": true,
      "totalUnlocked": 89,
      "unlockRate": 44.5,
      "createdAt": "2025-01-08T09:15:00Z"
    }
  ],
  "totalAchievements": 25,
  "categories": [
    {
      "name": "education",
      "displayName": "Eğitim",
      "count": 8,
      "icon": "📚"
    },
    {
      "name": "assessment",
      "displayName": "Değerlendirme",
      "count": 6,
      "icon": "📝"
    },
    {
      "name": "engagement",
      "displayName": "Katılım",
      "count": 5,
      "icon": "⚡"
    },
    {
      "name": "social",
      "displayName": "Sosyal",
      "count": 4,
      "icon": "👥"
    },
    {
      "name": "special",
      "displayName": "Özel",
      "count": 2,
      "icon": "⭐"
    }
  ],
  "rarityDistribution": {
    "common": 12,
    "uncommon": 8,
    "rare": 4,
    "epic": 1,
    "legendary": 0
  }
}
```

### Frontend Kullanımı
```javascript
const getAllAchievements = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/achievements', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Başarımlar alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get achievements error:', error);
    throw error;
  }
};
```

## 3. Kullanıcının Başarımları

### Endpoint
```
GET /achievements/my-achievements
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
  "userAchievements": {
    "userId": "user_789",
    "userName": "Ahmet Yılmaz",
    "totalPoints": 425,
    "totalAchievements": 8,
    "completionRate": 32.0,
    "rank": 15,
    "level": 3,
    "nextLevelPoints": 75,
    "unlockedAchievements": [
      {
        "id": "achievement_123",
        "name": "İlk Ders Tamamlama",
        "description": "İlk dersinizi başarıyla tamamladınız",
        "icon": "🎓",
        "type": "lesson_completion",
        "points": 50,
        "rarity": "common",
        "category": "education",
        "unlockedAt": "2025-01-20T14:30:00Z",
        "progress": 100,
        "isNew": false
      },
      {
        "id": "achievement_125",
        "name": "Haftalık Seri",
        "description": "7 gün üst üste çalıştınız",
        "icon": "🔥",
        "type": "streak",
        "points": 75,
        "rarity": "uncommon",
        "category": "engagement",
        "unlockedAt": "2025-01-28T18:45:00Z",
        "progress": 100,
        "isNew": true
      }
    ],
    "inProgressAchievements": [
      {
        "id": "achievement_124",
        "name": "Quiz Ustası",
        "description": "10 quiz'i başarıyla tamamladınız",
        "icon": "🏆",
        "type": "quiz_completion",
        "points": 100,
        "rarity": "rare",
        "category": "assessment",
        "progress": 60,
        "currentValue": 6,
        "targetValue": 10,
        "estimatedCompletion": "2025-02-15T00:00:00Z"
      }
    ],
    "availableAchievements": [
      {
        "id": "achievement_126",
        "name": "Matematik Uzmanı",
        "description": "Matematik derslerinde 90+ ortalama yapın",
        "icon": "🧮",
        "type": "subject_mastery",
        "points": 150,
        "rarity": "epic",
        "category": "education",
        "progress": 0,
        "requirements": [
          "5 matematik dersi tamamla",
          "90+ ortalama yap",
          "Hiç quiz'de başarısız olma"
        ]
      }
    ],
    "recentActivity": [
      {
        "achievementId": "achievement_125",
        "achievementName": "Haftalık Seri",
        "action": "unlocked",
        "timestamp": "2025-01-28T18:45:00Z",
        "pointsEarned": 75
      }
    ],
    "statistics": {
      "commonAchievements": 5,
      "uncommonAchievements": 2,
      "rareAchievements": 1,
      "epicAchievements": 0,
      "legendaryAchievements": 0,
      "averageUnlockTime": 12.5,
      "streakDays": 7,
      "lastActivity": "2025-01-30T10:30:00Z"
    }
  }
}
```

### Frontend Kullanımı
```javascript
const getUserAchievements = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/achievements/my-achievements', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Kullanıcı başarımları alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user achievements error:', error);
    throw error;
  }
};
```

## 4. Başarım Kontrolü ve Kilidi Açma

### Endpoint
```
POST /achievements/check-unlocks
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
  "newlyUnlocked": [
    {
      "id": "achievement_127",
      "name": "Günlük Çalışma",
      "description": "Bugün en az 1 saat çalıştınız",
      "icon": "⏰",
      "type": "daily_study",
      "points": 25,
      "rarity": "common",
      "category": "engagement",
      "unlockedAt": "2025-01-30T12:00:00Z",
      "reason": "1 saatlik çalışma süresi tamamlandı"
    }
  ],
  "progressUpdates": [
    {
      "achievementId": "achievement_124",
      "achievementName": "Quiz Ustası",
      "previousProgress": 60,
      "newProgress": 70,
      "currentValue": 7,
      "targetValue": 10,
      "progressIncrease": 10
    }
  ],
  "totalPointsEarned": 25,
  "newLevel": null,
  "levelUp": false,
  "summary": {
    "achievementsUnlocked": 1,
    "progressUpdated": 1,
    "pointsEarned": 25,
    "checkTime": "2025-01-30T12:00:00Z"
  }
}
```

### Frontend Kullanımı
```javascript
const checkAchievementUnlocks = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/achievements/check-unlocks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Başarım kontrolü yapılamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Check achievements error:', error);
    throw error;
  }
};
```

## 5. Liderlik Tablosu

### Endpoint
```
GET /achievements/leaderboard
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?limit=20
```

### Response (200 OK)
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_456",
      "userName": "Ayşe Kaya",
      "avatar": "/uploads/avatar456.jpg",
      "totalPoints": 1250,
      "totalAchievements": 18,
      "level": 8,
      "title": "Başarım Ustası",
      "recentAchievements": [
        {
          "id": "achievement_130",
          "name": "Mükemmel Seri",
          "icon": "💎",
          "rarity": "legendary",
          "unlockedAt": "2025-01-29T16:20:00Z"
        }
      ],
      "badges": ["top_student", "quiz_master", "streak_champion"],
      "streakDays": 25,
      "lastActivity": "2025-01-30T11:45:00Z"
    },
    {
      "rank": 2,
      "userId": "user_789",
      "userName": "Mehmet Özkan",
      "avatar": "/uploads/avatar789.jpg",
      "totalPoints": 1180,
      "totalAchievements": 16,
      "level": 7,
      "title": "Çalışkan Öğrenci",
      "recentAchievements": [
        {
          "id": "achievement_128",
          "name": "Fen Bilgisi Uzmanı",
          "icon": "🔬",
          "rarity": "epic",
          "unlockedAt": "2025-01-28T14:10:00Z"
        }
      ],
      "badges": ["science_expert", "consistent_learner"],
      "streakDays": 18,
      "lastActivity": "2025-01-30T09:30:00Z"
    },
    {
      "rank": 3,
      "userId": "user_123",
      "userName": "Zeynep Demir",
      "avatar": "/uploads/avatar123.jpg",
      "totalPoints": 1050,
      "totalAchievements": 15,
      "level": 6,
      "title": "Azimli Öğrenci",
      "recentAchievements": [
        {
          "id": "achievement_126",
          "name": "Matematik Uzmanı",
          "icon": "🧮",
          "rarity": "epic",
          "unlockedAt": "2025-01-27T20:45:00Z"
        }
      ],
      "badges": ["math_expert", "dedicated_student"],
      "streakDays": 12,
      "lastActivity": "2025-01-29T22:15:00Z"
    }
  ],
  "currentUser": {
    "rank": 15,
    "userId": "user_current",
    "userName": "Ahmet Yılmaz",
    "totalPoints": 425,
    "totalAchievements": 8,
    "level": 3,
    "pointsToNextRank": 75,
    "nextRankUser": {
      "rank": 14,
      "userName": "Ali Veli",
      "totalPoints": 500
    }
  },
  "statistics": {
    "totalUsers": 200,
    "averagePoints": 285,
    "averageAchievements": 6.5,
    "topPercentile": 10,
    "lastUpdated": "2025-01-30T12:00:00Z"
  }
}
```

### Frontend Kullanımı
```javascript
const getLeaderboard = async (limit = 10) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/achievements/leaderboard?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Liderlik tablosu alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get leaderboard error:', error);
    throw error;
  }
};
```

## 6. Manuel Başarım Kilidi Açma (ADMIN)

### Endpoint
```
POST /achievements/unlock/:achievementId
```

### Yetkilendirme
- **Rol**: ADMIN
- **JWT Token**: Gerekli

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
  "userId": "user_789"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "achievement": {
    "id": "achievement_123",
    "name": "İlk Ders Tamamlama",
    "description": "İlk dersinizi başarıyla tamamladınız",
    "icon": "🎓",
    "points": 50,
    "rarity": "common"
  },
  "user": {
    "id": "user_789",
    "name": "Ahmet Yılmaz",
    "newTotalPoints": 475,
    "newLevel": 3
  },
  "unlockedAt": "2025-01-30T12:05:00Z",
  "unlockedBy": "admin_456",
  "reason": "Manuel olarak admin tarafından açıldı",
  "message": "Başarım başarıyla kullanıcıya verildi"
}
```

### Frontend Kullanımı
```javascript
const unlockAchievement = async (achievementId, userId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/achievements/unlock/${achievementId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      throw new Error('Başarım kilidi açılamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Unlock achievement error:', error);
    throw error;
  }
};
```

## React Hook Örneği

```javascript
import { useState, useCallback, useEffect } from 'react';

const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newUnlocks, setNewUnlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllAchievements();
      setAchievements(response.achievements);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserAchievements();
      setUserAchievements(response.userAchievements);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (limit = 10) => {
    setLoading(true);
    try {
      const response = await getLeaderboard(limit);
      setLeaderboard(response.leaderboard);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUnlocks = useCallback(async () => {
    try {
      const response = await checkAchievementUnlocks();
      
      if (response.newlyUnlocked.length > 0) {
        setNewUnlocks(prev => [...prev, ...response.newlyUnlocked]);
        // Kullanıcı başarımlarını güncelle
        fetchUserAchievements();
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchUserAchievements]);

  const createNewAchievement = useCallback(async (achievementData) => {
    try {
      const response = await createAchievement(achievementData);
      // Başarım listesini güncelle
      fetchAllAchievements();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchAllAchievements]);

  const unlockForUser = useCallback(async (achievementId, userId) => {
    try {
      const response = await unlockAchievement(achievementId, userId);
      // İlgili verileri güncelle
      fetchUserAchievements();
      fetchLeaderboard();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchUserAchievements, fetchLeaderboard]);

  const dismissNewUnlock = useCallback((achievementId) => {
    setNewUnlocks(prev => prev.filter(unlock => unlock.id !== achievementId));
  }, []);

  const clearAllNewUnlocks = useCallback(() => {
    setNewUnlocks([]);
  }, []);

  // Otomatik başarım kontrolü
  useEffect(() => {
    const interval = setInterval(() => {
      checkUnlocks();
    }, 60000); // 1 dakikada bir kontrol et

    return () => clearInterval(interval);
  }, [checkUnlocks]);

  // İlk yükleme
  useEffect(() => {
    fetchAllAchievements();
    fetchUserAchievements();
    fetchLeaderboard();
  }, [fetchAllAchievements, fetchUserAchievements, fetchLeaderboard]);

  return {
    achievements,
    userAchievements,
    leaderboard,
    newUnlocks,
    loading,
    error,
    fetchAllAchievements,
    fetchUserAchievements,
    fetchLeaderboard,
    checkUnlocks,
    createNewAchievement,
    unlockForUser,
    dismissNewUnlock,
    clearAllNewUnlocks
  };
};

export default useAchievements;
```

## Achievement Notification Component

```javascript
import React, { useEffect, useState } from 'react';
import useAchievements from './useAchievements';

const AchievementNotification = () => {
  const { newUnlocks, dismissNewUnlock } = useAchievements();
  const [currentUnlock, setCurrentUnlock] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (newUnlocks.length > 0 && !currentUnlock) {
      setCurrentUnlock(newUnlocks[0]);
      setIsVisible(true);
      
      // 5 saniye sonra otomatik kapat
      setTimeout(() => {
        handleDismiss();
      }, 5000);
    }
  }, [newUnlocks, currentUnlock]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (currentUnlock) {
        dismissNewUnlock(currentUnlock.id);
        setCurrentUnlock(null);
      }
    }, 300);
  };

  if (!currentUnlock || !isVisible) return null;

  return (
    <div className={`achievement-notification ${isVisible ? 'visible' : ''}`}>
      <div className="achievement-content">
        <div className="achievement-icon">
          {currentUnlock.icon}
        </div>
        <div className="achievement-info">
          <h3>Başarım Kazandınız!</h3>
          <h4>{currentUnlock.name}</h4>
          <p>{currentUnlock.description}</p>
          <div className="achievement-points">
            +{currentUnlock.points} puan
          </div>
        </div>
        <button 
          className="close-btn"
          onClick={handleDismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;
```

## Başarım Türleri

- **lesson_completion**: Ders tamamlama
- **quiz_completion**: Quiz tamamlama
- **streak**: Çalışma serisi
- **subject_mastery**: Konu hakimiyeti
- **daily_study**: Günlük çalışma
- **social**: Sosyal etkileşim
- **special**: Özel etkinlikler

## Nadir Seviyeleri

- **common**: Yaygın (70-100%)
- **uncommon**: Nadir (40-69%)
- **rare**: Ender (15-39%)
- **epic**: Efsanevi (5-14%)
- **legendary**: Efsanevi (0-4%)

## Kategoriler

- **education**: Eğitim
- **assessment**: Değerlendirme
- **engagement**: Katılım
- **social**: Sosyal
- **special**: Özel

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim (ADMIN gerekli)
- **404**: Başarım bulunamadı
- **409**: Başarım zaten açılmış
- **500**: Sunucu hatası

## Güvenlik ve Performans

1. **Role-based Access**: Rol tabanlı erişim kontrolü
2. **Achievement Validation**: Başarım doğrulama
3. **Anti-cheat**: Hile önleme
4. **Rate Limiting**: İstek sınırlaması
5. **Caching**: Performans optimizasyonu
6. **Real-time Updates**: Gerçek zamanlı güncellemeler