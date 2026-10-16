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
  const categoryName = lang === 'en' ? product.category.name.en : product.category.name.tr;
  
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

  return (
    <div className="catalog-spread-row flex flex-row gap-0 print:block">
      {/* LEFT PAGE: Pure White Architectural Presentation with Interactive Drag/Pan/Zoom */}
      <div className="catalog-page catalog-page-bleed bg-white relative overflow-hidden flex flex-col justify-between border-r border-neutral-200">
        {heroImage ? (
          <InteractiveCatalogImage
            id={`minotti-hero-${product.slug}`}
            src={heroImage}
            alt={title}
            containerClassName="absolute inset-0 w-full h-full bg-white"
            objectFit="contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 uppercase tracking-widest text-xs">
            Görsel Bulunamadı
          </div>
        )}

        {/* Subtle Bottom Left Folio Overlay on Pure White Background */}
        <div className="relative z-10 p-[16mm] mt-auto flex justify-between items-end text-[10px] tracking-[0.25em] text-neutral-500 font-normal pointer-events-none">
          <span className="uppercase">{categoryName} / {title}</span>
          <span className="font-mono text-neutral-700">{String(pageNumberLeft).padStart(3, '0')}</span>
        </div>
      </div>

      {/* RIGHT PAGE: Architectural Typographic & Dimension Study (High Contrast Crisp White Paper) */}
      <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
        {/* Top Folio Header with Larger Original Logo */}
        <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-neutral-500 uppercase hairline-b pb-3">
          <BirimLogo variant="black" className="h-6 w-auto object-contain -ml-3" />
          <span>{categoryName} / {title}</span>
        </div>

        {/* Product Identity & Editorial Text */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-medium block">
              DESIGN BY {designersStr} {product.design_year ? `— ${product.design_year}` : ''}
            </span>
            <h2 className="text-[34px] font-light tracking-[0.12em] uppercase text-neutral-900 leading-none">
              {title}
            </h2>
          </div>

          {desc && (
            <p className="text-[11px] leading-[1.8] text-neutral-700 font-normal max-w-[145mm] text-justify tracking-normal">
              {desc}
            </p>
          )}
        </div>

        {/* Center: Technical 2D Line Schematic with Pure White Background and Dynamic Multi-Drawing Grid */}
        <div className="my-auto pt-1 pb-2">
          <div className="hairline-b pb-1.5 mb-2 flex justify-between items-baseline">
            <span className="text-[30px] tracking-[0.04em] uppercase text-neutral-900 font-light leading-none">
              {lang === 'en' ? 'DIMENSIONS' : 'ÖLÇÜLER'}
            </span>
          </div>

          {/* Dynamic Unbordered Multi-Drawing Grid */}
          {dimImages.length === 0 && (
            <div className="h-[78mm] w-full bg-white flex items-center justify-center text-[10px] text-neutral-400 font-light">
              Teknik ölçü çizimi mevcut değil
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
                  alt={`${title} Ölçüler`}
                  containerClassName="w-full h-full bg-white"
                  objectFit="contain"
                  initialScale={1}
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
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Folio Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-500 hairline-t pt-3 mt-2">
          <span className="uppercase">WWW.BIRIM.COM</span>
          <span className="font-mono text-neutral-700">{String(pageNumberRight).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
};
