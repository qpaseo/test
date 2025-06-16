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
          <span className="text-base font-medium">
            Estimated Monthly Cost (USD)
          </span>
          <span className="text-xl font-semibold text-blue-600">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-medium">
            Estimated Monthly Cost (KRW)
          </span>
          <span className="text-xl font-semibold text-blue-600">
            ₩{(total * 1300).toLocaleString()}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        * Prices are estimates and may vary based on actual usage and current
        pricing.
      </p>
    </div>
  );
};

export default CostSummary;
