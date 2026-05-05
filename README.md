# Not-ELFBEH | Markdown Notes

Bu uygulama Docker üzerinde çalıştırılmak üzere optimize edilmiştir.

## Docker ile Çalıştırma

1. **İmajı Derleyin:**
   ```bash
   docker build -t not-elfbeh .
   ```

2. **Konteyneri Başlatın:**
   ```bash
   docker run -p 3000:3000 \
     -e GOOGLE_GENAI_API_KEY=your_api_key_here \
     not-elfbeh
   ```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Özellikler
- **Markdown Editörü:** Gerçek zamanlı önizleme.
- **PWA Desteği:** Mobil cihazlara uygulama olarak yüklenebilir.
- **Yerel Depolama:** Notlarınız tarayıcınızın `localStorage` alanında saklanır.
