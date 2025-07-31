# Auth Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/auth
```

## 1. Kullanıcı Kaydı (Signup)

### Endpoint
```
POST /auth/signup
```

### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "STUDENT"
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "Test User",
  "role": "STUDENT",
  "createdAt": "2025-01-30T10:30:00Z"
}
```

### Error Responses
```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": "Geçersiz e-posta formatı veya eksik alanlar",
  "error": "Bad Request"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "E-posta zaten kullanımda",
  "error": "Forbidden"
}
```

### Frontend Kullanımı
```javascript
const signup = async (userData) => {
  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Kayıt işlemi başarısız');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
```

## 2. Kullanıcı Girişi (Signin)

### Endpoint
```
POST /auth/signin
```

### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "STUDENT"
  }
}
```

### Error Responses
```json
// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Geçersiz kimlik bilgileri",
  "error": "Unauthorized"
}
```

### Frontend Kullanımı
```javascript
const signin = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Giriş işlemi başarısız');
    }
    
    const data = await response.json();
    
    // Token'ları localStorage'a kaydet
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};
```

## 3. Kullanıcı Çıkışı (Logout)

### Endpoint
```
POST /auth/logout
```

### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Response (200 OK)
```json
{
  "message": "Kullanıcı başarıyla çıkış yaptı"
}
```

### Frontend Kullanımı
```javascript
const logout = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Token'ları temizle
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
```

## 4. Token Yenileme (Refresh)

### Endpoint
```
POST /auth/refresh
```

### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Frontend Kullanımı
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    const response = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Token yenileme başarısız');
    }
    
    const data = await response.json();
    
    // Yeni token'ları kaydet
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};
```

## 5. Kullanıcı Profili (Me)

### Endpoint
```
GET /auth/me
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
  "email": "test@example.com",
  "name": "Test User",
  "role": "STUDENT",
  "profilePicture": "/uploads/profile-123456.jpg",
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

### Frontend Kullanımı
```javascript
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3000/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Profil bilgileri alınamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
```

## 6. Şifre Değiştirme

### Endpoint
```
POST /auth/change-password
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
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Response (200 OK)
```json
{
  "message": "Şifre başarıyla değiştirildi"
}
```

## 7. Şifre Sıfırlama Talebi

### Endpoint
```
POST /auth/forgot-password
```

### Request Body
```json
{
  "email": "test@example.com"
}
```

### Response (200 OK)
```json
{
  "message": "Şifre sıfırlama e-postası gönderildi"
}
```

## 8. Şifre Sıfırlama

### Endpoint
```
POST /auth/reset-password
```

### Request Body
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

### Response (200 OK)
```json
{
  "message": "Şifre başarıyla sıfırlandı"
}
```

## 9. Profil Fotoğrafı Yükleme

### Endpoint
```
POST /auth/upload-profile-picture
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
formData.append('profilePicture', file);
```

### Response (200 OK)
```json
{
  "message": "Profil fotoğrafı başarıyla yüklendi",
  "filePath": "/uploads/profile-123456.jpg",
  "fileName": "profile-123456.jpg",
  "originalName": "my-photo.jpg",
  "size": 1024000
}
```

### Frontend Kullanımı
```javascript
const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await fetch('http://localhost:3000/auth/upload-profile-picture', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Profil fotoğrafı yüklenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

## Genel Frontend Utilities

### Token Kontrolü
```javascript
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
```

### Axios Interceptor (Otomatik Token Yenileme)
```javascript
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        // Orijinal isteği tekrar dene
        return axios.request(error.config);
      } catch (refreshError) {
        // Refresh başarısız, kullanıcıyı login sayfasına yönlendir
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Hata Kodları

- **200**: Başarılı
- **201**: Oluşturuldu
- **400**: Hatalı istek
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim
- **404**: Bulunamadı
- **500**: Sunucu hatası

## Güvenlik Notları

1. Token'ları güvenli bir şekilde saklayın (localStorage yerine httpOnly cookies tercih edilebilir)
2. HTTPS kullanın (production'da)
3. Token süresi dolmadan önce yenileyin
4. Hassas bilgileri console.log ile yazdırmayın
5. CORS ayarlarını doğru yapılandırın