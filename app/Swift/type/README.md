# Swift의 자료형 (Data Types)

Swift는 타입에 매우 안전한(Type-Safe) 언어로, 코드에서 사용하는 값의 타입을 명확하게 하도록 권장합니다. Swift는 컴파일 시점에 타입 검사(Type Checking)를 수행하여 오류를 미리 방지합니다.

## 기본 데이터 타입 (Basic Data Types)

| 타입 | 설명 |
|:---|:---|
| `Int` | 부호 있는 정수. 플랫폼에 따라 32비트 또는 64비트 크기를 가집니다. |
| `UInt` | 부호 없는 정수. 0과 양수만 표현합니다. |
| `Double` | 64비트 부동 소수점. `Float`보다 더 정밀하여 대부분의 실수에 권장됩니다. |
| `Float` | 32비트 부동 소수점. |
| `Bool` | `true` 또는 `false` 값을 가지는 논리 타입. |
| `String` | 텍스트 데이터를 나타내는 문자열. |
| `Character` | 큰따옴표(`"`)로 감싼 하나의 문자를 나타냅니다. |

```swift
let myInt: Int = 100
let myDouble: Double = 3.14
let isVisible: Bool = true
let initial: Character = "J"
let name: String = "Swift"

// 타입 추론(Type Inference)이 가능하므로 타입을 생략할 수 있습니다.
let message = "My name is \(name)" // "My name is Swift"
```

## 컬렉션 타입 (Collection Types)

Swift는 데이터를 모아서 관리하는 세 가지 주요 컬렉션 타입을 제공합니다. Swift의 컬렉션은 기본적으로 **값 타입(Value Type)**이며, 항상 **가변(Mutable)**으로 생성되지만 `let`으로 선언하면 **불변(Immutable)**이 됩니다.

- **`Array`**: 순서가 있는 값의 목록. 중복을 허용합니다.
- **`Set`**: 순서가 없고, 고유한 값만 가지는 컬렉션.
- **`Dictionary`**: 순서가 없는 Key-Value 쌍의 컬렉션. Key는 고유해야 합니다.

```swift
// 불변 배열 (let으로 선언)
let numbers: [Int] = [1, 2, 3, 2]

// 가변 배열 (var로 선언)
var mutableNames: [String] = ["Alice", "Bob"]
mutableNames.append("Charlie") // 추가 가능

// 셋 (중복된 "apple"은 하나만 저장됨)
var fruits: Set<String> = ["apple", "banana", "apple"]

// 딕셔너리
var userMap: [Int: String] = [1: "Alice", 2: "Bob"]
userMap[3] = "Charlie" // 추가 또는 변경 가능
print(userMap[1]) // Optional("Alice")
```

## 옵셔널 (Optionals)

Swift는 **값이 없음**을 안전하게 처리하기 위해 **옵셔널(Optional)** 이라는 개념을 사용합니다. 이는 Kotlin의 Nullable 타입과 매우 유사합니다.

- 변수나 상수에 값이 있을 수도, 없을 수도(`nil`) 있음을 나타냅니다.
- 타입 이름 뒤에 `?`를 붙여 옵셔널 타입을 선언합니다.
- `nil`은 Swift에서 "값이 없음"을 나타내는 특별한 키워드입니다.

```swift
var name: String = "Swift"
// name = nil // 컴파일 오류!

var optionalName: String? = "Swift"
optionalName = nil // 가능

// 옵셔널 값에 접근하려면 "Unwrapping" 과정이 필요합니다.
// 1. Optional Binding (if let) - 가장 안전하고 권장되는 방법
if let unwrappedName = optionalName {
    print("My name is \(unwrappedName)")
} else {
    print("Name is nil.")
}

// 2. Nil-Coalescing Operator (??) - 기본값 제공
let displayName = optionalName ?? "Guest" // optionalName이 nil이면 "Guest"를 사용

// 3. Forced Unwrapping (!) - 강제 언래핑 (주의해서 사용)
// 만약 값이 nil일 때 사용하면 런타임 에러가 발생하여 앱이 중단됩니다.
// print(optionalName!.count)
```
옵셔널은 Swift의 타입 안전성(Type Safety)의 핵심 기능으로, `nil`로 인한 런타임 오류를 크게 줄여줍니다.
