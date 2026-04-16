import { AuthController } from "../modules/auth/controllers/auth.controller";
import { AuthService } from "../modules/auth/services/auth.service";
import { AuthRoutes } from "../modules/auth/routes/auth.routes";

import { UserController } from "../modules/user/controllers/user.controller";
import { UserService } from "../modules/user/services/user.service";
import { UserRoutes } from "../modules/user/routes/user.routes";

import { FinancialService } from "../modules/financial/services/financial.service";
import { UserRepository } from "../modules/user/repositories/user.repository";
import { PasswordManager } from "../common/utils/password.util";
import { TokenManager } from "../common/utils/token.manager.util";
import { getDatabase } from "../config/db/db";
import { FinancialRepository } from "../modules/financial/repositories/financial.repository";
import { UserMemoryRepository } from "../modules/user/repositories/user-memory.repository";
import { AuthMiddleware } from "../common/middlewares/auth.middleware";
import { ChatService } from "../modules/chat/services/chat.service";
import { ChatRoomRepository } from "../modules/chat/repositories/chat.room.repository";
import { ChatMemoryRepository } from "../modules/chat/repositories/chat.memory.repository";
import { ChatToolHandler } from "../modules/chat/tools/chat.tools";
import { ChatToolRepository } from "../modules/chat/repositories/chat.tool.repository";
import { ChatMessageRepository } from "../modules/chat/repositories/chat.message.repository";
import { OpenAIClient } from "../infrastructure/ai/openai-client";
import { FsChatService } from "../modules/chat/services/financial.chat.service";
import { FinancialChatMessageRepository } from "../modules/chat/repositories/financial.chat.message.repository";
import { FsChatToolHandler } from "../modules/chat/tools/fs-chat.tools";
import { FinancialChatRoomRepository } from "../modules/chat/repositories/financial.chat.room.repository";
import { ConceptRoutes } from "../modules/concepts/routes/concept.route";
import { ConceptController } from "../modules/concepts/controllers/concept.controller";
import { ConceptService } from "../modules/concepts/services/concept.service";
import { ConceptRepository } from "../modules/concepts/repositories/concepts.repository";
import { ChatRoutes } from "../modules/chat/routes/chatRouter";
import { ChatController } from "../modules/chat/controllers/chat.controller";
import { UuidGenerator } from "../common/utils/uuid.generator.util";
import { FsChatRoutes } from "../modules/chat/routes/fschatrouter";
import { FsChatController } from "../modules/chat/controllers/financial.chat.controller";
import { ChatAiService } from "../modules/chat/services/chat.ai.service";
import { FinancialDraftRepository } from "../modules/chat/repositories/financial.draft.repository";
import { FsDraftService } from "../modules/chat/services/financial.draft.service";
import { RagService } from "../modules/rag/services/rag.service";
import { RagRepository } from "../modules/rag/repositories/rag.repository";

export const buildContainer = () => {
  // =========================
  // infra / utils
  // =========================
  const openAIClient = new OpenAIClient();
  const passwordManager = new PasswordManager();
  const tokenManager = new TokenManager();
  const uuidGenerator = new UuidGenerator();

  // =========================
  // middleware
  // =========================
  const authMiddleware = new AuthMiddleware(tokenManager);

  // =========================
  // repositories
  // =========================
  const db = getDatabase();
  const ragRepository = new RagRepository(db);
  const userRepository = new UserRepository(db);
  const financialRepository = new FinancialRepository(db);
  const userMemoryRepository = new UserMemoryRepository(db);
  const toolHandler = new ChatToolHandler(db);
  const chatToolRepository = new ChatToolRepository(db);
  //chat
  const chatRoomRepository = new ChatRoomRepository(db, uuidGenerator);
  const chatMessageRepository = new ChatMessageRepository(db);
  const chatMemoryRepository = new ChatMemoryRepository(db);
  const financialChatMessageRepository = new FinancialChatMessageRepository(db);
  const financialChatRoomRepository = new FinancialChatRoomRepository(db);
  const conceptRepository = new ConceptRepository(db);
  const financialDraftRepository = new FinancialDraftRepository(db);

  // =========================
  // services
  // =========================
  const aiService = new ChatAiService(openAIClient, toolHandler);
  const financialService = new FinancialService(financialRepository);
  const userService = new UserService(userRepository, userMemoryRepository);
  const authService = new AuthService(
    userService,
    financialService,
    financialChatRoomRepository,
    passwordManager,
    tokenManager,
    userRepository,
  );
  const chatService = new ChatService(
    chatRoomRepository,
    chatMessageRepository,
    chatMemoryRepository,
    aiService,
  );
  const ragService = new RagService(ragRepository, openAIClient);
  const fsToolHandler = new FsChatToolHandler(db, ragService);
  const fsChatService = new FsChatService(
    financialRepository,
    financialChatMessageRepository,
    financialChatRoomRepository,
    financialDraftRepository,
    chatToolRepository,
    fsToolHandler,
    openAIClient,
    uuidGenerator,
  );
  const fsDraftService = new FsDraftService(financialDraftRepository);
  const conceptService = new ConceptService(conceptRepository);

  // =========================
  // controllers
  // =========================
  const authController = new AuthController(authService, tokenManager);
  const userController = new UserController(
    userService,
    financialService,
    chatService,
    fsChatService,
  );
  const conceptController = new ConceptController(conceptService);
  const chatController = new ChatController(chatService);
  const fsChatController = new FsChatController(
    fsChatService,
    fsDraftService,
    uuidGenerator,
  );

  // =========================
  // routes
  // =========================
  const authRoutes = new AuthRoutes(authController).build();
  const userRoutes = new UserRoutes(userController, authMiddleware).build();
  const conceptRoutes = new ConceptRoutes(
    conceptController,
    authMiddleware,
  ).build();
  const chatRoutes = new ChatRoutes(chatController, authMiddleware).build();
  const fsChatRoutes = new FsChatRoutes(
    fsChatController,
    authMiddleware,
  ).build();

  return {
    authRoutes,
    userRoutes,
    conceptRoutes,
    chatRoutes,
    fsChatRoutes,
  };
};
