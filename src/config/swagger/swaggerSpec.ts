import { swaggerBase } from "./swaggerBase";
import { authPaths, authSchemas } from "../../../auth/swaggerAuthPaths";

// 다른 모듈 추가 예시
// import { userPaths, userSchemas } from "../../user/swaggerUserPaths";
// import { conceptPaths, conceptSchemas } from "../../concepts/swaggerConceptPaths";

export const swaggerSpec = {
  ...swaggerBase,
  // 기존 paths에 다른 모듈 paths 합치기
  paths: {
    ...swaggerBase.paths,
    ...authPaths, // Auth 컨트롤러
    // ...userPaths,         // User 모듈 추가 시
    // ...conceptPaths,      // Concept 모듈 추가 시
  },
  components: {
    ...swaggerBase.components,
    // 기존 schemas에 다른 모듈 schemas 합치기
    schemas: {
      ...swaggerBase.components.schemas,
      ...authSchemas, // Auth 컨트롤러
      // ...userSchemas,     // User 모듈 추가 시
      // ...conceptSchemas,  // Concept 모듈 추가 시
    },
  },
};
