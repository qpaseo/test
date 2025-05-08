interface Resource {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
}

interface ResourceSelectionProps {
  resources: Resource[];
  selectedResource: string;
  onSelect: (id: string) => void;
}

const ResourceSelection = ({
  resources,
  selectedResource,
  onSelect,
}: ResourceSelectionProps) => {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Select Resource Type
      </label>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className={`cursor-pointer rounded-lg border p-4 transition-all ${
              selectedResource === resource.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
            onClick={() => onSelect(resource.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{resource.name}</h3>
              <div className="text-sm font-semibold text-blue-600">
                ${resource.pricePerUnit}/hr
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {resource.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceSelection;