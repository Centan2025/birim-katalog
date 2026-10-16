import React from 'react';
import { EditorialVariant, Language } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

interface EditorialPageProps {
  pageNumber: number;
  lang?: Language;
  variant?: EditorialVariant;
  featuredVisual?: string;
  secondaryVisual?: string;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({
  pageNumber,
  lang = 'tr',
  variant = 'alt-1',
  featuredVisual,
  secondaryVisual,
}) => {
  const isTr = lang === 'tr';

  // Fallback visuals from Birim collection if not passed
  const heroImg = featuredVisual || 'https://birim-assets.web-birim.workers.dev/migration/products/ms0008-alan/media/1789055250189-bm_alan-01.webp';
  const detailImg = secondaryVisual || 'https://birim-assets.web-birim.workers.dev/migration/products/ms0008-alan/1789133103471-MS008_ALAN_01__.webp';

  // =========================================================================
  // ALT 1: MINOTTI ARCHITECTURAL STYLE (Klasik Tipografik Manifesto & 3 İlke)
  // =========================================================================
  if (variant === 'alt-1') {
    return (
      <div className="catalog-page bg-[#FFFFFF] text-neutral-900 p-[22mm] flex flex-col justify-between select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[10px] tracking-[0.3em] uppercase text-neutral-500 hairline-b pb-3">
          <BirimLogo variant="black" className="h-6 w-auto object-contain" />
          <span className="font-mono text-neutral-400">
            {isTr ? 'MİMARİ YAKLAŞIM // ARCHITECTURAL STATEMENT' : 'ARCHITECTURAL STATEMENT // 2026'}
          </span>
        </div>

        {/* Main Editorial Text & Quotation */}
        <div className="space-y-6 max-w-[155mm] my-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-semibold block">
            {isTr ? 'BİRİM TASARIM FELSEFESİ' : 'THE BİRİM DESIGN PHILOSOPHY'}
          </span>

          <h2 className="text-[28px] font-light tracking-wide leading-[1.35] text-neutral-950 uppercase">
            {isTr 
              ? 'Mimari orantılar, zamansız strüktürler ve sessiz bir mekânsal varlık.' 
              : 'Architectural proportions, timeless structures, and a quiet spatial presence.'}
          </h2>

          <div className="w-16 h-[2px] bg-neutral-950" />

          {/* 2-Column Split Text */}
          <div className="grid grid-cols-2 gap-8 text-[11px] leading-[1.9] text-neutral-700 font-light text-justify pt-1">
            <p>
              {isTr
                ? 'BİRİM; modern yaşam ve çalışma alanlarını yalnızca nesnelerle doldurmak değil, mimariyle sessiz bir diyaloğa giren formlar inşa etmek amacıyla üretmektedir. Tasarım prensiplerimizin merkezinde; gereksiz süslemelerden arındırılmış rasyonel çizgiler yer alır.'
                : 'BİRİM creates not merely to fill modern living environments with objects, but to construct forms that engage in a quiet dialogue with architecture. At the heart of our design principles lies rational lines stripped of superfluous ornamentation.'}
            </p>
            <p>
              {isTr
                ? 'Birinci sınıf doğal zanaat teknikleri, hassas metal mühendisliği ve seçkin kumaşların hassas dengesi; çağdaş tasarımcıların vizyonu ve BİRİM atölyelerinin ustalığıyla hayat bulan seçkin bir mimari arşive dönüşür.'
                : 'Superior artisanal craftsmanship, precision metal engineering, and the balanced curation of noble fabrics transform into an architectural archive brought to life through contemporary designers and the mastery of BİRİM ateliers.'}
            </p>
          </div>

          {/* 3 Principles Strip */}
          <div className="grid grid-cols-3 gap-6 pt-4 hairline-t">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 block mb-1">01 / ORANTI</span>
              <p className="text-[9.5px] text-neutral-600 leading-relaxed font-light">
                {isTr ? 'İnsan ergonomisi ve mekan hacmiyle uyumlu rasyonel geometri.' : 'Rational geometry in harmony with human ergonomics and spatial scale.'}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 block mb-1">02 / ZANAAT</span>
              <p className="text-[9.5px] text-neutral-600 leading-relaxed font-light">
                {isTr ? 'Atölyelerimizde nesilden nesile aktarılan el işçiliği ve hassasiyet.' : 'Artisanal mastery and precision passed down through generations in our ateliers.'}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 block mb-1">03 / KALICILIK</span>
              <p className="text-[9.5px] text-neutral-600 leading-relaxed font-light">
                {isTr ? 'Geçici trendlerden bağımsız, mekanla olgunlaşan estetik değer.' : 'Timeless aesthetic value that matures gracefully alongside architecture.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Folio */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] uppercase text-neutral-400 hairline-t pt-3">
          <span>WWW.BIRIM.COM</span>
          <span className="font-mono text-neutral-700">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 2: B&B ITALIA STYLE (Asimetrik Görsel Çıpa & Editoryal Monografi)
  // =========================================================================
  if (variant === 'alt-2') {
    return (
      <div className="catalog-page bg-[#FFFFFF] p-[18mm] flex flex-col justify-between select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[9.5px] tracking-[0.25em] uppercase text-neutral-400 hairline-b pb-3">
          <BirimLogo variant="black" className="h-5 w-auto object-contain" />
          <span className="font-mono text-neutral-400">MANIFESTO // 2026</span>
        </div>

        {/* Asymmetrical 2-Column Split: Visual Left + Editorial Right */}
        <div className="flex-1 my-auto grid grid-cols-12 gap-8 items-center py-2">
          {/* Left Column (50%): Architectural Visual Anchor */}
          <div className="col-span-6 h-[175mm] bg-neutral-100 overflow-hidden relative border border-neutral-200 shadow-sm">
            <img
              src={heroImg}
              alt="Birim Architecture"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-3 left-3 bg-neutral-950/80 text-white text-[7.5px] font-mono tracking-widest px-2 py-1 uppercase backdrop-blur-sm">
              BİRİM ATELIER / ARCHITECTURAL STUDY
            </div>
          </div>

          {/* Right Column (50%): Manifesto & Statement */}
          <div className="col-span-6 space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                {isTr ? 'MİMARİ DİYALOG' : 'SPATIAL DIALOGUE'}
              </span>
              <h2 className="text-[26px] font-light tracking-[0.06em] uppercase text-neutral-950 leading-tight">
                {isTr ? 'FORM VE MEKÂNIN SESSİZ DENGESİ' : 'THE QUIET BALANCE OF FORM AND SPACE'}
              </h2>
            </div>

            <div className="w-12 h-[1.5px] bg-neutral-950" />

            <p className="text-[11px] font-light italic leading-relaxed text-neutral-700 border-l-2 border-neutral-900 pl-3">
              {isTr
                ? '"Bir mobilyanın gücü, içinde bulunduğu mimariyi ezmeden, onunla sessiz bir uyum kurabilmesinde saklıdır."'
                : '"The strength of a furniture piece lies not in dominating architecture, but in completing it through silent harmony."'}
            </p>

            <div className="space-y-3 text-[10.5px] leading-[1.8] text-neutral-600 font-light text-justify">
              <p>
                {isTr
                  ? 'BİRİM; nesnelerin ötesinde, mekanın ruhunu tanımlayan heykelsi ve rasyonel formlar üretir. Malzemenin doğallığına saygı duyan tasarım disiplinimiz; birinci sınıf işçilik ve çağdaş estetikle birleşir.'
                  : 'BİRİM crafts sculptural and rational forms that define the spirit of spaces beyond mere utility. Our design discipline honours material authenticity.'}
              </p>
              <p>
                {isTr
                  ? 'Bu sayfalardaki her ürün, mimar ve tasarımcıların yaratıcı vizyonlarını en yüksek kalitede gerçeğe dönüştürmek için tasarlanmıştır.'
                  : 'Every piece within these pages is conceived to translate the creative vision of architects and designers into reality at the highest standards.'}
              </p>
            </div>

            <div className="pt-2 hairline-t text-[8px] font-mono tracking-widest text-neutral-400 uppercase">
              BİRİM STUDIO // MERKEZ ATÖLYE & FABRİKA
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] uppercase text-neutral-400 hairline-t pt-3">
          <span>WWW.BIRIM.COM</span>
          <span className="font-mono text-neutral-700">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 3: FLEXFORM STYLE (Sıcak Atölye, Zanaat Dokusu & Malzeme Kimliği)
  // =========================================================================
  if (variant === 'alt-3') {
    return (
      <div className="catalog-page bg-[#F8F7F4] p-[20mm] flex flex-col justify-between select-none">
        {/* Top Folio */}
        <div className="flex justify-between items-center text-[9.5px] tracking-[0.25em] uppercase text-[#77726A] hairline-b pb-3">
          <BirimLogo variant="black" className="h-6 w-auto object-contain" />
          <span className="font-mono text-[#8C877E]">ATELIER CRAFT & HERITAGE</span>
        </div>

        {/* Main Content */}
        <div className="space-y-6 my-auto max-w-[155mm]">
          {/* Dual Visual Header */}
          <div className="grid grid-cols-2 gap-4 h-[65mm]">
            <div className="h-full bg-white overflow-hidden border border-[#E2DFD8] relative">
              <img
                src={heroImg}
                alt="Craftsmanship"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[7px] font-mono px-1.5 py-0.5 uppercase tracking-wider">
                FIG. 01 / FORM
              </div>
            </div>
            <div className="h-full bg-white overflow-hidden border border-[#E2DFD8] relative">
              <img
                src={detailImg}
                alt="Materiality"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[7px] font-mono px-1.5 py-0.5 uppercase tracking-wider">
                FIG. 02 / DETAIL
              </div>
            </div>
          </div>

          {/* Statement */}
          <div className="space-y-3">
            <span className="text-[9.5px] font-mono tracking-[0.25em] text-[#8C877E] uppercase block">
              {isTr ? 'ZANAAT VE MİMARİ STRÜKTÜR' : 'CRAFT AND ARCHITECTURAL STRUCTURE'}
            </span>
            <h2 className="text-[26px] font-light tracking-[0.05em] uppercase text-neutral-950 leading-tight">
              {isTr 
                ? 'Usta ellerin zarafeti, endüstriyel hassasiyetin gücüyle buluşuyor.' 
                : 'Artisanal elegance converges with the power of industrial precision.'}
            </h2>
            <p className="text-[11px] font-light leading-[1.85] text-neutral-700 text-justify">
              {isTr
                ? 'BİRİM atölyelerinde şekillenen her parça; masif ahşap, doğal taş ve döküm metalin kusursuz dengesini barındırır. Seri üretim kolaycılığı yerine, her mobilyaya bir sanat objesi özeniyle yaklaşır, mekânların dokunsal zenginliğini inşa ederiz.'
                : 'Every piece sculpted in BİRİM ateliers embodies the seamless balance of solid woods, natural stone, and cast metals. Rather than mass production shortcuts, we approach each furniture item with the dedication of an objet d\'art.'}
            </p>
          </div>

          {/* 3 Material Metrics Cards */}
          <div className="grid grid-cols-3 gap-4 pt-3 hairline-t">
            <div className="bg-white/80 p-3 border border-[#E2DFD8]">
              <span className="text-[8.5px] font-mono tracking-widest text-[#8C877E] uppercase block mb-1">01 / MASİF & MERMER</span>
              <p className="text-[9px] text-neutral-700 leading-snug">
                {isTr ? 'Doğal desenleri korunan seçkin ahşap ve taş bloklar.' : 'Curated wood and stone blocks preserving organic textures.'}
              </p>
            </div>
            <div className="bg-white/80 p-3 border border-[#E2DFD8]">
              <span className="text-[8.5px] font-mono tracking-widest text-[#8C877E] uppercase block mb-1">02 / METAL İŞÇİLİĞİ</span>
              <p className="text-[9px] text-neutral-700 leading-snug">
                {isTr ? 'Lazer kesim ve elektrostatik fırın kaplama dayanımı.' : 'Laser precision and electrostatic oven coating endurance.'}
              </p>
            </div>
            <div className="bg-white/80 p-3 border border-[#E2DFD8]">
              <span className="text-[8.5px] font-mono tracking-widest text-[#8C877E] uppercase block mb-1">03 / DÖŞEME USTALIĞI</span>
              <p className="text-[9px] text-neutral-700 leading-snug">
                {isTr ? 'İtalyan kumaş ve derilerde el terziliği hassasiyeti.' : 'Tailored craftsmanship in Italian fabrics and top-grain leathers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] uppercase text-[#8C877E] hairline-t pt-3">
          <span>WWW.BIRIM.COM</span>
          <span className="font-mono text-neutral-700">{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 4: LIVING DIVANI STYLE (Radikal Sessizlik, Bol Negatif Alan & Saf Aforizma)
  // =========================================================================
  if (variant === 'alt-4') {
    return (
      <div className="catalog-page bg-[#FFFFFF] p-[24mm] flex flex-col justify-between select-none">
        {/* Top Minimal Folio */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-neutral-400">
          <BirimLogo variant="black" className="h-5 w-auto object-contain" />
          <span className="font-mono text-neutral-400">ARCHITECTURAL STATEMENT</span>
        </div>

        {/* Central Monolithic Aphorism */}
        <div className="my-auto max-w-[150mm] space-y-8">
          <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-neutral-400 block">
            01 / MANIFESTO
          </span>
          <h1 className="text-[36px] font-extralight tracking-[0.05em] uppercase text-neutral-950 leading-[1.3] text-left">
            {isTr ? (
              <>
                Mimari orantılar,<br />
                zamansız strüktürler ve<br />
                sessiz bir mekânsal varlık.
              </>
            ) : (
              <>
                Architectural proportions,<br />
                timeless structures, and a<br />
                quiet spatial presence.
              </>
            )}
          </h1>
          <div className="w-12 h-[1px] bg-neutral-900" />
        </div>

        {/* Lower Right Compact Editorial Text */}
        <div className="flex justify-end">
          <div className="max-w-[85mm] space-y-3 text-[10px] leading-[1.8] text-neutral-600 font-light text-justify">
            <p>
              {isTr
                ? 'BİRİM; gereksiz süslemelerden arındırılmış rasyonel formlar, birinci sınıf zanaat teknikleri ve seçkin materyallerle mimari mekanın sessiz dengesini kurar.'
                : 'BİRİM establishes the quiet balance of architectural spaces through rational forms stripped of ornamentation, superior craft techniques, and noble materials.'}
            </p>
            <p>
              {isTr
                ? 'Tasarım felsefemiz; nesneleri değil, içinde yaşanacak dingin atmosferleri inşa etmektir.'
                : 'Our design philosophy is not merely about crafting objects, but constructing tranquil atmospheres to inhabit.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[8.5px] font-mono tracking-[0.25em] text-neutral-400 uppercase hairline-t pt-3 mt-4">
          <span>WWW.BIRIM.COM</span>
          <span>{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ALT 5: CASSINA TRIENNALE STYLE (3 Temel İlke Grid'i & Tasarım Mirası)
  // =========================================================================
  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
      {/* Top Folio */}
      <div className="flex justify-between items-center text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 hairline-b pb-3">
        <BirimLogo variant="black" className="h-6 w-auto object-contain" />
        <span className="font-mono text-neutral-400">DESIGN HERITAGE & PRINCIPLES</span>
      </div>

      {/* Headline Block */}
      <div className="pt-2 pb-2 hairline-b">
        <span className="text-[8.5px] font-mono tracking-[0.3em] uppercase text-neutral-400 block mb-1">
          {isTr ? 'KURUMSAL KİMLİK' : 'BRAND PHILOSOPHY'}
        </span>
        <h2 className="text-[30px] font-light tracking-[0.08em] uppercase text-neutral-950 leading-none">
          {isTr ? 'TEMEL TASARIM PRENSİPLERİ' : 'CORE DESIGN PRINCIPLES'}
        </h2>
      </div>

      {/* 3 Core Structural Principle Cards */}
      <div className="grid grid-cols-3 gap-5 my-auto py-2">
        <div className="border border-neutral-200 p-5 space-y-3 bg-[#FCFCFA] flex flex-col justify-between h-[90mm]">
          <div>
            <span className="text-[28px] font-extralight font-mono text-neutral-300 block leading-none">
              01
            </span>
            <h3 className="text-[13px] font-medium tracking-wider uppercase text-neutral-900 mt-3 mb-2">
              {isTr ? 'RASYONALİTE VE GEOMETRİ' : 'RATIONALITY & GEOMETRY'}
            </h3>
            <p className="text-[10px] leading-[1.7] text-neutral-600 font-light text-justify">
              {isTr
                ? 'Her çizgi, her radius ve her birleşim noktası mimari bir amaca hizmet eder. Gereksiz biçimsel fazlalıklardan arınmış saf estetik.'
                : 'Every line, radius, and joinery serves an architectural intent. Pure aesthetics freed from superfluous formal excesses.'}
            </p>
          </div>
          <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest pt-2 hairline-t">
            ARCHITECTURAL ACCURACY
          </div>
        </div>

        <div className="border border-neutral-200 p-5 space-y-3 bg-[#FCFCFA] flex flex-col justify-between h-[90mm]">
          <div>
            <span className="text-[28px] font-extralight font-mono text-neutral-300 block leading-none">
              02
            </span>
            <h3 className="text-[13px] font-medium tracking-wider uppercase text-neutral-900 mt-3 mb-2">
              {isTr ? 'MATERYALİTE VE DOKU' : 'MATERIALITY & TEXTURE'}
            </h3>
            <p className="text-[10px] leading-[1.7] text-neutral-600 font-light text-justify">
              {isTr
                ? 'Doğal masif ahşap, soğuk işlenmiş fırçalı metal ve sıcak dokulu tekstillerin dengeli, dokunsal ve duyusal diyaloğu.'
                : 'A tactile and sensory dialogue balancing organic solid woods, cold-finished brushed metals, and richly textured fabrics.'}
            </p>
          </div>
          <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest pt-2 hairline-t">
            NOBLE TEXTURES
          </div>
        </div>

        <div className="border border-neutral-200 p-5 space-y-3 bg-[#FCFCFA] flex flex-col justify-between h-[90mm]">
          <div>
            <span className="text-[28px] font-extralight font-mono text-neutral-300 block leading-none">
              03
            </span>
            <h3 className="text-[13px] font-medium tracking-wider uppercase text-neutral-900 mt-3 mb-2">
              {isTr ? 'ZAMANSIZ KALICILIK' : 'TIMELESS ENDURANCE'}
            </h3>
            <p className="text-[10px] leading-[1.7] text-neutral-600 font-light text-justify">
              {isTr
                ? 'Mevsimlik ve geçici eğilimlerin ötesinde; yıllar geçtikçe mekânla birlikte yaşayan, değerini koruyan koleksiyon felsefesi.'
                : 'Beyond seasonal fads; a collection philosophy that lives alongside architecture over decades while retaining its intrinsic value.'}
            </p>
          </div>
          <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest pt-2 hairline-t">
            TIMELESS IDENTITY
          </div>
        </div>
      </div>

      {/* Bottom Summary & Signature */}
      <div className="space-y-2 hairline-t pt-3">
        <p className="text-[10.5px] font-light leading-[1.8] text-neutral-700 max-w-[145mm] text-justify">
          {isTr
            ? 'Bu katalog, BİRİM atölyelerinin çağdaş mobilya tasarımına getirdiği zanaat ustalığını ve mimari ölçek hassasiyetini belgeleyen yaşayan bir tasarım arşividir.'
            : 'This catalog serves as a living design archive documenting the artisanal mastery and architectural scale precision brought to contemporary furniture design by BİRİM ateliers.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[9px] tracking-[0.25em] uppercase text-neutral-400 hairline-t pt-3 mt-1">
        <span>WWW.BIRIM.COM</span>
        <span className="font-mono text-neutral-700">{String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  );
};
