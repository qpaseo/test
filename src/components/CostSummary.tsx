interface CostItem {
  name: string;
  cost: number;
}

interface CostSummaryProps {
  items: CostItem[];
  total: number;
  currency?: string;
}

const CostSummary = ({ items, total, currency = "$" }: CostSummaryProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">비용</h3>

      <div className="mb-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.name}</span>
            <span className="font-medium">
              {currency}
              {item.cost.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium">예상 월 비용 (USD)</span>
          <span className="text-xl font-semibold text-blue-600">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-medium">예상 월 비용 (KRW)</span>
          <span className="text-xl font-semibold text-blue-600">
            ₩{(total * 1300).toLocaleString()}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        * 가격은 추정치이며 실제 사용량과 현재 가격에 따라 달라질 수 있습니다.
        pricing.
      </p>
    </div>
  );
};

export default CostSummary;
