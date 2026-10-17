import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';
import { BlankCatalogPage } from './BlankCatalogPage';

export interface TechnicalItem {
  model_code: string;
  drawing_url: string;
  title?: string;
  dimensions_text?: string;
  is_mirrored?: boolean;
}

export const extractProductDrawings = (product: CatalogProduct): TechnicalItem[] => {
  const items: TechnicalItem[] = [];
  const seenCodes = new Set<string>();

  // 1. Primary from dimension_images
  if (product.dimension_images && product.dimension_images.length > 0) {
    for (const dim of product.dimension_images) {
      const code = dim.model_code || (typeof dim.title === 'string' ? dim.title : dim.title?.tr) || '';
      if (dim.url && (!code || !seenCodes.has(code))) {
        if (code) seenCodes.add(code);
        items.push({
          model_code: code,
          drawing_url: dim.url,
          title: typeof dim.title === 'string' ? dim.title : dim.title?.tr,
          is_mirrored: dim.is_mirrored,
        });
      }
    }
  }

  // 2. Fallback from models_and_variations
  if (product.models_and_variations && product.models_and_variations.length > 0) {
    for (const m of product.models_and_variations) {
      if (m.technical_drawing_url && !seenCodes.has(m.model_code)) {
        seenCodes.add(m.model_code);
        items.push({
          model_code: m.model_code,
          drawing_url: m.technical_drawing_url,
          dimensions_text: m.dimensions_text,
        });
      }
    }
  }

  return items;
};

export const getBirimCollectionPageCount = (product: CatalogProduct, isSpreadMode = false): number => {
  const drawings = extractProductDrawings(product);
  let count = 1;
  if (drawings.length <= 3) {
    count = drawings.length > 0 ? 2 : 1;
  } else {
    const techPages = Math.ceil(drawings.length / 6);
    count = 1 + techPages;
  }
  if (isSpreadMode && count % 2 !== 0) {
    count += 1; // Pad with blank page so spread is complete
  }
  return count;
};

interface BirimCollectionSpreadProps {
  product: CatalogProduct;
  startPageNumber: number;
  lang?: Language;
  isSpreadMode?: boolean;
}

const getCountWord = (count: number, lang: Language): string => {
  if (lang === 'en') {
    const map: Record<number, string> = {
      1: 'Single size option',
      2: 'Two size options',
      3: 'Three size options',
      4: 'Four size options',
    };
    return map[count] || `${count} size options`;
  }
  const map: Record<number, string> = {
    1: 'Tek ölçü seçeneği',
    2: 'İki ölçü seçeneği',
    3: 'Üç ölçü seçeneği',
    4: 'Dört ölçü seçeneği',
    5: 'Beş ölçü seçeneği',
  };
  return map[count] || `${count} ölçü seçeneği`;
};

export const BirimCollectionSpread: React.FC<BirimCollectionSpreadProps> = ({
  product,
  startPageNumber,
  lang = 'tr',
  isSpreadMode = false
}) => {
  const title = (lang === 'en' ? product.name.en : product.name.tr).toUpperCase();
  const designersStr = product.designers?.length
    ? product.designers.map(d => (lang === 'en' ? d.name.en : d.name.tr).toUpperCase()).join(' / ')
    : 'BİRİM DESIGN TEAM';

  const rawShortDesc = (product.short_description
    ? (lang === 'en' ? product.short_description.en : product.short_description.tr)
    : '') || '';

  const rawLongDesc = (product.long_description
    ? (lang === 'en' ? product.long_description.en : product.long_description.tr)
    : '') || '';

  const desc = rawShortDesc || rawLongDesc;

  // Secondary description
  let secondaryDesc = '';
  if (rawLongDesc && rawShortDesc && rawLongDesc.length > rawShortDesc.length) {
    secondaryDesc = rawLongDesc.replace(rawShortDesc, '').trim();
  }
  if (!secondaryDesc && product.collection_and_family?.art_edition?.technique) {
    secondaryDesc = lang === 'en'
      ? product.collection_and_family.art_edition.technique.en
      : product.collection_and_family.art_edition.technique.tr;
  }
  if (!secondaryDesc) {
    secondaryDesc = lang === 'en'
      ? 'A signature furniture collection bringing bespoke craft together with contemporary design.'
      : 'Sanatsal yüzeylerin modern mobilya formuyla buluştuğu özgün koleksiyon.';
  }

  const heroImage = product.cover_image?.url || product.gallery_images?.[0]?.url;
  const isHeroMirrored = product.cover_image ? product.cover_image.is_mirrored : product.gallery_images?.[0]?.is_mirrored;
  const detailImageObj = product.gallery_images && product.gallery_images.length > 1
    ? product.gallery_images[1]
    : null;
  const detailImage = detailImageObj?.url || null;

  const familyName = (product.collection_and_family?.family_name || product.name.tr).toUpperCase();

  const drawings = extractProductDrawings(product);
  const isMultiModel = drawings.length > 3;

  // Split drawings into chunks of 6 for grid layout if multi-model
  const chunks: TechnicalItem[][] = [];
  if (isMultiModel) {
    for (let i = 0; i < drawings.length; i += 6) {
      chunks.push(drawings.slice(i, i + 6));
    }
  } else if (drawings.length > 0) {
    chunks.push(drawings);
  }

  const pages: React.ReactNode[] = [];
  let currentPage = startPageNumber;

  // ==========================================
  // PAGE 1: PRODUCT HERO PAGE (PDF Page 2 & 5)
  // ==========================================
  pages.push(
    <div
      key={`hero-${product.slug}`}
      className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none"
    >
      {/* Top Header */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <BirimLogo variant="black" className="h-7 w-auto object-contain" />
        </div>
        <div className="w-full border-b border-[#D8D8D8] mt-3" />
      </div>

      {/* Product Title & Info */}
      <div className="mt-5">
        <h1 className="text-[38px] font-light text-[#111111] tracking-[0.06em] uppercase leading-none">
          {title}
        </h1>
        <p className="text-[10px] tracking-[0.22em] text-[#777777] uppercase font-normal mt-2.5">
          {designersStr}
        </p>
        {product.design_year && (
          <p className="text-[9.5px] tracking-[0.15em] text-[#999999] font-light mt-1">
            {product.design_year}
          </p>
        )}
        {desc && (
          <p className="text-[11px] leading-[1.7] text-[#444444] font-light max-w-[90%] mt-4">
            {desc}
          </p>
        )}
      </div>

      {/* Center Hero Image */}
      <div className="flex-1 flex items-center justify-center my-3 w-full min-h-[90mm] max-h-[115mm]">
        {heroImage ? (
          <div className="relative w-full h-full max-h-[110mm] flex items-center justify-center">
            <InteractiveCatalogImage
              id={`birim-hero-${product.slug}`}
              src={heroImage}
              alt={title}
              containerClassName="w-full h-full flex items-center justify-center"
              objectFit="contain"
              isMirrored={isHeroMirrored}
            />
          </div>
        ) : null}
      </div>

      {/* Bottom Secondary Block (No modular disclaimer) */}
      {detailImage && (
        <div className="mb-4 flex items-center gap-6">
          <div className="w-[32mm] h-[38mm] flex-shrink-0 bg-neutral-100 overflow-hidden relative border border-neutral-200">
            <img
              src={detailImage}
              alt={familyName}
              className={`w-full h-full object-cover ${detailImageObj?.is_mirrored ? '-scale-x-100' : ''}`}
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-[12px] font-medium tracking-[0.18em] text-[#222222] uppercase mb-1.5">
              {familyName}
            </h3>
            <p className="text-[10.5px] leading-[1.6] text-[#666666] font-light max-w-[125mm]">
              {secondaryDesc}
            </p>
          </div>
        </div>
      )}

      {/* Footer Pagination */}
      <div className="w-full">
        <div className="flex justify-between items-center text-[9px] tracking-[0.22em] text-[#888888] uppercase font-light">
          <span>BIRIM / COLLECTION</span>
          <span className="tracking-widest font-mono">{String(currentPage).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
  currentPage++;

  // ==========================================
  // PAGE 2+: TECHNICAL DRAWINGS (PDF Pages 3, 6, 7)
  // ==========================================
  if (!isMultiModel && drawings.length > 0) {
    // LAYOUT A: STACKED ROWS
    pages.push(
      <div
        key={`tech-stacked-${product.slug}`}
        className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none"
      >
        {/* Top Header */}
        <div className="w-full">
          <div className="flex items-center justify-between">
            <BirimLogo variant="black" className="h-7 w-auto object-contain" />
          </div>
          <div className="w-full border-b border-[#D8D8D8] mt-3" />
        </div>

        {/* Section Header */}
        <div className="mt-5 mb-4">
          <h2 className="text-[36px] font-light text-[#111111] tracking-[0.02em] leading-tight mb-1">
            {lang === 'en' ? 'Dimensions' : 'Ölçüler'}
          </h2>
          <p className="text-[10px] tracking-[0.15em] text-[#777777] font-light">
            {getCountWord(drawings.length, lang)} / {lang === 'en' ? 'Original technical drawings' : 'Orijinal teknik çizimler'}
          </p>
        </div>

        {/* Stacked Rows with visual on top and model code centered below */}
        <div className="flex-1 flex flex-col justify-around py-2">
          {drawings.map((item, idx) => (
            <div
              key={item.model_code || idx}
              className="w-full border-b border-[#E5E7EB] pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0 flex flex-col items-center text-center"
            >
              {/* Technical Drawing */}
              <div className="w-full h-[46mm] flex items-center justify-center">
                {item.drawing_url ? (
                  <img
                    src={item.drawing_url}
                    alt={item.model_code}
                    className={`max-h-full max-w-full object-contain filter contrast-[1.05] ${item.is_mirrored ? '-scale-x-100' : ''}`}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-[9px] text-neutral-400 font-mono">
                    {lang === 'en' ? 'Drawing not available' : 'Teknik çizim mevcut değil'}
                  </span>
                )}
              </div>

              {/* Product Code Centered Below Drawing */}
              <div className="mt-2.5 text-center">
                <span className="text-[11px] font-medium tracking-[0.12em] text-[#222222] font-mono block">
                  {item.model_code}
                </span>
                {item.dimensions_text && (
                  <span className="text-[9px] text-neutral-500 font-mono block mt-0.5">
                    {item.dimensions_text}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pagination */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[9px] tracking-[0.22em] text-[#888888] uppercase font-light">
            <span>BIRIM / COLLECTION</span>
            <span className="tracking-widest font-mono">{String(currentPage).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    );
    currentPage++;
  } else if (isMultiModel) {
    // LAYOUT B: 2x3 GRID FOR MULTIPLE VARIATIONS (PDF Pages 6 & 7)
    const totalPages = chunks.length;

    chunks.forEach((chunk, pageIdx) => {
      pages.push(
        <div
          key={`tech-grid-${product.slug}-${pageIdx}`}
          className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none"
        >
          {/* Top Header */}
          <div className="w-full">
            <div className="flex items-center justify-between">
              <BirimLogo variant="black" className="h-7 w-auto object-contain" />
            </div>
            <div className="w-full border-b border-[#D8D8D8] mt-3" />
          </div>

          {/* Section Header */}
          <div className="mt-5 mb-4">
            <h2 className="text-[36px] font-light text-[#111111] tracking-[0.02em] leading-tight mb-1">
              {lang === 'en' ? 'Dimensions' : 'Ölçüler'}
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-[#777777] font-normal uppercase">
              {title} / {drawings.length} {lang === 'en' ? 'MODELS' : 'MODEL'}
              {totalPages > 1 ? ` / ${lang === 'en' ? 'PAGE' : 'SAYFA'} ${pageIdx + 1} / ${totalPages}` : ''}
            </p>
          </div>

          {/* 2-Column x 3-Row Grid */}
          <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-x-10 gap-y-6 items-center content-center py-2">
            {chunk.map((item, idx) => (
              <div key={item.model_code || idx} className="flex flex-col items-center w-full text-center">
                {/* CAD Drawing */}
                <div className="w-full h-[45mm] flex items-center justify-center">
                  {item.drawing_url ? (
                    <img
                      src={item.drawing_url}
                      alt={item.model_code}
                      className={`max-h-full max-w-full object-contain filter contrast-[1.05] ${item.is_mirrored ? '-scale-x-100' : ''}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-[9px] text-neutral-400 font-mono">
                      {lang === 'en' ? 'No Drawing' : 'Çizim Yok'}
                    </div>
                  )}
                </div>
                {/* Model Code Centered Below Drawing */}
                <span className="text-[10px] font-medium tracking-[0.12em] text-[#222222] font-mono mt-3 text-center block">
                  {item.model_code}
                </span>
                {item.dimensions_text && (
                  <span className="text-[9px] text-neutral-500 font-mono mt-0.5 text-center block">
                    {item.dimensions_text}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Footer Pagination */}
          <div className="w-full">
            <div className="flex justify-between items-center text-[9px] tracking-[0.22em] text-[#888888] uppercase font-light">
              <span>BIRIM / COLLECTION</span>
              <span className="tracking-widest font-mono">{String(currentPage).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      );
      currentPage++;
    });
  }

  if (isSpreadMode) {
    if (pages.length % 2 !== 0) {
      pages.push(
        <BlankCatalogPage
          key={`blank-${product.slug}-${currentPage}`}
          pageNumber={currentPage}
          lang={lang}
        />
      );
    }
    const spreads: React.ReactNode[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      spreads.push(
        <div key={`spread-${product.slug}-${i}`} className="catalog-spread-row flex flex-row gap-0">
          {pages[i]}
          {pages[i + 1]}
        </div>
      );
    }
    return <>{spreads}</>;
  }

  return (
    <div className="catalog-spread-row flex flex-row flex-wrap justify-center gap-6 print:gap-0">
      {pages}
    </div>
  );
};
