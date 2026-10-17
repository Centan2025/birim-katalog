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
  lang = 'tr',
}) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] px-[12mm] py-[20mm] flex flex-col justify-between select-none relative h-full">
      {/* Top Header */}
      <div className="w-full">
        <div className="text-[8.5px] tracking-[0.28em] text-[#888888] uppercase font-light">
          {lang === 'en' ? 'DESIGN OBJECTS' : 'TASARIM NESNELERİ'} &nbsp;/&nbsp; {year}
        </div>
        <div className="w-full border-b border-[#E0E0E0] mt-3" />
      </div>

      {/* Main Left-Aligned Grid - Exactly matching reference */}
      <div className="w-full pt-[52mm] pb-[20mm] flex flex-col items-start">
        {/* Dominant BİRİM Brand Mark */}
        <div className="w-[55mm] mb-[24mm]">
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
            {lang === 'en' ? 'ARCHITECTURAL DESIGN & CONTEMPORARY FURNITURE' : 'MİMARİ TASARIM & ÇAĞDAŞ MOBİLYA'}
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest text-[#888888]">
        <span className="lowercase">www.birim.com</span>
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
 * - Altta "www.birim.com"
 */
const CoverAlt2: React.FC<MasterCoverProps> = ({
  subtitle,
  year = "2026",
  lang = 'tr',
}) => {
  const shortYear = year.slice(-2);
  const firstWord = subtitle ? subtitle.split(' ')[0] : (lang === 'en' ? 'DESIGN' : 'TASARIM');
  const secondWord = subtitle ? subtitle.split(' ').slice(1).join(' ') || (lang === 'en' ? 'COLLECTION' : 'KOLEKSİYONU') : (lang === 'en' ? 'COLLECTION' : 'KOLEKSİYONU');

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none relative h-full overflow-hidden">
      {/* Top Header with Dominant BİRİM Logo and Section Line */}
      <div className="w-full pt-1">
        <div className="w-[50mm]">
          <BirimLogo 
            variant="black" 
            className="w-full h-auto object-contain block object-left" 
            alt="BİRİM"
          />
        </div>
        <div className="w-full border-b border-[#D0D0CE] mt-6 mb-3" />
        <div className="text-[7.5px] tracking-[0.3em] text-[#888888] uppercase font-light">
          {lang === 'en' ? 'A COLLECTION OF DESIGN' : 'ÖZGÜN TASARIM KOLEKSİYONU'}
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
            {firstWord}
          </div>
          <div className="text-[34px] font-light tracking-[0.22em] text-[#1A1A1A] uppercase leading-none">
            {secondWord}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full text-[8px] font-mono tracking-[0.25em] text-[#888888] lowercase">
        www.birim.com
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 3: Architectural Geometry
 * - Katmanlı bej mimari düzlemler, teknik yay çizgisi
 * - Üstte devasa BİRİM logosu ve "BIRIM / 2026"
 * - Ortada sol dikey ayraç çizgisi, yanında "DESIGN COLLECTION" ve "A STUDY OF FORM, MATERIAL AND SPACE"
 * - Altta "www.birim.com"
 */
const CoverAlt3: React.FC<MasterCoverProps> = ({
  subtitle,
  year = "2026",
  lang = 'tr',
}) => {
  const firstWord = subtitle ? subtitle.split(' ')[0] : (lang === 'en' ? 'DESIGN' : 'TASARIM');
  const secondWord = subtitle ? subtitle.split(' ').slice(1).join(' ') || (lang === 'en' ? 'COLLECTION' : 'KOLEKSİYONU') : (lang === 'en' ? 'COLLECTION' : 'KOLEKSİYONU');

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
        <div className="w-[50mm]">
          <BirimLogo 
            variant="black" 
            className="w-full h-auto object-contain block object-left" 
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
              {firstWord}
            </h1>
            <h1 className="text-[28px] font-light tracking-[0.22em] text-[#111111] uppercase leading-[1.05]">
              {secondWord}
            </h1>
          </div>
          <p className="text-[7.5px] tracking-[0.28em] text-[#666666] uppercase font-medium">
            {lang === 'en' ? 'A STUDY OF FORM, MATERIAL AND SPACE' : 'FORM, MALZEME VE MEKÂNIN DİYALOĞU'}
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 w-full text-[8px] font-mono tracking-[0.25em] text-[#888888] lowercase">
        www.birim.com
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
  lang = 'tr',
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
        <div className="w-[18mm] h-[60mm] relative flex items-center justify-center my-auto">
          <div className="absolute w-[60mm] h-[18mm] -rotate-90 origin-center flex items-center justify-center">
            <BirimLogo 
              variant="black" 
              className="w-[60mm] h-auto object-contain block" 
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
            <span>{lang === 'en' ? 'DESIGN OBJECTS' : 'TASARIM NESNELERİ'}</span>
            <span>{lang === 'en' ? 'ARCHITECTURAL MONOGRAPH' : 'MİMARİ MONOGRAF'}</span>
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
              {lang === 'en' ? 'ARCHITECTURAL DESIGN & CONTEMPORARY FURNITURE' : 'MİMARİ TASARIM & ÇAĞDAŞ MOBİLYA'}
            </p>
          </div>
        </div>

        {/* Bottom Meta */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-[0.25em] text-[#888888]">
          <span className="lowercase">www.birim.com</span>
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
  subtitle,
  year = "2026",
  lang = 'tr',
}) => {
  const shortYear = year.slice(-2);
  const cleanSubtitle = subtitle 
    ? subtitle.toUpperCase().replace(/^DESIGN\s+/i, '').replace(/^TASARIM\s+/i, '') 
    : (lang === 'en' ? 'COLLECTION' : 'KOLEKSİYONU');

  return (
    <div className="catalog-page bg-[#FAFAF8] flex select-none relative overflow-hidden h-full">
      {/* Left Black Monolith Column */}
      <div className="w-[56mm] h-full bg-[#111111] flex flex-col justify-between items-center py-[20mm] relative z-10 flex-shrink-0">
        <div className="text-[7.5px] tracking-[0.35em] text-[#888888] uppercase font-light">
          {year}
        </div>
        
        {/* White Logo Vertical */}
        <div className="w-[18mm] h-[60mm] relative flex items-center justify-center my-auto">
          <div className="absolute w-[60mm] h-[18mm] -rotate-90 origin-center flex items-center justify-center">
            <BirimLogo 
              variant="white" 
              className="w-[60mm] h-auto object-contain block" 
              alt="BİRİM"
            />
          </div>
        </div>

        <div className="text-[7.5px] font-mono tracking-[0.2em] text-[#666666] lowercase">
          www.birim.com
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-[20mm] flex flex-col justify-between h-full">
        <div className="w-full">
          <div className="text-[8px] tracking-[0.3em] text-[#888888] uppercase font-light">
            {lang === 'en' ? 'ARCHITECTURAL FURNITURE' : 'MİMARİ MOBİLYA'} &nbsp;/&nbsp; {cleanSubtitle}
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
              {lang === 'en' ? 'DESIGN' : 'TASARIM'}
            </div>
            <div className="text-[32px] font-light tracking-[0.22em] text-[#1A1A1A] uppercase leading-none">
              {cleanSubtitle}
            </div>
          </div>
          <p className="text-[8px] tracking-[0.25em] text-[#777777] uppercase font-light mt-6">
            {lang === 'en' ? 'A STUDY OF FORM, MATERIAL AND SPACE' : 'FORM, MALZEME VE MEKÂNIN DİYALOĞU'}
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
  lang = 'tr',
}) => {
  const cleanSubtitle = subtitle.toUpperCase().replace(/^DESIGN\s+/i, '') || 'COLLECTION';

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex select-none relative overflow-hidden h-full">
      {/* Left/Center Main Editorial Area */}
      <div className="flex-1 pr-[16mm] flex flex-col justify-between h-full border-r border-[#EAEAEA]">
        {/* Top Header */}
        <div className="w-full">
          <div className="text-[8.5px] tracking-[0.3em] text-[#888888] uppercase font-light">
            BİRİM &nbsp;/&nbsp; {year} {lang === 'en' ? 'CATALOGUE' : 'KATALOĞU'}
          </div>
          <div className="w-full border-b border-[#EAEAEA] mt-3" />
        </div>

        {/* Center Typography */}
        <div className="my-auto py-[15mm]">
          <div className="text-[9px] tracking-[0.35em] text-[#999999] uppercase font-medium mb-4">
            {lang === 'en' ? 'OFFICIAL PORTFOLIO' : 'RESMİ PORTFOLYO'}
          </div>
          <div className="space-y-2 mb-8">
            <h1 className="text-[42px] font-extralight tracking-[0.18em] text-[#111111] uppercase leading-[0.95]">
              {lang === 'en' ? 'DESIGN' : 'TASARIM'}
            </h1>
            <h1 className="text-[42px] font-extralight tracking-[0.18em] text-[#111111] uppercase leading-[0.95]">
              {cleanSubtitle}
            </h1>
          </div>
          <div className="w-[45mm] border-t border-[#111111] mb-5" />
          <p className="text-[8px] tracking-[0.24em] text-[#666666] uppercase font-light leading-relaxed max-w-[95mm]">
            {lang === 'en'
              ? 'DISTINCT FORMS, MATERIAL DIALOGUE AND SPATIAL EXPERIENCE IN ARCHITECTURAL FURNITURE.'
              : 'MİMARİ TASARIM VE ÇAĞDAŞ MOBİLYA ÜRETİMİNDE ÖZGÜN FORMLAR VE MEKÂNSAL DİL.'}
          </p>
        </div>

        {/* Bottom Meta */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest text-[#888888]">
          <span className="lowercase">www.birim.com</span>
          <span>{String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Right Column: Vertical BİRİM Logo */}
      <div className="w-[24mm] h-full flex flex-col justify-between items-center pl-[6mm] flex-shrink-0">
        <div className="text-[7.5px] tracking-[0.3em] text-[#999999] uppercase font-mono">
          '{year.slice(-2)}
        </div>

        <div className="w-[18mm] h-[60mm] relative flex items-center justify-center my-auto">
          <div className="absolute w-[60mm] h-[18mm] rotate-90 origin-center flex items-center justify-center">
            <BirimLogo 
              variant="black" 
              className="w-[60mm] h-auto object-contain block" 
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

/**
 * ALTERNATİF 7: Galeri Çerçeveli Minimalist Monograf (Gallery Frame Monograph)
 * - İnce 1px iç galeri çerçevesi, köşe mimari register artı (+) işaretleri
 * - Geniş negatif boşluk, merkezde büyük BİRİM logosu
 * - Alt kısımda 3 sütunlu editoryal mikro-tipografi ve arşiv kodları
 */
const CoverAlt7: React.FC<MasterCoverProps> = ({
  subtitle = "COLLECTION",
  year = "2026",
  pageNumber = 1,
  lang = 'tr',
}) => {
  return (
    <div className="catalog-page bg-[#FFFFFF] p-[16mm] flex flex-col justify-between select-none relative h-full overflow-hidden">
      {/* Outer Inset Fine Gallery Frame */}
      <div className="absolute inset-[12mm] border border-[#E8E8E6] pointer-events-none" />

      {/* 4 Corner Crosshair Registration Marks */}
      <div className="absolute top-[10.5mm] left-[10.5mm] text-[#999999] text-[11px] font-mono select-none pointer-events-none">+</div>
      <div className="absolute top-[10.5mm] right-[10.5mm] text-[#999999] text-[11px] font-mono select-none pointer-events-none">+</div>
      <div className="absolute bottom-[10.5mm] left-[10.5mm] text-[#999999] text-[11px] font-mono select-none pointer-events-none">+</div>
      <div className="absolute bottom-[10.5mm] right-[10.5mm] text-[#999999] text-[11px] font-mono select-none pointer-events-none">+</div>

      {/* Top Header */}
      <div className="relative z-10 w-full pt-[4mm] px-[4mm]">
        <div className="flex justify-between items-center text-[8.5px] tracking-[0.3em] text-[#777777] uppercase font-light">
          <span>{lang === 'en' ? 'BİRİM ARCHITECTURAL ARCHIVE' : 'BİRİM MİMARİ ARŞİVİ'}</span>
          <span>VOL. {year}</span>
        </div>
        <div className="w-full border-b border-[#E8E8E6] mt-3" />
      </div>

      {/* Center Hero Identity & Monograph Title */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-[20mm]">
        <div className="w-[52mm] max-w-[35%] mb-8">
          <BirimLogo 
            variant="black" 
            className="w-full h-auto object-contain block" 
            alt="BİRİM"
          />
        </div>

        <div className="w-[40mm] border-t border-[#111111] mb-6" />

        <div className="text-center space-y-3 max-w-[140mm]">
          <h1 className="text-[28px] font-extralight tracking-[0.32em] text-[#111111] uppercase leading-none">
            {subtitle}
          </h1>
          <p className="text-[8.5px] tracking-[0.28em] text-[#777777] uppercase font-light">
            {lang === 'en' 
              ? 'CONTEMPORARY FURNITURE & ARCHITECTURAL FORMS' 
              : 'ÇAĞDAŞ MOBİLYA & MİMARİ FORMLAR'}
          </p>
        </div>
      </div>

      {/* Bottom 3-Column Micro-Typography */}
      <div className="relative z-10 w-full pb-[4mm] px-[4mm]">
        <div className="grid grid-cols-3 gap-4 items-end text-[7.5px] tracking-[0.25em] text-[#888888] uppercase font-mono">
          <div>{lang === 'en' ? 'EDITION' : 'EDİSYON'} {year}</div>
          <div className="text-center lowercase">www.birim.com</div>
          <div className="text-right">FOLIO {String(pageNumber).padStart(2, '0')}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 8: Koyu Stüdyo Monolit (Dark Studio Monograph)
 * - Derin mat antrasit/siyah fon (#0E0E10)
 * - Sade, yalın mimari tipografi ve ferah negatif alan
 * - Gereksiz filigran ve kalabalıklardan arındırılmış saf lüks tasarım
 */
const CoverAlt8: React.FC<MasterCoverProps> = ({
  title,
  subtitle = "COLLECTION",
  year = "2026",
  pageNumber = 1,
  lang = 'tr',
}) => {
  const displayTitle = (title || subtitle || (lang === 'en' ? 'COLLECTION' : 'KOLEKSİYON')).toUpperCase();

  return (
    <div 
      className="catalog-page !bg-[#0E0E10] !text-[#F5F5F5] p-[20mm] flex flex-col justify-between select-none relative h-full overflow-hidden"
      style={{ backgroundColor: '#0E0E10', color: '#F5F5F5' }}
    >
      {/* Top Header */}
      <div className="relative z-10 w-full shrink-0">
        <div className="flex justify-between items-center text-[8.5px] tracking-[0.3em] text-[#666668] uppercase font-mono">
          <span>{lang === 'en' ? 'DESIGN ARCHIVE' : 'TASARIM ARŞİVİ'}</span>
          <span>ISTANBUL &nbsp;/&nbsp; {year}</span>
        </div>
        <div className="w-full border-b border-[#202024] mt-3.5" />
      </div>

      {/* Center Monolithic Identity */}
      <div className="relative z-10 w-full my-auto py-[10mm] flex flex-col items-start">
        {/* Dominant White Birim Logo */}
        <div className="w-[52mm] mb-8">
          <BirimLogo 
            variant="white" 
            className="w-full h-auto object-contain block object-left" 
            alt="BİRİM"
          />
        </div>

        {/* Clean, Refined Typography */}
        <div className="space-y-4 max-w-[140mm]">
          <h1 className="text-[28px] font-extralight tracking-[0.28em] text-[#E8E8EC] uppercase leading-tight break-words">
            {displayTitle}
          </h1>

          <div className="w-[36mm] border-t border-[#3A3A40]" />

          <p className="text-[8px] tracking-[0.25em] text-[#7A7A82] uppercase font-light">
            {lang === 'en' 
              ? 'ARCHITECTURAL FURNITURE & SPATIAL DESIGN' 
              : 'MİMARİ TASARIM & ÇAĞDAŞ MOBİLYA'}
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 w-full pt-3.5 flex justify-between items-center text-[8px] font-mono tracking-[0.25em] text-[#666668] uppercase shrink-0">
        <span className="lowercase">www.birim.com</span>
        <span>FOLIO {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

/**
 * ALTERNATİF 9: İsviçre Izgara & Brütalist Tipografi (Swiss Architectural Grid)
 * - Sıcak alabaster kağıt fonu (#FAF8F5)
 * - Matematiksel 4-çeyrek mimari ızgara (2x2 grid)
 * - Kılavuz çizgileri ve tam kesişim noktasında mimari artı (+) register işareti
 * - Logo sol kadranda sınırlıdır (max-w-[42mm]), sağ kadrana asla taşmaz
 */
const CoverAlt9: React.FC<MasterCoverProps> = ({
  title,
  subtitle = "COLLECTION",
  year = "2026",
  pageNumber = 1,
  lang = 'tr',
}) => {
  const displayTitle = (title || subtitle || 'COLLECTION').toUpperCase();

  return (
    <div 
      className="catalog-page !bg-[#FAF8F5] !text-[#111111] p-[18mm] select-none relative h-full overflow-hidden"
      style={{ backgroundColor: '#FAF8F5', color: '#111111' }}
    >
      {/* 2x2 Swiss Architectural Grid Container */}
      <div className="w-full h-full flex flex-col relative">

        {/* TOP ROW (48% height) */}
        <div className="w-full h-[48%] flex border-b border-[#D8D4CA]">
          
          {/* Quadrant 1: Top-Left (56% width) */}
          <div className="w-[56%] h-full pr-[6mm] pb-[6mm] border-r border-[#D8D4CA] flex flex-col justify-between">
            {/* Logo constrained to fit quadrant cleanly with no overflow */}
            <div className="w-[28mm] pt-1">
              <BirimLogo 
                variant="black" 
                className="w-full h-auto object-contain block object-left" 
                alt="BİRİM"
              />
            </div>
            <div className="text-[8.5px] tracking-[0.28em] text-[#777777] uppercase font-light">
              {lang === 'en' ? 'FURNITURE ARCHIVE' : 'MOBİLYA ARŞİVİ'} &nbsp;/&nbsp; {year}
            </div>
          </div>

          {/* Quadrant 2: Top-Right (44% width) */}
          <div className="w-[44%] h-full pl-[6mm] pb-[6mm] flex flex-col justify-between text-[8px] font-mono tracking-[0.18em] text-[#666666] leading-relaxed">
            <div className="space-y-1 pt-1">
              <div className="text-[#999999] uppercase text-[7.5px]">{lang === 'en' ? 'SPECIFICATION' : 'KÜNYE'}</div>
              <div>{lang === 'en' ? 'SERIES: ARCHITECTURAL' : 'SERİ: MİMARİ'}</div>
              <div>{lang === 'en' ? 'YEAR' : 'YIL'}: {year}</div>
              <div>{lang === 'en' ? 'LOCATION: ISTANBUL' : 'KONUM: İSTANBUL'}</div>
            </div>
            <div className="text-[7.5px] text-[#888888] uppercase">
              {lang === 'en' ? 'EDITION: OFFICIAL MONOGRAPH' : 'EDİSYON: RESMİ MONOGRAF'}
            </div>
          </div>

        </div>

        {/* Center Intersection Crosshair (+) placed exactly at intersection */}
        <div className="absolute top-[48%] left-[56%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#88847C] text-[13px] font-mono pointer-events-none select-none bg-[#FAF8F5]">
          +
        </div>

        {/* BOTTOM ROW (52% height) */}
        <div className="w-full h-[52%] flex">

          {/* Quadrant 3: Bottom-Left (56% width) */}
          <div className="w-[56%] h-full pr-[6mm] pt-[6mm] border-r border-[#D8D4CA] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[72px] font-extralight tracking-[-0.04em] text-[#111111] leading-[0.82] font-sans">
                {year}
              </div>
              <h1 className="text-[28px] font-light tracking-[0.16em] text-[#111111] uppercase leading-tight break-words max-w-[90mm]">
                {displayTitle}
              </h1>
            </div>

            <div className="text-[8px] font-mono tracking-[0.25em] text-[#777777] lowercase">
              www.birim.com
            </div>
          </div>

          {/* Quadrant 4: Bottom-Right (44% width) */}
          <div className="w-[44%] h-full pl-[6mm] pt-[6mm] flex flex-col justify-between">
            <p className="text-[8px] tracking-[0.2em] text-[#555555] uppercase font-light leading-relaxed">
              {lang === 'en'
                ? 'AN ARCHITECTURAL EXPLORATION OF TIMELESS FORMS, CRAFT AND MINIMALIST PROPORTIONS.'
                : 'ZAMANSIZ FORMLAR, MALZEME DİYALOĞU VE MİMARİ ORANLARIN ÇAĞDAŞ TASARIM KEŞFİ.'}
            </p>

            <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-[#777777]">
              <span>ISTANBUL</span>
              <span>FOLIO {String(pageNumber).padStart(2, '0')}</span>
            </div>
          </div>

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
  if (variant === 'alt-7') return <CoverAlt7 {...props} />;
  if (variant === 'alt-8') return <CoverAlt8 {...props} />;
  if (variant === 'alt-9') return <CoverAlt9 {...props} />;
  return <CoverAlt1 {...props} />;
};
