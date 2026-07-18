# Insurance Landing Project

김원자 FP 보험 점검 랜딩 페이지와 백서 아카이브를 위한 정적 웹 프로젝트입니다.

## 구성 파일

- `index.html`: 메인 랜딩 페이지
- `styles.css`: 전체 스타일
- `script.js`: 랜딩 인터랙션, 폼 제출, 로컬 저장
- `whitepaper.html`: 백서 아카이브 페이지
- `whitepaper-data.js`: 백서 데이터 소스
- `whitepaper-page.js`: 백서 렌더링
- `site-config.js`: 카카오 상담 링크, 시트 웹훅, 사이트 URL 설정
- `google-sheets-webhook.gs`: Google Apps Script 웹훅 코드

## 로컬 실행

프로젝트 루트에서 정적 서버만 띄우면 됩니다.

```bash
cd /Users/jeongmin/Desktop/Website/Insurance
python3 -m http.server 4173
```

브라우저에서 아래 주소로 확인합니다.

- `http://localhost:4173/index.html`
- `http://localhost:4173/whitepaper.html`

## 설정값

`site-config.js`에서 아래 값을 관리합니다.

- `kakaoChatUrl`: 카카오 상담 링크
- `siteBaseUrl`: 실제 배포 도메인
- `sourcePageLabel`: 로컬 실행 시 시트에 남길 페이지 식별값
- `googleSheetWebhookUrl`: Google Apps Script 웹훅 URL

예시:

```js
window.INSURANCE_CONFIG = {
  kakaoChatUrl: "https://open.kakao.com/...",
  siteBaseUrl: "https://example.com",
  sourcePageLabel: "insurance-landing",
  googleSheetWebhookUrl: "https://script.google.com/macros/s/.../exec",
};
```

## 백서 추가 방법

새 백서를 추가할 때는 `whitepaper-data.js` 안의 `createWhitepaperEntry({...})` 블록을 복사해 새 항목을 추가합니다.

필수로 채울 값:

- `id`
- `publishedAt`
- `monthLabel`
- `title`
- `subtitle`
- `summary`

권장 규칙:

- `id`: `YYYY-MM` 형식 사용
- `publishedAt`: `YYYY-MM-DD` 형식 사용
- 가장 최신 백서는 배열 어디에 넣어도 됩니다. 파일에서 자동으로 `publishedAt` 기준 내림차순 정렬됩니다.

## 구글 시트 저장 컬럼

### 상담 신청 시트

- 이름
- 연락처
- 이메일
- 연령대
- 상담희망방식
- 상담 희망 분야
- 현재 고민
- 개인정보 수집 및 이용 동의
- 신청일시
- 유입페이지
- 폼구분

### 행복한 부자 신청 시트

- 이름
- 연락처
- 주소
- 상세주소
- 개인정보 수집 및 이용 동의
- 신청일시
- 유입페이지
- 폼구분

## Apps Script 반영 방법

`google-sheets-webhook.gs`를 Google Apps Script에 반영한 뒤 웹 앱을 다시 배포해야 브라우저 변경사항이 실제 시트에도 반영됩니다.

체크 순서:

1. Apps Script 코드 업데이트
2. 웹 앱 재배포
3. `site-config.js`의 웹훅 URL 확인
4. 테스트 제출 후 시트 컬럼 확인

## 참고

- 로컬에서 `index.html`을 직접 열면 `유입페이지`는 `local:insurance-landing` 형식으로 저장됩니다.
- 실제 배포 도메인이 있으면 `siteBaseUrl`을 채워 URL 형태로 시트에 저장할 수 있습니다.
