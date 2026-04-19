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

  async createEmbeddings(inputs: string[]): Promise<number[][]> {
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: inputs,
    });

    // API는 index 순서를 보장하지 않으므로 정렬
    return response.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }
}
