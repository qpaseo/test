function buildFsChatSystemPrompt(latest: any | null): string {
  let prompt = `재무재표 생성 AI`;

  if (latest) {
    prompt += `\n이전 데이터 있음`;
  }

  return prompt;
}

export { buildFsChatSystemPrompt };
