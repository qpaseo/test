## 문법 (기능)
이 섹션에서는 Swift의 핵심 문법과 기능을 다룹니다.

### 1. 변수와 상수 선언 (Variable and Constant Declaration)
JavaScript의 `let`, `const`와 정확히 일치하는 키워드를 사용합니다.

- `let`: 한 번 할당되면 변경할 수 없는 상수입니다. (JavaScript의 `const`와 동일)
  ```swift
  let name: String = "홍길동"
  // name = "김철수" // 컴파일 오류 발생
  ```

- `var`: 재할당이 가능한 변수입니다. (JavaScript의 `let`과 동일)
  ```swift
  var age: Int = 20
  age = 21 // 가능
  ```

### 2. 함수 선언 (Function Declaration)
`func` 키워드를 사용하여 함수를 정의합니다.

```swift
// 기본 형태
func sum(a: Int, b: Int) -> Int {
    return a + b
}

// 파라미터 이름에 대한 이해
// _ : 외부에서 파라미터 이름을 사용하지 않을 때
// from: 외부에서 사용할 이름, a: 내부에서 사용할 이름
func sayHello(from a: String) {
    print("Hello, \(a)")
}
sayHello(from: "Swift") // 호출 시 외부 이름을 사용
```

### 3. 문자열 보간법 (String Interpolation)
JavaScript의 템플릿 리터럴이나 코틀린의 문자열 템플릿과 유사합니다. `\()` 안에 변수나 표현식을 넣어 사용합니다.

```swift
let user = "이순신"
let message = "안녕하세요, \(user) 님!" // "안녕하세요, 이순신 님!"
print(message)

let a = 10
let b = 20
print("\(a) + \(b) = \(a + b)") // "10 + 20 = 30"
```

### 4. 옵셔널 (Optionals)
Swift의 핵심적인 Null 안전성 기능입니다. 코틀린의 Nullable 타입(`?`)과 거의 동일한 개념으로, 값이 있을 수도 있고 없을 수도(`nil`) 있음을 나타냅니다.

- **옵셔널 타입 (`?`)**: 변수가 `nil` 값을 가질 수 있음을 명시합니다.
  ```swift
  var optionalName: String? = "개발자"
  optionalName = nil // 가능

  var nonOptionalName: String = "개발자"
  // nonOptionalName = nil // 컴파일 오류 발생
  ```

- **안전한 호출 (Optional Chaining, `?.`)**: `nil`이 아닐 경우에만 메서드나 프로퍼티에 접근합니다. `nil`이면 `nil`을 반환합니다.
  ```swift
  let length = optionalName?.count
  print(length) // optionalName이 nil이면 nil 출력
  ```

- **강제 언래핑 (`!`)**: 옵셔널 변수가 `nil`이 아님을 확신할 때 사용합니다. 만약 `nil`인데 사용하면 런타임 에러가 발생하므로 주의해야 합니다.
  ```swift
  // let unwrappedName = optionalName! // 만약 optionalName이 nil이면 앱이 강제 종료됨
  ```

### 5. 구조체와 클래스 (Structs and Classes)
Swift에서는 데이터와 관련 행위를 캡슐화하기 위해 `struct`와 `class`를 사용합니다. **SwiftUI는 `struct` 기반**으로 동작하는 것이 큰 특징입니다.

- `struct`: 값 타입(Value Type). 복사될 때마다 새로운 인스턴스가 생성됩니다. SwiftUI 뷰를 만들 때 기본적으로 사용됩니다.
- `class`: 참조 타입(Reference Type). 여러 변수가 하나의 인스턴스를 공유(참조)할 수 있습니다.

```swift
// 값 타입 구조체 (데이터 모델에 주로 사용)
struct User {
    let id: Int
    var name: String
}

// 참조 타입 클래스 (상태를 공유해야 할 때 사용)
class UserViewModel: ObservableObject {
    @Published var user = User(id: 1, name: "홍길동")
}

// 객체 생성
var user1 = User(id: 1, name: "이순신")
var user2 = user1 // user1의 값이 복사되어 새로운 user2가 생성됨
user2.name = "강감찬"

print(user1.name) // "이순신"
print(user2.name) // "강감찬"
```

### 6. 조건문 (if, guard, switch)
- `if`: 다른 언어와 유사하게 사용됩니다.
- `guard`: `if`문과 반대로, 특정 조건이 `true`가 아닐 경우 현재 스코프를 빠르게 종료시키는 데 사용됩니다. "빠른 탈출" 구문으로 가독성을 높입니다.
- `switch`: 코틀린의 `when`처럼 강력하며, 모든 경우(`case`)를 다루어야 합니다.

```swift
// guard 사용 예시
func printUserInfo(name: String?, age: Int?) {
    guard let userName = name, let userAge = age else {
        print("정보가 없습니다.")
        return // 스코프 종료
    }
    print("이름: \(userName), 나이: \(userAge)")
}

// switch 사용 예시
let fruit = "apple"
switch fruit {
case "apple":
    print("사과입니다.")
case "banana":
    print("바나나입니다.")
default:
    print("기타 과일입니다.")
}
```

### 7. 컬렉션과 반복문 (Collections and Loops)
`Array`, `Set`, `Dictionary`와 같은 컬렉션을 사용합니다. `for-in` 루프를 사용해 아이템을 순회합니다.

```swift
let fruits = ["사과", "바나나", "딸기"] // 변경 불가능한 배열 (let)

for fruit in fruits {
    print(fruit)
}

// 인덱스와 값을 함께 사용
for (index, fruit) in fruits.enumerated() {
    print("인덱스 \(index): \(fruit)")
}
```

### 8. 클로저 (Closures)
코틀린의 람다, JavaScript의 화살표 함수와 동일한 개념의 이름 없는 함수입니다.

```swift
// (Int, Int) -> Int 타입의 클로저를 변수에 할당
let multiply = { (a: Int, b: Int) -> Int in
    return a * b
}

let result = multiply(5, 10) // 50
print(result)

// 후행 클로저 (Trailing Closure)
// 함수의 마지막 인자가 클로저일 때, 소괄호 밖으로 뺄 수 있습니다.
// 이는 SwiftUI에서 UI를 구성할 때 매우 흔하게 사용됩니다.
fruits.forEach { fruit in
    print("\(fruit)!")
}
```
