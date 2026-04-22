
# Next.js searchParams 사용 정리

1.  searchParams (Server Component)

## 개요

* URL의 쿼리 파라미터(`?key=value`)를 서버에서 읽는 방법

## 사용 예시

* 데이터 로딩에 필요할 때
* 쿼리 값에 따라 서버에서 결과가 달라질 때

## 예시

export default async function Page({ searchParams }) {
  const page = (await searchParams).page
  const data = await fetch(`/api/products?page=${page}`)
}

⸻

2.  useSearchParams (Client Component)

## 개요

* 클라이언트에서 쿼리 파라미터를 읽는 Hook
* 값이 바뀌면 리렌더링됨

## 사용 예시

* UI 상태를 바꿀 때
* 서버 요청 없이 화면만 변경할 때

## 예시

'use client'
import { useSearchParams } from 'next/navigation'
const searchParams = useSearchParams()
const sort = searchParams.get('sort')

⸻

3. URLSearchParams (window API)

## 개요

* 현재 URL을 한 번만 읽는 브라우저 API
* React와 연결 없음 (리렌더링 없음)

## 사용 예시

* 이벤트 핸들러에서 값 확인
* 단발성 로직 처리

## 예시

const handleClick = () => {
  const params = new URLSearchParams(window.location.search)
  const page = params.get('page')
}
