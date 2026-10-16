import React from 'react';
import { Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

interface EditorialPageProps {
  pageNumber: number;
  lang?: Language;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({
  pageNumber,
  lang = 'tr'
}) => {
  const isTr = lang === 'tr';

  return (
    <div className="catalog-page bg-[#FFFFFF] text-neutral-900 p-[24mm] flex flex-col justify-between select-none border-r border-neutral-200">
      {/* Top Folio - High Contrast with Larger Logo */}
      <div className="flex justify-between items-center text-[10px] tracking-[0.3em] uppercase text-neutral-600 border-b border-neutral-300 pb-4">
        <BirimLogo variant="black" className="h-6 w-auto object-contain" />
        <span className="font-mono text-neutral-500">MİMARİ YAKLAŞIM / ARCHITECTURAL STATEMENT</span>
      </div>

      {/* Main Editorial Text & Quotation */}
      <div className="space-y-10 max-w-[145mm] my-auto">
        <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold block">
          {isTr ? 'BİRİM TASARIM FELSEFESİ' : 'THE BİRİM DESIGN PHILOSOPHY'}
        </span>

        <h2 className="text-[30px] font-light tracking-wide leading-[1.4] text-neutral-950 uppercase">
          {isTr 
            ? 'Mimari orantılar, zamansız strüktürler ve sessiz bir mekânsal varlık.' 
            : 'Architectural proportions, timeless structures, and a quiet spatial presence.'}
        </h2>

        <div className="w-20 h-[2px] bg-neutral-900" />

        <div className="space-y-5 text-[12px] leading-[2.1] font-normal text-neutral-800 tracking-normal text-justify">
          <p>
            {isTr
              ? 'BİRİM; modern yaşam ve çalışma alanlarını yalnızca nesnelerle doldurmak değil, mimariyle sessiz bir diyaloğa giren formlar inşa etmek amacıyla üretmektedir. Tasarım prensiplerimizin merkezinde; gereksiz süslemelerden arındırılmış rasyonel çizgiler, birinci sınıf doğal zanaat teknikleri ve metal, masif ahşap ile seçkin kumaşların hassas dengesi yer alır.'
              : 'BİRİM creates not merely to fill modern living and working environments with objects, but to construct forms that engage in a quiet dialogue with architecture. At the heart of our design principles lies rational lines stripped of superfluous ornamentation, superior artisanal craftsmanship, and the precise balance of metals, solid woods, and curated fabrics.'}
          </p>
          <p>
            {isTr
              ? 'Bu katalog; her biri çağdaş tasarımcıların vizyonu ve BİRİM üretim atölyelerinin usta elleriyle hayat bulan seçkin mobilya koleksiyonumuzun teknik ve estetik bir arşividir.'
              : 'This catalog serves as both a technical and aesthetic archive of our distinctive furniture collection, brought to life through the vision of contemporary designers and the mastery of BİRİM ateliers.'}
          </p>
        </div>
      </div>

      {/* Bottom Folio */}
      <div className="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase text-neutral-500 border-t border-neutral-300 pt-4">
        <span>İSTANBUL / FABRİKA VE MERKEZ ATÖLYE</span>
        <span className="font-mono text-neutral-800 font-medium">{String(pageNumber).padStart(3, '0')}</span>
      </div>
    </div>
  );
};
