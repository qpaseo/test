# TanStack Form

## 1. 이름
**TanStack Form**

## 2. 설명
TanStack Form은 React, Solid, Vue, Svelte 등에서 사용할 수 있는 **헤드리스(Headless) 폼 상태 관리 라이브러리**입니다. '헤드리스'라는 의미는 폼과 관련된 UI 컴포넌트(예: `Input`, `Select`, `Checkbox`)를 전혀 제공하지 않고, 오직 폼의 상태(값, 유효성 검사, 에러, 제출 상태 등)를 관리하는 로직에만 집중한다는 뜻입니다. 이를 통해 어떤 UI 라이브러리(MUI, Ant Design, TailwindCSS 등)와도 자유롭게 조합하여 사용할 수 있는 유연성을 제공합니다.

## 3. 사용되는 상황
- 복잡한 폼의 상태(수많은 입력 필드, 동적 필드 등)를 효율적으로 관리하고 싶을 때
- 실시간 유효성 검사(validation)나 제출 시 유효성 검사를 구현해야 할 때
- 폼의 성능을 최적화하고 싶을 때 (불필요한 리렌더링 방지)
- 특정 UI 라이브러리에 종속되지 않는, 재사용 가능한 폼 로직을 만들고 싶을 때
- 타입스크립트를 사용하여 폼 데이터와 유효성 검사 규칙의 타입 안전성을 보장하고 싶을 때

## 4. 사용하면 좋은 이유
- **완전한 UI 자율성:** 헤드리스 아키텍처 덕분에 UI/UX 디자이너나 개발자가 원하는 대로 폼의 모양과 동작을 완벽하게 제어할 수 있습니다.
- **성능 최적화:** 필드 레벨의 상태 관리를 통해, 특정 입력 필드가 변경될 때 해당 필드와 관련된 컴포넌트만 리렌더링되도록 하여 폼 전체의 성능을 향상시킵니다.
- **타입 안전성:** 타입스크립트 기반으로 설계되어, 폼의 기본값, 필드 값, 제출 데이터 등의 타입을 명확하게 정의하고 자동 완성의 이점을 누릴 수 있습니다.
- **간결하고 직관적인 API:** `useForm` 훅을 중심으로 매우 적은 양의 코드로 강력한 폼을 구성할 수 있습니다.
- **프레임워크 독립적:** React뿐만 아니라 다른 여러 프레임워크에서도 동일한 로직으로 폼을 만들 수 있습니다.

## 5. 예시 코드 (React 기준)

```jsx
import { useForm } from '@tanstack/react-form';
import { z } from 'zod'; // 유효성 검사를 위해 Zod 사용
import { zodValidator } from '@tanstack/zod-form-adapter'; // Zod 어댑터

function MyForm() {
  const form = useForm({
    // 폼의 기본값 정의
    defaultValues: {
      email: '',
      password: '',
    },
    // 폼 제출 시 실행될 함수
    onSubmit: async ({ value }) => {
      console.log('Submitted data:', value);
    },
    // Zod를 사용한 유효성 검사 어댑터
    validatorAdapter: zodValidator,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* 이메일 필드 */}
      <form.Field
        name="email"
        // 필드 레벨 유효성 검사 (Zod 스키마)
        validators={{
          onChange: z.string().email('유효한 이메일을 입력해주세요.'),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name}>Email:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <em style={{ color: 'red' }}>{field.state.meta.errors.join(', ')}</em>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* 비밀번호 필드 */}
      <form.Field
        name="password"
        validators={{
          onChange: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name}>Password:</label>
            <input
              type="password"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <em style={{ color: 'red' }}>{field.state.meta.errors.join(', ')}</em>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
```

## 6. 입문자를 위한 정보
- **`form.Field` 컴포넌트를 이해하세요:** 이 컴포넌트는 TanStack Form의 핵심입니다. `name`으로 어떤 상태를 관리할지 지정하고, 자식으로 렌더링 함수(render prop)를 받습니다. 이 함수는 `field` 객체를 인자로 받으며, 이 객체 안에는 해당 필드의 상태(`value`, `meta.errors` 등)와 핸들러(`handleChange`, `handleBlur`)가 모두 들어있습니다.
- **유효성 검사는 어댑터와 함께:** TanStack Form 자체는 유효성 검사 라이브러리가 아닙니다. `Zod`, `Yup` 같은 라이브러리와 함께 사용하는 것을 권장하며, 이를 위해 `@tanstack/zod-form-adapter` 같은 공식 어댑터를 제공합니다.
- **상태 구독(Subscription)으로 최적화:** `form.Subscribe` 컴포넌트를 사용하면 폼 전체 상태 중 특정 일부(예: `canSubmit`, `isSubmitting`)가 변경될 때만 리렌더링되는 컴포넌트를 만들 수 있습니다. 이는 불필요한 렌더링을 막는 중요한 최적화 기법입니다.
- **헤드리스의 의미를 잘 활용하세요:** UI가 없다는 것은 단점이 아니라, 내가 사용하는 UI 컴포넌트 라이브러리(MUI의 `TextField`, Antd의 `Input` 등)에 `field` 객체의 `value`와 `onChange` 등을 연결해주기만 하면 된다는 의미입니다. 이는 매우 높은 자유도를 제공합니다.
