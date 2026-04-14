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

export const buildContainer = () => {
  // =========================
  // infra / utils
  // =========================
  const openAIClient = new OpenAIClient();
  const passwordManager = new PasswordManager();
  const tokenManager = new TokenManager();

  // =========================
  // middleware
  // =========================
  const authMiddleware = new AuthMiddleware(tokenManager);

  // =========================
  // repositories
  // =========================
  const db = getDatabase();
  const userRepository = new UserRepository(db);
  const financialRepository = new FinancialRepository(db);
  const userMemoryRepository = new UserMemoryRepository(db);
  const toolHandler = new ChatToolHandler(db);
  const fsToolHandler = new FsChatToolHandler(db);
  const chatToolRepository = new ChatToolRepository(db);
  //chat
  const chatRoomRepository = new ChatRoomRepository(db);
  const chatMessageRepository = new ChatMessageRepository(db);
  const chatMemoryRepository = new ChatMemoryRepository(db);
  const financialChatMessageRepository = new FinancialChatMessageRepository(db);
  const financialChatRoomRepository = new FinancialChatRoomRepository(db);

  // =========================
  // services
  // =========================
  const financialService = new FinancialService(financialRepository);
  const userService = new UserService(userRepository, userMemoryRepository);
  const authService = new AuthService(
    userService,
    financialService,
    null, // financialChatRoomRepository (나중에 주입)
    passwordManager,
    tokenManager,
    userRepository,
  );
  const chatService = new ChatService(
    chatRoomRepository,
    chatMessageRepository,
    chatMemoryRepository,
    toolHandler,
    openAIClient,
  );
  const fsChatService = new FsChatService(
    financialChatMessageRepository,
    financialChatRoomRepository,
    chatToolRepository,
    fsToolHandler,
    openAIClient,
  );

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

  // =========================
  // routes
  // =========================
  const authRoutes = new AuthRoutes(authController).build();
  const userRoutes = new UserRoutes(userController, authMiddleware).build();

  return {
    authRoutes,
    userRoutes,
  };
};
