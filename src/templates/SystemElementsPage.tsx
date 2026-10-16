import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

export interface SystemChunk {
  drawings: NonNullable<CatalogProduct['dimension_images']>;
  startIndex: number;
  chunkIndex: number;
}

// 2 columns x 2 rows (4 drawings) on first page, and up to 6 per annex page
export const ITEMS_PER_FIRST_PAGE = 4;
export const ITEMS_PER_SYSTEM_PAGE = 6;

export const getSystemElementsPageCount = (product: CatalogProduct): number => {
  const count = product.dimension_images?.length || 0;
  if (count <= ITEMS_PER_FIRST_PAGE) return 0;
  return Math.ceil((count - ITEMS_PER_FIRST_PAGE) / ITEMS_PER_SYSTEM_PAGE);
};

export const getSystemElementsChunks = (product: CatalogProduct): SystemChunk[] => {
  const images = product.dimension_images || [];
  if (images.length <= ITEMS_PER_FIRST_PAGE) return [];
  const remaining = images.slice(ITEMS_PER_FIRST_PAGE);
  const chunks: SystemChunk[] = [];
  for (let i = 0; i < remaining.length; i += ITEMS_PER_SYSTEM_PAGE) {
    chunks.push({
      drawings: remaining.slice(i, i + ITEMS_PER_SYSTEM_PAGE),
      startIndex: ITEMS_PER_FIRST_PAGE + i,
      chunkIndex: Math.floor(i / ITEMS_PER_SYSTEM_PAGE),
    });
  }
  return chunks;
};

interface SystemElementsPageProps {
  product: CatalogProduct;
  drawings: NonNullable<CatalogProduct['dimension_images']>;
  startIndex: number;
  pageNumber: number;
  lang?: Language;
}

export const SystemElementsPage: React.FC<SystemElementsPageProps> = ({
  product,
  drawings,
  startIndex,
  pageNumber,
  lang = 'tr',
}) => {
  const title = lang === 'en' ? product.name.en : product.name.tr;
  const categoryName = lang === 'en' ? product.category.name.en : product.category.name.tr;

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
      {/* Top Folio Header with Left-Aligned Logo */}
      <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-neutral-500 uppercase hairline-b pb-3">
        <BirimLogo variant="black" className="h-6 w-auto object-contain" />
        <span>{categoryName} / {title}</span>
      </div>

      {/* Page Title: ÖLÇÜLER */}
      <div className="hairline-b pb-1.5 mb-2 flex justify-between items-baseline pt-1">
        <span className="text-[30px] tracking-[0.04em] uppercase text-neutral-900 font-light leading-none">
          {lang === 'en' ? 'DIMENSIONS' : 'ÖLÇÜLER'}
        </span>
      </div>

      {/* 2-Column Dynamic Row Grid — Fills page with as many rows as fit (up to 3 rows / 6 items per sheet) */}
      <div className="my-auto pt-1 pb-2 grid grid-cols-2 gap-x-6 gap-y-3 w-full bg-white">
        {drawings.map((dim, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between bg-white h-[68mm] overflow-hidden"
          >
            <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
              <span className="text-[9px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                {dim.model_code}
              </span>
            </div>
            <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
              <InteractiveCatalogImage
                id={`annex-dim-${product.slug}-${startIndex + idx}`}
                src={dim.url}
                alt={`${title} ${dim.model_code}`}
                containerClassName="w-full h-full bg-white"
                objectFit="contain"
                initialScale={1}
                isMirrored={dim.is_mirrored}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Folio Footer */}
      <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-500 hairline-t pt-3 mt-2">
        <span className="uppercase">WWW.BIRIM.COM</span>
        <span className="font-mono text-neutral-700">{String(pageNumber).padStart(3, '0')}</span>
      </div>
    </div>
  );
};
