import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MenuRecommendationResultProps {
  result: string;
  onBack: () => void;
}

export default function MenuRecommendationResult({
  result,
  onBack,
}: MenuRecommendationResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">추천 식단</h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                복사
              </>
            )}
          </button>
        </div>

        <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-lg text-gray-800">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
