import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';

interface LookbookGalleryProps {
  products: CatalogProduct[];
  categoryTitle: string;
  pageNumber: number;
  lang?: Language;
  onSelectProduct?: (product: CatalogProduct) => void;
}

export const LookbookGalleryPage: React.FC<LookbookGalleryProps> = ({
  products,
  categoryTitle,
  pageNumber,
  lang = 'tr',
  onSelectProduct
}) => {
  return (
    <div className="catalog-page bg-[#FAFAFA] p-[20mm] flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex justify-between items-baseline hairline-b pb-3">
        <span className="text-[12px] tracking-[0.25em] uppercase font-light text-neutral-900">
          {categoryTitle} — KOLEKSİYON GENEL BAKIŞ
        </span>
        <span className="text-[8.5px] tracking-[0.2em] uppercase text-neutral-400 font-mono">
          LOOKBOOK OVERVIEW
        </span>
      </div>

      {/* 2x2 Clean Minimalist Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 my-auto">
        {products.slice(0, 4).map((item, idx) => {
          const title = lang === 'en' ? item.name.en : item.name.tr;
          const designer = item.designers?.[0] 
            ? (lang === 'en' ? item.designers[0].name.en : item.designers[0].name.tr)
            : 'BİRİM STUDIO';
          const cover = item.cover_image?.url || item.gallery_images?.[0]?.url;

          return (
            <div 
              key={idx} 
              className="group cursor-pointer space-y-2.5"
              onClick={() => onSelectProduct?.(item)}
            >
              <div className="aspect-[4/3] bg-white border border-neutral-200 overflow-hidden relative shadow-sm group-hover:border-neutral-900 transition-colors">
                {cover ? (
                  <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                    Görsel Yok
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-neutral-900/80 text-white text-[7px] font-mono px-1.5 py-0.5 uppercase tracking-wider backdrop-blur-sm">
                  {item.models_and_variations?.length || 1} MODEL
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <h4 className="text-[12px] tracking-[0.15em] font-medium uppercase text-neutral-900 leading-tight">
                    {title}
                  </h4>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-neutral-400">
                    {designer}
                  </p>
                </div>
                <span className="text-[8px] font-mono text-neutral-500">
                  {item.design_year || ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center hairline-t pt-3 text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
        <span>BİRİM ARCHIVES</span>
        <span className="font-mono">{String(pageNumber).padStart(3, '0')}</span>
      </div>
    </div>
  );
};
