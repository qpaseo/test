import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import CostSlider from "../components/CostSlider";
import CostToggle from "../components/CostToggle";
import ResourceSelection from "../components/ResourceSelection";
import CostSummary from "../components/CostSummary";
import {
  firebasePlans,
  firebaseStorageOptions,
  firebaseFeatures,
} from "../data/firebaseData";

const FirebaseCalculator = () => {
  const [selectedPlan, setSelectedPlan] = useState(firebasePlans[0].id);
  const [selectedStorage, setSelectedStorage] = useState(
    firebaseStorageOptions[0].id
  );
  const [storageSize, setStorageSize] = useState(5); // GB
  const [activeUsers, setActiveUsers] = useState(1000);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [planCost, setPlanCost] = useState(0);
  const [storageCost, setStorageCost] = useState(0);
  const [featureCost, setFeatureCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  useEffect(() => {
    const plan = firebasePlans.find((p) => p.id === selectedPlan)!;
    const storage = firebaseStorageOptions.find(
      (s) => s.id === selectedStorage
    )!;

    const planCostValue = plan.pricePerUnit;
    const storageCostValue = storage.pricePerGB * storageSize;
    const featuresCostValue = selectedFeatures.reduce((total, featureId) => {
      const feature = firebaseFeatures.find((f) => f.id === featureId);
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
    selectedFeatures,
    activeUsers,
  ]); // Added activeUsers to dependencies

  return (
    <div className="firebase-theme">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Flame className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Firebase Cost Calculator</h1>
        <p className="text-gray-600">
          Estimate your Firebase development costs based on usage{" "}
          <a className="underline" href="https://firebase.google.com/">
            (Document)
          </a>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-4 text-xl font-semibold">플랜</h2>
            <ResourceSelection
              resources={firebasePlans}
              selectedResource={selectedPlan}
              onSelect={setSelectedPlan}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Storage</h2>
            <ResourceSelection // Added ResourceSelection for Storage Type
              resources={firebaseStorageOptions}
              selectedResource={selectedStorage}
              onSelect={setSelectedStorage}
            />
            <CostSlider
              id="storageSize"
              label="Storage Size"
              min={1}
              max={100}
              step={1}
              value={storageSize}
              onChange={setStorageSize}
              unit=" GB"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Monthly Active Users</h2>
            <CostSlider
              id="activeUsers"
              label="Active Users"
              min={100}
              max={100000}
              step={100}
              value={activeUsers}
              onChange={setActiveUsers}
              unit=" users"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Optional Features</h2>
            {firebaseFeatures.map((feature) => (
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

          {/* Configuration Summary Section - Adapted for Firebase */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">선택한 구성</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  선택된 플랜
                </h4>
                <p className="font-medium">
                  {firebasePlans.find((p) => p.id === selectedPlan)?.name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  저장소 타입
                </h4>
                <p className="font-medium">
                  {
                    firebaseStorageOptions.find((s) => s.id === selectedStorage)
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
                <p className="font-medium">{activeUsers} users</p>
              </div>

              {selectedFeatures.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Optional Features
                  </h4>
                  <ul className="list-inside list-disc">
                    {selectedFeatures.map((featureId) => (
                      <li key={featureId} className="font-medium">
                        {firebaseFeatures.find((f) => f.id === featureId)?.name}
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

export default FirebaseCalculator;
