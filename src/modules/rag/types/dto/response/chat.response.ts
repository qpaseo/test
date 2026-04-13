//답변과 함께 근거가 된 청크 출처도 반환. 디버깅 및 신뢰도에 유용하기에 같이 반환함

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export interface ChatSource {
  chunkIndex: number;
  pageNumber: number;
  content: string;
}
