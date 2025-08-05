# Kotlin의 자료형 (Data Types)

Kotlin은 정적 타입 언어로, 모든 변수와 표현식은 컴파일 시점에 타입이 결정됩니다. Kotlin의 모든 타입은 객체(Object)입니다.

## 기본 숫자 타입 (Primitive Types)

Java와 달리 Kotlin에서는 기본 타입(primitive type)과 참조 타입(reference type)을 구분하지 않고 모두 객체로 취급합니다. 하지만 컴파일 시 최적화를 위해 대부분의 경우 Java의 기본 타입(e.g., `int`, `double`)으로 변환됩니다.

| 타입 | 크기 (Bits) | 설명 |
|:---|:---|:---|
| `Double` | 64 | 64비트 부동 소수점. 가장 일반적인 실수 타입. |
| `Float` | 32 | 32비트 부동 소수점. |
| `Long` | 64 | 64비트 정수. |
| `Int` | 32 | 32비트 정수. 가장 일반적인 정수 타입. |
| `Short` | 16 | 16비트 정수. |
| `Byte` | 8 | 8비트 정수. |

```kotlin
val myInt: Int = 100
val myDouble: Double = 3.14
val myLong = 200L // 'L' 접미사를 붙여 Long 타입으로 명시
val myFloat = 3.14F // 'F' 접미사를 붙여 Float 타입으로 명시
```

## 기타 기본 타입

| 타입 | 설명 |
|:---|:---|
| `Boolean` | `true` 또는 `false` 값을 가집니다. |
| `Char` | 작은따옴표(`'`)로 감싼 하나의 문자를 나타냅니다. (예: `'A'`) |
| `String` | 큰따옴표(`"`)로 감싼 문자열을 나타냅니다. 템플릿 표현식(`$variable`)을 지원합니다. |

```kotlin
val isVisible: Boolean = true
val initial: Char = 'J'
val name: String = "John"
val message = "My name is $name" // "My name is John"
```

## 컬렉션 (Collections)

Kotlin의 컬렉션은 크게 **불변(Immutable)**과 **가변(Mutable)**으로 나뉩니다.

- **`List`**: 순서가 있는 요소의 컬렉션. 중복을 허용합니다. (기본적으로 불변)
- **`MutableList`**: 요소를 추가, 삭제, 변경할 수 있는 List.
- **`Set`**: 순서가 없고, 고유한 요소만 가지는 컬렉션. (기본적으로 불변)
- **`MutableSet`**: 요소를 추가, 삭제할 수 있는 Set.
- **`Map`**: Key-Value 쌍으로 이루어진 컬렉션. Key는 고유해야 합니다. (기본적으로 불변)
- **`MutableMap`**: 요소를 추가, 삭제, 변경할 수 있는 Map.

```kotlin
// 불변 리스트 (읽기 전용)
val numbers: List<Int> = listOf(1, 2, 3, 2)

// 가변 리스트
val mutableNames: MutableList<String> = mutableListOf("Alice", "Bob")
mutableNames.add("Charlie") // 추가 가능

// 셋 (중복된 "apple"은 하나만 저장됨)
val fruits: Set<String> = setOf("apple", "banana", "apple")

// 맵
val userMap: Map<Int, String> = mapOf(1 to "Alice", 2 to "Bob")
println(userMap[1]) // "Alice"
```

## Null 가능성 (Nullability)

Kotlin은 **Null Pointer Exception (NPE)** 을 컴파일 시점에 방지하기 위해 타입 시스템에 Null 가능성을 명시적으로 포함합니다.

- 타입 이름 뒤에 `?`를 붙이지 않으면 해당 변수는 `null` 값을 가질 수 없습니다.
- `?`를 붙이면 `null` 값을 가질 수 있는 **Nullable** 타입이 됩니다.

```kotlin
var name: String = "Kotlin"
// name = null // 컴파일 오류!

var nullableName: String? = "Kotlin"
nullableName = null // 가능

// Nullable 타입의 프로퍼티나 함수를 사용하려면 안전한 호출이 필요합니다.
// 1. Safe Call (?.)
println(nullableName?.length) // nullableName이 null이면 null을 반환, 아니면 길이를 반환

// 2. Elvis Operator (?:)
val length = nullableName?.length ?: 0 // nullableName이 null이면 0을 사용
```
이러한 Null 안정성 덕분에 Kotlin은 매우 안정적이고 예측 가능한 코드를 작성하도록 유도합니다.
