import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center text-sm text-gray-500 mb-3">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={14} className="mx-1" />}
              {item.to ? (
                <Link to={item.to} className="hover:text-primary-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        </div>
        
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;