import React from 'react';
import { CatalogCategory, CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface CategoryDividerProps {
  category: CatalogCategory;
  categoryIndex: number;
  featuredProduct?: CatalogProduct;
  categoryProducts?: CatalogProduct[];
  lang?: Language;
}

export const CategoryDivider: React.FC<CategoryDividerProps> = ({
  category,
  categoryIndex,
  featuredProduct,
  categoryProducts = [],
  lang = 'tr'
}) => {
  const indexStr = String(categoryIndex + 1).padStart(2, '0');
  const title = lang === 'en' ? category.name.en : category.name.tr;
  const subtitle = category.subtitle 
    ? (lang === 'en' ? category.subtitle.en : category.subtitle.tr) 
    : '';

  const heroImage = featuredProduct?.cover_image?.url || featuredProduct?.gallery_images?.[0]?.url;

  return (
    <div className="catalog-page bg-[#FFFFFF] text-[#111111] flex flex-col justify-between p-[18mm] select-none border-r border-neutral-200">
      {/* Top Header Folio */}
      <div className="flex justify-between items-center text-[11px] tracking-[0.25em] uppercase text-neutral-600 font-medium border-b border-neutral-300 pb-3">
        <BirimLogo variant="black" className="h-7 w-auto object-contain" />
        <span className="font-mono text-neutral-500">BÖLÜM {indexStr} / KOLEKSİYON</span>
      </div>

      {/* Featured Visual Container (Cinematic Category Anchor with Pan & Zoom) */}
      <div className="my-4 h-[120mm] w-full bg-white overflow-hidden relative border border-neutral-200 shadow-sm">
        {heroImage ? (
          <InteractiveCatalogImage
            id={`cat-${category.slug}`}
            src={heroImage}
            alt={title}
            containerClassName="w-full h-full bg-white"
            objectFit="contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest">
            {title}
          </div>
        )}
      </div>

      {/* Category Typography & Statement */}
      <div className="space-y-4 pt-1">
        <div className="flex items-baseline space-x-4">
          <span className="text-[38px] font-extralight text-neutral-400 font-mono leading-none">
            {indexStr}
          </span>
          <div>
            <h2 className="text-[28px] font-light tracking-[0.16em] uppercase text-neutral-900 leading-none">
              {title}
            </h2>
            {category.name.en && lang === 'tr' && (
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-light block mt-1">
                {category.name.en}
              </span>
            )}
          </div>
        </div>

        {subtitle && (
          <p className="text-[12px] tracking-wide font-light text-neutral-700 italic border-l-2 border-neutral-900 pl-3">
            "{subtitle}"
          </p>
        )}

        {/* Category Product Quick Index Pills */}
        {categoryProducts.length > 0 && (
          <div className="pt-2">
            <span className="text-[8px] tracking-[0.2em] uppercase text-neutral-400 font-medium block mb-1.5">
              BU BÖLÜMDE YER ALAN MODELLER ({categoryProducts.length})
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[16mm] overflow-hidden">
              {categoryProducts.slice(0, 12).map((p, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 bg-neutral-100 text-[8px] tracking-wider text-neutral-700 font-mono uppercase"
                >
                  {lang === 'en' ? p.name.en : p.name.tr}
                </span>
              ))}
              {categoryProducts.length > 12 && (
                <span className="px-2 py-0.5 bg-neutral-100 text-[8px] text-neutral-400 font-mono">
                  +{categoryProducts.length - 12} MODEL
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sub-info */}
      <div className="flex justify-between items-center text-[9px] tracking-[0.2em] uppercase text-neutral-500 border-t border-neutral-200 pt-3 mt-2">
        <span>BİRİM MOBİLYA</span>
        <span>WWW.BIRIM.COM</span>
      </div>
    </div>
  );
};
