# Not-ELFBEH | Markdown Notes

Bu uygulama Docker üzerinde çalıştırılmak üzere optimize edilmiştir ve Google Gemini AI desteği sunar.

## Yapay Zeka (AI) Kurulumu

AI özelliklerini (Özetleme, Başlık Önerisi vb.) kullanmak için bir API anahtarına ihtiyacınız var:

1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresine gidin.
2. Ücretsiz bir **API Key** oluşturun.
3. Bu anahtarı Docker konteynerini başlatırken kullanın.

## Docker ile Çalıştırma

1. **İmajı Derleyin:**
   ```bash
   docker build -t not-elfbeh .
   ```

2. **Konteyneri Başlatın (AI Anahtarı ile):**
   ```bash
   docker run -d -p 3000:3000 \
     --name not-elfbeh \
     -e GOOGLE_GENAI_API_KEY=BURAYA_ALDIĞINIZ_ANAHTARI_YAZIN \
     not-elfbeh
   ```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Özellikler
- **Markdown Editörü:** Gerçek zamanlı önizleme.
- **PWA Desteği:** Mobil cihazlara uygulama olarak yüklenebilir.
- **AI Asistanı:** Gemini 2.5 Flash ile notlarınızı profesyonelce düzenleyin.
- **Yerel Depolama:** Notlarınız tarayıcınızın `localStorage` alanında saklanır (Docker kapansa bile notlar kaybolmaz).
