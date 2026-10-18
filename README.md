# ⚡ FitTrack 3D | Cyber-Athletics & Smart Tracking Platform

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Android](https://img.shields.io/badge/Android_APK-API_24--36-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Security](https://img.shields.io/badge/Security-OWASP_Hardened-red?style=for-the-badge&logo=securityscorecard&logoColor=white)](https://owasp.org/)

**FitTrack 3D** is a next-generation cyber-aesthetic fitness ecosystem designed for athletes, bodybuilders, and fitness enthusiasts. It bridges real-time **WebGL 3D anatomical biomechanics**, **AI-assisted food vision & barcode scanning**, progressive nutritional analytics, and **enterprise-grade cybersecurity** into a cohesive cross-platform web and mobile experience.

---

## 🌟 Highlights & Features

### 🦾 1. Interactive 3D Anatomical Avatar (WebGL / Three.js)
- **High-Fidelity Cyber Model**: Realistic human athletic musculature rendered in real-time with ambient cybernetic holography, metallic shaders, dynamic shadows, and orbital rotation.
- **Muscle Target Highlighting**: Focus mode on major muscle chains (Chest, Back, Arms, Legs, Core, Shoulders) displaying anatomical coverage and targeted workout metrics.
- **Symmetry & Posture Analytics**: Interactive biometrics overlay assessing left-to-right kinetic symmetry and postural alignment.
- **Customization**: Multi-level zoom, 360° pan/tilt controls, and Wireframe inspection mode.

### 📸 2. Nutri-Scan AI & Barcode Nutrition Engine
- **Visual Food Recognition**: Upload food photos or use your smartphone camera in real-time to analyze meals.
- **Macronutrient Estimation**: Instant automatic calculation of Calories (kcal), Proteins (g), Carbohydrates (g), and Fats (g) with macro breakdown percentages.
- **Barcode Scanner**: Integrated camera barcode decoder for instant nutritional label mapping.
- **One-Click Meal Logging**: Save scanned nutritional profiles directly into your daily nutrition journal with instant persistence.

### 📊 3. Biometrics, Goals & Analytics
- **Dynamic Body Metric Logging**: Weight (kg), Waist circumference (cm), automatic BMI index evaluation.
- **Personalized Goals**: Target definition for weight loss, muscle hyper-trophy, strength benchmarks, and cardiovascular endurance.
- **Milestone Engine**: Real-time progress trackers with interactive milestone celebrations (confetti particle bursts and visual badges).

### 📱 4. Native Android Mobile APK
- **Native Android Packaging**: Built with modern Capacitor bridging for 100% native mobile performance.
- **Hardware Integration**: Direct camera and storage gallery permissions configured for mobile food scanning.
- **Responsive Touch Controls**: Touch-optimized 3D avatar gestures, smooth bottom-bar navigation, and native pull-to-refresh.

---

## 🛡️ Enterprise-Grade Cybersecurity Architecture

FitTrack implements a defense-in-depth security model adhering to **OWASP Top 10** and **NIST** industry standards:

```
[ Mobile / Web Client ]
         │ (HTTPS / Bearer JWT)
         ▼
[ RateLimitingFilter ] ──▶ Sliding-Window IP Throttling (Anti-Brute Force / DoS)
         │ (Permitted requests)
         ▼
[ Security Headers Filter ] ──▶ CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
         │
         ▼
[ JwtAuthenticationFilter ] ──▶ 256-bit HMAC-SHA256 Signature Validation
         │                  └── Checks In-Memory Revocation / Blacklist Store
         ▼
[ IDOR & Business Logic ] ──▶ Strict Ownership Verification (AccessDeniedException)
         │
         ▼
[ GlobalSecurityExceptionHandler ] ──▶ Sanitized JSON Errors (Zero Stack Trace Leakage - CWE-209)
```

1. **Cryptographic Protection**: 256-bit HMAC-SHA256 JWT tokens with configurable environment variable secret injection (`${JWT_SECRET}`).
2. **Server-Side Session Revocation**: Dedicated `/api/auth/logout` endpoint that blacklists active tokens on the server, eliminating session hijacking risks.
3. **Anti-Brute Force Rate Limiting**: In-memory IP-based sliding window filter throttling sensitive authentication endpoints (`HTTP 429 Too Many Requests` + `Retry-After: 60`).
4. **Strict Explicit-Origin CORS**: Disallows credentialed wildcards, strictly whitelisting verified client origins.
5. **HTTP Security Headers**: Strict Content Security Policy (CSP), anti-clickjacking frame denial, and MIME sniffing prevention.
6. **Information Disclosure Prevention (CWE-209)**: Centralized `@RestControllerAdvice` sanitizing all internal exceptions without leaking stack traces or database schemas.
7. **IDOR Protection**: Multi-tenant resource ownership validation on all mutation and deletion operations.

---

## 🏛️ System Architecture & Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.4 (Java 17+)
- **Security Engine**: Spring Security 6 with JJWT 0.11.5
- **Persistence & ORM**: Spring Data JPA & Hibernate
- **Database**: PostgreSQL / MySQL (configurable via environment variables)
- **API Documentation**: OpenAPI 3 / Swagger (`/swagger-ui/index.html`)

### Frontend
- **Core**: React 19, JavaScript ESNext, Vite 8
- **3D Graphics**: Three.js (WebGL rendering, Custom Cyber Shaders)
- **Styling**: Vanilla CSS3 Glassmorphism 2.0 (Custom design system without heavyweight utility overhead)
- **Icons**: Lucide React
- **Mobile Engine**: Capacitor 7 Android Native Bridge

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK)**: Java 17 or higher
- **Node.js**: v18.0.0 or higher & npm
- **Database**: PostgreSQL 14+ (or MySQL / H2)
- **Android SDK** (Optional, for building the mobile APK): Android Studio or command-line SDK

---

### 1. Database Configuration
By default, the application connects to PostgreSQL. You can configure credentials using environment variables or edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fittrackdb
spring.datasource.username=postgres
spring.datasource.password=your_secure_password
```

---

### 2. Running the Backend
From the root directory:

```bash
# Compile and run with Maven
mvn spring-boot:run
```
The server will start at `http://localhost:8080`.
- Swagger UI Documentation: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI Specification: `http://localhost:8080/api-docs`

---

### 3. Running the Frontend
From the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### 4. Compiling & Installing the Android Mobile APK 📱

The project includes a ready-to-build Android native wrapper via Capacitor:

```bash
cd frontend

# 1. Build the production web bundle
npm run build

# 2. Sync web assets into Android native project
npx cap sync android

# 3. Compile the debug APK using Gradle wrapper
cd android
.\gradlew assembleDebug
```

The resulting installable APK will be generated at:
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Installing on your Smartphone:
1. Connect your Android phone via USB with **USB Debugging** enabled and run:
   ```bash
   adb install -r frontend/android/app/build/outputs/apk/debug/app-debug.apk
   ```
2. Or transfer `app-debug.apk` directly to your phone via Google Drive, WhatsApp, or USB cable, and open the file on your device to install.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT Bearer token | No |
| `POST` | `/api/auth/logout` | Revoke and blacklist session token | **Yes** |
| `GET` | `/api/goals` | Retrieve all goals for authenticated user | **Yes** |
| `POST` | `/api/goals` | Create a new athletic / fitness goal | **Yes** |
| `GET` | `/api/meals` | List logged meals with macros | **Yes** |
| `POST` | `/api/meals` | Log a meal (calories, protein, carbs, fat) | **Yes** |
| `DELETE`| `/api/meals/{id}` | Delete a meal entry (with IDOR ownership check) | **Yes** |
| `GET` | `/api/progress` | Fetch user weight, waist, and BMI history | **Yes** |
| `POST` | `/api/progress` | Record new progress entry and auto-calculate BMI | **Yes** |

---

## 🧪 Testing

Execute automated unit and security integration test suites:

```bash
# Run security cryptographic and rate limit tests
mvn test
```

---

## 👤 Author & Repository

- **Repository**: [https://github.com/jeyfreck/fittrackProyect](https://github.com/jeyfreck/fittrackProyect)
- **Author**: **Keyron Fernández Freckleton** ([@jeyfreck](https://github.com/jeyfreck))

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
