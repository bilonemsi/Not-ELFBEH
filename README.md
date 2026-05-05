# Not-ELFBEH | Markdown Notes

Bu uygulama Docker üzerinde çalıştırılmak üzere optimize edilmiştir ve Google Gemini AI desteği ile Firebase Kimlik Doğrulama sunar.

## Güvenlik Uyarısı
GitHub'a kod yüklerken `.env` dosyanızı **asla** yüklemeyin. Bu proje, hassas anahtarların commit edilmesini engellemek için `.gitignore` dosyası içermektedir.

## Kurulum ve Yapılandırma

Uygulamanın çalışması için gerekli olan çevre değişkenlerini (Environment Variables) Docker başlatırken tanımlamanız gerekir.

### 1. Firebase Yapılandırması (Giriş Sistemi İçin)
Firebase konsolundan bir proje oluşturun ve şu bilgileri Docker'a geçirin:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 2. Yapay Zeka (AI) Kurulumu
1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresinden bir API Key alın.
2. `GOOGLE_GENAI_API_KEY` değişkeni ile Docker'a geçirin.

## Docker ile Çalıştırma

```bash
# Projeyi derleyin
docker build -t not-elfbeh .

# Değişkenlerle birlikte çalıştırın (Örnek)
docker run -d -p 3000:3000 \
  --name not-elfbeh \
  -e GOOGLE_GENAI_API_KEY="AI_ANAHTARINIZ" \
  -e NEXT_PUBLIC_FIREBASE_API_KEY="FB_KEY" \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="FB_DOMAIN" \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID="FB_ID" \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="FB_BUCKET" \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SENDER_ID" \
  -e NEXT_PUBLIC_FIREBASE_APP_ID="APP_ID" \
  not-elfbeh
```

## Önemli Not
Eğer anahtarları Docker'a geçirmenize rağmen hata alıyorsanız, Next.js'in bu değişkenleri build sırasında (derleme aşamasında) görmesi gerekebilir. Bu durumda `docker build` komutuna `--build-arg` eklemek gerekebilir.