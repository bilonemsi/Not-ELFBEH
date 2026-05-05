# Not-ELFBEH | Markdown Notes

Bu uygulama Docker üzerinde çalıştırılmak üzere optimize edilmiştir ve Google Gemini AI desteği ile Firebase Kimlik Doğrulama sunar.

## Güvenlik Uyarısı
GitHub'a kod yüklerken `.env` dosyanızı **asla** yüklemeyin. Bu proje, hassas anahtarların commit edilmesini engellemek için `.gitignore` dosyası içermektedir.

## Kurulum ve Yapılandırma

Uygulamanın çalışması için gerekli olan çevre değişkenlerini (Environment Variables) `.env` dosyası içinde tanımlamanız gerekir.

### 1. Yapılandırma Dosyası
Proje kök dizininde bir `.env` dosyası oluşturun ve içini Firebase konsolundan aldığınız bilgilerle doldurun:

```env
# Google AI (Gemini) API Anahtarı
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# Firebase Konfigürasyonu
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Docker ile Çalıştırma

### Seçenek 1: Docker Compose ile (Önerilen)

En hızlı ve kolay yöntemdir. `.env` dosyanızdaki değişkenleri otomatik olarak okur:

```bash
# Uygulamayı derleyin ve arka planda başlatın
docker-compose up -d --build
```

### Seçenek 2: Docker CLI ile

Eğer işlemleri adım adım yapmak isterseniz:

```bash
# 1. İmajı derleyin
docker build -t not-elfbeh .

# 2. Konteyneri .env dosyasını kullanarak çalıştırın
docker run -d -p 3000:3000 --name not-elfbeh --env-file .env not-elfbeh
```

## Önemli Notlar
*   **Derleme Aşaması:** Next.js, `NEXT_PUBLIC_` ile başlayan değişkenleri **derleme (build)** anında kodun içine gömer. Bu nedenle, Docker imajını oluşturmadan (build etmeden) önce `.env` dosyanızın hazır ve doğru bilgilerle dolu olduğundan emin olun.
*   **Değişiklikler:** Eğer `.env` dosyasındaki bir bilgiyi değiştirirseniz, imajı yeniden derlemeniz (build etmeniz) gerekir.
*   **Port:** Uygulama varsayılan olarak `3000` portunda çalışır.
