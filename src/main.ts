import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:5000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Enhanced Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('🎓 GÜNÜBİRLİK DOZ API')
    .setDescription(`
      <div style="text-align: center; margin: 20px 0;">
        <h2>🚀 AI Destekli Eğitim Platformu API'si</h2>
        <p><strong>GÜNÜBİRLİK DOZ</strong> - Yapay zeka teknolojileri ile desteklenen modern eğitim yönetim sistemi</p>
      </div>
      
      <h3>🌟 Özellikler</h3>
      <ul>
        <li>🤖 <strong>AI Destekli İçerik Analizi:</strong> Google Gemini 2.0 Flash ile otomatik özetleme</li>
        <li>🧠 <strong>Akıllı Quiz Sistemi:</strong> LangGraph ile otomatik soru oluşturma</li>
        <li>👨‍🎓 <strong>Kişiselleştirilmiş Öğrenme:</strong> LangChain ile özel öneriler</li>
        <li>🔐 <strong>Güvenli Kimlik Doğrulama:</strong> JWT Bearer Token sistemi</li>
        <li>👥 <strong>Rol Bazlı Erişim:</strong> Öğrenci, Öğretmen, Veli ve Admin rolleri</li>
        <li>📊 <strong>Gelişmiş Analitik:</strong> Detaylı performans raporları</li>
        <li>📧 <strong>E-posta Entegrasyonu:</strong> Otomatik bildirimler</li>
        <li>📁 <strong>Dosya Yönetimi:</strong> Güvenli dosya yükleme ve paylaşım</li>
      </ul>
      
      <h3>🛠️ Teknoloji Yığını</h3>
      <p><code>NestJS</code> • <code>TypeScript</code> • <code>PostgreSQL</code> • <code>Prisma ORM</code> • <code>Google AI</code> • <code>LangChain</code> • <code>LangGraph</code></p>
      
      <h3>📚 Kullanım Rehberi</h3>
      <ol>
        <li><strong>Kimlik Doğrulama:</strong> <code>/auth/signin</code> endpoint'i ile giriş yapın</li>
        <li><strong>Token Kullanımı:</strong> Bearer token'ı Authorization header'ında gönderin</li>
        <li><strong>Rol Kontrolü:</strong> Endpoint'lerin gerektirdiği rolleri kontrol edin</li>
        <li><strong>API Testi:</strong> Aşağıdaki "Try it out" butonlarını kullanın</li>
      </ol>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4>📥 JSON Export</h4>
        <p>API dokümantasyonunu JSON formatında indirmek için: <a href="/api-json" target="_blank"><strong>Swagger JSON İndir</strong></a></p>
      </div>
    `)
    .setVersion('2.0.0')
    .setContact(
      'GÜNÜBİRLİK DOZ Geliştirici Ekibi',
      'https://github.com/gunibirlikdoz',
      'info@gunibirlikdoz.com'
    )
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .setExternalDoc('GitHub Repository', 'https://github.com/gunibirlikdoz/api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT Bearer token ile kimlik doğrulama',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('🔐 Auth', 'Kimlik doğrulama ve yetkilendirme işlemleri')
    .addTag('📊 Content Analysis', 'AI destekli içerik analizi ve özetleme')
    .addTag('🎯 User Onboarding', 'Kullanıcı adaptasyonu ve kişiselleştirme')
    .addTag('📚 Lessons', 'Ders yönetimi ve içerik organizasyonu')
    .addTag('❓ Quizzes', 'Quiz oluşturma ve değerlendirme sistemi')
    .addTag('👨‍🎓 Student Panel', 'Öğrenci dashboard ve özellikler')
    .addTag('👨‍👩‍👧‍👦 Parent Panel', 'Veli takip ve raporlama sistemi')
    .addTag('🏆 Achievements', 'Başarı rozetleri ve ödül sistemi')
    .addTag('💬 Messages', 'Mesajlaşma ve iletişim sistemi')
    .addTag('🔔 Notifications', 'Bildirim yönetimi')
    .addTag('📁 Uploads', 'Dosya yükleme ve yönetimi')
    .addTag('📈 Analytics', 'Performans analizi ve raporlama')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Save Swagger JSON to file for download
  const swaggerJsonPath = path.join(process.cwd(), 'swagger.json');
  fs.writeFileSync(swaggerJsonPath, JSON.stringify(document, null, 2));
  
  // Setup Swagger UI with custom options
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      showExtensions: true,
      showCommonExtensions: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: '🎓 GÜNÜBİRLİK DOZ API Dokümantasyonu',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { background-color: #1976d2; }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
      .swagger-ui .info .title { color: #1976d2; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 15px; border-radius: 8px; }
      .swagger-ui .info .description p { line-height: 1.6; }
      .swagger-ui .info .description h3 { color: #1976d2; margin-top: 25px; }
      .swagger-ui .info .description h4 { color: #388e3c; }
      .swagger-ui .info .description code { background: #e3f2fd; padding: 2px 6px; border-radius: 4px; }
      .swagger-ui .opblock.opblock-post { border-color: #4caf50; }
      .swagger-ui .opblock.opblock-get { border-color: #2196f3; }
      .swagger-ui .opblock.opblock-put { border-color: #ff9800; }
      .swagger-ui .opblock.opblock-delete { border-color: #f44336; }
    `,
  });

  // Add JSON download endpoint
  app.getHttpAdapter().get('/api-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="gunibirlikdoz-api.json"');
    res.send(document);
  });

  console.log('🚀 GÜNÜBİRLİK DOZ API başlatılıyor...');
  console.log(`📚 Swagger UI: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`📥 JSON Export: http://localhost:${process.env.PORT ?? 3000}/api-json`);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
