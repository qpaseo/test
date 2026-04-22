## Route Groups

app/
(marketing)/
page.tsx
(shop)/
page.tsx

특징:
- `(폴더명)`은 URL에 포함되지 않음
- 코드 구조만 그룹화
사용 목적:
- 레이아웃 분리
- 기능 단위 정리
---

## Dynamic Routes

app/products/[id]/page.tsx → /products/123

사용:

params.id

- `[]`로 동적 경로 정의
- URL path 일부를 변수로 사용
---

## Catch-all Routes (와일드카드 라우트 : 모든값이 들어와도 되는데 있기는 해야하는 라우트)

app/docs/[…slug]/page.tsx

예:

/docs/a/b/c

→ `slug = ['a', 'b', 'c']`

## Optional Catch-all (선택적 와일드카드 라우트 : 모든값이 들어와도 되는게 값이 없어도 되는 라우트 )

app/docs/[[…slug]]/page.tsx

- 값이 없어도 동작
- `/docs`도 허용

---
## Parallel Routes (@슬롯)

app/dashboard/
  layout.tsx
  page.tsx
  @analytics/
    page.tsx

특징:
- `@폴더명`은 URL에 포함되지 않음
- 라우트가 아니라 **레이아웃에 주입되는 슬롯(UI 영역)**
- 독립적인 error 독립적인 loading이 필요할때에 사용

동작:

- `/dashboard` 접속 시
- `page.tsx` + `@analytics/page.tsx`가 **동시에 렌더링됨**

예시 렌더링:

```tsx
<section>
  <DashboardPage />     // children
  <AnalyticsPage />     // analytics 슬롯
</section>