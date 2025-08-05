## 문법 (기능)
이 섹션에서는 코틀린의 핵심 문법과 기능을 다룹니다.

### 1. 변수 선언 (Variable Declaration)
JavaScript의 `const`, `let`과 유사한 개념이 있습니다.

- `val` (value): 한 번 할당되면 변경할 수 없는 읽기 전용 변수입니다. (JavaScript의 `const`와 유사)
  ```kotlin
  val name: String = "홍길동"
  // name = "김철수" // 컴파일 오류 발생
  ```

- `var` (variable): 재할당이 가능한 변수입니다. (JavaScript의 `let`과 유사)
  ```kotlin
  var age: Int = 20
  age = 21 // 가능
  ```

### 2. 함수 선언 (Function Declaration)
`fun` 키워드를 사용하여 함수를 정의합니다.

```kotlin
// 기본 형태
fun sum(a: Int, b: Int): Int {
    return a + b
}

// 표현식 스타일 (return 생략 가능)
fun sumSimple(a: Int, b: Int) = a + b
```

### 3. 문자열 템플릿 (String Templates)
JavaScript의 템플릿 리터럴(`` `${}` ``)과 매우 유사합니다. `$` 기호를 사용하여 변수를 문자열에 삽입할 수 있습니다.

```kotlin
val user = "이순신"
val message = "안녕하세요, $user 님!" // "안녕하세요, 이순신 님!"
println(message)

// 표현식을 사용하려면 {}로 감쌉니다.
val a = 10
val b = 20
println("$a + $b = ${a + b}") // "10 + 20 = 30"
```

### 4. Null 안전성 (Null Safety)
코틀린의 가장 큰 특징 중 하나로, `null`로 인한 오류(NPE: NullPointerException)를 컴파일 시점에 방지합니다.

- **Nullable 타입 (`?`)**: 변수가 `null` 값을 가질 수 있음을 명시적으로 선언해야 합니다.
  ```kotlin
  var nullableName: String? = "개발자"
  nullableName = null // 가능

  var nonNullName: String = "개발자"
  // nonNullName = null // 컴파일 오류 발생
  ```

- **안전한 호출 (`?.`)**: `null`이 아닐 경우에만 메서드나 프로퍼티에 접근합니다. `null`이면 `null`을 반환합니다.
  ```kotlin
  val length = nullableName?.length
  println(length) // nullableName이 null이면 null 출력
  ```

### 5. 클래스와 데이터 클래스 (Classes and Data Classes)
코틀린의 클래스는 `class` 키워드로 선언합니다. `data` 클래스는 데이터를 다루는 데 특화된 보일러플레이트 코드를 자동으로 생성해 줍니다.

```kotlin
// 일반 클래스
class Person(val name: String, var age: Int)

// 데이터 클래스 (equals(), hashCode(), toString(), copy() 등 자동 생성)
data class User(val id: Long, val name: String, val email: String)

// 객체 생성 (new 키워드 없음)
val person = Person("홍길동", 30)
val user = User(1, "이순신", "lee@example.com")
```

### 6. 조건문 (when)
Java의 `switch` 문보다 훨씬 강력하고 유연합니다. `if`문처럼 표현식으로 사용해 결과를 반환할 수 있습니다.

```kotlin
val score = 85

val grade = when (score) {
    in 90..100 -> "A"
    in 80..89 -> "B"
    in 70..79 -> "C"
    else -> "F"
}

println("성적: $grade") // "성적: B"
```

### 7. 컬렉션과 반복문 (Collections and Loops)
`List`, `Set`, `Map`과 같은 컬렉션을 쉽게 만들 수 있습니다. `for-in` 루프를 사용해 컬렉션의 아이템을 순회합니다.

- **읽기 전용 컬렉션**: `listOf`, `setOf`, `mapOf`
- **변경 가능 컬렉션**: `mutableListOf`, `mutableSetOf`, `mutableMapOf`

```kotlin
val fruits = listOf("사과", "바나나", "딸기") // 읽기 전용 리스트

for (fruit in fruits) {
    println(fruit)
}

// 인덱스와 값을 함께 사용
for ((index, fruit) in fruits.withIndex()) {
    println("인덱스 $index: $fruit")
}
```

### 8. 람다 표현식 (Lambda Expressions)
이름 없는 함수로, 다른 함수의 인자로 전달하거나 변수에 할당할 수 있습니다. JavaScript의 화살표 함수(`=>`)와 유사합니다.

```kotlin
// (Int, Int) -> Int 타입의 람다를 변수에 할당
val multiply = { a: Int, b: Int -> a * b }

val result = multiply(5, 10) // 50
println(result)

// 컬렉션 함수와 함께 사용될 때 매우 유용합니다.
fruits.filter { it.startsWith("사") }
      .map { "$it!" }
      .forEach { println(it) } // "사과!" 출력
```
