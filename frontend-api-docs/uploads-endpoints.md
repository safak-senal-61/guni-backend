# Uploads Endpointleri - Frontend Entegrasyon Rehberi

## Base URL
```
http://localhost:3000/uploads
```

## Kimlik Doğrulama
Tüm endpointler JWT token gerektirir ve sadece ADMIN ve TEACHER rolleri dosya yükleyebilir:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 1. Dosya Yükleme

### Endpoint
```
POST /uploads/file
```

### Request Headers
```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Request Body (Form Data)
```
file: [Binary File Data]
```

### Dosya Kısıtlamaları
- **Maksimum dosya boyutu**: 10MB
- **Desteklenen formatlar**: Tüm dosya türleri (kısıtlama yok)
- **Yetki**: Sadece ADMIN ve TEACHER rolleri

### Response (201 Created)
```json
{
  "filename": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.pdf",
  "originalname": "ders-notlari.pdf",
  "size": 2048576
}
```

### Hata Yanıtları

#### 400 Bad Request - Dosya boyutu çok büyük
```json
{
  "statusCode": 400,
  "message": "File too large",
  "error": "Bad Request"
}
```

#### 401 Unauthorized - Token eksik
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden - Yetkisiz rol
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### Frontend Kullanımı

#### JavaScript/Fetch API
```javascript
const uploadFile = async (file) => {
  try {
    const token = localStorage.getItem('access_token');
    
    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Dosya boyutu 10MB\'dan büyük olamaz');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:3000/uploads/file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Dosya yüklenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

#### Axios Kullanımı
```javascript
import axios from 'axios';

const uploadFileWithAxios = async (file) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('http://localhost:3000/uploads/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
};
```

## React Hook Örneği

```javascript
import { useState, useCallback } from 'react';

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Dosya boyutu kontrolü
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Dosya boyutu 10MB\'dan büyük olamaz');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            setUploadProgress(percentCompleted);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 201) {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } else {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.message || 'Dosya yüklenemedi'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Ağ hatası'));
        });
        
        xhr.open('POST', 'http://localhost:3000/uploads/file');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadFile,
    uploading,
    uploadProgress,
    error,
    resetUpload
  };
};

export default useFileUpload;
```

## React Component Örneği

```javascript
import React, { useState } from 'react';
import useFileUpload from './hooks/useFileUpload';

const FileUploadComponent = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadFile, uploading, uploadProgress, error, resetUpload } = useFileUpload();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      resetUpload();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Lütfen bir dosya seçin');
      return;
    }

    try {
      const result = await uploadFile(selectedFile);
      console.log('Upload successful:', result);
      onUploadSuccess?.(result);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <div className="file-input-wrapper">
        <input
          id="file-input"
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          {selectedFile ? selectedFile.name : 'Dosya Seç'}
        </label>
      </div>
      
      {selectedFile && (
        <div className="file-info">
          <p>Dosya: {selectedFile.name}</p>
          <p>Boyut: {formatFileSize(selectedFile.size)}</p>
          <p>Tür: {selectedFile.type || 'Bilinmiyor'}</p>
        </div>
      )}
      
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p>{uploadProgress}% yüklendi</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>Hata: {error}</p>
        </div>
      )}
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || uploading}
        className="upload-button"
      >
        {uploading ? 'Yükleniyor...' : 'Dosyayı Yükle'}
      </button>
    </div>
  );
};

export default FileUploadComponent;
```

## Drag & Drop Upload Component

```javascript
import React, { useState, useRef } from 'react';
import useFileUpload from './hooks/useFileUpload';

const DragDropUpload = ({ onUploadSuccess, accept, maxSize = 10 * 1024 * 1024 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { uploadFile, uploading, uploadProgress, error } = useFileUpload();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} dosyası çok büyük (max ${maxSize / 1024 / 1024}MB)`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(validFiles);
  };

  const uploadFiles = async () => {
    for (const file of selectedFiles) {
      try {
        const result = await uploadFile(file);
        onUploadSuccess?.(result);
      } catch (error) {
        console.error(`${file.name} yüklenemedi:`, error);
      }
    }
    setSelectedFiles([]);
  };

  return (
    <div className="drag-drop-upload">
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        <div className="drop-zone-content">
          <svg className="upload-icon" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <p>Dosyaları buraya sürükleyin veya tıklayın</p>
          <p className="file-info">Maksimum dosya boyutu: {maxSize / 1024 / 1024}MB</p>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h4>Seçilen Dosyalar:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
          </ul>
          
          <button 
            onClick={uploadFiles} 
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? `Yükleniyor... ${uploadProgress}%` : 'Dosyaları Yükle'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          Hata: {error}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
```

## CSS Stilleri

```css
.file-upload-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.file-input-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-input-label {
  display: block;
  padding: 12px 20px;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-input-label:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.file-info {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.upload-progress {
  margin-bottom: 15px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.upload-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.upload-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.upload-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Drag & Drop Styles */
.drag-drop-upload {
  max-width: 600px;
  margin: 0 auto;
}

.drop-zone {
  border: 3px dashed #dee2e6;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.drop-zone.drag-over {
  border-color: #007bff;
  background-color: #e7f3ff;
}

.drop-zone:hover {
  border-color: #adb5bd;
  background-color: #e9ecef;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  fill: #6c757d;
}

.selected-files {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.selected-files ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.selected-files li {
  padding: 5px 0;
  border-bottom: 1px solid #dee2e6;
}

.selected-files li:last-child {
  border-bottom: none;
}
```

## Hata Kodları

- **200**: Başarılı
- **201**: Dosya başarıyla yüklendi
- **400**: Hatalı istek (dosya boyutu, format)
- **401**: Kimlik doğrulama gerekli
- **403**: Yetkisiz erişim (sadece ADMIN/TEACHER)
- **413**: Dosya çok büyük
- **415**: Desteklenmeyen medya türü
- **500**: Sunucu hatası

## Güvenlik Notları

1. **Dosya Boyutu**: Maksimum 10MB sınırı
2. **Yetkilendirme**: Sadece ADMIN ve TEACHER rolleri
3. **Dosya Adı**: Güvenlik için rastgele oluşturulur
4. **Depolama**: Sunucuda `./uploads` klasöründe
5. **Virus Tarama**: Üretim ortamında virus tarama önerilir

## Performans İpuçları

1. **Chunk Upload**: Büyük dosyalar için parçalı yükleme
2. **Progress Tracking**: Kullanıcı deneyimi için ilerleme göstergesi
3. **Error Handling**: Ağ kesintileri için yeniden deneme
4. **File Validation**: Client-side validasyon
5. **Compression**: Mümkünse dosya sıkıştırma

## Desteklenen Dosya Türleri

- **Dökümanlar**: PDF, DOC, DOCX, TXT, RTF
- **Resimler**: JPG, JPEG, PNG, GIF, SVG, WEBP
- **Videolar**: MP4, AVI, MOV, WMV, FLV
- **Sesler**: MP3, WAV, OGG, M4A
- **Arşivler**: ZIP, RAR, 7Z
- **Diğer**: Tüm dosya türleri desteklenir