import { swaggerBase } from "./swaggerBase";
import { authPaths, authSchemas } from "../../modules/auth/swaggerAuthPaths";
import { userPaths, userSchemas } from "../../modules/user/swaggerUserPaths";
import {
  conceptPaths,
  conceptSchemas,
} from "../../modules/concepts/swaggerConceptsPaths";
import { chatPaths, chatSchemas } from "../../modules/chat/swaggerChatPaths";
import {
  fsChatPaths,
  fsChatSchemas,
} from "../../modules/chat/swaggerFsChatPaths";

// 다른 모듈 추가 예시
// import { userPaths, userSchemas } from "../../user/swaggerUserPaths";
// import { conceptPaths, conceptSchemas } from "../../concepts/swaggerConceptPaths";

export const swaggerSpec = {
  ...swaggerBase,
  // 기존 paths에 다른 모듈 paths 합치기
  paths: {
    ...swaggerBase.paths,
    ...authPaths,
    ...userPaths,
    ...conceptPaths,
    ...chatPaths,
    ...fsChatPaths,
    // ...userPaths,         // User 모듈 추가 시
    // ...conceptPaths,      // Concept 모듈 추가 시
  },
  components: {
    ...swaggerBase.components,
    // 기존 schemas에 다른 모듈 schemas 합치기
    schemas: {
      ...swaggerBase.components.schemas,
      ...authSchemas,
      ...userSchemas,
      ...conceptSchemas,
      ...chatSchemas,
      ...fsChatSchemas,
      // ...userSchemas,     // User 모듈 추가 시
      // ...conceptSchemas,  // Concept 모듈 추가 시
    },
  },
};
