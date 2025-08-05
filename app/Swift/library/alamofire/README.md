# Alamofire

- **카테고리**: 네트워킹 (Networking)
- **설명**: Alamofire는 Swift로 작성된 우아한 HTTP 네트워킹 라이브러리입니다. Apple의 `URLSession`을 기반으로 하지만, 더 간결하고 읽기 쉬운 API를 제공하여 네트워크 요청, 응답 처리, 파라미터 인코딩, 인증 등 일반적인 네트워킹 작업을 매우 쉽게 만들어줍니다. Swift 네트워킹 생태계에서 가장 널리 사용되는 라이브러리 중 하나입니다.

## 핵심 특징

- **체인 가능한(Chainable) 요청/응답 메서드**: 요청을 만들고 응답을 처리하는 과정을 메서드 체인으로 깔끔하게 표현할 수 있습니다.
- **자동 응답 직렬화**: JSON, Data, String 등 다양한 형식의 응답을 자동으로 파싱하고 직렬화해줍니다. `Codable` 프로토콜과 완벽하게 통합됩니다.
- **파라미터 인코딩**: URL 쿼리 스트링, JSON 본문 등 다양한 방식의 파라미터 인코딩을 지원합니다.
- **인증 처리**: `Authenticator`를 통해 401 Unauthorized와 같은 응답을 받았을 때 토큰을 갱신하고 원래 요청을 재시도하는 로직을 쉽게 구현할 수 있습니다.
- **파일 업로드/다운로드**: 멀티파트(multipart) 폼 데이터 업로드 및 파일 다운로드를 위한 편리한 API를 제공합니다.
- **Combine 및 `async/await` 지원**: 최신 Swift Concurrency 모델과 완벽하게 호환됩니다.

## 기본 사용법 (`async/await`)

1.  **데이터 요청 및 `Codable` 파싱**: `AF.request`로 요청을 만들고, `await`와 `serializingDecodable`을 사용하여 `Codable` 타입으로 바로 디코딩할 수 있습니다.

    ```swift
    import Alamofire

    // 응답을 파싱할 Codable 모델
    struct Post: Codable {
        let id: Int
        let title: String
        let body: String
    }

    func fetchPost(id: Int) async {
        let url = "https://jsonplaceholder.typicode.com/posts/\(id)"

        do {
            // 요청을 보내고 응답을 Post 타입으로 디코딩
            let post = try await AF.request(url)
                                   .serializingDecodable(Post.self)
                                   .value

            print("Fetched Post: \(post.title)")
        } catch {
            print("Error fetching post: \(error.localizedDescription)")
        }
    }
    ```

2.  **파라미터와 함께 요청 보내기**: `parameters` 인자와 `encoder`를 사용하여 요청에 파라미터를 추가할 수 있습니다.

    ```swift
    struct NewPost: Codable {
        let title: String
        let body: String
        let userId: Int
    }

    func createPost() async {
        let url = "https://jsonplaceholder.typicode.com/posts"
        let newPost = NewPost(title: "My New Post", body: "This is the content.", userId: 1)

        do {
            // newPost를 JSON으로 인코딩하여 요청 본문에 추가
            let createdPost = try await AF.request(url,
                                                   method: .post,
                                                   parameters: newPost,
                                                   encoder: JSONParameterEncoder.default)
                                          .serializingDecodable(Post.self)
                                          .value
            print("Created Post ID: \(createdPost.id)")
        } catch {
            print("Error creating post: \(error.localizedDescription)")
        }
    }
    ```
