import React from 'react';
import { CatalogCategory, CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface BirimCategoryDividerProps {
  category: CatalogCategory;
  categoryIndex: number;
  featuredProduct?: CatalogProduct;
  pageNumber: number;
  lang?: Language;
}

const capitalizeTr = (text: string): string => {
  if (!text) return '';
  const lower = text.toLocaleLowerCase('tr-TR');
  return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
};

export const BirimCategoryDivider: React.FC<BirimCategoryDividerProps> = ({
  category,
  categoryIndex,
  featuredProduct,
  pageNumber,
  lang = 'tr'
}) => {
  const indexStr = String(categoryIndex + 1).padStart(2, '0');
  const rawTitle = lang === 'en' ? category.name.en : category.name.tr;
  const displayTitle = lang === 'en' ? rawTitle : capitalizeTr(rawTitle);

  const displaySubtitle = (category.name.en && lang === 'tr')
    ? category.name.en.toUpperCase()
    : (category.subtitle ? (lang === 'en' ? category.subtitle.en : category.subtitle.tr).toUpperCase() : '');

  const heroImage = featuredProduct?.cover_image?.url || featuredProduct?.gallery_images?.[0]?.url;
  const isHeroMirrored = featuredProduct?.cover_image ? featuredProduct.cover_image.is_mirrored : featuredProduct?.gallery_images?.[0]?.is_mirrored;

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none">
      {/* Top Header Folio */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <BirimLogo variant="black" className="h-7 w-auto object-contain" />
        </div>
        <div className="w-full border-b border-[#D8D8D8] mt-3" />
      </div>

      {/* Category Classification & Title */}
      <div className="mt-5">
        <span className="text-[10px] tracking-[0.25em] text-[#888888] uppercase font-light block">
          COLLECTION / {indexStr}
        </span>
        <h1 className="text-[44px] font-extralight text-[#111111] tracking-[-0.01em] leading-tight mt-5 mb-1.5">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="text-[11px] tracking-[0.25em] text-[#888888] uppercase font-normal mb-3">
            {displaySubtitle}
          </p>
        )}
        <div className="w-12 h-[1px] bg-[#D0D0D0] mb-4" />
      </div>

      {/* Central Visual Anchor */}
      <div className="flex-1 flex items-center justify-center my-auto w-full min-h-[110mm] max-h-[135mm]">
        {heroImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <InteractiveCatalogImage
              id={`birim-cat-divider-${category.slug}`}
              src={heroImage}
              alt={displayTitle}
              containerClassName="w-full h-full max-h-[130mm] flex items-center justify-center"
              objectFit="contain"
              isMirrored={isHeroMirrored}
            />
          </div>
        ) : null}
      </div>

      {/* Footer Pagination */}
      <div className="w-full">
        <div className="flex justify-between items-center text-[9px] tracking-[0.22em] text-[#888888] uppercase font-light">
          <span>BIRIM / COLLECTION</span>
          <span className="tracking-widest font-mono">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
