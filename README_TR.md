# Dünya Kâşifi 🌍

Ülkeleri, başkentleri, bayrakları ve dünya coğrafyasını eğlenceli testler ve harita keşifleriyle öğrenmenize yardımcı olmak için tasarlanmış modern, interaktif ve eğitici bir web uygulaması.

[Click here for English README](README.md)

<img width="1394" height="746" alt="Ekran Resmi 2026-09-09 12 41 54" src="https://github.com/user-attachments/assets/5afad5ce-f042-40f0-a086-0b542e22e6a2" />

## ✨ Özellikler

*   🗺️ **İnteraktif Dünya Haritası**: Ülkeleri özgürce keşfedin; harita üzerinde tıklayarak ülkelerin başkentlerini, bayraklarını ve detaylarını öğrenin.
*   🏁 **Bayrak Bulmaca**: Bayrakları görerek hangi ülkeye ait olduğunu bulmaya çalışın.
*   🏛️ **Başkent Bulmaca**: Dünyadaki çeşitli ülkelerin başkentlerini tahmin edin.
*   📍 **Harita Bulmaca**: İstenen ülkeyi doğrudan dünya haritası üzerinde bularak tıklayın.
*   🎲 **Karışık Quiz**: Bayraklar, başkentler ve harita konumlarıyla ilgili soruları harmanlayan zorlu bir test.
*   📚 **Öğrenme Modu**: Süre veya skor baskısı olmadan, kıta kıta ülkeleri inceleyin ve öğrenin.
*   📊 **Detaylı İstatistikler**: Gelişiminizi takip edin; toplam puanınızı, doğru/yanlış oranlarınızı ve günlük serilerinizi görün.
*   🏆 **Rozetler ve Başarılar**: Belirli kilometre taşlarına ulaştıkça (puan toplamak, arka arkaya günlerce giriş yapmak vb.) yeni rozetler kazanın.
*   🌓 **Karanlık/Aydınlık Mod**: Göz zevkinize uygun UI temasıyla öğrenmenin tadını çıkarın.
*   🔊 **Ses Efektleri ve Sesli Okuma**: Etkileşimli ses efektleri ve ülke isimlerinin sesli okunması (Text-to-Speech) özelliğiyle öğrenme deneyiminizi artırın.
*   🌐 **Çoklu Dil Desteği**: Uygulama tamamen İngilizce ve Türkçe olarak kullanılabilir.

## 🛠️ Kullanılan Teknolojiler

*   **Framework**: [React 19](https://react.dev/)
*   **Derleme Aracı (Build Tool)**: [Vite](https://vitejs.dev/)
*   **Stil (Styling)**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **İkonlar**: [Lucide React](https://lucide.dev/)
*   **Haritalar ve Coğrafya**: 
    *   `d3-geo` (Harita projeksiyonları için)
    *   `topojson-client` (Harita verilerini işlemek için)
    *   `world-atlas` (Ülke sınır ve topoloji verileri)
*   **Animasyonlar**: `motion` (Framer Motion)
*   **Paket Yöneticisi**: [Bun](https://bun.sh/) (veya npm/yarn/pnpm)

## 🚀 Başlarken

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

Bilgisayarınızda [Node.js](https://nodejs.org/) veya [Bun](https://bun.sh/) yüklü olduğundan emin olun.

### Kurulum

1.  Projeyi klonlayın:
    ```bash
    git clone <repo link>
    cd dunya-kasifi
    ```

2.  Bağımlılıkları yükleyin (bu örnekte Bun kullanılmıştır):
    ```bash
    bun install
    # veya npm install / yarn install
    ```

3.  Geliştirme sunucusunu başlatın:
    ```bash
    bun run dev
    # veya npm run dev / yarn dev
    ```

4.  Tarayıcınızı açın ve `http://localhost:3000` (veya terminalde belirtilen port) adresine gidin.

## 🎮 Nasıl Oynanır?

1.  **Oyun Modu Seçin**: Ana ekrandan Bayrak, Başkent, Harita veya Karışık quizlerinden birini seçin.
2.  **Zorluk Seviyesi Belirleyin**: Kendinize olan güveninize göre Kolay, Orta veya Zor seviyeyi seçin.
3.  **Soruları Cevaplayın**: Soruyu okuyun ve doğru seçeneğe tıklayın veya harita üzerinde doğru konumu işaretleyin.
4.  **Canları ve Skoru Takip Edin**: Her oyunda 3 canınız vardır. Doğru cevaplar size puan ve çarpan kazandırır!
5.  **İstatistikleri İnceleyin**: İstatistikler sekmesine giderek genel performansınızı ve kazandığınız rozetleri görüntüleyin.

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak, sorun bildirmek veya yeni bir özellik önermek isterseniz [issues sayfasına](https://github.com/kullanici-adiniz/dunya-kasifi/issues) göz atabilirsiniz.


## Screenshots

<img width="1394" height="746" alt="Ekran Resmi 2026-09-09 12 41 54" src="https://github.com/user-attachments/assets/47e242fe-d767-4bd0-99ec-a59f5e4a93db" />
<img width="1317" height="745" alt="Ekran Resmi 2026-09-09 12 42 02" src="https://github.com/user-attachments/assets/3de0e978-187b-45f5-b91d-6421cb31d0f3" />
<img width="947" height="751" alt="Ekran Resmi 2026-09-09 12 42 40" src="https://github.com/user-attachments/assets/952b3c76-3304-4092-9858-4f520044e3ec" />
<img width="1100" height="763" alt="Ekran Resmi 2026-09-09 12 42 30" src="https://github.com/user-attachments/assets/04495c6f-8a1c-408f-a456-d5ff1e4c8521" />
<img width="960" height="736" alt="Ekran Resmi 2026-09-09 12 42 55" src="https://github.com/user-attachments/assets/bcccea36-2430-4368-bfe8-0c5e0b83efaf" />
<img width="974" height="753" alt="Ekran Resmi 2026-09-09 12 43 12" src="https://github.com/user-attachments/assets/158aae71-3e84-410f-a70c-fc42e453d506" />
<img width="910" height="771" alt="Ekran Resmi 2026-09-09 12 43 19" src="https://github.com/user-attachments/assets/07881486-0ab0-4850-9150-d058cba744c7" />
<img width="978" height="764" alt="Ekran Resmi 2026-09-09 12 42 16" src="https://github.com/user-attachments/assets/087cfe28-cde8-4618-bbce-f9a8beee2455" />
<img width="896" height="752" alt="Ekran Resmi 2026-09-09 12 54 36" src="https://github.com/user-attachments/assets/f1ce3a04-5cd2-42f4-81f2-b533f5eb69e7" />
