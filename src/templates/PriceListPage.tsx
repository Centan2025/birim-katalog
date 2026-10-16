import React from 'react';
import { CatalogProduct, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

interface PriceListPageProps {
  products: CatalogProduct[];
  categoryTitle: string;
  pageNumber: number;
  currency?: 'EUR' | 'USD' | 'TRY';
  lang?: Language;
}

export const PriceListPage: React.FC<PriceListPageProps> = ({
  products,
  categoryTitle,
  pageNumber,
  currency = 'EUR',
  lang = 'tr'
}) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex justify-between items-center hairline-b pb-3">
        <div className="flex items-center space-x-4">
          <BirimLogo variant="black" className="h-4 w-auto object-contain" />
          <h2 className="text-[12px] tracking-[0.2em] uppercase font-light text-neutral-900 border-l border-neutral-300 pl-3">
            {categoryTitle} — FİYAT LİSTESİ / PRICE LIST
          </h2>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
          PARA BİRİMİ: {currency}
        </span>
      </div>

      {/* Table */}
      <div className="my-auto overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-900 text-[8px] tracking-[0.2em] uppercase text-neutral-600 font-semibold">
              <th className="py-2 pl-1">ÜRÜN / MODEL</th>
              <th className="py-2">MODEL KODU</th>
              <th className="py-2">ÖLÇÜLER (W x D x H)</th>
              <th className="py-2">KATEGORİ</th>
              <th className="py-2 text-right pr-1">FİYAT ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-[8.5px]">
            {products.slice(0, 16).map((item, idx) => {
              const title = lang === 'en' ? item.name.en : item.name.tr;
              const firstVariation = item.models_and_variations?.[0];
              const modelCode = firstVariation?.model_code || item.slug.toUpperCase();
              
              return (
                <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-2 pl-1 font-medium text-neutral-900 uppercase">
                    {title}
                  </td>
                  <td className="py-2 font-mono text-neutral-500">
                    {modelCode}
                  </td>
                  <td className="py-2 text-neutral-500 font-mono">
                    Standart Proje Ebatı
                  </td>
                  <td className="py-2 text-neutral-400 uppercase text-[8px]">
                    {lang === 'en' ? item.category.name.en : item.category.name.tr}
                  </td>
                  <td className="py-2 text-right pr-1 font-mono text-neutral-900 font-medium">
                    —
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="space-y-3">
        <div className="text-[7.5px] text-neutral-400 font-light leading-relaxed hairline-t pt-2">
          * Fiyatlar fabrika teslim (Ex-Works) olup nakliye ve montaj hariçtir. BİRİM, ürün özelliklerinde ve fiyatlandırmada önceden haber vermeksizin değişiklik yapma hakkını saklı tutar.
        </div>
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
          <span>BİRİM MOBİLYA A.Ş.</span>
          <span className="font-mono">{String(pageNumber).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
};
