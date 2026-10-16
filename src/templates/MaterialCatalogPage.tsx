import React from 'react';
import { Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

interface MaterialItem {
  code: string;
  name: string;
  category: string;
  imageUrl?: string;
  colorHex?: string;
}

interface MaterialCatalogPageProps {
  categoryTitle: string;
  pageNumber: number;
  materials?: MaterialItem[];
  lang?: Language;
}

export const MaterialCatalogPage: React.FC<MaterialCatalogPageProps> = ({
  categoryTitle,
  pageNumber,
  materials = [
    { code: 'LT-01', name: 'Nubuk Vizon', category: 'Deri / Leather' },
    { code: 'LT-04', name: 'Antrasit Yarı Anilin', category: 'Deri / Leather' },
    { code: 'FB-12', name: 'Bouclé Krem', category: 'Kumaş / Fabric' },
    { code: 'FB-18', name: 'Keten Dokuma Kül', category: 'Kumaş / Fabric' },
    { code: 'WD-02', name: 'Doğal Masif Meşe', category: 'Ahşap / Wood' },
    { code: 'WD-07', name: 'Füme Ceviz', category: 'Ahşap / Wood' },
    { code: 'MT-01', name: 'Fırçalanmış Paslanmaz Çelik', category: 'Metal' },
    { code: 'MT-05', name: 'Bronz Eloksal', category: 'Metal' },
  ],
  lang = 'tr'
}) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center hairline-b pb-3">
        <div className="flex items-center space-x-4">
          <BirimLogo variant="black" className="h-4 w-auto object-contain" />
          <span className="text-[11px] tracking-[0.2em] uppercase font-light text-neutral-900 border-l border-neutral-300 pl-3">
            {categoryTitle} — MALZEME & KARTELA DİZİNİ
          </span>
        </div>
        <span className="text-[8.5px] font-mono text-neutral-400">
          SWATCH MATRIX
        </span>
      </div>

      {/* Swatch Grid (4x2 clean architectural tiles) */}
      <div className="grid grid-cols-4 gap-6 my-auto">
        {materials.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="aspect-square bg-neutral-100 border border-neutral-200 overflow-hidden relative shadow-sm flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div 
                  className="w-full h-full" 
                  style={{ backgroundColor: item.colorHex || '#D6D6D2' }}
                />
              )}
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[7px] font-mono px-1 py-0.5">
                {item.code}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-medium text-neutral-900 leading-tight">
                {item.name}
              </p>
              <p className="text-[7.5px] tracking-wider text-neutral-400 uppercase">
                {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center hairline-t pt-3 text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
        <span>{lang === 'en' ? 'SWATCHES ARCHIVE' : 'BİRİM KARTELA ARŞİVİ'}</span>
        <span className="font-mono">{String(pageNumber).padStart(3, '0')}</span>
      </div>
    </div>
  );
};
