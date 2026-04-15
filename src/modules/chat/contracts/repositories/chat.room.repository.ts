import {
  ChatRoomRow,
  ChatRoomWithLastMessage,
} from "../../types/entity/chat-room.entity";
import { CreateChatRoomInput, UpdateChatRoomInput } from "../../types/internal";

export interface IChatRoomRepository {
  findChatRoomsWithLastMessage(
    userId: string,
  ): Promise<ChatRoomWithLastMessage[]>;

  findRoomsByUserId(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ rows: ChatRoomRow[]; total: number }>;

  findRoomById(roomId: string): Promise<ChatRoomRow | null>;

  createRoom(input: CreateChatRoomInput): Promise<string>;

  updateRoom(roomId: string, input: UpdateChatRoomInput): Promise<void>;

  deleteRoom(roomId: string): Promise<void>;

  incrementMemoryCount(roomId: string): Promise<void>;
}
