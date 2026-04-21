import {Elysia} from "elysia"

//2. State (당하는 elysia 객채에서 공유하고 사용하며 변경 가능한 값 [store로 접근])
new Elysia()
    .state('count', 0)
    .get('/', ({ store }) => {
        store.count++
        return store.count
    })
