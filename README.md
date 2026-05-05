
# Not-ELFBEH | Professional Markdown Notes

Bu uygulama, Docker üzerinde çalıştırılmak üzere optimize edilmiş, Google Gemini AI desteği ve Firebase Authentication sunan profesyonel bir not tutma çözümüdür.

## Özellikler
*   **Güvenli Giriş:** Firebase Auth ile kullanıcı bazlı erişim.
*   **AI Asistanı:** Notlarınızı özetleyin, iyileştirin veya başlık önerileri alın.
*   **Gerçek Zamanlı:** Yazdığınız her şey anında Firestore'a kaydedilir.
*   **PWA Desteği:** Mobil cihazlara "uygulama" olarak yüklenebilir.
*   **Markdown:** Tam kapsamlı Markdown render desteği.

## Kurulum ve Yapılandırma

Uygulamanın çalışması için gerekli olan çevre değişkenlerini `.env` dosyası içinde tanımlamanız gerekir.

### 1. Ortam Değişkenleri (.env)
Proje kök dizininde bir `.env` dosyası oluşturun:

```env
# Google AI (Gemini) API Key
GOOGLE_GENAI_API_KEY=your_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Docker ile Dağıtım

### Seçenek 1: Docker Compose (Önerilen)
```bash
docker-compose up -d --build
```

### Seçenek 2: Docker CLI
```bash
docker build -t not-elfbeh .
docker run -d -p 3000:3000 --name not-elfbeh --env-file .env not-elfbeh
```

## Lisans
Bu proje özel kullanım için tasarlanmıştır. Tüm hakları saklıdır.
