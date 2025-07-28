# 🎓 GÜNÜBİRLİK DOZ - Eğitim Platformu API

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google AI" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain" />
</div>

<div align="center">
  <h3>🚀 Modern AI Destekli Eğitim Yönetim Sistemi</h3>
  <p>Öğrenciler, öğretmenler ve veliler için kapsamlı eğitim platformu</p>
</div>

---

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🏗️ Teknoloji Stack](#️-teknoloji-stack)
- [🚀 Kurulum](#-kurulum)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [🔐 Kimlik Doğrulama](#-kimlik-doğrulama)
- [🤖 AI Özellikleri](#-ai-özellikleri)
- [👥 Kullanıcı Rolleri](#-kullanıcı-rolleri)
- [📊 Modüller](#-modüller)
- [🧪 Test](#-test)
- [📄 Lisans](#-lisans)

## 🎯 Proje Hakkında

**GÜNÜBİRLİK DOZ**, modern eğitim ihtiyaçlarını karşılamak için geliştirilmiş kapsamlı bir eğitim yönetim sistemidir. Yapay zeka teknolojileri ile desteklenen platform, öğrenciler, öğretmenler ve veliler arasında etkili bir köprü kurarak eğitim sürecini optimize eder.

### 🎯 Misyon
Eğitimde teknoloji kullanımını yaygınlaştırarak, kişiselleştirilmiş öğrenme deneyimleri sunmak ve eğitim kalitesini artırmak.

### 🌟 Vizyon
AI destekli eğitim araçları ile geleceğin eğitim standardını bugünden oluşturmak.

## ✨ Özellikler

### 🤖 AI Destekli Özellikler
- **İçerik Analizi**: Gemini 2.0 Flash ile güçlendirilmiş metin ve dosya analizi
- **Otomatik Özetleme**: Video ve metin içeriklerinin AI ile özetlenmesi
- **Akıllı Quiz Oluşturma**: LangGraph workflow ile çoktan seçmeli soru üretimi
- **Kişiselleştirilmiş Öneriler**: Öğrenci performansına göre AI destekli öneriler
- **Gelişmiş İçerik Analizi**: Çoklu adımlı LangGraph workflow ile kapsamlı analiz

### 👨‍🎓 Öğrenci Özellikleri
- Kişiselleştirilmiş ana sayfa ve öneriler
- İnteraktif quiz sistemi
- İlerleme takibi ve başarı rozetleri
- Ders materyallerine erişim
- Bildirim sistemi

### 👨‍🏫 Öğretmen Özellikleri
- AI destekli içerik oluşturma ve analiz
- Öğrenci performans analizi
- Quiz ve ders materyali yönetimi
- Toplu bildirim gönderimi
- Detaylı raporlama

### 👨‍👩‍👧‍👦 Veli Özellikleri
- Çocuk ilerleme takibi
- Detaylı performans raporları
- Öğretmen ile iletişim
- Başarı bildirimleri
- Analitik dashboard

### 🔧 Sistem Özellikleri
- JWT tabanlı güvenli kimlik doğrulama
- Rol bazlı erişim kontrolü
- E-posta doğrulama sistemi
- Dosya yükleme ve yönetimi
- Kapsamlı API dokümantasyonu (Swagger)
- Gerçek zamanlı bildirimler

## 🏗️ Teknoloji Stack

### Backend Framework
- **NestJS**: Modern, ölçeklenebilir Node.js framework
- **TypeScript**: Tip güvenli JavaScript geliştirme
- **Express**: HTTP server altyapısı

### Veritabanı & ORM
- **PostgreSQL**: Güçlü ilişkisel veritabanı
- **Prisma**: Modern TypeScript ORM
- **Prisma Client**: Tip güvenli veritabanı erişimi

### AI & Machine Learning
- **Google Generative AI (Gemini 2.0 Flash)**: Gelişmiş dil modeli
- **LangChain**: AI uygulama geliştirme framework
- **LangGraph**: Karmaşık AI workflow yönetimi

### Güvenlik & Kimlik Doğrulama
- **JWT (JSON Web Tokens)**: Güvenli token tabanlı kimlik doğrulama
- **Passport.js**: Kimlik doğrulama middleware
- **Argon2**: Güvenli şifre hashleme
- **bcrypt**: Ek şifre güvenliği

### Validation & Documentation
- **Class Validator**: DTO validation
- **Class Transformer**: Veri dönüşümü
- **Swagger/OpenAPI**: Otomatik API dokümantasyonu

### File Handling & Communication
- **Multer**: Dosya yükleme işlemleri
- **Nodemailer**: E-posta gönderimi
- **SMTP**: E-posta sunucu entegrasyonu

### Development & Testing
- **Jest**: Unit ve integration testleri
- **Supertest**: HTTP endpoint testleri
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlama

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (v13 veya üzeri)
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd guni-backend
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env` dosyası oluşturun:
```env
# Veritabanı
DATABASE_URL="postgresql://username:password@localhost:5432/guni_db"

# JWT Secrets
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Google AI
GOOGLE_API_KEY="your-google-api-key"

# SMTP (E-posta)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Uygulama
PORT=3000
FRONTEND_URL="http://localhost:3000"
```

### 4. Veritabanını Hazırlayın
```bash
# Prisma migration
npx prisma migrate dev

# Prisma client oluştur
npx prisma generate
```

### 5. Uygulamayı Başlatın

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📚 API Dokümantasyonu

Swagger UI dokümantasyonuna erişim:
```
http://localhost:3000/api
```

### Ana Endpoint Grupları
- `/auth` - Kimlik doğrulama işlemleri
- `/content-analysis` - AI destekli içerik analizi
- `/user-onboarding` - Kullanıcı onboarding ve kişiselleştirme
- `/student-panel` - Öğrenci paneli işlemleri
- `/parent-panel` - Veli paneli işlemleri
- `/lessons` - Ders yönetimi
- `/quizzes` - Quiz işlemleri
- `/achievements` - Başarı sistemi
- `/notifications` - Bildirim yönetimi
- `/analytics` - Analitik ve raporlama
- `/uploads` - Dosya yükleme
- `/messages` - Mesajlaşma sistemi

## 🔐 Kimlik Doğrulama

### JWT Token Kullanımı
Tüm korumalı endpoint'ler için Authorization header'ı gereklidir:
```
Authorization: Bearer <your-jwt-token>
```

### Kullanıcı Kayıt ve Giriş
```bash
# Kayıt
POST /auth/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}

# Giriş
POST /auth/signin
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

## 🤖 AI Özellikleri

### İçerik Özetleme
```bash
POST /content-analysis/summarize
{
  "text": "Özetlenecek metin içeriği",
  "title": "İçerik Başlığı"
}
```

### AI Quiz Oluşturma
```bash
POST /content-analysis/generate-quiz-questions
{
  "text": "Quiz konusu metni",
  "numberOfQuestions": 5
}
```

### Gelişmiş İçerik Analizi
```bash
POST /content-analysis/analyze-workflow
{
  "text": "Analiz edilecek içerik",
  "analysisType": "educational_value"
}
```

## 👥 Kullanıcı Rolleri

| Rol | Açıklama | Yetkiler |
|-----|----------|----------|
| **STUDENT** | Öğrenci | Quiz çözme, ilerleme takibi, ders materyallerine erişim |
| **TEACHER** | Öğretmen | İçerik oluşturma, AI analiz, öğrenci yönetimi |
| **PARENT** | Veli | Çocuk takibi, performans raporları, iletişim |
| **ADMIN** | Yönetici | Tam sistem erişimi, kullanıcı yönetimi |

## 📊 Modüller

### 🔐 Auth Module
- Kullanıcı kayıt/giriş
- JWT token yönetimi
- E-posta doğrulama
- Şifre sıfırlama

### 🤖 Content Analysis Module
- AI destekli içerik analizi
- Otomatik özetleme
- Quiz soru üretimi
- LangGraph workflow

### 🎯 User Onboarding Module
- Kişiselleştirilmiş onboarding
- AI destekli profil oluşturma
- Öğrenme tercihleri analizi

### 👨‍🎓 Student Panel Module
- Öğrenci dashboard
- İlerleme takibi
- Quiz çözme
- Başarı sistemi

### 👨‍👩‍👧‍👦 Parent Panel Module
- Veli dashboard
- Çocuk performans takibi
- Detaylı raporlar
- İletişim araçları

### 📚 Lessons Module
- Ders içeriği yönetimi
- Video/dosya yükleme
- İçerik organizasyonu

### 📝 Quizzes Module
- Quiz oluşturma/yönetimi
- Otomatik değerlendirme
- Sonuç analizi

### 🏆 Achievements Module
- Başarı rozeti sistemi
- İlerleme ödülleri
- Motivasyon araçları

### 🔔 Notifications Module
- Gerçek zamanlı bildirimler
- E-posta bildirimleri
- Bildirim tercihleri

### 📊 Analytics Module
- Performans analizi
- Kullanım istatistikleri
- Detaylı raporlama

### 📁 Uploads Module
- Dosya yükleme
- Medya yönetimi
- Güvenli dosya erişimi

### 💬 Messages Module
- Kullanıcı arası mesajlaşma
- Grup iletişimi
- Mesaj geçmişi

## 🧪 Test

### Unit Testleri
```bash
npm run test
```

### Test Coverage
```bash
npm run test:cov
```

### E2E Testleri
```bash
npm run test:e2e
```

### Test Watch Mode
```bash
npm run test:watch
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker (Opsiyonel)
```dockerfile
# Dockerfile örneği
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Proje Sahibi**: GÜNÜBİRLİK DOZ Ekibi
- **E-posta**: info@gunibirlikdoz.com
- **Website**: https://gunibirlikdoz.com

## 🙏 Teşekkürler

- [NestJS](https://nestjs.com/) - Güçlü backend framework
- [Prisma](https://prisma.io/) - Modern ORM
- [Google AI](https://ai.google.dev/) - Gemini AI modeli
- [LangChain](https://langchain.com/) - AI uygulama framework

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

```
MIT License

Copyright (c) 2024 GÜNÜBİRLİK DOZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <p>⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!</p>
  <p>Made with ❤️ by GÜNÜBİRLİK DOZ Team</p>
</div>
