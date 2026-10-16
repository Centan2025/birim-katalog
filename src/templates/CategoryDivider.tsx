import React from 'react';
import { CatalogCategory, CatalogProduct, CategoryDividerVariant, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface CategoryDividerProps {
  category: CatalogCategory;
  categoryIndex: number;
  featuredProduct?: CatalogProduct;
  categoryProducts?: CatalogProduct[];
  pageNumber?: number;
  lang?: Language;
  variant?: CategoryDividerVariant;
}

const capitalizeTr = (text: string): string => {
  if (!text) return '';
  const lower = text.toLocaleLowerCase('tr-TR');
  return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
};

export const CategoryDivider: React.FC<CategoryDividerProps> = ({
  category,
  categoryIndex,
  featuredProduct,
  categoryProducts = [],
  pageNumber = 1,
  lang = 'tr',
  variant = 'alt-1',
}) => {
  const isTr = lang === 'tr';
  const indexStr = String(categoryIndex + 1).padStart(2, '0');
  const rawTitle = isTr ? category.name.tr : (category.name.en || category.name.tr);
  const displayTitle = isTr ? capitalizeTr(rawTitle) : rawTitle;
  const uppercaseTitle = rawTitle.toUpperCase();

  const displaySubtitle = category.subtitle
    ? (isTr ? category.subtitle.tr : category.subtitle.en)
    : (isTr ? category.name.en : '');

  const heroImage = featuredProduct?.cover_image?.url || featuredProduct?.gallery_images?.[0]?.url;
  const isHeroMirrored = featuredProduct?.cover_image
    ? featuredProduct.cover_image.is_mirrored
    : featuredProduct?.gallery_images?.[0]?.is_mirrored;

  // =========================================================================
  // ALT 1: MINOTTI ARCHITECTURAL STYLE (Sinematik Geniş Görsel & Dev Mimari Tipografi)
  // =========================================================================
  if (variant === 'alt-1') {
    return (
      <div className="catalog-page bg-[#FFFFFF] text-[#111111] flex flex-col justify-between p-[18mm] select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase text-neutral-600 font-medium hairline-b pb-3">
          <BirimLogo variant="black" className="h-6 w-auto object-contain" />
          <span className="font-mono text-neutral-400">
            {isTr ? `BÖLÜM ${indexStr} // MİMARİ SERİLER` : `SECTION ${indexStr} // ARCHITECTURAL SERIES`}
          </span>
        </div>

        {/* Central Frameless Hero Visual */}
        <div className="my-auto h-[135mm] w-full bg-white overflow-hidden relative">
          {heroImage ? (
            <InteractiveCatalogImage
              id={`cat-alt1-${category.slug}`}
              src={heroImage}
              alt={displayTitle}
              containerClassName="w-full h-full bg-white flex items-center justify-center"
              objectFit="contain"
              isMirrored={isHeroMirrored}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest font-mono">
              {displayTitle}
            </div>
          )}
        </div>

        {/* Typography Block */}
        <div className="space-y-3 pt-2">
          <div className="flex items-baseline space-x-4">
            <span className="text-[44px] font-extralight text-neutral-300 font-mono leading-none">
              {indexStr}
            </span>
            <div>
              <h2 className="text-[28px] font-light tracking-[0.14em] uppercase text-neutral-900 leading-none">
                {uppercaseTitle}
              </h2>
              {category.name.en && isTr && (
                <span className="text-[9.5px] tracking-[0.25em] text-neutral-400 uppercase font-light block mt-1">
                  {category.name.en}
                </span>
              )}
            </div>
          </div>

          {displaySubtitle && (
            <p className="text-[11px] tracking-wide font-light text-neutral-600 border-l-2 border-neutral-900 pl-3 leading-relaxed">
              {displaySubtitle}
            </p>
          )}

          {/* Model pills */}
          {categoryProducts.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5 max-h-[14mm] overflow-hidden">
              {categoryProducts.slice(0, 10).map((p, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-neutral-100 text-[8px] tracking-wider text-neutral-700 font-mono uppercase"
                >
                  {isTr ? p.name.tr : p.name.en}
                </span>
              ))}
              {categoryProducts.length > 10 && (
                <span className="px-2 py-0.5 bg-neutral-100 text-[8px] text-neutral-400 font-mono">
                  +{categoryProducts.length - 10} {isTr ? 'MODEL' : 'MODELS'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.2em] uppercase text-neutral-400 hairline-t pt-3 mt-2">
          <span>WWW.BIRIM.COM</span>
          <span className="font-mono">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 2: B&B ITALIA MONOLITH STYLE (Asimetrik Stüdyo & Fihrist)
  // =========================================================================
  if (variant === 'alt-2') {
    return (
      <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[9.5px] tracking-[0.25em] uppercase text-neutral-400 hairline-b pb-3">
          <BirimLogo variant="black" className="h-5 w-auto object-contain" />
          <span className="font-mono text-neutral-400">SERIES {indexStr}</span>
        </div>

        {/* Asymmetrical 2-Column Split Body */}
        <div className="flex-1 my-auto grid grid-cols-12 gap-8 items-center py-4">
          {/* Left Column (40%): Chapter Identity & Model Directory */}
          <div className="col-span-5 space-y-6">
            <div>
              <span className="text-[64px] font-extralight font-mono text-neutral-300 leading-none block">
                {indexStr}
              </span>
              <h2 className="text-[26px] font-medium tracking-[0.05em] uppercase text-neutral-950 leading-tight mt-2">
                {uppercaseTitle}
              </h2>
              {category.name.en && isTr && (
                <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-mono block mt-1">
                  {category.name.en}
                </span>
              )}
            </div>

            <div className="w-12 h-[1.5px] bg-neutral-950" />

            {displaySubtitle && (
              <p className="text-[10.5px] font-light leading-[1.8] text-neutral-600 text-justify">
                {displaySubtitle}
              </p>
            )}

            {/* Structured Model Index */}
            {categoryProducts.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[8px] font-mono tracking-[0.25em] uppercase text-neutral-400 font-semibold block">
                  {isTr ? 'BÖLÜM MODELLERİ' : 'INDEXED MODELS'}
                </span>
                <div className="space-y-1">
                  {categoryProducts.slice(0, 7).map((p, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-[9px] text-neutral-700 hairline-b pb-0.5"
                    >
                      <span className="font-medium uppercase tracking-wider">
                        {isTr ? p.name.tr : p.name.en}
                      </span>
                      <span className="font-mono text-neutral-400 text-[8px]">
                        {p.designers?.[0]?.name ? (isTr ? p.designers[0].name.tr : p.designers[0].name.en) : 'BİRİM'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (60%): Floating Sculptural Hero Visual */}
          <div className="col-span-7 h-[160mm] bg-white flex items-center justify-center relative overflow-hidden">
            {heroImage ? (
              <InteractiveCatalogImage
                id={`cat-alt2-${category.slug}`}
                src={heroImage}
                alt={displayTitle}
                containerClassName="w-full h-full bg-white flex items-center justify-center"
                objectFit="contain"
                isMirrored={isHeroMirrored}
              />
            ) : (
              <div className="text-xs text-neutral-300 font-mono uppercase tracking-widest">
                {displayTitle}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] uppercase text-neutral-400 hairline-t pt-3">
          <span>WWW.BIRIM.COM</span>
          <span className="font-mono">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 3: FLEXFORM STYLE (100% Full-Bleed Atmosferik Görsel & Yüzen Kart)
  // =========================================================================
  if (variant === 'alt-3') {
    return (
      <div className="catalog-page catalog-page-bleed bg-[#F4F3F0] relative overflow-hidden flex flex-col justify-between select-none">
        {/* Full Bleed Image Layer */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <InteractiveCatalogImage
              id={`cat-alt3-${category.slug}`}
              src={heroImage}
              alt={displayTitle}
              containerClassName="w-full h-full"
              objectFit="cover"
              isMirrored={isHeroMirrored}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />
          </div>
        )}

        {/* Top Folio Overlay */}
        <div className="relative z-10 p-[18mm] pb-0 flex justify-between items-center text-white/90">
          <BirimLogo variant="white" className="h-6 w-auto object-contain drop-shadow" />
          <span className="text-[9.5px] font-mono tracking-[0.25em] uppercase drop-shadow text-white/80">
            CHAPTER // {indexStr}
          </span>
        </div>

        {/* Bottom Floating Luxury Glass Card */}
        <div className="relative z-10 p-[18mm] pt-0">
          <div className="bg-white/95 backdrop-blur-md p-7 max-w-[155mm] border border-neutral-200/80 shadow-2xl">
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-1.5">
              COLLECTION {indexStr}
            </span>
            <h2 className="text-[32px] font-light tracking-[0.08em] uppercase text-neutral-950 leading-none mb-3">
              {uppercaseTitle}
            </h2>
            {displaySubtitle && (
              <p className="text-[11px] font-light leading-[1.8] text-neutral-700 text-justify mb-4">
                {displaySubtitle}
              </p>
            )}
            <div className="flex justify-between items-center hairline-t pt-3 text-[8.5px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>{categoryProducts.length} {isTr ? 'SEÇKİN MODEL' : 'CURATED MODELS'}</span>
              <span>WWW.BIRIM.COM</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 4: LIVING DIVANI STYLE (Sessiz Minimalizm & Saf Negatif Alan)
  // =========================================================================
  if (variant === 'alt-4') {
    return (
      <div className="catalog-page bg-[#FFFFFF] p-[24mm] flex flex-col justify-between select-none">
        {/* Top Minimal Folio */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-neutral-400">
          <BirimLogo variant="black" className="h-5 w-auto object-contain" />
          <span className="font-mono text-neutral-300">{indexStr}</span>
        </div>

        {/* Central Poetic Panoramic Window */}
        <div className="my-auto h-[90mm] w-full flex items-center justify-center">
          {heroImage ? (
            <InteractiveCatalogImage
              id={`cat-alt4-${category.slug}`}
              src={heroImage}
              alt={displayTitle}
              containerClassName="w-full h-full flex items-center justify-center"
              objectFit="contain"
              isMirrored={isHeroMirrored}
            />
          ) : (
            <div className="text-[10px] text-neutral-300 font-mono uppercase tracking-widest">
              {displayTitle}
            </div>
          )}
        </div>

        {/* Bottom Typography in Ultra-Wide Tracking */}
        <div className="space-y-4">
          <div className="hairline-b pb-4">
            <h2 className="text-[17px] font-light tracking-[0.32em] uppercase text-neutral-900 leading-tight">
              {uppercaseTitle}
            </h2>
            {category.name.en && isTr && (
              <span className="text-[8.5px] tracking-[0.25em] text-neutral-400 uppercase font-mono block mt-1.5">
                {category.name.en}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-[8.5px] font-mono tracking-[0.25em] text-neutral-400 uppercase pt-1">
            <span>WWW.BIRIM.COM</span>
            <span>{String(pageNumber).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 5: POLIFORM STYLE (Grafik Mozaik & Çoklu Model Önizleme Grid'i)
  // =========================================================================
  if (variant === 'alt-5') {
    return (
      <div className="catalog-page bg-[#FFFFFF] p-[18mm] flex flex-col justify-between select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 hairline-b pb-3">
          <BirimLogo variant="black" className="h-6 w-auto object-contain" />
          <span className="font-mono text-neutral-400">
            {isTr ? `BÖLÜM DİZİNİ / ${indexStr}` : `SECTION DIRECTORY / ${indexStr}`}
          </span>
        </div>

        {/* Title Bar */}
        <div className="pt-2 pb-1 flex justify-between items-baseline hairline-b pb-3">
          <div>
            <span className="text-[8.5px] font-mono tracking-[0.3em] uppercase text-neutral-400 block mb-0.5">
              COLLECTION {indexStr}
            </span>
            <h2 className="text-[28px] font-light tracking-[0.1em] uppercase text-neutral-950 leading-none">
              {uppercaseTitle}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-neutral-700">
            {categoryProducts.length} {isTr ? 'MODEL' : 'MODELS'}
          </span>
        </div>

        {/* Main Body: Upper Hero + Lower Mosaic Showcase */}
        <div className="flex-1 my-auto flex flex-col justify-around py-2 gap-4">
          {/* Upper Hero Crop */}
          <div className="h-[75mm] w-full bg-white relative overflow-hidden flex items-center justify-center hairline-b pb-2">
            {heroImage && (
              <InteractiveCatalogImage
                id={`cat-alt5-${category.slug}`}
                src={heroImage}
                alt={displayTitle}
                containerClassName="w-full h-full flex items-center justify-center bg-white"
                objectFit="contain"
                isMirrored={isHeroMirrored}
              />
            )}
          </div>

          {/* Lower Mosaic Gallery (Up to 3 secondary products) */}
          <div className="grid grid-cols-3 gap-4 pt-1">
            {categoryProducts.slice(1, 4).map((p, idx) => {
              const pImg = p.cover_image?.url || p.gallery_images?.[0]?.url;
              const pMirrored = p.cover_image ? p.cover_image.is_mirrored : p.gallery_images?.[0]?.is_mirrored;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="aspect-[4/3] bg-neutral-50 border border-neutral-200 overflow-hidden relative">
                    {pImg ? (
                      <img
                        src={pImg}
                        alt={p.name.tr}
                        className={`w-full h-full object-cover ${pMirrored ? '-scale-x-100' : ''}`}
                        crossOrigin="anonymous"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-300 font-mono">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline pt-0.5">
                    <span className="text-[9px] font-medium uppercase tracking-wider text-neutral-800 truncate">
                      {isTr ? p.name.tr : p.name.en}
                    </span>
                    <span className="text-[7.5px] font-mono text-neutral-400">
                      {p.models_and_variations?.length || 1}V
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] uppercase text-neutral-400 hairline-t pt-3">
          <span>WWW.BIRIM.COM</span>
          <span className="font-mono">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 6: BİRİM COLLECTION OFFICIAL STYLE (Klasik Resmi PDF Şablonu)
  // =========================================================================
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
            {displaySubtitle.toUpperCase()}
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

      {/* Footer Rule & Pagination */}
      <div className="w-full">
        <div className="w-full border-t border-[#D8D8D8] mb-3" />
        <div className="flex justify-between items-center text-[9px] tracking-[0.22em] text-[#888888] uppercase font-light">
          <span>WWW.BIRIM.COM</span>
          <span className="tracking-widest font-mono">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
