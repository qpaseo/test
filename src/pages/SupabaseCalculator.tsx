import { useState, useEffect } from "react";
import { Flame, Zap } from "lucide-react";
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
    const plan = supabasePlans.find((p) => p.id === selectedPlan)!;
    const storage = supabaseStorageOptions.find(
      (s) => s.id === selectedStorage
    )!;

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
  }, [selectedPlan, selectedStorage, storageSize, selectedFeatures]);

  return (
    <div className="supabase-theme">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Zap className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Supabase Cost Calculator</h1>
        <p className="text-gray-600">
          Estimate your Supabase project costs based on usage
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Plan</h2>
            <ResourceSelection
              resources={supabasePlans}
              selectedResource={selectedPlan}
              onSelect={setSelectedPlan}
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Storage</h2>

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
              { name: "Plan", cost: planCost },
              { name: "Storage", cost: storageCost },
              { name: "Optional Features", cost: featureCost },
            ]}
            total={totalCost}
          />
        </div>
      </div>
    </div>
  );
};

export default SupabaseCalculator;
