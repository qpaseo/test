## 서버 통신 (Server Communication)
Swift/iOS 앱에서 서버와 통신할 때는 주로 애플이 기본으로 제공하는 **`URLSession`**을 사용합니다. 최신 Swift에서는 **`async/await`** 문법을 함께 사용하여 비동기 코드를 매우 간결하게 작성할 수 있습니다. 이는 코틀린의 코루틴이나 JavaScript의 `async/await`와 거의 동일한 경험을 제공합니다.

전체적인 흐름은 다음과 같습니다:
1.  **DTO 정의**: 서버 응답 JSON을 파싱하기 위해 `Codable` 프로토콜을 따르는 `struct`를 정의합니다. (코틀린의 `data class`, NestJS의 DTO와 동일한 역할)
2.  **API 서비스 로직 작성**: `async/await`를 사용하여 `URLSession`으로 데이터를 요청하고 디코딩하는 비동기 함수를 만듭니다.
3.  **API 호출**: SwiftUI View 또는 ViewModel에서 이 비동기 함수를 호출하여 결과를 처리합니다.

### 예시: 사용자 목록 가져오기

#### 1. DTO (Data Transfer Object)
서버가 `[{"id": 1, "name": "홍길동"}, ...]` 형태의 JSON 배열을 반환한다고 가정합니다. `Codable`은 JSON과 Swift 객체 간의 변환을 자동으로 처리해 줍니다.

```swift
// User.swift
struct User: Codable, Identifiable {
    let id: Int
    let name: String
    let email: String
}
```
- `Codable`: `Encodable`과 `Decodable`을 합친 것으로, JSON 인코딩/디코딩을 모두 지원합니다.
- `Identifiable`: SwiftUI 리스트에서 각 항목을 고유하게 식별하기 위해 필요한 프로토콜입니다.

#### 2. API 서비스 클래스
네트워크 요청을 담당하는 독립된 클래스나 구조체를 만드는 것이 일반적입니다.

```swift
// ApiService.swift
import Foundation

class ApiService {
    private let baseUrl = "https://api.example.com"

    func fetchUsers() async throws -> [User] {
        // 1. URL 생성
        guard let url = URL(string: "\(baseUrl)/users") else {
            throw URLError(.badURL)
        }

        // 2. 데이터 요청 (async/await)
        // urlSession.data(for:)는 (Data, URLResponse) 튜플을 비동기적으로 반환합니다.
        let (data, _) = try await URLSession.shared.data(from: url)

        // 3. JSON 디코딩
        let users = try JSONDecoder().decode([User].self, from: data)
        
        return users
    }
}
```
- `async`: 이 함수가 비동기 함수임을 나타냅니다.
- `throws`: 이 함수가 오류를 발생시킬 수 있음을 나타냅니다.
- `await`: 비동기 함수가 완료될 때까지 기다립니다.

#### 3. API 호출 (ViewModel에서)
UI의 상태를 관리하는 `ViewModel`에서 API를 호출하고, `@Published` 프로퍼티를 업데이트하여 UI를 변경합니다.

```swift
// UserViewModel.swift
import Foundation

@MainActor // UI 업데이트는 메인 스레드에서 수행되어야 함을 보장
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var errorMessage: String?

    private let apiService = ApiService()

    func loadUsers() {
        Task { // 비동기 작업을 수행하기 위한 Task 블록
            do {
                self.users = try await apiService.fetchUsers()
            } catch {
                self.errorMessage = error.localizedDescription
                print(error)
            }
        }
    }
}
```
- `@MainActor`: 클래스나 함수를 메인 스레드에서 실행하도록 지정하는 어노테이션입니다.
- `ObservableObject`: SwiftUI View가 관찰할 수 있는 객체임을 나타냅니다.
- `@Published`: 이 프로퍼티가 변경될 때마다 View에 업데이트를 알립니다.
- `Task`: 동기 코드에서 비동기 함수를 호출할 때 사용하는 브릿지 역할을 합니다.

이처럼 Swift의 `URLSession`과 `async/await`는 외부 라이브러리 없이도 타입-세이프하고 모던한 방식으로 네트워크 통신을 구현할 수 있게 해줍니다.
