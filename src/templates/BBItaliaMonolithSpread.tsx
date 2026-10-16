import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface BBItaliaSpreadProps {
  product: CatalogProduct;
  pageNumberLeft: number;
  pageNumberRight: number;
  lang?: Language;
}

export const BBItaliaMonolithSpread: React.FC<BBItaliaSpreadProps> = ({
  product,
  pageNumberLeft,
  pageNumberRight,
  lang = 'tr'
}) => {
  const title = lang === 'en' ? product.name.en : product.name.tr;
  const categoryName = lang === 'en' ? product.category.name.en : product.category.name.tr;
  const rawDesc = (product.short_description 
    ? (lang === 'en' ? product.short_description.en : product.short_description.tr) 
    : '') || '';
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
    : 'BİRİM STUDIO';

  const heroImage = product.cover_image?.url;
  const detailImage = product.gallery_images?.[0]?.url || product.gallery_images?.[1]?.url;
  const dimImages = product.dimension_images || [];

  return (
    <div className="catalog-spread-row flex flex-row gap-0 print:block">
      {/* LEFT PAGE: Pure Sculptural Object on Pure White Background */}
      <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none border-r border-neutral-200">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-neutral-400">
          <BirimLogo variant="black" className="h-3.5 w-auto object-contain" />
          <span>{categoryName}</span>
        </div>

        {/* Sculptural Hero Presentation - Taller area to prevent clipping during zoom/pan */}
        <div className="flex-1 w-full my-2 min-h-[195mm] relative flex items-center justify-center">
          {heroImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <InteractiveCatalogImage
                id={`bb-hero-${product.slug}`}
                src={heroImage}
                alt={title}
                containerClassName="w-full h-full flex items-center justify-center"
                objectFit="contain"
              />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-neutral-400 text-xs">
              Görsel Hazırlanıyor
            </div>
          )}
        </div>

        {/* Bottom Hero Identifier */}
        <div className="flex justify-between items-end border-t border-neutral-300 pt-4">
          <div>
            <h2 className="text-[28px] font-light tracking-[0.2em] uppercase text-neutral-900 leading-none">
              {title}
            </h2>
            <p className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase mt-1">
              DESIGN {designersStr}
            </p>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-neutral-400">
            {String(pageNumberLeft).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* RIGHT PAGE: Details, Architectural Section, Specifications */}
      <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-neutral-400 hairline-b pb-3">
          <span>TECHNICAL & MATERIALS</span>
          <span>{title}</span>
        </div>

        {/* Detail Photo + Editorial Synopsis */}
        <div className="grid grid-cols-2 gap-4 items-start pt-2">
          {/* Detail crop */}
          <div className="h-[52mm] bg-neutral-100 overflow-hidden relative">
            {detailImage ? (
              <img
                src={detailImage}
                alt={`${title} Detay`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400">
                Detay Görseli
              </div>
            )}
          </div>

          {/* Text Synopsis */}
          <div className="space-y-3">
            <span className="text-[8px] tracking-[0.25em] uppercase text-neutral-400 font-medium block">
              DESIGN RATIONALE
            </span>
            <p className="text-[9.5px] leading-[1.7] text-neutral-600 font-light text-justify">
              {desc || 'Zarif detaylar ve mimari orantılarla mekanın dengesini kuran çağdaş form dili.'}
            </p>
          </div>
        </div>

        {/* Center: CAD Drawing */}
        <div className="space-y-2 py-2">
          <div className="hairline-b pb-1.5 mb-2 flex justify-between items-baseline">
            <span className="text-[20px] tracking-[0.04em] uppercase text-neutral-900 font-light leading-none">
              {lang === 'en' ? 'DIMENSIONS' : 'ÖLÇÜLER'}
            </span>
          </div>

          {dimImages.length === 0 && (
            <div className="h-[75mm] w-full bg-white flex items-center justify-center text-[10px] text-neutral-400 font-light">
              Teknik ölçü çizimi mevcut değil
            </div>
          )}

          {dimImages.length === 1 && (
            <div className="h-[88mm] w-full bg-white relative overflow-hidden flex flex-col justify-between">
              <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
                <span className="text-[9.5px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                  {dimImages[0].model_code}
                </span>
              </div>
              <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
                <InteractiveCatalogImage
                  id={`bb-dim-${product.slug}-0`}
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
            <div className="grid grid-cols-2 gap-4 h-[88mm] w-full bg-white">
              {dimImages.slice(0, 2).map((dim, idx) => (
                <div key={idx} className="h-full flex flex-col justify-between bg-white overflow-hidden">
                  <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
                    <span className="text-[9px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                      {dim.model_code}
                    </span>
                  </div>
                  <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
                    <InteractiveCatalogImage
                      id={`bb-dim-${product.slug}-${idx}`}
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 h-[88mm] w-full bg-white">
              {dimImages.slice(0, 4).map((dim, idx) => (
                <div key={idx} className="h-full flex flex-col justify-between bg-white overflow-hidden">
                  <div className="w-full flex justify-start pb-1 relative z-20 flex-shrink-0">
                    <span className="text-[8.5px] font-mono text-neutral-800 uppercase tracking-wider font-semibold leading-none select-none">
                      {dim.model_code}
                    </span>
                  </div>
                  <div className="flex-1 w-full bg-white overflow-hidden relative z-10">
                    <InteractiveCatalogImage
                      id={`bb-dim-${product.slug}-${idx}`}
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



        {/* Bottom Folio */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-400 hairline-t pt-3">
          <span className="uppercase">BİRİM MOBİLYA</span>
          <span className="font-mono">{String(pageNumberRight).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
};
