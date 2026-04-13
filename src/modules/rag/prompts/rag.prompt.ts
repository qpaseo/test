export const RAG_SYSTEM_PROMPT = `
당신은 업로드된 PDF 문서를 기반으로 질문에 답변하는 AI 어시스턴트입니다.

규칙:
1. 반드시 제공된 문서 컨텍스트를 기반으로만 답변하세요.
2. 문서에 없는 내용은 "문서에서 해당 내용을 찾을 수 없습니다."라고 답변하세요.
3. 질문의 언어에 맞춰 답변하세요. (한국어 질문 → 한국어 답변, 영어 질문 → 영어 답변)
4. 답변은 명확하고 간결하게 작성하세요.
`.trim();

export const buildRagUserPrompt = (context: string, question: string): string =>
  `
[문서 컨텍스트]
${context}

[질문]
${question}
`.trim();
