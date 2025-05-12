import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import CostSlider from "../components/CostSlider";
import CostToggle from "../components/CostToggle";
import ResourceSelection from "../components/ResourceSelection";
import CostSummary from "../components/CostSummary";
import { instances, storageOptions, additionalServices } from "../data/awsData";

const AwsCalculator = () => {
  const [selectedInstance, setSelectedInstance] = useState(instances[0].id);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0].id);
  const [instanceCount, setInstanceCount] = useState(1);
  const [storageSize, setStorageSize] = useState(50);
  const [uptime, setUptime] = useState(100);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [computeCost, setComputeCost] = useState(0);
  const [storageCost, setStorageCost] = useState(0);
  const [additionalCost, setAdditionalCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalCostKRW, setTotalCostKRW] = useState(0);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  useEffect(() => {
    const instance = instances.find((i) => i.id === selectedInstance)!;
    const storage = storageOptions.find((s) => s.id === selectedStorage)!;

    const hourlyInstanceCost = instance.pricePerUnit * instanceCount;
    const hoursInMonth = 730;
    const computeCostValue = hourlyInstanceCost * hoursInMonth * (uptime / 100);

    const storageCostValue = storage.pricePerGB * storageSize;

    const servicesCostValue = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);

    setComputeCost(computeCostValue);
    setStorageCost(storageCostValue);
    setAdditionalCost(servicesCostValue);
    setTotalCost(computeCostValue + storageCostValue + servicesCostValue);

    const exchangeRate = 1300;
    const totalCostKRW =
      (computeCostValue + storageCostValue + servicesCostValue) * exchangeRate;
    setTotalCostKRW(totalCostKRW);
  }, [
    selectedInstance,
    selectedStorage,
    instanceCount,
    storageSize,
    uptime,
    selectedServices,
  ]);

  return (
    <div className="aws-theme">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Cloud className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">AWS Cost Calculator</h1>
        <p className="text-gray-600">
          Estimate your Amazon Web Services development costs{" "}
          <a className="underline" href="https://docs.aws.amazon.com/">
            (Document)
          </a>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-4 text-xl font-semibold">EC2 Compute</h2>
            <ResourceSelection
              resources={instances}
              selectedResource={selectedInstance}
              onSelect={setSelectedInstance}
            />

            <CostSlider
              id="instanceCount"
              label="Number of Instances"
              min={1}
              max={10}
              step={1}
              value={instanceCount}
              onChange={setInstanceCount}
            />

            <CostSlider
              id="uptime"
              label="Uptime Percentage"
              min={10}
              max={100}
              step={5}
              value={uptime}
              onChange={setUptime}
              unit="%"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">EBS Storage</h2>

            <CostSlider
              id="storageSize"
              label="Storage Size"
              min={10}
              max={1000}
              step={10}
              value={storageSize}
              onChange={setStorageSize}
              unit=" GB"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Additional Services</h2>
            {additionalServices.map((service) => (
              <CostToggle
                key={service.id}
                id={service.id}
                label={service.name}
                description={service.description}
                isChecked={selectedServices.includes(service.id)}
                onChange={() => toggleService(service.id)}
                price={service.price}
              />
            ))}
          </div>
        </div>

        <div>
          <CostSummary
            items={[
              { name: "EC2 Compute", cost: computeCost },
              { name: "EBS Storage", cost: storageCost },
              { name: "Additional Services", cost: additionalCost },
            ]}
            total={totalCost}
          />

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Your Configuration</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Instance Type
                </h4>
                <p className="font-medium">
                  {instances.find((i) => i.id === selectedInstance)?.name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Instance Count
                </h4>
                <p className="font-medium">{instanceCount}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Uptime</h4>
                <p className="font-medium">{uptime}%</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Storage Type
                </h4>
                <p className="font-medium">
                  {storageOptions.find((s) => s.id === selectedStorage)?.name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Storage Size
                </h4>
                <p className="font-medium">{storageSize} GB</p>
              </div>

              {selectedServices.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Additional Services
                  </h4>
                  <ul className="list-inside list-disc">
                    {selectedServices.map((serviceId) => (
                      <li key={serviceId} className="font-medium">
                        {
                          additionalServices.find((s) => s.id === serviceId)
                            ?.name
                        }
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

export default AwsCalculator;
