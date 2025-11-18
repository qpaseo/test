# wset

# 🥗 영양 기반 메뉴 추천 서비스

**오늘 메뉴 선택이 어려울 때, 공공데이터 기반 영양 정보를 활용해 스마트하게 메뉴를 추천해주는 서비스입니다.**

칼로리·단백질·나트륨 등 영양 성분을 기준으로 사용자가 원하는 식단을 쉽게 찾을 수 있도록 설계되었습니다.

---

## 📌 프로젝트 소개

많은 사람들이 “오늘 뭐 먹지?”라는 고민을 합니다.

이 서비스는 공공데이터포털의 **식품 영양성분 API**를 활용하여,

사용자가 설정한 영양 기준(칼로리·단백질·나트륨 등)에 맞는 음식을 추천하는 시스템입니다.

서비스는 간단한 랜덤 추천부터,

사용 목적(다이어트/단백질 위주/저염식 등)에 따른 영양 기반 추천까지 지원합니다.

---

## 🛠 기술 스택

| 분야 | 기술 |
| --- | --- |
| Frontend | **React 19** + **Vite** + **TypeScript** / **TailwindCSS** / **Lucide-react** / **i18next**|
| Backend | Firebase / Supabase / @google/generative-ai |
| Database | Supabase |
| API | 공공데이터포털 – 식품 영양성분 데이터 |

## 🚀 주요 기능

### ✔ 영양 조건 기반 메뉴 추천

- 칼로리 범위 설정
- 단백질/당류/나트륨 등 특정 영양 성분 기준으로 추천
- 다이어트, 고단백, 저염 등 목적 선택 기능

### ✔ 상세 영양 정보 조회

- 공공데이터 API에서 제공한 모든 영양 정보 표시
- 위험 요소(예: 나트륨 과다) 자동 표시

### ✔ 즐겨찾기 & 최근 추천

- 좋아하는 메뉴 저장
- 최근 추천 받은 메뉴 기록 확인

### ✔ 공공데이터 API 연동

- 식품 영양성분 API 호출
- JSON 데이터 파싱 및 DB 저장
- 추천 알고리즘 데이터로 활용

---

---

## 📂 프로젝트 구조

```
📦 src
 ┣ 📁 
 ┃ ┣ 📁 components/      # 페이지 및 UI 컴포넌트
 ┃ ┣ 📁 contexts/        # 상태 관리 (AuthContext 등)
 ┃ ┣ 📁 lib/             # Firebase 초기화 등 라이브러리
 ┃ ┗ 📁 locales/         # 다국어 번역 파일
 ┃ ┣ 📁 router/          # 라우터 설정
 ┃ ┣ 📁 types/           # TypeScript 타입 정의
 ┃ ┗ 📁 util/            # 유틸 함수 (Firebase, Gemini, OpenAPI 관련)
 ┗ README.md

```

---

---

## 🧪 실행 방법

```
git clone https://github.com/your-repo-url
cd project-folder
npm install
npm run dev
```