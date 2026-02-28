# Tarot Journey

Firebase Hosting과 GitHub Actions를 통한 자동 배포 프로젝트입니다.

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속할 수 있습니다.

### 3. 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 설정 방법

### 1. Firebase 프로젝트 설정

✅ Firebase 프로젝트 ID가 이미 설정되어 있습니다: `tarotjourney-6763a`

Firebase CLI를 설치하고 로그인합니다:
```bash
npm install -g firebase-tools
firebase login
```

### 2. Firebase Service Account 키 생성

1. Firebase Console에서 프로젝트 설정 > 서비스 계정으로 이동합니다.
2. "새 비공개 키 생성"을 클릭하여 JSON 키 파일을 다운로드합니다.
3. JSON 파일의 전체 내용을 복사합니다.

### 3. Firebase Functions Secret 설정

Firebase Functions에서 사용할 API 키를 설정합니다:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

명령어 실행 후 Gemini API 키를 입력하세요.

**Gemini API 키 발급:**
1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. **Create API Key** 클릭
3. 생성된 API 키를 위 명령어로 설정

자세한 내용은 [FIREBASE_SECRETS_SETUP.md](./FIREBASE_SECRETS_SETUP.md)를 참고하세요.

### 4. GitHub Secrets 설정

1. GitHub 저장소로 이동합니다.
2. Settings > Secrets and variables > Actions로 이동합니다.
3. "New repository secret"을 클릭합니다.
4. 다음 secret을 추가합니다:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: 다운로드한 JSON 키 파일의 전체 내용을 붙여넣습니다.

### 5. 프로젝트 구조

```
tarotjourney/
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml      # main 브랜치 병합 시 배포
│       └── firebase-hosting-pull-request.yml  # PR 생성 시 프리뷰 배포
├── public/                                  # 소스 파일들
│   ├── index.html
│   └── js/
│       └── firebase-config.js              # Firebase 설정 및 초기화
├── dist/                                    # 빌드된 파일 (자동 생성)
├── firebase.json                            # Firebase Hosting 설정
├── .firebaserc                              # Firebase 프로젝트 ID
├── vite.config.js                           # Vite 빌드 설정
├── package.json                             # 프로젝트 의존성
└── README.md
```

### 6. 배포

- `main` 브랜치에 코드를 푸시하면 자동으로 Firebase Hosting에 배포됩니다.
- Pull Request를 생성하면 프리뷰 URL이 자동으로 생성됩니다.

## 로컬 개발

### Vite 개발 서버 사용 (권장)

```bash
npm run dev
```

### Firebase Hosting 에뮬레이터 사용

빌드 후 에뮬레이터를 실행합니다:

```bash
npm run build
firebase emulators:start --only hosting
```

## Firebase 설정

Firebase 설정은 `public/js/firebase-config.js`에 있습니다. 
다음 Firebase 서비스를 사용할 수 있습니다:

- ✅ Analytics (이미 설정됨)
- 🔐 Authentication
- 💾 Firestore
- 📦 Storage
- ☁️ Cloud Functions (Gemini API 연동)

필요한 서비스를 추가하려면 `firebase-config.js` 파일을 수정하세요.

## Firebase Functions 배포

Functions를 배포하려면:

```bash
firebase deploy --only functions
```

⚠️ **주의**: Functions를 배포하기 전에 `GEMINI_API_KEY` secret이 설정되어 있어야 합니다.

## 참고 자료

- [Firebase Hosting 문서](https://firebase.google.com/docs/hosting)
- [GitHub Actions for Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)
