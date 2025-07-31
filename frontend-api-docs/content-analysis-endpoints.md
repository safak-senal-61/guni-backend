# İçerik Analizi Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/content-analysis
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. İçerik Analizi Başlatma

### Endpoint
```
POST /content-analysis/analyze
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
  "content": "Bu bir örnek metin içeriğidir. Matematik konularında türev ve integral kavramları önemlidir.",
  "contentType": "text",
  "analysisType": "comprehensive",
  "options": {
    "extractKeywords": true,
    "analyzeSentiment": true,
    "detectTopics": true,
    "generateSummary": true,
    "assessDifficulty": true
  }
}
```

### Response (200 OK)
```json
{
  "id": "analysis_123456",
  "status": "completed",
  "content": "Bu bir örnek metin içeriğidir. Matematik konularında türev ve integral kavramları önemlidir.",
  "contentType": "text",
  "analysisResults": {
    "keywords": [
      {
        "word": "matematik",
        "frequency": 1,
        "relevance": 0.95,
        "category": "subject"
      },
      {
        "word": "türev",
        "frequency": 1,
        "relevance": 0.88,
        "category": "concept"
      },
      {
        "word": "integral",
        "frequency": 1,
        "relevance": 0.88,
        "category": "concept"
      }
    ],
    "sentiment": {
      "score": 0.7,
      "label": "positive",
      "confidence": 0.85
    },
    "topics": [
      {
        "name": "Matematik",
        "confidence": 0.92,
        "subtopics": ["Türev", "İntegral"]
      }
    ],
    "summary": "Metin matematik konularında türev ve integral kavramlarının önemini vurgulamaktadır.",
    "difficulty": {
      "level": "intermediate",
      "score": 6.5,
      "factors": [
        "Teknik terimler kullanımı",
        "Kavramsal içerik"
      ]
    },
    "readability": {
      "score": 7.2,
      "grade": "8-9",
      "metrics": {
        "averageWordsPerSentence": 12,
        "averageSyllablesPerWord": 2.3,
        "complexWordPercentage": 15
      }
    }
  },
  "metadata": {
    "wordCount": 15,
    "characterCount": 89,
    "sentenceCount": 2,
    "paragraphCount": 1,
    "processingTime": 1.2,
    "language": "tr"
  },
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:01Z"
}
```

### Frontend Kullanımı
```javascript
const analyzeContent = async (contentData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/content-analysis/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contentData)
    });
    
    if (!response.ok) {
      throw new Error('İçerik analizi başarısız');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Content analysis error:', error);
    throw error;
  }
};
```

## 2. Dosya İçeriği Analizi

### Endpoint
```
POST /content-analysis/analyze-file
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
formData.append('analysisType', 'comprehensive');
formData.append('options', JSON.stringify({
  extractKeywords: true,
  analyzeSentiment: true,
  detectTopics: true
}));
```

### Response (200 OK)
```json
{
  "id": "file_analysis_789",
  "status": "completed",
  "fileName": "ders-notlari.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "extractedText": "Matematik dersi notları...",
  "analysisResults": {
    "keywords": [...],
    "sentiment": {...},
    "topics": [...],
    "summary": "...",
    "difficulty": {...}
  },
  "metadata": {
    "pageCount": 5,
    "wordCount": 1250,
    "processingTime": 3.5,
    "language": "tr"
  },
  "createdAt": "2025-01-30T10:35:00Z"
}
```

### Frontend Kullanımı
```javascript
const analyzeFile = async (file, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('analysisType', options.analysisType || 'comprehensive');
    formData.append('options', JSON.stringify(options));
    
    const response = await fetch('http://localhost:3000/content-analysis/analyze-file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Dosya analizi başarısız');
    }
    
    return await response.json();
  } catch (error) {
    console.error('File analysis error:', error);
    throw error;
  }
};
```

## 3. Analiz Sonucu Getirme

### Endpoint
```
GET /content-analysis/:analysisId
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
  "id": "analysis_123456",
  "status": "completed",
  "content": "...",
  "analysisResults": {...},
  "metadata": {...},
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:01Z"
}
```

### Frontend Kullanımı
```javascript
const getAnalysisResult = async (analysisId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/content-analysis/${analysisId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Analiz sonucu alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get analysis error:', error);
    throw error;
  }
};
```

## 4. Kullanıcının Analiz Geçmişi

### Endpoint
```
GET /content-analysis/history
```

### Request Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Query Parameters
```
?page=1&limit=20&contentType=text&status=completed&sortBy=createdAt&sortOrder=desc
```

### Response (200 OK)
```json
{
  "analyses": [
    {
      "id": "analysis_123456",
      "status": "completed",
      "contentType": "text",
      "contentPreview": "Bu bir örnek metin içeriğidir...",
      "analysisType": "comprehensive",
      "keyTopics": ["Matematik", "Türev"],
      "difficulty": "intermediate",
      "wordCount": 15,
      "createdAt": "2025-01-30T10:30:00Z"
    },
    {
      "id": "analysis_789012",
      "status": "completed",
      "contentType": "file",
      "fileName": "ders-notlari.pdf",
      "analysisType": "basic",
      "keyTopics": ["Fizik", "Hareket"],
      "difficulty": "advanced",
      "wordCount": 1250,
      "createdAt": "2025-01-29T15:20:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalAnalyses": 25,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Frontend Kullanımı
```javascript
const getAnalysisHistory = async (options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const { page = 1, limit = 20, contentType, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    let url = `http://localhost:3000/content-analysis/history?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (contentType) url += `&contentType=${contentType}`;
    if (status) url += `&status=${status}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Analiz geçmişi alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get analysis history error:', error);
    throw error;
  }
};
```

## 5. Analiz Silme

### Endpoint
```
DELETE /content-analysis/:analysisId
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
  "message": "Analiz başarıyla silindi",
  "deletedAnalysisId": "analysis_123456"
}
```

### Frontend Kullanımı
```javascript
const deleteAnalysis = async (analysisId) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://localhost:3000/content-analysis/${analysisId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Analiz silinemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete analysis error:', error);
    throw error;
  }
};
```

## 6. Toplu Analiz

### Endpoint
```
POST /content-analysis/batch-analyze
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
  "contents": [
    {
      "id": "content_1",
      "content": "İlk metin içeriği",
      "contentType": "text"
    },
    {
      "id": "content_2",
      "content": "İkinci metin içeriği",
      "contentType": "text"
    }
  ],
  "analysisType": "basic",
  "options": {
    "extractKeywords": true,
    "detectTopics": true
  }
}
```

### Response (202 Accepted)
```json
{
  "batchId": "batch_456789",
  "status": "processing",
  "totalContents": 2,
  "estimatedCompletionTime": "2025-01-30T10:35:00Z",
  "message": "Toplu analiz başlatıldı"
}
```

## 7. Toplu Analiz Durumu

### Endpoint
```
GET /content-analysis/batch/:batchId
```

### Response (200 OK)
```json
{
  "batchId": "batch_456789",
  "status": "completed",
  "totalContents": 2,
  "completedContents": 2,
  "failedContents": 0,
  "results": [
    {
      "contentId": "content_1",
      "analysisId": "analysis_111",
      "status": "completed",
      "analysisResults": {...}
    },
    {
      "contentId": "content_2",
      "analysisId": "analysis_222",
      "status": "completed",
      "analysisResults": {...}
    }
  ],
  "createdAt": "2025-01-30T10:30:00Z",
  "completedAt": "2025-01-30T10:32:00Z"
}
```

## 8. Anahtar Kelime Önerisi

### Endpoint
```
POST /content-analysis/suggest-keywords
```

### Request Body
```json
{
  "content": "Matematik dersi için içerik hazırlıyorum",
  "subject": "matematik",
  "level": "intermediate",
  "maxSuggestions": 10
}
```

### Response (200 OK)
```json
{
  "suggestions": [
    {
      "keyword": "türev",
      "relevance": 0.95,
      "category": "concept",
      "difficulty": "intermediate"
    },
    {
      "keyword": "integral",
      "relevance": 0.92,
      "category": "concept",
      "difficulty": "intermediate"
    },
    {
      "keyword": "fonksiyon",
      "relevance": 0.88,
      "category": "concept",
      "difficulty": "basic"
    }
  ],
  "totalSuggestions": 3
}
```

## 9. İçerik Karşılaştırma

### Endpoint
```
POST /content-analysis/compare
```

### Request Body
```json
{
  "content1": "İlk metin içeriği",
  "content2": "İkinci metin içeriği",
  "comparisonType": "similarity",
  "options": {
    "compareKeywords": true,
    "compareTopics": true,
    "compareDifficulty": true,
    "compareSentiment": true
  }
}
```

### Response (200 OK)
```json
{
  "comparisonId": "comparison_123",
  "similarity": {
    "overall": 0.75,
    "keywords": 0.68,
    "topics": 0.82,
    "structure": 0.71
  },
  "differences": {
    "uniqueKeywords1": ["türev", "limit"],
    "uniqueKeywords2": ["integral", "alan"],
    "difficultyDifference": 1.2,
    "sentimentDifference": 0.1
  },
  "recommendations": [
    "İçerikler benzer konuları ele alıyor",
    "İkinci içerik daha ileri seviye kavramlar içeriyor"
  ]
}
```

## 10. İçerik Kalitesi Değerlendirmesi

### Endpoint
```
POST /content-analysis/quality-assessment
```

### Request Body
```json
{
  "content": "Değerlendirilecek içerik",
  "criteria": {
    "clarity": true,
    "accuracy": true,
    "completeness": true,
    "engagement": true,
    "structure": true
  },
  "targetAudience": "students",
  "subject": "matematik"
}
```

### Response (200 OK)
```json
{
  "qualityScore": 8.2,
  "assessmentDetails": {
    "clarity": {
      "score": 8.5,
      "feedback": "İçerik açık ve anlaşılır"
    },
    "accuracy": {
      "score": 9.0,
      "feedback": "Bilgiler doğru ve güncel"
    },
    "completeness": {
      "score": 7.5,
      "feedback": "Bazı detaylar eksik"
    },
    "engagement": {
      "score": 8.0,
      "feedback": "İlgi çekici örnekler mevcut"
    },
    "structure": {
      "score": 8.5,
      "feedback": "İyi organize edilmiş"
    }
  },
  "improvements": [
    "Daha fazla örnek eklenebilir",
    "Görsel içerik artırılabilir",
    "Özet bölümü eklenebilir"
  ],
  "strengths": [
    "Açık açıklamalar",
    "Doğru bilgiler",
    "İyi yapılandırma"
  ]
}
```

## React Hook Örneği

```javascript
import { useState, useCallback } from 'react';

const useContentAnalysis = () => {
  const [analyses, setAnalyses] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeContent = useCallback(async (contentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeContent(contentData);
      setCurrentAnalysis(result);
      setAnalyses(prev => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeFile = useCallback(async (file, options) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFile(file, options);
      setCurrentAnalysis(result);
      setAnalyses(prev => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalysisHistory = useCallback(async (options) => {
    setLoading(true);
    try {
      const response = await getAnalysisHistory(options);
      setAnalyses(response.analyses);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const compareContents = useCallback(async (content1, content2, options) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/content-analysis/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content1,
          content2,
          comparisonType: 'similarity',
          options
        })
      });
      
      if (!response.ok) {
        throw new Error('Karşılaştırma başarısız');
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
    analyses,
    currentAnalysis,
    loading,
    error,
    analyzeContent,
    analyzeFile,
    loadAnalysisHistory,
    compareContents,
    setCurrentAnalysis
  };
};

export default useContentAnalysis;
```

## Hata Kodları

- **200**: Başarılı
- **202**: Kabul edildi (toplu işlem)
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Analiz bulunamadı
- **413**: Dosya çok büyük
- **422**: İşlenemeyen varlık
- **429**: Çok fazla istek
- **500**: Sunucu hatası

## Desteklenen Dosya Formatları

- **Metin**: .txt, .md
- **Doküman**: .pdf, .doc, .docx
- **Sunum**: .ppt, .pptx
- **Elektronik Tablo**: .xls, .xlsx
- **Web**: .html, .htm

## Analiz Türleri

- **basic**: Temel analiz (anahtar kelimeler, konu tespiti)
- **comprehensive**: Kapsamlı analiz (tüm özellikler)
- **sentiment**: Sadece duygu analizi
- **keywords**: Sadece anahtar kelime çıkarımı
- **topics**: Sadece konu tespiti
- **quality**: Sadece kalite değerlendirmesi

## Performans ve Sınırlar

- **Maksimum dosya boyutu**: 50MB
- **Maksimum metin uzunluğu**: 100,000 karakter
- **Rate limiting**: Dakikada 30 analiz
- **Toplu analiz**: Maksimum 100 içerik
- **Analiz geçmişi**: Son 1000 analiz saklanır