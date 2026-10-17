import React from 'react';
import { Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

interface BlankCatalogPageProps {
  pageNumber?: number;
  lang?: Language;
}

export const BlankCatalogPage: React.FC<BlankCatalogPageProps> = ({ pageNumber }) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none">
      {/* Top Header Folio (Subtle quiet logo) */}
      <div className="w-full">
        <div className="flex justify-between items-center pb-2">
          <BirimLogo variant="black" className="h-6 w-auto object-contain opacity-25" />
        </div>
      </div>

      {/* Pristine Architectural Negative Space */}
      <div className="flex-1 my-auto flex items-center justify-center">
        {/* Intentionally blank editorial spread */}
      </div>

      {/* Footer Pagination */}
      <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-300 pt-3">
        <span className="lowercase">www.birim.com</span>
        {pageNumber !== undefined && (
          <span className="font-mono text-neutral-400">{String(pageNumber).padStart(2, '0')}</span>
        )}
      </div>
    </div>
  );
};
