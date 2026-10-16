import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface FlexformCuratedSpreadProps {
  product: CatalogProduct;
  pageNumberLeft: number;
  pageNumberRight: number;
  lang?: Language;
}

export const FlexformCuratedSpread: React.FC<FlexformCuratedSpreadProps> = ({
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

  const detailImage = product.gallery_images?.[1]?.url || null;
  const isDetailMirrored = product.gallery_images?.[1]?.is_mirrored ?? false;

  const dimImages = product.dimension_images || [];

  return (
    <div className="catalog-spread-row flex flex-row gap-0 print:block">
      {/* ========================================================= */}
      {/* LEFT PAGE: 100% Full-Bleed Architectural Visual Anchor    */}
      {/* ========================================================= */}
      <div className="catalog-page catalog-page-bleed bg-[#F4F3F0] relative overflow-hidden flex flex-col justify-between select-none border-r border-neutral-300">
        {heroImage ? (
          <InteractiveCatalogImage
            id={`flexform-hero-${product.slug}`}
            src={heroImage}
            alt={title}
            containerClassName="absolute inset-0 w-full h-full bg-[#F4F3F0]"
            objectFit="contain"
            isMirrored={isHeroMirrored}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-mono uppercase tracking-widest">
            Görsel Hazırlanıyor
          </div>
        )}

        {/* Minimal Bottom Left Architectural Folio Overlay */}
        <div className="relative z-10 p-[16mm] mt-auto flex justify-between items-end text-[9px] tracking-[0.28em] text-neutral-600 font-light pointer-events-none uppercase">
          <span>{categoryName} &nbsp;/&nbsp; {title}</span>
          <span className="font-mono">{String(pageNumberLeft).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PAGE: Atelier Craft, Curated Details & Schematics   */}
      {/* ========================================================= */}
      <div className="catalog-page bg-[#FAF9F6] p-[18mm] flex flex-col justify-between select-none">
        {/* Top Header */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[8.5px] tracking-[0.3em] uppercase text-neutral-500 font-light">
            <BirimLogo variant="black" className="h-6 w-auto object-contain" />
            <span>COLLECTION &nbsp;/&nbsp; {product.design_year || '2026'}</span>
          </div>
          <div className="w-full border-b border-[#E2DFD8] mt-3" />
        </div>

        {/* Product Heading & Manifesto */}
        <div className="pt-4">
          <h1 className="text-[34px] font-extralight tracking-[0.06em] text-[#1A1A1A] uppercase leading-none">
            {title}
          </h1>
          <p className="text-[9px] tracking-[0.24em] text-[#6E6A62] uppercase font-normal mt-2">
            DESIGN: {designersStr}
          </p>
          {desc && (
            <p className="text-[10px] leading-[1.7] text-[#4A4740] font-light mt-3 max-w-[130mm]">
              {desc}
            </p>
          )}
        </div>

        {/* Center Secondary Atelier Image & Material Rationale */}
        <div className="grid grid-cols-2 gap-5 my-2 items-center">
          <div className="h-[44mm] bg-white border border-[#E6E3DC] overflow-hidden relative shadow-sm">
            {detailImage ? (
              <img
                src={detailImage}
                alt={`${title} Detail`}
                className={`w-full h-full object-cover ${isDetailMirrored ? '-scale-x-100' : ''}`}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-400 font-mono uppercase">
                Atelier Craft
              </div>
            )}
          </div>

          <div className="space-y-2 text-[8.5px] text-[#5A564E] leading-relaxed font-light">
            <div className="font-mono uppercase text-[#948F85] text-[7.5px] tracking-widest">
              ATELIER PHILOSOPHY
            </div>
            <p>
              {lang === 'en'
                ? 'Sculptural purity balanced with domestic intimacy and tactile materials.'
                : 'Heykelsi sadelik; sıcak malzeme paleti ve zanaatkar detaylarla buluşuyor.'}
            </p>
            <div className="pt-1 text-[7.5px] font-mono text-[#8C877E] uppercase">
              SOLID WOOD / MARBLE / BESPOKE TEXTILE
            </div>
          </div>
        </div>

        {/* Bottom Technical Schematics Section */}
        <div className="w-full border-t border-[#E2DFD8] pt-3">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[8.5px] tracking-[0.25em] uppercase font-medium text-neutral-700">
              {lang === 'en' ? 'ARCHITECTURAL SCHEMATICS' : 'MİMARİ ÇİZİMLER VE ÖLÇÜLER'}
            </span>
            <span className="text-[8px] font-mono text-neutral-400">
              UNIT: CM
            </span>
          </div>

          {/* Dimension Grid */}
          <div className="grid grid-cols-3 gap-3 h-[45mm]">
            {dimImages.slice(0, 3).map((dim, idx) => (
              <div key={idx} className="h-full flex flex-col items-center justify-between bg-white border border-[#E6E3DC] p-2">
                <div className="w-full h-[30mm] flex items-center justify-center">
                  <img
                    src={dim.url}
                    alt={dim.model_code}
                    className={`max-h-full max-w-full object-contain filter contrast-[1.05] ${dim.is_mirrored ? '-scale-x-100' : ''}`}
                    loading="lazy"
                  />
                </div>
                <span className="text-[8.5px] font-mono text-neutral-800 font-medium tracking-wider text-center block truncate w-full">
                  {dim.model_code}
                </span>
              </div>
            ))}
            {dimImages.length === 0 && (
              <div className="col-span-3 text-center text-[9px] text-neutral-400 font-mono py-4">
                {lang === 'en' ? 'Schematic details provided on demand.' : 'Teknik ölçü föyü talep üzerine temin edilir.'}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-[#E2DFD8] pt-3 mt-2 flex justify-between items-center text-[8px] font-mono tracking-[0.2em] text-[#888888] uppercase">
          <span>FLEXFORM CURATED LIVING // BİRİM</span>
          <span>{String(pageNumberRight).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
