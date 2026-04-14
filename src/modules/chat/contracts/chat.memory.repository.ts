import { ChatMemoryRow } from "../types/entity/chat-memory.entity";
import { CreateChatMemoryInput } from "../types/internal";

export interface IChatMemoryRepository {
  findMemoriesByRoomId(roomId: string): Promise<ChatMemoryRow[]>;
  findLatestMemory(roomId: string): Promise<ChatMemoryRow | null>;
  findMemoryById(memoryId: string): Promise<ChatMemoryRow | null>;
  createMemory(input: CreateChatMemoryInput): Promise<void>;
  deleteMemoriesByRoomId(roomId: string): Promise<void>;
}
