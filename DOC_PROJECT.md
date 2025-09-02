# Workout Tracker - Proje Dokümantasyonu

## 1. Proje Genel Bakışı

Workout Tracker, modern web teknolojileri kullanılarak geliştirilmiş tam özellikli bir antrenman takip uygulamasıdır. Kullanıcılar antrenman seanslarını kayıt edebilir, düzenleyebilir ve geçmiş antrenmanlarını görüntüleyebilir.

### 1.1 Projenin Amacı
- Kişisel fitness takibini kolaylaştırmak
- Antrenman verilerini organize etmek
- İlerlemeyi görsel olarak takip etmek
- Modern ve kullanıcı dostu bir arayüz sunmak

### 1.2 Hedef Kullanıcılar
- Düzenli spor yapan bireyler
- Fitness antrenörleri
- Spor salonları
- Kişisel gelişim takip eden kullanıcılar

## 2. Teknik Mimari

### 2.1 Genel Mimari
Proje, modern full-stack mimarisi kullanarak client-server modeli üzerine kurulmuştur:

```
Client (React + Vite + TypeScript)
        ↕ REST API
Server (Node.js + Express + TypeScript)
        ↕ ODM
Database (MongoDB + Mongoose)
```

### 2.2 Teknoloji Yığını

#### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB object document mapper
- **Jest/Vitest**: Unit testing framework
- **Supertest**: HTTP integration testing
- **mongodb-memory-server**: In-memory test database

#### Frontend
- **React 18**: UI library
- **Vite**: Build tool ve dev server
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS post-processor

#### Geliştirme Araçları
- **ts-node-dev**: TypeScript development server
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Concurrently**: Parallel script execution

## 3. Veritabanı Tasarımı

### 3.1 Workout Model Schema

```typescript
interface IWorkout {
  date: Date;           // Antrenman tarihi (zorunlu)
  type: WorkoutType;    // Antrenman türü (zorunlu)
  duration: number;     // Süre (dakika, min: 1, zorunlu)
  calories?: number;    // Kalori (min: 0, isteğe bağlı)
  notes?: string;       // Notlar (max: 500 karakter, isteğe bağlı)
  createdAt: Date;      // Oluşturma tarihi (otomatik)
  updatedAt: Date;      // Güncelleme tarihi (otomatik)
}

enum WorkoutType {
  STRENGTH = "strength",
  CARDIO = "cardio", 
  MOBILITY = "mobility",
  OTHER = "other"
}
```

### 3.2 Doğrulama Kuralları
- **date**: Gerekli, geçerli tarih formatı
- **type**: Gerekli, enum değerlerinden biri
- **duration**: Gerekli, minimum 1 dakika
- **calories**: İsteğe bağlı, minimum 0
- **notes**: İsteğe bağlı, maksimum 500 karakter

## 4. API Tasarımı

### 4.1 REST API Endpoints

| Method | Endpoint | Açıklama | Request Body | Response |
|--------|----------|----------|--------------|----------|
| POST | `/api/workouts` | Yeni antrenman oluştur | Workout data | 201 + Created workout |
| GET | `/api/workouts` | Tüm antrenmanları getir | - | 200 + Workout array |
| GET | `/api/workouts/:id` | Tek antrenman getir | - | 200 + Workout object |
| PUT | `/api/workouts/:id` | Antrenman güncelle | Updated data | 200 + Updated workout |
| DELETE | `/api/workouts/:id` | Antrenman sil | - | 204 |

### 4.2 Hata Yönetimi
- **400**: Bad Request (Geçersiz veri)
- **404**: Not Found (Kayıt bulunamadı)
- **500**: Internal Server Error (Sunucu hatası)

### 4.3 CORS Yapılandırması
Frontend (localhost:5174) ile backend (localhost:5173) arasında güvenli iletişim.

## 5. Frontend Tasarımı

### 5.1 Bileşen Hiyerarşisi

```
App.tsx
├── WorkoutForm.tsx      (Sol panel - Form)
└── WorkoutList.tsx      (Sağ panel - Liste)
    └── WorkoutCard.tsx  (Her antrenman için kart)
```

### 5.2 State Yönetimi
- React useState hooks ile local state
- Form kontrolü için controlled components
- API çağrıları için async/await pattern

### 5.3 Responsive Tasarım
- Mobile-first approach
- Tailwind CSS utility classes
- Flexbox ve Grid layout sistemleri
- Breakpoint-based responsive design

### 5.4 API Entegrasyonu
```typescript
// lib/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  getWorkouts: () => fetch(`${BASE_URL}/api/workouts`),
  createWorkout: (data) => fetch(`${BASE_URL}/api/workouts`, {...}),
  updateWorkout: (id, data) => fetch(`${BASE_URL}/api/workouts/${id}`, {...}),
  deleteWorkout: (id) => fetch(`${BASE_URL}/api/workouts/${id}`, {...})
};
```

## 6. Test Stratejisi

### 6.1 Backend Testing
- **Unit Tests**: Model validasyonları, utility functions
- **Integration Tests**: API endpoint testleri
- **Database Tests**: MongoDB memory server ile isolated testler

### 6.2 Test Araçları
- Jest/Vitest: Test framework
- Supertest: HTTP assertion library
- mongodb-memory-server: Test database

### 6.3 Test Senaryoları
- CRUD operasyonları
- Veri doğrulama
- Error handling
- Edge cases

## 7. Deployment ve DevOps

### 7.1 Environment Konfigürasyonu

#### Server (.env)
```
PORT=5173
MONGODB_URI=mongodb://127.0.0.1:27017/workout_tracker
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174
```

#### Client (.env)
```
VITE_API_BASE_URL=http://localhost:5173
```

### 7.2 Build Process
- TypeScript compilation
- Vite bundle optimization
- Static asset generation
- Environment variable injection

### 7.3 Deployment Stratejisi
- Backend: Node.js hosting (Heroku, Railway, etc.)
- Frontend: Static hosting (Vercel, Netlify, etc.)
- Database: MongoDB Atlas cloud database
- Environment variables: Secure configuration management

## 8. Geliştirme Rehberi

### 8.1 Proje Kurulumu
```bash
# Tüm bağımlılıkları yükle
npm run install:all

# Development modunda çalıştır
npm run dev

# Testleri çalıştır
npm test

# Production build
npm run build:all
```

### 8.2 Code Style ve Standards
- TypeScript strict mode
- ESLint kuralları
- Prettier code formatting
- Conventional commits
- Meaningful variable names

### 8.3 Git Workflow
- Feature branch strategy
- Pull request reviews
- Automated testing on CI/CD
- Semantic versioning

### 8.4 Gelecek Geliştirmeler
- Kullanıcı authentication sistemi
- Dashboard ve analytics
- Workout planları oluşturma
- Social sharing özellikleri
- Mobile app development
- Progressive Web App (PWA) özellikleri

## 9. Performans Optimizasyonları

### 9.1 Frontend Optimizasyonları
- React.memo kullanımı
- useCallback ve useMemo hooks
- Code splitting ve lazy loading
- Image optimization
- Bundle size minimization

### 9.2 Backend Optimizasyonları
- Database indexing
- Query optimization
- Caching strategies
- Response compression
- Rate limiting

### 9.3 UX/UI İyileştirmeleri
- Loading states
- Error boundaries
- Optimistic updates
- Smooth transitions
- Accessibility compliance

Bu dokümantasyon, Workout Tracker projesinin kapsamlı bir rehberi olarak tasarlanmış olup, geliştiricilerin projeyi anlaması ve katkıda bulunması için gerekli tüm bilgileri içermektedir.
