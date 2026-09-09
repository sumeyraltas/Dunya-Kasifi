# Dünya Kâşifi 🌍

Ülkeleri, başkentleri, bayrakları ve dünya coğrafyasını eğlenceli testler ve harita keşifleriyle öğrenmenize yardımcı olmak için tasarlanmış modern, interaktif ve eğitici bir web uygulaması.

[Click here for English README](README.md)

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
