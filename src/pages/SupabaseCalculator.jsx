import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import CostSlider from "../components/CostSlider";
import CostToggle from "../components/CostToggle";
import ResourceSelection from "../components/ResourceSelection";
import CostSummary from "../components/CostSummary";
import {
  supabasePlans,
  supabaseStorageOptions,
  supabaseFeatures,
} from "../data/supabaseData";

const SupabaseCalculator = () => {
  const [selectedPlan, setSelectedPlan] = useState(supabasePlans[0].id);
  const [selectedStorage, setSelectedStorage] = useState(
    supabaseStorageOptions[0].id
  );
  const [storageSize, setStorageSize] = useState(5);
  const [activeUsers, setActiveUsers] = useState(1000);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const [planCost, setPlanCost] = useState(0);
  const [storageCost, setStorageCost] = useState(0);
  const [featureCost, setFeatureCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  useEffect(() => {
    const plan = supabasePlans.find((p) => p.id === selectedPlan);
    const storage = supabaseStorageOptions.find(
      (s) => s.id === selectedStorage
    );

    const planCostValue = plan.pricePerUnit;
    const storageCostValue = storage.pricePerGB * storageSize;
    const featuresCostValue = selectedFeatures.reduce((total, featureId) => {
      const feature = supabaseFeatures.find((f) => f.id === featureId);
      return total + (feature ? feature.price : 0);
    }, 0);

    setPlanCost(planCostValue);
    setStorageCost(storageCostValue);
    setFeatureCost(featuresCostValue);
    setTotalCost(planCostValue + storageCostValue + featuresCostValue);
  }, [
    selectedPlan,
    selectedStorage,
    storageSize,
    activeUsers,
    selectedFeatures,
  ]);

  return (
    <div className="supabase-theme">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Zap className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Supabase 비용 계산기</h1>
        <p className="text-gray-600">
          Supabase의 개발 비용을 확인하여 보세요{" "}
          <a className="underline" href="https://supabase.com/">
            (서비스 문서)
          </a>
          <a className="underline" href="https://supabase.com/pricing">
            (비용 문서)
          </a>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-4 text-xl font-semibold">플랜</h2>
            <ResourceSelection
              resources={supabasePlans}
              selectedResource={selectedPlan}
              onSelect={setSelectedPlan}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">저장소</h2>
            <ResourceSelection
              resources={supabaseStorageOptions}
              selectedResource={selectedStorage}
              onSelect={setSelectedStorage}
            />
            <CostSlider
              id="storageSize"
              label="저장소 크기"
              min={1}
              max={100}
              step={1}
              value={storageSize}
              onChange={setStorageSize}
              unit=" GB"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">월간 활성 사용자</h2>
            <CostSlider
              id="activeUsers"
              label="활성 사용자"
              min={100}
              max={100000}
              step={100}
              value={activeUsers}
              onChange={setActiveUsers}
              unit=" users"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">추가 기능</h2>
            {supabaseFeatures.map((feature) => (
              <CostToggle
                key={feature.id}
                id={feature.id}
                label={feature.name}
                description={feature.description}
                isChecked={selectedFeatures.includes(feature.id)}
                onChange={() => toggleFeature(feature.id)}
                price={feature.price}
              />
            ))}
          </div>
        </div>

        <div>
          <CostSummary
            items={[
              { name: "플랜", cost: planCost },
              { name: "저장소", cost: storageCost },
              { name: "추가 서비스", cost: featureCost },
            ]}
            total={totalCost}
          />

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">선택한 구성</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  선택된 플랜
                </h4>
                <p className="font-medium">
                  {supabasePlans.find((p) => p.id === selectedPlan)?.name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  저장소 타입
                </h4>
                <p className="font-medium">
                  {
                    supabaseStorageOptions.find((s) => s.id === selectedStorage)
                      ?.name
                  }
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  저장소 크기
                </h4>
                <p className="font-medium">{storageSize} GB</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  월간 활성 사용자
                </h4>
                <p className="font-medium">{activeUsers} 명</p>
              </div>

              {selectedFeatures.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    추가 기능
                  </h4>
                  <ul className="list-inside list-disc">
                    {selectedFeatures.map((featureId) => (
                      <li key={featureId} className="font-medium">
                        {supabaseFeatures.find((f) => f.id === featureId)?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseCalculator;
