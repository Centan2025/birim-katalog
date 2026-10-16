import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface CassinaTriennaleSpreadProps {
  product: CatalogProduct;
  pageNumberLeft: number;
  pageNumberRight: number;
  lang?: Language;
}

export const CassinaTriennaleSpread: React.FC<CassinaTriennaleSpreadProps> = ({
  product,
  pageNumberLeft,
  pageNumberRight,
  lang = 'tr'
}) => {
  const title = (lang === 'en' ? product.name.en : product.name.tr).toUpperCase();
  const categoryName = (lang === 'en' ? product.category.name.en : product.category.name.tr).toUpperCase();
  
  const designersStr = product.designers?.length
    ? product.designers.map(d => (lang === 'en' ? d.name.en : d.name.tr).toUpperCase()).join(' & ')
    : 'BİRİM DESIGN STUDIO';

  const desc = product.short_description
    ? (lang === 'en' ? product.short_description.en : product.short_description.tr)
    : (product.long_description ? (lang === 'en' ? product.long_description.en : product.long_description.tr) : '');

  const heroImage = product.cover_image?.url || product.gallery_images?.[0]?.url;
  const isHeroMirrored = product.cover_image ? product.cover_image.is_mirrored : product.gallery_images?.[0]?.is_mirrored;

  const detailImage1 = product.gallery_images?.[1]?.url || product.gallery_images?.[0]?.url;
  const isDetail1Mirrored = product.gallery_images?.[1]?.is_mirrored ?? false;

  const detailImage2 = product.gallery_images?.[2]?.url || null;
  const isDetail2Mirrored = product.gallery_images?.[2]?.is_mirrored ?? false;

  const dimImages = product.dimension_images || [];

  return (
    <div className="catalog-spread-row flex flex-row gap-0 print:block">
      {/* ========================================================= */}
      {/* LEFT PAGE: Editorial Storyboard, Narrative & Material Study */}
      {/* ========================================================= */}
      <div className="catalog-page bg-[#FFFFFF] p-[18mm] flex flex-col justify-between select-none border-r border-[#EAEAEA]">
        {/* Top Header */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[8.5px] tracking-[0.3em] uppercase text-neutral-500 font-light">
            <BirimLogo variant="black" className="h-6 w-auto object-contain" />
            <span>{categoryName} &nbsp;/&nbsp; ARCHIVE</span>
          </div>
          <div className="w-full border-b border-[#E0E0E0] mt-3" />
        </div>

        {/* Product Title & Designer Statement */}
        <div className="pt-5 pb-3">
          <div className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-mono mb-2">
            DESIGN MONOGRAPH // {product.design_year || '2026'}
          </div>
          <h1 className="text-[36px] font-extralight tracking-[0.08em] text-[#111111] uppercase leading-none">
            {title}
          </h1>
          <p className="text-[9.5px] tracking-[0.22em] text-[#666666] uppercase font-normal mt-2.5">
            CREATIVE DIRECTION: {designersStr}
          </p>
        </div>

        {/* Narrative Block with Accent Border */}
        {desc && (
          <div className="border-l-2 border-[#111111] pl-4 my-2">
            <p className="text-[10px] leading-[1.75] text-[#444444] font-light max-w-[130mm]">
              {desc}
            </p>
          </div>
        )}

        {/* Dual Material / Macro Detail Visuals */}
        <div className="grid grid-cols-2 gap-4 my-2">
          {detailImage1 && (
            <div className="aspect-[4/3] bg-neutral-50 border border-neutral-200 overflow-hidden relative">
              <img
                src={detailImage1}
                alt={`${title} Detail 1`}
                className={`w-full h-full object-cover ${isDetail1Mirrored ? '-scale-x-100' : ''}`}
                loading="lazy"
              />
              <span className="absolute bottom-1.5 left-2 text-[7px] font-mono tracking-widest text-neutral-700 bg-white/90 px-1 py-0.5 uppercase">
                FIG. 01 / FORM
              </span>
            </div>
          )}

          {detailImage2 ? (
            <div className="aspect-[4/3] bg-neutral-50 border border-neutral-200 overflow-hidden relative">
              <img
                src={detailImage2}
                alt={`${title} Detail 2`}
                className={`w-full h-full object-cover ${isDetail2Mirrored ? '-scale-x-100' : ''}`}
                loading="lazy"
              />
              <span className="absolute bottom-1.5 left-2 text-[7px] font-mono tracking-widest text-neutral-700 bg-white/90 px-1 py-0.5 uppercase">
                FIG. 02 / DETAIL
              </span>
            </div>
          ) : (
            <div className="aspect-[4/3] bg-[#FAF9F7] border border-neutral-200 p-4 flex flex-col justify-between">
              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                CRAFT // SPECIFICATION
              </span>
              <p className="text-[8.5px] leading-relaxed text-neutral-600 font-light">
                {lang === 'en'
                  ? 'Precision craft meets architectural proportions and bespoke upholstery details.'
                  : 'Hassas zanaat, mimari oranlar ve seçkin döşeme detaylarıyla harmanlanmıştır.'}
              </p>
              <span className="text-[7.5px] font-mono text-neutral-400">
                MADE IN TURKEY // BİRİM
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full border-t border-[#E0E0E0] pt-3 flex justify-between items-center text-[8.5px] font-mono tracking-[0.2em] text-[#888888] uppercase">
          <span>WWW.BIRIM.COM</span>
          <span>{String(pageNumberLeft).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PAGE: Large Hero Visual & CAD Technical Schematics */}
      {/* ========================================================= */}
      <div className="catalog-page bg-[#FFFFFF] p-[18mm] flex flex-col justify-between select-none">
        {/* Top Header */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[8.5px] tracking-[0.3em] uppercase text-neutral-500 font-light">
            <span>{title} &nbsp;/&nbsp; PERSPECTIVE</span>
            <span className="font-mono">{String(pageNumberRight).padStart(2, '0')}</span>
          </div>
          <div className="w-full border-b border-[#E0E0E0] mt-3" />
        </div>

        {/* Hero Visual Area with Pan/Zoom */}
        <div className="flex-1 w-full my-3 min-h-[110mm] max-h-[125mm] relative flex items-center justify-center">
          {heroImage ? (
            <InteractiveCatalogImage
              id={`cassina-hero-${product.slug}`}
              src={heroImage}
              alt={title}
              containerClassName="w-full h-full flex items-center justify-center"
              objectFit="contain"
              isMirrored={isHeroMirrored}
            />
          ) : (
            <div className="text-neutral-400 text-xs uppercase tracking-widest font-mono">
              Görsel Hazırlanıyor
            </div>
          )}
        </div>

        {/* Technical Drawings Strip */}
        <div className="w-full border-t border-[#EAEAEA] pt-3">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium text-neutral-800">
              {lang === 'en' ? 'DIMENSIONS' : 'ÖLÇÜLER'}
            </span>
            <span className="text-[8px] font-mono text-neutral-400">
              {dimImages.length} {lang === 'en' ? 'MODELS' : 'MODEL'}
            </span>
          </div>

          {/* Drawings Row */}
          <div className="grid grid-cols-3 gap-3 h-[42mm] items-center">
            {dimImages.slice(0, 3).map((dim, idx) => (
              <div key={idx} className="h-full flex flex-col items-center justify-between border border-neutral-100 p-1.5 bg-[#FCFCFA]">
                <div className="w-full h-[28mm] flex items-center justify-center">
                  <img
                    src={dim.url}
                    alt={dim.model_code}
                    className={`max-h-full max-w-full object-contain filter contrast-[1.05] ${dim.is_mirrored ? '-scale-x-100' : ''}`}
                    loading="lazy"
                  />
                </div>
                <span className="text-[8.5px] font-mono text-neutral-700 font-medium tracking-wider text-center block truncate w-full">
                  {dim.model_code}
                </span>
              </div>
            ))}
            {dimImages.length === 0 && (
              <div className="col-span-3 text-center text-[9px] text-neutral-400 font-mono py-4">
                {lang === 'en' ? 'Standard dimensions available upon request.' : 'Özel ölçü seçenekleri için iletişime geçiniz.'}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-[#E0E0E0] pt-3 mt-3 flex justify-between items-center text-[8.5px] font-mono tracking-[0.2em] text-[#888888] uppercase">
          <span>BİRİM ARCHIVES / EDITORIAL SPREAD</span>
          <span>{String(pageNumberRight).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
