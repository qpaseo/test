# React Hook Form

- **카테고리**: 폼 관리 및 유효성 검사 (Form State Management & Validation)
- **설명**: React Hook Form은 React의 Hooks를 기반으로 하는, 성능이 뛰어나고 사용하기 쉬운 폼 관리 라이브러리입니다. 제어되지 않는 컴포넌트(uncontrolled components)를 기본으로 사용하여 불필요한 리렌더링을 최소화하고, 폼 상태 관리를 매우 효율적으로 만듭니다.

## 핵심 특징

- **성능**: 입력값이 변경될 때마다 리렌더링이 발생하는 것을 최소화하여 성능을 최적화합니다.
- **간결한 API**: `useForm`이라는 단일 Hook을 중심으로 매우 직관적인 API를 제공합니다.
- **쉬운 유효성 검사**: HTML 표준(e.g., `required`, `minLength`)을 포함하여, 내장된 규칙이나 `Yup`, `Zod`와 같은 스키마 기반 유효성 검사 라이브러리와 쉽게 통합할 수 있습니다.
- **개발자 경험**: 폼 상태를 추적하고 디버깅할 수 있는 자체 개발자 도구를 제공합니다.
- **작은 용량**: 의존성이 거의 없어 라이브러리 크기가 매우 작습니다.

## 기본 사용법

1.  **`useForm` Hook 사용**: `useForm`을 호출하여 폼을 다루는 데 필요한 메서드들을 가져옵니다.

    - `register`: 입력을 등록하고 유효성 검사 규칙을 적용합니다.
    - `handleSubmit`: 폼 유효성 검사를 통과했을 때만 콜백 함수를 실행하는 래퍼 함수입니다.
    - `formState: { errors }`: 폼의 유효성 검사 에러 정보를 담고 있는 객체입니다.

2.  **폼 작성**: 가져온 메서드들을 사용하여 폼을 구성합니다.

    ```tsx
    import React from 'react';
    import { useForm, SubmitHandler } from 'react-hook-form';

    type FormInputs = {
      firstName: string;
      lastName: string;
      email: string;
    };

    function MyForm() {
      const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

      // 유효성 검사를 통과하면 이 함수가 실행됨
      const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log(data);
      };

      return (
        // `handleSubmit`이 폼 제출 전에 유효성 검사를 실행
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 'register' 함수로 입력을 등록 */}
          <input
            {...register('firstName', { required: true, maxLength: 20 })}
          />
          {/* 에러 메시지 표시 */}
          {errors.firstName && <span>First name is required.</span>}

          <input {...register('lastName', { pattern: /^[A-Za-z]+$/i })} />
          {errors.lastName && <span>Last name contains invalid characters.</span>}

          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <span>{errors.email.message}</span>}

          <input type="submit" />
        </form>
      );
    }
    ```
