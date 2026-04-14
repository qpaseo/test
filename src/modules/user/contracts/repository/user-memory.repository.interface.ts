import {
  UserMemoryContent,
  UserMemoryRow,
} from "../../types/entity/user-memory.entity";

export interface IUserMemoryRepository {
  createUserMemory(userId: string, content: UserMemoryContent): Promise<void>;
  getUserMemory(userId: string): Promise<UserMemoryRow | null>;
}
