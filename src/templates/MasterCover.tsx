import React from 'react';
import { CatalogMetadata, Language, CoverVariant } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

export interface MasterCoverProps {
  metadata?: CatalogMetadata;
  title?: string;
  subtitle?: string;
  year?: string;
  coverImage?: string;
  pageNumber?: number;
  lang?: Language;
  variant?: CoverVariant;
}

/**
 * ALTERNATİF 1: Minimal Swiss Monolith
 * - Üstte "DESIGN OBJECTS / 2026" ve tam en ince çizgi
 * - ~%36 yükseklikte başlayan devasa, sol marjine kusursuz sıfırlanmış BİRİM logosu
 * - Logo altında "COLLECTION" (veya seçili kategori örn. "ARMCHAIRS"), sol hizalı kısa ayrım çizgisi ve "MİMARİ TASARIM & ÇAĞDAŞ MOBİLYA"
 * - Altta "BIRIM.COM" ve "01"
 */
const CoverAlt1: React.FC<MasterCoverProps> = ({
  subtitle = "COLLECTION",
  year = "2026",
  pageNumber = 1,
}) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] px-[12mm] py-[20mm] flex flex-col justify-between select-none relative h-full">
      {/* Top Header */}
      <div className="w-full">
        <div className="text-[8.5px] tracking-[0.28em] text-[#888888] uppercase font-light">
          DESIGN OBJECTS &nbsp;/&nbsp; {year}
        </div>
        <div className="w-full border-b border-[#E0E0E0] mt-3" />
      </div>

      {/* Main Left-Aligned Grid - Exactly matching reference */}
      <div className="w-full pt-[52mm] pb-[20mm] flex flex-col items-start">
        {/* Dominant BİRİM Brand Mark - Oversized, flush to left margin */}
        <div className="w-[190mm] mb-[34mm]">
          <BirimLogo 
            variant="black" 
            className="w-full h-auto object-contain object-left block" 
            alt="BİRİM"
          />
        </div>

        {/* Collection / Category Title & Subtitles - Flush left-aligned to logo spine */}
        <div className="w-full flex flex-col items-start">
          <h1 className="text-[32px] font-extralight tracking-[0.24em] text-[#111111] uppercase leading-none">
            {subtitle}
          </h1>

          <div className="w-[48mm] border-t border-[#888888] my-4" />

          <p className="text-[8.5px] tracking-[0.24em] text-[#666666] uppercase font-light">
            MİMARİ TASARIM &nbsp;&amp;&nbsp; ÇAĞDAŞ MOBİLYA
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest text-[#888888]">
        <span>BIRIM.COM</span>
        <span>{String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 2: Typographic 26 & Spine
 * - Sol kenarda dikey siyah cilt şeridi (spine band)
 * - En üstte tam en BİRİM logosu, altında boydan boya çizgi ve "A COLLECTION OF DESIGN"
 * - Orta-alt alanda devasa "26" editoryal rakamı, altında "DESIGN COLLECTION" ve boydan boya alt çizgi
 * - Altta "WWW.BIRIM.COM"
 */
const CoverAlt2: React.FC<MasterCoverProps> = ({
  year = "2026",
}) => {
  const shortYear = year.slice(-2);

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none relative h-full overflow-hidden">
      {/* Top Header with Dominant BİRİM Logo and Section Line */}
      <div className="w-full pt-1">
        <div className="w-full">
          <BirimLogo 
            variant="black" 
            className="w-full h-auto object-contain block" 
            alt="BİRİM"
          />
        </div>
        <div className="w-full border-b border-[#D0D0CE] mt-8 mb-3" />
        <div className="text-[7.5px] tracking-[0.3em] text-[#888888] uppercase font-light">
          A COLLECTION OF DESIGN
        </div>
      </div>

      {/* Center-Lower Section: Dominant '26', Divider under 26, & DESIGN COLLECTION */}
      <div className="w-full pt-[16mm] pb-[10mm]">
        {/* Massive Typographic 26 */}
        <div className="text-[220px] font-extralight tracking-[-0.04em] text-[#1A1A1A] leading-[0.78] select-none font-sans">
          {shortYear}
        </div>

        {/* Full-width hairline divider directly under 26 */}
        <div className="w-full border-b border-[#D0D0CE] mt-5 mb-7" />

        {/* Stacked Title - Larger */}
        <div className="space-y-2">
          <div className="text-[34px] font-light tracking-[0.22em] text-[#1A1A1A] uppercase leading-none">
            DESIGN
          </div>
          <div className="text-[34px] font-light tracking-[0.22em] text-[#1A1A1A] uppercase leading-none">
            COLLECTION
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full text-[8px] font-mono tracking-[0.25em] text-[#888888] uppercase">
        WWW.BIRIM.COM
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 3: Architectural Geometry
 * - Katmanlı bej mimari düzlemler, teknik yay çizgisi
 * - Üstte devasa BİRİM logosu ve "BIRIM / 2026"
 * - Ortada sol dikey ayraç çizgisi, yanında "DESIGN COLLECTION" ve "A STUDY OF FORM, MATERIAL AND SPACE"
 * - Altta "WWW.BIRIM.COM"
 */
const CoverAlt3: React.FC<MasterCoverProps> = ({
  year = "2026",
}) => {
  return (
    <div className="catalog-page bg-[#F5F3ED] p-[20mm] flex flex-col justify-between select-none relative h-full overflow-hidden">
      {/* Background Architectural Geometry: Tone Panels */}
      {/* Right vertical stone panel */}
      <div className="absolute top-0 right-0 bottom-0 w-[36%] bg-[#DDD8CF] pointer-events-none" />

      {/* Angled geometric polygon plane */}
      <div 
        className="absolute top-0 right-[28%] bottom-0 w-[22%] bg-[#E8E4DA] pointer-events-none opacity-90"
        style={{ clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 75% 100%)' }}
      />

      {/* Delicate Architectural Wireframe Arc in upper-right */}
      <div className="absolute top-[26mm] right-[-12mm] w-[110mm] h-[110mm] rounded-full border border-[#BDB7AA]/60 pointer-events-none" />
      <div className="absolute top-[40mm] right-[6mm] w-[80mm] h-[80mm] rounded-full border border-[#CAC4B7]/40 pointer-events-none" />

      {/* Foreground Content */}
      {/* Top Brand Block */}
      <div className="relative z-10 w-full pt-1">
        <div className="w-full">
          <BirimLogo 
            variant="black" 
            className="w-full h-auto object-contain block" 
            alt="BİRİM"
          />
        </div>
        <div className="text-[8px] tracking-[0.3em] text-[#777777] uppercase font-light mt-3.5">
          BIRIM &nbsp;/&nbsp; {year}
        </div>
      </div>

      {/* Center Left Editorial Block with Vertical Bar Accent */}
      <div className="relative z-10 w-full max-w-[85%] pt-[45mm] pb-[30mm] flex items-start">
        {/* Vertical Black Accent Line */}
        <div className="w-[1.5px] h-[64px] bg-[#111111] flex-shrink-0 mt-1 mr-4" />

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-light tracking-[0.22em] text-[#111111] uppercase leading-[1.05]">
              DESIGN
            </h1>
            <h1 className="text-[28px] font-light tracking-[0.22em] text-[#111111] uppercase leading-[1.05]">
              COLLECTION
            </h1>
          </div>
          <p className="text-[7.5px] tracking-[0.28em] text-[#666666] uppercase font-medium">
            A STUDY OF FORM, MATERIAL AND SPACE
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 w-full text-[8px] font-mono tracking-[0.25em] text-[#888888] uppercase">
        WWW.BIRIM.COM
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 4: Dikey Sol Minimal Monolith
 * - Sol sütunda 190mm dikey siyah BİRİM logosu ve dikey ayrım çizgisi
 * - Sağ alanda editoryal 26 rakamı, COLLECTION başlığı, ayrım çizgisi ve alt metin
 */
const CoverAlt4: React.FC<MasterCoverProps> = ({
  subtitle = "COLLECTION",
  year = "2026",
  pageNumber = 1,
}) => {
  const shortYear = year.slice(-2);

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex select-none relative overflow-hidden h-full">
      {/* Left Column: Vertical Logo in Allocated Space */}
      <div className="w-[28mm] h-full flex flex-col justify-between items-start border-r border-[#EBEBEB] pr-[6mm] flex-shrink-0">
        <div className="text-[7.5px] tracking-[0.25em] text-[#999999] uppercase font-light">
          {year}
        </div>

        {/* Vertical BİRİM Logo */}
        <div className="w-[22mm] h-[190mm] relative flex items-center justify-center my-auto">
          <div className="absolute w-[190mm] h-[22mm] -rotate-90 origin-center flex items-center justify-center">
            <BirimLogo 
              variant="black" 
              className="w-[190mm] h-auto object-contain block" 
              alt="BİRİM"
            />
          </div>
        </div>

        <div className="text-[7.5px] font-mono tracking-widest text-[#999999]">
          {String(pageNumber).padStart(2, '0')}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 pl-[16mm] flex flex-col justify-between h-full">
        {/* Top Header Line */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[8px] tracking-[0.3em] text-[#888888] uppercase font-light">
            <span>DESIGN OBJECTS</span>
            <span>ARCHITECTURAL MONOGRAPH</span>
          </div>
          <div className="w-full border-b border-[#EBEBEB] mt-3" />
        </div>

        {/* Center Typography */}
        <div className="my-auto py-[10mm] space-y-6">
          <div className="text-[120px] font-extralight tracking-[-0.04em] text-[#111111] leading-[0.8] font-sans select-none">
            {shortYear}
          </div>
          
          <div className="space-y-3">
            <h1 className="text-[36px] font-light tracking-[0.22em] text-[#111111] uppercase leading-none">
              {subtitle}
            </h1>
            <div className="w-[45mm] border-t border-[#111111] my-4" />
            <p className="text-[8.5px] tracking-[0.26em] text-[#555555] uppercase font-light leading-relaxed max-w-[100mm]">
              MİMARİ TASARIM &amp; ÇAĞDAŞ MOBİLYA
            </p>
          </div>
        </div>

        {/* Bottom Meta */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-[0.25em] text-[#888888]">
          <span>WWW.BIRIM.COM</span>
          <span>ISTANBUL</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 5: Dikey Siyah Monolit Kolon & Beyaz Logo
 * - Sol %26'lık alanda tam boy siyah kolon içinde dikey beyaz BİRİM logosu
 * - Sağ alanda mimari bej/beyaz fon, editoryal 26, DESIGN COLLECTION ve manifesto
 */
const CoverAlt5: React.FC<MasterCoverProps> = ({
  subtitle = "COLLECTION",
  year = "2026",
}) => {
  const shortYear = year.slice(-2);

  return (
    <div className="catalog-page bg-[#FAFAF8] flex select-none relative overflow-hidden h-full">
      {/* Left Black Monolith Column */}
      <div className="w-[56mm] h-full bg-[#111111] flex flex-col justify-between items-center py-[20mm] relative z-10 flex-shrink-0">
        <div className="text-[7.5px] tracking-[0.35em] text-[#888888] uppercase font-light">
          {year}
        </div>
        
        {/* White Logo Vertical */}
        <div className="w-[26mm] h-[180mm] relative flex items-center justify-center my-auto">
          <div className="absolute w-[180mm] h-[26mm] -rotate-90 origin-center flex items-center justify-center">
            <BirimLogo 
              variant="white" 
              className="w-[180mm] h-auto object-contain block" 
              alt="BİRİM"
            />
          </div>
        </div>

        <div className="text-[7.5px] font-mono tracking-[0.2em] text-[#666666]">
          BIRIM.COM
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-[20mm] flex flex-col justify-between h-full">
        <div className="w-full">
          <div className="text-[8px] tracking-[0.3em] text-[#888888] uppercase font-light">
            ARCHITECTURAL FURNITURE &nbsp;/&nbsp; {subtitle}
          </div>
          <div className="w-full border-b border-[#E0E0DD] mt-3" />
        </div>

        <div className="my-auto py-[15mm]">
          <div className="text-[140px] font-extralight tracking-[-0.04em] text-[#1A1A1A] leading-[0.82] select-none font-sans">
            {shortYear}
          </div>
          <div className="w-full border-b border-[#D0D0CE] mt-6 mb-7" />
          <div className="space-y-2">
            <div className="text-[32px] font-light tracking-[0.22em] text-[#1A1A1A] uppercase leading-none">
              DESIGN
            </div>
            <div className="text-[32px] font-light tracking-[0.22em] text-[#1A1A1A] uppercase leading-none">
              {subtitle}
            </div>
          </div>
          <p className="text-[8px] tracking-[0.25em] text-[#777777] uppercase font-light mt-6">
            A STUDY OF FORM, MATERIAL AND SPACE
          </p>
        </div>

        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-[0.2em] text-[#888888]">
          <span>ISTANBUL</span>
          <span>VOL. 01</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 6: Dikey Sağ Kılavuz & Poster Tipografisi
 * - Sağ kenarda tam boy dikey ayraç kılavuzu ve dikey siyah BİRİM logosu
 * - Sol alanda İsviçre poster tarzı büyük punto DESIGN COLLECTION ve editoryal metin
 */
const CoverAlt6: React.FC<MasterCoverProps> = ({
  subtitle = "COLLECTION",
  year = "2026",
  pageNumber = 1,
}) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex select-none relative overflow-hidden h-full">
      {/* Left/Center Main Editorial Area */}
      <div className="flex-1 pr-[16mm] flex flex-col justify-between h-full border-r border-[#EAEAEA]">
        {/* Top Header */}
        <div className="w-full">
          <div className="text-[8.5px] tracking-[0.3em] text-[#888888] uppercase font-light">
            BİRİM &nbsp;/&nbsp; {year} CATALOGUE
          </div>
          <div className="w-full border-b border-[#EAEAEA] mt-3" />
        </div>

        {/* Center Typography */}
        <div className="my-auto py-[15mm]">
          <div className="text-[9px] tracking-[0.35em] text-[#999999] uppercase font-medium mb-4">
            OFFICIAL PORTFOLIO
          </div>
          <div className="space-y-2 mb-8">
            <h1 className="text-[42px] font-extralight tracking-[0.18em] text-[#111111] uppercase leading-[0.95]">
              DESIGN
            </h1>
            <h1 className="text-[42px] font-extralight tracking-[0.18em] text-[#111111] uppercase leading-[0.95]">
              {subtitle}
            </h1>
          </div>
          <div className="w-[45mm] border-t border-[#111111] mb-5" />
          <p className="text-[8px] tracking-[0.24em] text-[#666666] uppercase font-light leading-relaxed max-w-[95mm]">
            MİMARİ TASARIM VE ÇAĞDAŞ MOBİLYA ÜRETİMİNDE ÖZGÜN FORMLAR VE MEKÂNSAL DİL.
          </p>
        </div>

        {/* Bottom Meta */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest text-[#888888]">
          <span>WWW.BIRIM.COM</span>
          <span>{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Right Column: Vertical BİRİM Logo */}
      <div className="w-[24mm] h-full flex flex-col justify-between items-center pl-[6mm] flex-shrink-0">
        <div className="text-[7.5px] tracking-[0.3em] text-[#999999] uppercase font-mono">
          '{year.slice(-2)}
        </div>

        <div className="w-[20mm] h-[190mm] relative flex items-center justify-center my-auto">
          <div className="absolute w-[190mm] h-[20mm] rotate-90 origin-center flex items-center justify-center">
            <BirimLogo 
              variant="black" 
              className="w-[190mm] h-auto object-contain block" 
              alt="BİRİM"
            />
          </div>
        </div>

        <div className="text-[7.5px] font-mono text-[#999999]">
          IST
        </div>
      </div>
    </div>
  );
};

export const MasterCover: React.FC<MasterCoverProps> = (props) => {
  const { variant = 'alt-1' } = props;
  if (variant === 'alt-2') return <CoverAlt2 {...props} />;
  if (variant === 'alt-3') return <CoverAlt3 {...props} />;
  if (variant === 'alt-4') return <CoverAlt4 {...props} />;
  if (variant === 'alt-5') return <CoverAlt5 {...props} />;
  if (variant === 'alt-6') return <CoverAlt6 {...props} />;
  return <CoverAlt1 {...props} />;
};
