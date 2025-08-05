# React Server Communication

React 애플리케이션은 종종 외부 서버로부터 데이터를 가져오거나(fetching), 서버에 데이터를 전송(mutating)해야 합니다. 이 문서에서는 React에서 서버와 통신하는 일반적인 방법들을 설명합니다.

## 1. Fetch API

`Fetch API`는 웹 브라우저에 내장된 기능으로, HTTP 요청을 보내고 응답을 받을 수 있는 간단하고 강력한 인터페이스를 제공합니다. 별도의 라이브러리 설치 없이 사용할 수 있습니다.

-   `Promise` 기반으로 동작하여 비동기 처리가 용이합니다.
-   `useEffect` Hook과 함께 사용하여 컴포넌트가 렌더링될 때 데이터를 가져오는 경우가 많습니다.

### 예제: 데이터 가져오기 (GET)

```jsx
import React, { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## 2. Axios

`Axios`는 `Promise` 기반의 인기 있는 HTTP 클라이언트 라이브러리입니다. `Fetch API`에 비해 몇 가지 편의 기능을 추가로 제공합니다.

-   **자동 JSON 변환**: 응답 데이터를 자동으로 JSON으로 변환해줍니다.
-   **요청/응답 인터셉터**: 요청을 보내거나 응답을 받기 전에 공통 로직(e.g., 인증 토큰 추가)을 삽입할 수 있습니다.
-   **브라우저 호환성**: 구형 브라우저에서도 동작하도록 지원합니다.
-   **타임아웃 설정**: 요청 시간 초과를 쉽게 설정할 수 있습니다.

### 예제: 데이터 생성 (POST)

```jsx
import axios from 'axios';

async function createPost(newPost) {
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
    console.log('Post created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

// 사용
createPost({ title: 'New Post', body: 'This is the body.', userId: 1 });
```

## 3. 데이터 페칭 라이브러리 (Data Fetching Libraries)

서버 상태(Server State)를 관리하기 위한 전문 라이브러리들은 로딩, 에러 처리, 캐싱, 재요청(refetching) 등의 복잡한 로직을 매우 간단하게 처리할 수 있도록 도와줍니다.

-   **TanStack Query (구 React Query)**: 서버 상태 관리를 위한 가장 인기 있는 라이브러리 중 하나입니다. 클라이언트 상태와 서버 상태를 분리하여 관리하며, 캐싱, 동기화, 업데이트 로직을 자동화해줍니다.
-   **SWR**: Next.js를 개발한 Vercel 팀에서 만든 데이터 페칭 라이브러리입니다. `stale-while-revalidate`라는 HTTP 캐시 무효화 전략의 이름을 따왔으며, 빠르고 가벼운 사용성을 자랑합니다.

### TanStack Query 예제

```jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPosts = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data;
};

function Posts() {
  // useQuery가 로딩, 에러, 데이터 상태를 모두 관리
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  if (isLoading) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```
