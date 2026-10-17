import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';
import { InteractiveCatalogImage } from '../components/InteractiveCatalogImage';

interface PoliformSpecSheetProps {
  product: CatalogProduct;
  pageNumber?: number;
  lang?: Language;
}

export const PoliformSpecSheet: React.FC<PoliformSpecSheetProps> = ({
  product,
  pageNumber = 1,
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

  const heroImage = product.cover_image?.url || product.gallery_images?.[0]?.url;
  const isHeroMirrored = product.cover_image ? product.cover_image.is_mirrored : product.gallery_images?.[0]?.is_mirrored;
  const dimensionImgObj = product.dimension_images?.[0];
  const dimensionImg = dimensionImgObj?.url;

  const extractDimensionsFromCode = (code: string): string => {
    if (!code) return '';
    const match = code.match(/(\d+)[Xx](\d+)(?:[Xx](\d+))?/);
    if (!match) return '';
    const [_, w, d, h] = match;
    return h ? `${w} × ${d} × ${h} cm` : `${w} × ${d} cm`;
  };

  const dimensionList = React.useMemo(() => {
    const list: Array<{ model_code: string; title: string; dimensions?: string }> = [];
    const seen = new Set<string>();

    if (product.dimension_images && product.dimension_images.length > 0) {
      product.dimension_images.forEach(d => {
        const code = d.model_code || (typeof d.title === 'string' ? d.title : d.title?.tr) || '';
        if (code && !seen.has(code)) {
          seen.add(code);
          list.push({
            model_code: code,
            title: typeof d.title === 'string' ? d.title : (d.title?.tr || code),
            dimensions: extractDimensionsFromCode(code)
          });
        }
      });
    }

    if (list.length === 0 && product.models_and_variations && product.models_and_variations.length > 0) {
      product.models_and_variations.forEach(m => {
        if (m.model_code && !seen.has(m.model_code)) {
          seen.add(m.model_code);
          list.push({
            model_code: m.model_code,
            title: typeof m.name === 'string' ? m.name : (m.name?.tr || m.model_code),
            dimensions: m.dimensions_text || extractDimensionsFromCode(m.model_code)
          });
        }
      });
    }

    return list;
  }, [product]);

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none">
      {/* Top Header: Brand & Document Classification with Larger Logo */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
        <div className="flex items-center space-x-4">
          <BirimLogo variant="black" className="h-8 w-auto object-contain" />
          <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-light border-l border-neutral-300 pl-3">
            {lang === 'en' ? 'PRODUCT SPECIFICATION SHEET' : 'ÜRÜN TEKNİK BİLGİ FÖYÜ'}
          </span>
        </div>
        <div className="text-[9.5px] tracking-[0.2em] text-neutral-500 uppercase font-mono">
          {categoryName}
        </div>
      </div>

      {/* Hero Visual Container (A4 Top 45% with Interactive Pan/Zoom) */}
      <div className="w-full h-[115mm] bg-white overflow-hidden relative my-3">
        {heroImage ? (
          <InteractiveCatalogImage
            id={`poliform-hero-${product.slug}`}
            src={heroImage}
            alt={title}
            containerClassName="w-full h-full bg-white"
            objectFit="contain"
            isMirrored={isHeroMirrored}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
            {lang === 'en' ? 'Image Not Available' : 'Görsel Yüklenemedi'}
          </div>
        )}
      </div>

      {/* Bottom Grid: 2 Columns (Specs & Description / Technical Drawing & Dimensions) */}
      <div className="grid grid-cols-12 gap-6 flex-1 items-start">
        {/* Left Column (5 Cols): Product Info, Narrative & Finishes */}
        <div className="col-span-5 space-y-4">
          <div>
            <h1 className="text-[22px] font-light tracking-[0.15em] text-neutral-900 uppercase leading-none">
              {title}
            </h1>
            <p className="text-[8.5px] tracking-[0.2em] uppercase text-neutral-500 mt-1">
              {lang === 'en' ? 'DESIGN BY' : 'TASARIM:'} {designersStr} {product.design_year ? `(${product.design_year})` : ''}
            </p>
          </div>

          <p className="text-[8.5px] leading-[1.65] text-neutral-600 font-light text-justify">
            {desc}
          </p>

          <div className="pt-2 border-t border-neutral-200 space-y-1.5 text-[8px]">
            <div className="flex justify-between text-neutral-500">
              <span className="uppercase tracking-wider font-medium">{lang === 'en' ? 'Category:' : 'Kategori:'}</span>
              <span className="text-neutral-800">{categoryName}</span>
            </div>
            {product.collection_and_family?.family_name && (
              <div className="flex justify-between text-neutral-500">
                <span className="uppercase tracking-wider font-medium">{lang === 'en' ? 'Series / Family:' : 'Seri / Aile:'}</span>
                <span className="text-neutral-800">{product.collection_and_family.family_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Technical CAD Drawing & Structured Model Matrix */}
        <div className="col-span-7 flex flex-col justify-start space-y-2">
          {/* Header */}
          <div className="flex justify-between items-baseline border-b border-neutral-200 pb-1">
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-neutral-800">
              {lang === 'en' ? 'DIMENSIONS & DRAWINGS' : 'ÖLÇÜLER & TEKNİK ÇİZİM'}
            </span>
            <span className="text-[8px] tracking-wider font-mono text-neutral-400">
              {lang === 'en' ? 'UNIT: CM' : 'BİRİM: CM'}
            </span>
          </div>

          {/* Drawing Container - Compact height to eliminate empty gap */}
          <div className="h-[46mm] w-full bg-white overflow-hidden relative flex items-center justify-center">
            {dimensionImg ? (
              <InteractiveCatalogImage
                id={`poliform-dim-${product.slug}`}
                src={dimensionImg}
                alt={`${title} ${lang === 'en' ? 'Drawing' : 'Çizim'}`}
                containerClassName="w-full h-full"
                objectFit="contain"
                initialScale={1}
                isMirrored={dimensionImgObj?.is_mirrored}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8.5px] text-neutral-400">
                {lang === 'en' ? 'Drawing Pending' : 'Çizim Ekleniyor'}
              </div>
            )}
          </div>

          {/* Model & Dimension Spec Matrix */}
          {dimensionList.length === 1 ? (
            // SINGLE MODEL: Clean unified spec line directly docked under the drawing (no "STANDART ÖLÇÜ" text)
            <div className="border-t border-neutral-200 pt-2 flex items-center justify-between text-[9px] font-mono">
              <span className="font-semibold text-neutral-900 tracking-wider">
                {dimensionList[0].model_code}
              </span>
              {dimensionList[0].dimensions && (
                <span className="text-neutral-600 font-normal">
                  {dimensionList[0].dimensions}
                </span>
              )}
            </div>
          ) : dimensionList.length > 1 && dimensionList.length <= 4 ? (
            // FEW MODELS (2 to 4): Elegant compact spec table
            <div className="border-t border-neutral-200 pt-1.5 space-y-1">
              {dimensionList.map((item) => (
                <div 
                  key={item.model_code} 
                  className="flex justify-between items-center text-[8.5px] font-mono py-0.5 border-b border-neutral-100 last:border-b-0"
                >
                  <span className="font-semibold text-neutral-900 tracking-wider">
                    {item.model_code}
                  </span>
                  <span className="text-neutral-600 font-medium">
                    {item.dimensions || item.title}
                  </span>
                </div>
              ))}
            </div>
          ) : dimensionList.length > 4 ? (
            // MULTIPLE MODELS (5+): Two-column compact matrix (no clipping, natural full expansion)
            <div className="border-t border-neutral-200 pt-1.5 grid grid-cols-2 gap-x-5 gap-y-1">
              {dimensionList.map((item) => (
                <div 
                  key={item.model_code} 
                  className="flex justify-between items-center text-[8px] font-mono py-0.5 border-b border-neutral-100"
                >
                  <span className="font-medium text-neutral-900 truncate">
                    {item.model_code}
                  </span>
                  <span className="text-neutral-500 text-right ml-1 whitespace-nowrap">
                    {item.dimensions}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // FALLBACK
            <div className="border-t border-neutral-200 pt-2 text-[8.5px] font-mono tracking-wider text-neutral-700 uppercase">
              {title}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Technical Footer */}
      <div className="flex justify-between items-center pt-2.5 mt-2 text-[8px] tracking-[0.2em] text-neutral-400 uppercase">
        <span className="lowercase">www.birim.com</span>
        <span className="font-mono">{String(pageNumber).padStart(3, '0')}</span>
      </div>
    </div>
  );
};
