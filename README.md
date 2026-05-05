# Not-ELFBEH | Markdown Notes

Bu uygulama Docker üzerinde çalıştırılmak üzere optimize edilmiştir ve Google Gemini AI desteği ile Firebase Kimlik Doğrulama sunar.

## Güvenlik Uyarısı
GitHub'a kod yüklerken `.env` dosyanızı **asla** yüklemeyin. Bu proje, hassas anahtarların commit edilmesini engellemek için `.gitignore` dosyası içermektedir.

## Kurulum ve Yapılandırma

Uygulamanın çalışması için gerekli olan çevre değişkenlerini (Environment Variables) `.env` dosyası içinde tanımlamanız gerekir.

### 1. Yapılandırma Dosyası
Proje kök dizininde bir `.env` dosyası oluşturun (veya `.env.example` dosyasının adını değiştirin) ve içini doldurun:

- `GOOGLE_GENAI_API_KEY`: AI özellikleri için anahtar.
- `NEXT_PUBLIC_FIREBASE_...`: Firebase projenizden aldığınız bilgiler.

## Docker ile Çalıştırma

### Docker Compose ile (Önerilen)

En kolay yöntem Docker Compose kullanmaktır:

```bash
# Uygulamayı arka planda başlatın
docker-compose up -d --build
```

### Docker CLI ile

```bash
# Projeyi derleyin
docker build -t not-elfbeh .

# Değişkenlerle birlikte çalıştırın
docker run -d -p 3000:3000 --name not-elfbeh --env-file .env not-elfbeh
```

## Önemli Not
Next.js `NEXT_PUBLIC_` değişkenlerini **derleme (build)** aşamasında kodun içine gömer. Bu yüzden `.env` dosyanızın `docker-compose up` komutunu çalıştırmadan önce hazır olduğundan emin olun. Değişkenleri değiştirirseniz `--build` parametresi ile imajı yeniden oluşturmanız gerekir.
