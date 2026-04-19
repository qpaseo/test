import OpenAI from "openai";

export interface IOpenAIClient {
  createChatCompletion(params: {
    messages: OpenAI.Chat.ChatCompletionMessageParam[];
    tools?: any;
    tool_choice?: "auto" | "none";
  }): Promise<OpenAI.Chat.ChatCompletion>;

  createChatStream(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
  ): Promise<AsyncIterable<OpenAI.Chat.ChatCompletionChunk>>;

  createEmbeddings(inputs: string[]): Promise<number[][]>;
}
