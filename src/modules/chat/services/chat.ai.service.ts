import OpenAI from "openai";
import { Response } from "express";
import { IOpenAIClient } from "../../../infrastructure/ai/contracts/openai-client";
import { IChatAIService } from "../contracts/services/chat.ai.service";
import { CHAT_TOOLS, ChatToolHandler } from "../tools/chat.tools";

export class ChatAiService implements IChatAIService {
  constructor(
    private readonly openaiClient: IOpenAIClient,
    private readonly toolHandler: ChatToolHandler,
  ) {}

  async runToolLoop(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    res: Response,
    roomId: string,
    userId: string,
  ): Promise<string> {
    let final = "";

    while (true) {
      const response = await this.openaiClient.createChatCompletion({
        messages,
        tools: CHAT_TOOLS,
        tool_choice: "auto",
      });

      const choice = response.choices[0];

      if (choice.finish_reason === "tool_calls") {
        messages.push(choice.message);

        for (const call of choice.message.tool_calls ?? []) {
          if (call.type !== "function") continue;

          const args = JSON.parse(call.function.arguments);

          // chat_room_id, user_id는 AI가 모르므로 서버에서 주입
          if ("chat_room_id" in args) args.chat_room_id = roomId;
          if ("user_id" in args) args.user_id = userId;

          const result = await this.toolHandler.handle(
            call.function.name,
            args,
          );

          messages.push({
            role: "tool",
            tool_call_id: call.id,
            content: result,
          });
        }
        continue;
      }

      const stream = await this.openaiClient.createChatStream(messages);

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content ?? "";

        if (delta) {
          final += delta;
          res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`);
        }
      }
      break;
    }

    return final;
  }

  async generateRoomMeta(
    firstMessage: string,
  ): Promise<{ name: string; description: string }> {
    const response = await this.openaiClient.createChatCompletion({
      messages: [
        {
          role: "system",
          content: `사용자의 첫 메시지를 보고 채팅방의 이름과 설명을 JSON으로 생성해줘.
반드시 아래 형식으로만 응답해:
{"name": "채팅방 이름 (20자 이내)", "description": "채팅방 설명 (50자 이내)"}`,
        },
        { role: "user", content: firstMessage },
      ],
    });

    try {
      const text = response.choices[0].message.content ?? "{}";
      const parsed = JSON.parse(text);
      return {
        name: parsed.name ?? firstMessage.slice(0, 20),
        description: parsed.description ?? "",
      };
    } catch {
      return { name: firstMessage.slice(0, 20), description: "" };
    }
  }
}
