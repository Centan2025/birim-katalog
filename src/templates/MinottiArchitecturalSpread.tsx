import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface MinottiSpreadProps {
  product: CatalogProduct;
  pageNumberLeft: number;
  pageNumberRight: number;
  lang?: Language;
}

export const MinottiArchitecturalSpread: React.FC<MinottiSpreadProps> = ({
  product,
  pageNumberLeft,
  pageNumberRight,
  lang = 'tr'
}) => {
  const title = lang === 'en' ? product.name.en : product.name.tr;
  
  // Clean description and avoid "edisyon" terminology safely
  const rawDesc = (product.long_description 
    ? (lang === 'en' ? product.long_description.en : product.long_description.tr)
    : (product.short_description ? (lang === 'en' ? product.short_description.en : product.short_description.tr) : '')) || '';
  
  const desc = rawDesc 
    ? rawDesc
        .replace(/edisyonlu/gi, 'özel')
        .replace(/edisyon/gi, 'koleksiyon')
        .replace(/varyasyonlar/gi, 'modeller')
        .replace(/varyasyon/gi, 'seçenek')
        .replace(/varyantlar/gi, 'modeller')
        .replace(/varyant/gi, 'model')
    : '';

  const designersStr = product.designers?.length
    ? product.designers.map(d => (lang === 'en' ? d.name.en : d.name.tr)).join(' & ')
    : 'BİRİM TASARIM EKİBİ';

  // Find best technical drawing and hero images
  const dimImages = product.dimension_images || [];
  const heroImage = product.cover_image?.url || product.gallery_images?.[0]?.url;
  const isHeroMirrored = product.cover_image ? product.cover_image.is_mirrored : product.gallery_images?.[0]?.is_mirrored;

  return (
    <div className="catalog-spread-row flex flex-row gap-0">
      {/* LEFT PAGE: Pure White Architectural Presentation with Interactive Drag/Pan/Zoom */}
      <div className="catalog-page catalog-page-bleed bg-white relative overflow-hidden flex flex-col justify-between border-r border-neutral-200">
        {heroImage ? (
          <InteractiveCatalogImage
            id={`minotti-hero-${product.slug}`}
            src={heroImage}
            alt={title}
            containerClassName="absolute inset-0 w-full h-full bg-white"
            objectFit="contain"
            isMirrored={isHeroMirrored}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 uppercase tracking-widest text-xs">
            {lang === 'en' ? 'Image Not Available' : 'Görsel Bulunamadı'}
          </div>
        )}

        {/* Bottom Folio / Product Identity */}
        <div className="relative z-10 p-[16mm] mt-auto flex items-center justify-center pointer-events-none">
          <span className="font-mono text-neutral-400 text-[10px] tracking-[0.25em] absolute left-[16mm] bottom-[16mm]">
            {String(pageNumberLeft).padStart(3, '0')}
          </span>
          <span className="text-[16px] font-light tracking-[0.22em] uppercase text-neutral-900 text-center">
            {title}
          </span>
        </div>
      </div>

      {/* RIGHT PAGE: Architectural Typographic & Dimension Study (High Contrast Crisp White Paper) */}
      <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
        {/* Top Folio Header with Larger Original Logo */}
        <div className="flex items-center pb-3.5 mb-10">
          <BirimLogo variant="black" className="h-6 w-auto object-contain" />
        </div>

        {/* Product Identity & Editorial Text */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <h2 className="text-[26px] font-light tracking-[0.12em] uppercase text-neutral-900 leading-none">
              {title}
            </h2>
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-medium block">
              {designersStr} {product.design_year ? `— ${product.design_year}` : ''}
            </span>
          </div>

          {desc && (
            <p className="text-[11px] leading-[1.8] text-neutral-700 font-normal max-w-[145mm] text-justify tracking-normal">
              {desc}
            </p>
          )}
        </div>

        {/* Center: Technical 2D Line Schematic with Pure White Background and Dynamic Multi-Drawing Grid */}
        <div className="my-auto pt-1 pb-2">
          <div className="pb-1.5 mb-2 flex justify-between items-baseline">
            <span className="text-[26px] font-light tracking-[0.12em] uppercase text-neutral-900 leading-none">
              {lang === 'en' ? 'DIMENSIONS' : 'ÖLÇÜLER'}
            </span>
          </div>

          {/* Dynamic Unbordered Multi-Drawing Grid */}
          {dimImages.length === 0 && (
            <div className="h-[78mm] w-full bg-white flex items-center justify-center text-[10px] text-neutral-400 font-light">
              {lang === 'en' ? 'Technical drawing not available' : 'Teknik ölçü çizimi mevcut değil'}
            </div>
          )}

          {dimImages.length === 1 && (
            <div className="h-[125mm] w-full bg-white relative overflow-hidden flex flex-col justify-between">
              <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
                <span className="text-[9.5px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                  {dimImages[0].model_code}
                </span>
              </div>
              <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
                <InteractiveCatalogImage
                  id={`dim-${product.slug}-0`}
                  src={dimImages[0].url}
                  alt={`${title} ${lang === 'en' ? 'Dimensions' : 'Ölçüler'}`}
                  containerClassName="w-full h-full bg-white"
                  objectFit="contain"
                  initialScale={1}
                  isMirrored={dimImages[0].is_mirrored}
                />
              </div>
            </div>
          )}

          {dimImages.length === 2 && (
            <div className="grid grid-cols-2 gap-6 h-[125mm] w-full bg-white">
              {dimImages.slice(0, 2).map((dim, idx) => (
                <div key={idx} className="h-full flex flex-col justify-between bg-white overflow-hidden">
                  <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
                    <span className="text-[9.5px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                      {dim.model_code}
                    </span>
                  </div>
                  <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
                    <InteractiveCatalogImage
                      id={`dim-${product.slug}-${idx}`}
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
          )}

          {dimImages.length >= 3 && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 h-[145mm] w-full bg-white">
              {dimImages.slice(0, 4).map((dim, idx) => (
                <div key={idx} className="h-full flex flex-col justify-between bg-white overflow-hidden">
                  <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
                    <span className="text-[9px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                      {dim.model_code}
                    </span>
                  </div>
                  <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
                    <InteractiveCatalogImage
                      id={`dim-${product.slug}-${idx}`}
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
          )}
        </div>

        {/* Bottom Folio Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-500 pt-3 mt-2">
          <span className="lowercase">www.birim.com</span>
          <span className="font-mono text-neutral-700">{String(pageNumberRight).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
};
