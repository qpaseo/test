import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  className?: string;
}

const CalculatorCard = ({
  title,
  description,
  icon,
  path,
  className,
}: CalculatorCardProps) => {
  return (
    <Link to={path} className={`card group ${className}`}>
      <div className="mb-4 flex items-center justify-center rounded-full bg-white p-3">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
        <span>Open Calculator</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
};

export default CalculatorCard;