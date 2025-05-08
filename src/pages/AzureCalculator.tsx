import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import CostSlider from "../components/CostSlider";
import CostToggle from "../components/CostToggle";
import ResourceSelection from "../components/ResourceSelection";
import CostSummary from "../components/CostSummary";
import {
  virtualMachines,
  storageOptions,
  additionalServices,
} from "../data/azureData";

const AzureCalculator = () => {
  // State for calculator inputs
  const [selectedVM, setSelectedVM] = useState(virtualMachines[0].id);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0].id);
  const [vmCount, setVMCount] = useState(1);
  const [storageSize, setStorageSize] = useState(50);
  const [uptime, setUptime] = useState(100);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // State for calculated costs
  const [computeCost, setComputeCost] = useState(0);
  const [storageCost, setStorageCost] = useState(0);
  const [additionalCost, setAdditionalCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Handle toggle for additional services
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Calculate costs whenever inputs change
  useEffect(() => {
    // Get selected VM and storage details
    const vm = virtualMachines.find((vm) => vm.id === selectedVM)!;
    const storage = storageOptions.find((s) => s.id === selectedStorage)!;

    // Calculate compute cost: price per hour * number of VMs * hours in month * uptime percentage
    const hourlyVMCost = vm.pricePerUnit * vmCount;
    const hoursInMonth = 730; // Average hours in a month (365 * 24 / 12)
    const computeCostValue = hourlyVMCost * hoursInMonth * (uptime / 100);

    // Calculate storage cost: price per GB * storage size
    const storageCostValue = storage.pricePerGB * storageSize;

    // Calculate additional services cost
    const servicesCostValue = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);

    // Update state with calculated values
    setComputeCost(computeCostValue);
    setStorageCost(storageCostValue);
    setAdditionalCost(servicesCostValue);
    setTotalCost(computeCostValue + storageCostValue + servicesCostValue);
  }, [
    selectedVM,
    selectedStorage,
    vmCount,
    storageSize,
    uptime,
    selectedServices,
  ]);

  return (
    <div className="azure-theme">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl font-bold">
          A
        </div>
        <h1 className="mb-2 text-3xl font-bold">Azure Cost Calculator</h1>
        <p className="text-gray-600">
          Estimate your Microsoft Azure development costs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Virtual Machines</h2>
            <ResourceSelection
              resources={virtualMachines}
              selectedResource={selectedVM}
              onSelect={setSelectedVM}
            />

            <CostSlider
              id="vmCount"
              label="Number of VMs"
              min={1}
              max={10}
              step={1}
              value={vmCount}
              onChange={setVMCount}
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
            <h2 className="mb-4 text-xl font-semibold">Storage</h2>

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
              { name: "Virtual Machines", cost: computeCost },
              { name: "Storage", cost: storageCost },
              { name: "Additional Services", cost: additionalCost },
            ]}
            total={totalCost}
          />

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Your Configuration</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">VM Type</h4>
                <p className="font-medium">
                  {virtualMachines.find((vm) => vm.id === selectedVM)?.name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">VM Count</h4>
                <p className="font-medium">{vmCount}</p>
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

export default AzureCalculator;
