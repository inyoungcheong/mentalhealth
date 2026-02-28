# Firebase Functions Secret 설정 가이드

Firebase Functions에서 사용할 API 키나 비밀 정보를 설정하는 방법입니다.

## GEMINI_API_KEY 설정하기

### 방법 1: Firebase CLI 사용 (권장)

1. **Firebase CLI가 설치되어 있는지 확인**
   ```bash
   firebase --version
   ```

2. **Firebase에 로그인**
   ```bash
   firebase login
   ```

3. **프로젝트 선택**
   ```bash
   firebase use tarotjourney-6763a
   ```

4. **Secret 설정**
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```
   
   명령어를 실행하면:
   - 비밀번호 입력을 요청합니다 (터미널에 표시되지 않음)
   - Gemini API 키를 입력하고 Enter를 누릅니다
   - Secret이 Firebase에 저장됩니다

### 방법 2: Google Cloud Console 사용

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택: `tarotjourney-6763a`
3. 좌측 메뉴에서 **Secret Manager** 검색 및 선택
4. **+ CREATE SECRET** 클릭
5. 다음 정보 입력:
   - **Name**: `GEMINI_API_KEY` (정확히 이 이름으로!)
   - **Secret value**: Gemini API 키 입력
   - **Secret access**: 기본값 유지
6. **CREATE SECRET** 클릭

### 방법 3: 환경 변수로 직접 입력 (CLI)

```bash
echo "YOUR_GEMINI_API_KEY" | firebase functions:secrets:set GEMINI_API_KEY
```

또는 PowerShell에서:
```powershell
"YOUR_GEMINI_API_KEY" | firebase functions:secrets:set GEMINI_API_KEY
```

## Gemini API 키 발급받기

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. **Create API Key** 클릭
4. 프로젝트 선택 (또는 새로 생성)
5. API 키가 생성되면 복사하여 위의 방법 중 하나로 설정

## Secret 확인하기

설정한 secret을 확인하려면:

```bash
firebase functions:secrets:access GEMINI_API_KEY
```

## Secret 삭제하기

```bash
firebase functions:secrets:delete GEMINI_API_KEY
```

## Functions 배포 시 Secret 자동 연결

`functions/index.js`에서 **`defineSecret('GEMINI_API_KEY')`** 를 사용합니다.
- 반드시 **Secret Manager**에 `GEMINI_API_KEY`를 설정해야 합니다 (`defineString`이 아님).
- 설정 후 배포: `firebase deploy --only functions`

## 주의사항

⚠️ **절대 코드에 API 키를 직접 작성하지 마세요!**
- `.env` 파일도 Git에 커밋하지 마세요
- Secret은 Firebase/Google Cloud에서 안전하게 관리됩니다
- 로컬 개발 시에는 `.env.local` 파일을 사용하고 `.gitignore`에 추가하세요

## 로컬 개발 시 Secret 사용

로컬에서 Functions를 테스트할 때:

1. `.env.local` 파일 생성 (프로젝트 루트에)
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. `.gitignore`에 추가 확인
   ```
   .env.local
   .env
   ```

3. Firebase Emulator 실행
   ```bash
   firebase emulators:start --only functions
   ```

## 문제 해결

### Secret을 찾을 수 없다는 오류가 발생하면:
1. Secret 이름이 정확한지 확인 (`GEMINI_API_KEY`)
2. 프로젝트가 올바른지 확인 (`firebase use tarotjourney-6763a`)
3. Secret Manager에서 secret이 생성되었는지 확인

### Functions 배포 실패 시:
1. `firebase functions:secrets:access GEMINI_API_KEY`로 secret 확인
2. **defineSecret** 사용 여부 확인 (defineString이면 Secret Manager 값이 안 들어감 → defineSecret으로 변경됨)
3. `firebase deploy --only functions --debug`로 상세 로그 확인

## Gemini가 안 될 때 체크리스트

- [ ] **GEMINI_API_KEY Secret 설정**: `firebase functions:secrets:set GEMINI_API_KEY` 실행 후 키 입력
- [ ] **Functions 배포**: `firebase deploy --only functions` 실행 (Secret 설정 후 한 번 더 배포)
- [ ] **프로젝트 선택**: `firebase use tarotjourney-6763a`
- [ ] **브라우저 콘솔**: F12 → Console에 `[oracleReading] error:` 등 에러 메시지 확인
- [ ] **앱에서 "점괘 API 연결 실패" 문구가 보이면** → 위 항목부터 다시 확인
