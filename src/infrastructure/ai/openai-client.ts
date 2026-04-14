import OpenAI from "openai";
import { ENV } from "../../config/env";
import { IOpenAIClient } from "./contracts/openai-client";

export class OpenAIClient implements IOpenAIClient {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: ENV.OPENAI_API_KEY,
    });
  }

  async createChatCompletion(params: {
    messages: OpenAI.Chat.ChatCompletionMessageParam[];
    tools?: any;
    tool_choice?: "auto" | "none";
  }) {
    return this.client.chat.completions.create({
      model: "gpt-4o",
      ...params,
    });
  }

  async createChatStream(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
  ): Promise<AsyncIterable<OpenAI.Chat.ChatCompletionChunk>> {
    const stream = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
    });

    return stream;
  }
}
