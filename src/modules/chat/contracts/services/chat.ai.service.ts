import OpenAI from "openai";
import { Response } from "express";

export interface IChatAIService {
  runToolLoop(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    res: Response,
    roomId: string,
    userId: string,
  ): Promise<string>;

  generateRoomMeta(
    firstMessage: string,
  ): Promise<{ name: string; description: string }>;
}
