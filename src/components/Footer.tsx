import { Calculator } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2">
          <Calculator className="h-5 w-5 text-blue-500" />
          <span className="text-lg font-semibold">Estimated Development Cost</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;