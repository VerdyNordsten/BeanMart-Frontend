import { useNavigate } from 'react-router-dom';

interface ProductBreadcrumbProps {
  productName: string;
}

export function ProductBreadcrumb({ productName }: ProductBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <button 
        onClick={() => navigate('/products')}
        className="hover:text-gray-900 transition-colors"
      >
        Products
      </button>
      <span>/</span>
      <span className="text-gray-900 font-medium">{productName}</span>
    </div>
  );
}
