import { UserMemory } from "../../../user/types/entity/user-memory.entity";
import { ChatMemory } from "../../types/entity/chat-memory.entity";

function buildChatSystemPrompt(
  latestMemory: ChatMemory | null,
  userMemory: UserMemory | null,
  memoryCount: number,
) {
  let prompt = `경제 AI\n메모리 수: ${memoryCount}\n`;

  if (latestMemory) {
    prompt += `\n${latestMemory.content}`;
  }

  if (userMemory) {
    prompt += `\n${userMemory.content.memory}\n중요 정보:\n${userMemory.content.important_information}`;
  }

  return prompt;
}

export { buildChatSystemPrompt };
