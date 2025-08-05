# Next.js UI & Styling

Next.js는 다양한 스타일링 방법을 지원하며, 개발자가 선호하는 방식을 유연하게 선택할 수 있습니다.

## 1. Built-in CSS Support (내장 CSS 지원)

Next.js는 별도의 설정 없이 다양한 방식의 CSS를 지원합니다.

### Global CSS (전역 CSS)

-   전역 스타일은 `app/layout.tsx` (App Router) 또는 `pages/_app.tsx` (Pages Router) 파일에서만 `import`할 수 있습니다.
-   애플리케이션 전체에 적용될 스타일(e.g., CSS 리셋, 기본 폰트 설정)을 정의하는 데 사용됩니다.

```css
/* styles/globals.css */
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
```
```tsx
// app/layout.tsx
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### CSS Modules

-   컴포넌트 레벨에서만 유효한 지역 스코프(local scope)를 갖는 CSS를 작성하는 방법입니다.
-   파일 이름을 `[name].module.css` 형식으로 지어야 합니다.
-   클래스 이름이 빌드 시점에 고유한 해시값으로 변경되어 스타일 충돌을 자동으로 방지합니다.

```css
/* components/Button.module.css */
.error {
  color: white;
  background-color: red;
}
```
```tsx
// components/Button.tsx
import styles from './Button.module.css';

export function Button() {
  return (
    <button type="button" className={styles.error}>
      Error Button
    </button>
  );
}
```

### Sass/SCSS Support

-   `sass` 패키지를 설치하면 별도 설정 없이 `.scss` 또는 `.sass` 파일을 바로 사용할 수 있습니다.
-   전역 스타일과 CSS 모듈 방식 모두에서 사용 가능합니다. (`[name].module.scss`)

## 2. Tailwind CSS

Next.js는 Tailwind CSS와의 통합을 공식적으로 지원하며, `create-next-app` 시에 바로 설정할 수 있습니다.

-   **장점**: 유틸리티 우선 접근 방식으로 매우 빠르게 UI를 개발할 수 있으며, 디자인 시스템을 일관되게 유지하기 쉽습니다. 최종 프로덕션 빌드 시 사용되지 않는 스타일은 모두 제거(Purge)되어 번들 크기가 최적화됩니다.
-   **설정**: `tailwind.config.js`와 `postcss.config.js` 파일이 자동으로 생성되며, `globals.css`에 Tailwind 지시어가 추가됩니다.

```tsx
// app/page.tsx
export default function Page() {
  return (
    <h1 className="text-3xl font-bold underline text-blue-600">
      Hello, Next.js with Tailwind!
    </h1>
  );
}
```

## 3. CSS-in-JS

JavaScript 코드 내에서 CSS를 작성하는 라이브러리들도 지원합니다. App Router의 서버 컴포넌트 환경과 호환되도록 설정이 필요할 수 있습니다.

-   **Styled-components**
-   **Emotion**

App Router에서 CSS-in-JS 라이브러리를 사용하려면, 해당 스타일을 생성하는 컴포넌트가 클라이언트 컴포넌트(`"use client"`)여야 하며, 스타일 레지스트리를 설정하여 서버에서 생성된 스타일을 HTML에 주입하는 추가적인 구성이 필요할 수 있습니다.

## UI Component Libraries

React에서 사용하는 모든 UI 라이브러리(MUI, Ant Design, Chakra UI 등)는 Next.js에서도 사용 가능합니다. App Router 환경에서는 서버 컴포넌트와의 호환성을 위해 `"use client"` 지시어를 적절히 사용해야 하는 경우가 많습니다.
