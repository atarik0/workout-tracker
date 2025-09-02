# Workout Tracker

Modern bir full-stack antrenman takip uygulaması. TypeScript, Express, MongoDB ve React ile geliştirilmiştir.

## 🎯 Değerlendirme Kriterleri Eşleştirme Tablosu

| Kriter | Dosya/Klasör | Açıklama |
|--------|--------------|----------|
| **Monorepo Yapısı** | `workout-tracker/` | Kök klasör, server ve client alt projeleri |
| **Backend İskeleti** | `server/src/` | Express + TypeScript + Mongoose yapısı |
| **TypeScript Kullanımı** | `server/tsconfig.json`, `client/` | Strict mode TypeScript konfigürasyonu |
| **Mongoose Model** | `server/src/models/Workout.ts` | Schema validasyonları ve enum'lar |
| **REST API** | `server/src/controllers/workoutController.ts` | CRUD endpoint'leri (201, 200, 204 response'ları) |
| **Express Kurulumu** | `server/src/app.ts` | CORS, middleware, routing konfigürasyonu |
| **Server Başlatma** | `server/src/server.ts` | Environment variables, DB bağlantısı, graceful shutdown |
| **Frontend Kurulumu** | `client/vite.config.ts`, `client/package.json` | Vite + React + TypeScript + Tailwind |
| **React Bileşenleri** | `client/src/components/` | WorkoutForm, WorkoutList, WorkoutCard |
| **API Entegrasyonu** | `client/src/lib/api.ts` | Fetch wrapper'ları, BASE_URL environment'tan |
| **Form Akışı** | `client/src/components/WorkoutForm.tsx` | Controlled form, validation, submit sonrası refresh |
| **Test & Seed** | `server/tests/`, `server/src/scripts/seed.ts` | Vitest + Supertest + mongodb-memory-server |
| **Concurrently** | `package.json` | npm run dev ile her iki servisi birlikte çalıştırma |
| **Environment Yönetimi** | `server/env.example`, `client/env.example` | Port ve CORS ayarları |
| **Dokümantasyon** | `README.md`, `DOC_PROJECT.md` | Kurulum, API örnekleri, proje detayları |

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd workout-tracker
```

### 2. Bağımlılıkları Yükleyin
```bash
npm run install:all
```

### 3. Environment Dosyalarını Hazırlayın
```bash
# Server environment
cp server/env.example server/.env

# Client environment  
cp client/env.example client/.env
```

### 4. MongoDB'yi Yapılandırın
`server/.env` dosyasında MONGODB_URI'yi kendi makinenize göre ayarlayın:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/workout_tracker
```

### 5. Veritabanını Seed Edin
```bash
npm run seed
```

### 6. Geliştirme Sunucularını Başlatın
```bash
npm run dev
```

🎉 **Tamamlandı!**
- **Client:** http://localhost:5174
- **Server:** http://localhost:5173

## 📊 Özellikler

- 🏋️ **Antrenman Kayıtları:** Oluşturma, düzenleme, silme
- 📊 **Antrenman Türleri:** Güç, Kardiyovasküler, Mobilite, Diğer
- ⏱️ **Süre ve Kalori Takibi:** Detaylı metrics
- 📝 **Notlar:** 500 karaktere kadar açıklama
- 📅 **Tarih Sıralama:** En yeni antrenmanlar önce
- 📱 **Responsive Design:** Mobile-first Tailwind CSS
- 🧪 **Test Coverage:** API endpoint'leri için kapsamlı testler

## 🛠️ Teknoloji Yığını

### Backend
- **Node.js** & **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** & **Mongoose** - Veritabanı ve ODM
- **Vitest** + **Supertest** - Testing framework
- **mongodb-memory-server** - In-memory test DB

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **Tailwind CSS** - Utility-first CSS framework

## 🔌 API Endpoints

| Method | Endpoint | Açıklama | Body | Response |
|--------|----------|----------|------|----------|
| POST | `/api/workouts` | Yeni antrenman oluştur | `{ date, type, duration, calories?, notes? }` | 201 + workout |
| GET | `/api/workouts` | Tüm antrenmanları getir | - | 200 + workout[] |
| GET | `/api/workouts/:id` | Tek antrenman getir | - | 200 + workout |
| PUT | `/api/workouts/:id` | Antrenman güncelle | `{ duration?, calories?, notes? }` | 200 + workout |
| DELETE | `/api/workouts/:id` | Antrenman sil | - | 204 |

### 📝 API Örnekleri

#### Yeni Antrenman Oluşturma (cURL)
```bash
curl -X POST http://localhost:5173/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "type": "strength",
    "duration": 45,
    "calories": 280,
    "notes": "Upper body workout"
  }'
```

#### Yeni Antrenman Oluşturma (JavaScript Fetch)
```javascript
const response = await fetch('http://localhost:5173/api/workouts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '2024-01-15',
    type: 'cardio',
    duration: 30,
    calories: 350,
    notes: 'Morning run'
  })
});

const result = await response.json();
console.log(result);
```

#### Tüm Antrenmanları Getirme
```bash
curl -X GET http://localhost:5173/api/workouts
```

#### Antrenman Güncelleme
```bash
curl -X PUT http://localhost:5173/api/workouts/64abc123def456789 \
  -H "Content-Type: application/json" \
  -d '{
    "duration": 60,
    "calories": 400
  }'
```

## 📱 Kullanım

1. **Sol Panel:** Yeni antrenman formu
   - Tarih seçimi (bugün veya geçmiş)
   - Antrenman türü (4 seçenek)
   - Süre (dakika, zorunlu)
   - Kalori (isteğe bağlı)
   - Notlar (max 500 karakter)

2. **Sağ Panel:** Antrenman geçmişi
   - İstatistik özeti
   - Antrenman kartları (tarih sıralı)
   - Her kartta düzenle/sil butonları

## 🧪 Test Çalıştırma

### Backend Testleri
```bash
# Server klasöründe
cd server
npm test

# Veya kök klasörden
npm test
```

Test coverage:
- ✅ POST /api/workouts (valid/invalid data)
- ✅ GET /api/workouts (empty/seeded)
- ✅ GET /api/workouts/:id (found/not found)
- ✅ PUT /api/workouts/:id (happy path)
- ✅ DELETE /api/workouts/:id (happy path)

## 🚧 Sorun Giderme

### CORS Hataları
Server ve client portlarının `.env` dosyalarında doğru ayarlandığından emin olun:
- Server: `PORT=5173`, `CORS_ORIGIN=http://localhost:5174`
- Client: `VITE_API_BASE_URL=http://localhost:5173`

### MongoDB Bağlantı Sorunu
1. MongoDB'nin çalıştığından emin olun
2. Connection string'i kontrol edin: `mongodb://127.0.0.1:27017/workout_tracker`
3. Firewall ayarlarını kontrol edin

### Port Çakışması
Eğer portlar kullanımdaysa, `.env` dosyalarında farklı portlar belirleyin.

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables (Production)
```bash
# Server
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/workout_tracker
CORS_ORIGIN=https://your-frontend-domain.com

# Client
VITE_API_BASE_URL=https://your-backend-domain.com
```

## 📖 Ek Komutlar

```bash
# Sadece server'ı çalıştır
npm run dev:server

# Sadece client'ı çalıştır  
npm run dev:client

# Production build
npm run build

# Server'ı production modunda çalıştır
npm run start

# Veritabanını seed et
npm run seed
```

## 🤝 GitHub Deposu Paylaşımı

1. **GitHub'da yeni repository oluşturun**
2. **Local repository'yi initialize edin:**
```bash
git init
git add .
git commit -m "Initial commit: Full-stack workout tracker"
git branch -M main
git remote add origin https://github.com/username/workout-tracker.git
git push -u origin main
```

3. **README.md'yi repository ana sayfasında güncelleyin**
4. **Environment dosyalarının .gitignore'da olduğundan emin olun**

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

💡 **İpucu:** Projeyi geliştirmek için `DOC_PROJECT.md` dosyasındaki detaylı teknik dokümantasyonu inceleyin.
