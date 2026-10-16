import React, { useState, useEffect, useRef } from 'react';
import { 
  CatalogCategory, 
  CatalogProduct, 
  CatalogTemplateType, 
  Language, 
  OutputFormat,
  CoverVariant
} from '../types/catalog';
import { BirimLogo } from './BirimLogo';
import { 
  Layers, 
  Printer, 
  Sliders, 
  Check, 
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Download,
  Upload
} from 'lucide-react';
import {
  saveTransformsToDisk,
  exportTransformsWithCustomName,
  importTransformsFromJson,
  resetAllTransforms,
  getSavedTransformCount,
  saveNamedPreset,
  getAvailablePresets,
  loadNamedPreset
} from './InteractiveCatalogImage';

interface SidebarProps {
  categories: CatalogCategory[];
  products: CatalogProduct[];
  selectedFormat: OutputFormat;
  onChangeFormat: (format: OutputFormat) => void;
  selectedCategory: string;
  onChangeCategory: (slug: string) => void;
  selectedProduct: string;
  onChangeProduct: (slug: string) => void;
  selectedTemplate: CatalogTemplateType;
  onChangeTemplate: (template: CatalogTemplateType) => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  includeCover: boolean;
  onToggleCover: (val: boolean) => void;
  coverVariant?: CoverVariant;
  onChangeCoverVariant?: (variant: CoverVariant) => void;
  includeEditorial: boolean;
  onToggleEditorial: (val: boolean) => void;
  includeTableOfContents?: boolean;
  onToggleTableOfContents?: (val: boolean) => void;
  includeCategoryDividers: boolean;
  onToggleCategoryDividers: (val: boolean) => void;
  includeMaterials: boolean;
  onToggleMaterials: (val: boolean) => void;
  includePrices: boolean;
  onTogglePrices: (val: boolean) => void;
  zoom: number;
  onChangeZoom: (delta: number) => void;
  onResetZoom: () => void;
  onPrint: () => void;
  totalPages: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  products,
  selectedFormat,
  onChangeFormat,
  selectedCategory,
  onChangeCategory,
  selectedProduct,
  onChangeProduct,
  selectedTemplate,
  onChangeTemplate,
  lang,
  onChangeLang,
  includeCover,
  onToggleCover,
  coverVariant = 'alt-1',
  onChangeCoverVariant,
  includeEditorial,
  onToggleEditorial,
  includeTableOfContents = false,
  onToggleTableOfContents,
  includeCategoryDividers,
  onToggleCategoryDividers,
  includeMaterials,
  onToggleMaterials,
  includePrices,
  onTogglePrices,
  zoom,
  onChangeZoom,
  onResetZoom,
  onPrint,
  totalPages,
}) => {
  const [savedCount, setSavedCount] = useState<number>(() => getSavedTransformCount());
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset management state
  const [presetName, setPresetName] = useState<string>('');
  const [availablePresets, setAvailablePresets] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const refreshPresets = () => {
    getAvailablePresets().then(list => {
      setAvailablePresets(list);
      if (list.length > 0) {
        setSelectedPreset(prev => prev && list.includes(prev) ? prev : list[0]);
      }
    });
  };

  useEffect(() => {
    refreshPresets();
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setSavedCount(getSavedTransformCount());
    };
    window.addEventListener('catalog-transforms-updated', handleUpdate);
    return () => {
      window.removeEventListener('catalog-transforms-updated', handleUpdate);
    };
  }, []);

  const handleSaveDisk = async () => {
    setIsSaving(true);
    setSaveMsg(null);
    const res = await saveTransformsToDisk();
    setIsSaving(false);
    setSaveMsg(res.message);
    refreshPresets();
    setTimeout(() => setSaveMsg(null), 4000);
  };

  const handleSaveNamedPreset = async () => {
    if (!presetName.trim()) {
      setSaveMsg('Lütfen bir isim yazın.');
      setTimeout(() => setSaveMsg(null), 3000);
      return;
    }
    setIsSaving(true);
    setSaveMsg(null);
    const res = await saveNamedPreset(presetName);
    setIsSaving(false);
    setSaveMsg(res.message);
    refreshPresets();
    setTimeout(() => setSaveMsg(null), 4000);
  };

  const handleDownloadNamed = () => {
    exportTransformsWithCustomName(presetName.trim() || 'catalog-kadraj');
  };

  const handleLoadSelectedPreset = async () => {
    if (!selectedPreset) return;
    setIsSaving(true);
    const ok = await loadNamedPreset(selectedPreset);
    setIsSaving(false);
    if (ok) {
      setSaveMsg(`"${selectedPreset}" yüklendi!`);
    } else {
      setSaveMsg('Preset yüklenemedi.');
    }
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importTransformsFromJson(content);
        if (success) {
          // If file had a name, save as preset too
          const filePresetName = file.name.replace(/\.json$/i, '');
          saveNamedPreset(filePresetName).then(() => refreshPresets());
          setSaveMsg(`"${file.name}" başarıyla yüklendi!`);
        } else {
          setSaveMsg('Geçersiz dosya formatı.');
        }
        setTimeout(() => setSaveMsg(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <aside className="w-80 bg-neutral-950 border-r border-neutral-800 text-neutral-300 flex flex-col h-screen select-none no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
        <div>
          <div className="flex items-center space-x-2">
            <BirimLogo variant="white" className="h-6 w-auto object-contain" />
            <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-mono">
              STUDIO
            </span>
          </div>
          <p className="text-[9px] tracking-wider text-neutral-500 uppercase mt-1">
            Katalog Tasarım Stüdyosu
          </p>
        </div>

        {/* Language Switcher Tabs */}
        <div className="flex items-center p-0.5 bg-neutral-900 border border-neutral-800 rounded-md">
          <button
            onClick={() => onChangeLang('tr')}
            className={`px-2 py-1 text-[10px] font-mono rounded font-medium transition-all ${
              lang === 'tr'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Türkçe Katalog"
          >
            TR
          </button>
          <button
            onClick={() => onChangeLang('en')}
            className={`px-2 py-1 text-[10px] font-mono rounded font-medium transition-all ${
              lang === 'en'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="English Catalog"
          >
            EN
          </button>
        </div>
      </div>

      {/* Scrollable Configuration Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* 1. KATALOG KAPSAMI (SCOPE) */}
        <div className="space-y-2.5">
          <label className="text-[9.5px] font-semibold tracking-[0.2em] text-neutral-400 uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            1. {lang === 'en' ? 'Catalog Scope' : 'Katalog Kapsamı'}
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
            <button
              onClick={() => onChangeFormat('master')}
              className={`py-1.5 text-[10px] tracking-wider uppercase font-medium rounded transition-all ${
                selectedFormat === 'master'
                  ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Full Catalog' : 'Tüm Katalog'}
            </button>
            <button
              onClick={() => onChangeFormat('category')}
              className={`py-1.5 text-[10px] tracking-wider uppercase font-medium rounded transition-all ${
                selectedFormat === 'category'
                  ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Category' : 'Kategori'}
            </button>
            <button
              onClick={() => onChangeFormat('product')}
              className={`py-1.5 text-[10px] tracking-wider uppercase font-medium rounded transition-all ${
                selectedFormat === 'product'
                  ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Product Sheet' : 'Ürün Föyü'}
            </button>
          </div>
        </div>

        {/* 2. KATEGORİ VEYA ÜRÜN SEÇİMİ */}
        {selectedFormat === 'category' && (
          <div className="space-y-2">
            <label className="text-[9.5px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">
              {lang === 'en' ? `Target Category (${categories.length})` : `Hedef Kategori (${categories.length})`}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onChangeCategory(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500"
            >
              {categories.map((c) => {
                const name = lang === 'en' ? (c.name.en || c.name.tr) : c.name.tr;
                return (
                  <option key={c.slug} value={c.slug}>
                    {name} ({c.product_count} {lang === 'en' ? 'Products' : 'Ürün'})
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selectedFormat === 'product' && (
          <div className="space-y-2">
            <label className="text-[9.5px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">
              {lang === 'en' ? `Target Product (${products.length})` : `Hedef Ürün (${products.length})`}
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => onChangeProduct(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500"
            >
              {products.map((p) => {
                const prodName = lang === 'en' ? (p.name.en || p.name.tr) : p.name.tr;
                const catName = lang === 'en' ? (p.category.name.en || p.category.name.tr) : p.category.name.tr;
                return (
                  <option key={p.slug} value={p.slug}>
                    {prodName} [{catName}]
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* 3. İTALYAN TASARIM ŞABLONLARI */}
        <div className="space-y-2.5">
          <label className="text-[9.5px] font-semibold tracking-[0.2em] text-neutral-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            2. Tasarım Şablonu
          </label>
          <div className="space-y-1.5">
            {/* Birim Collection (Resmi Şablon) */}
            <div
              onClick={() => onChangeTemplate('birim-collection')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === 'birim-collection'
                  ? 'border-neutral-300 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-700/50'
                  : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[11px] flex items-center gap-1.5 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Birim Collection (Resmi Şablon)
                </span>
                {selectedTemplate === 'birim-collection' && (
                  <Check className="w-3.5 h-3.5 text-neutral-200" />
                )}
              </div>
              <p className="text-[9px] text-neutral-400 mt-1 leading-relaxed">
                Birebir PDF: Üst logo çizgisi, büyük zarif tipografi, koleksiyonel hero görsel, alt editoryal detay ve 1-3 model yatay çizim veya 6'lı teknik grid.
              </p>
            </div>

            {/* Minotti Architectural */}
            <div
              onClick={() => onChangeTemplate('minotti-architectural')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === 'minotti-architectural'
                  ? 'border-neutral-300 bg-neutral-900 text-white'
                  : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[11px]">Minotti Architectural</span>
                {selectedTemplate === 'minotti-architectural' && (
                  <Check className="w-3.5 h-3.5 text-neutral-200" />
                )}
              </div>
              <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">
                2-Sayfa Spread: Sol tam boy sinematik görsel, Sağ: Büyük mimari tipografi & CAD ölçüleri.
              </p>
            </div>

            {/* B&B Italia Monolith */}
            <div
              onClick={() => onChangeTemplate('bb-italia-monolith')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === 'bb-italia-monolith'
                  ? 'border-neutral-300 bg-neutral-900 text-white'
                  : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[11px]">B&B Italia Monolith</span>
                {selectedTemplate === 'bb-italia-monolith' && (
                  <Check className="w-3.5 h-3.5 text-neutral-200" />
                )}
              </div>
              <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">
                2-Sayfa Spread: Sol izole heykelsi stüdyo objesi + bol negatif alan, Sağ: Detay grid & teknik plan.
              </p>
            </div>

            {/* Poliform Spec Sheet */}
            <div
              onClick={() => onChangeTemplate('poliform-specsheet')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === 'poliform-specsheet'
                  ? 'border-neutral-300 bg-neutral-900 text-white'
                  : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[11px]">Poliform Spec Sheet</span>
                {selectedTemplate === 'poliform-specsheet' && (
                  <Check className="w-3.5 h-3.5 text-neutral-200" />
                )}
              </div>
              <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">
                1-Sayfa Compact Föy: Üst yarı %50 fotoğraf, alt sol editoryal, alt sağ teknik çizim ve model tablosu.
              </p>
            </div>

            {/* Cassina Triennale */}
            <div
              onClick={() => onChangeTemplate('cassina-editorial')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === 'cassina-editorial'
                  ? 'border-neutral-300 bg-neutral-900 text-white'
                  : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[11px]">Cassina Triennale</span>
                {selectedTemplate === 'cassina-editorial' && (
                  <Check className="w-3.5 h-3.5 text-neutral-200" />
                )}
              </div>
              <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">
                2-Sayfa Spread: Sol editoryal monografi & çift makro detay (FIG. 01 & 02), Sağ yüzen perspektif & alt CAD teknik bandı.
              </p>
            </div>

            {/* Flexform Curated */}
            <div
              onClick={() => onChangeTemplate('flexform-curated')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === 'flexform-curated'
                  ? 'border-neutral-300 bg-neutral-900 text-white'
                  : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[11px]">Flexform Curated</span>
                {selectedTemplate === 'flexform-curated' && (
                  <Check className="w-3.5 h-3.5 text-neutral-200" />
                )}
              </div>
              <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">
                2-Sayfa Spread: Sol %100 tam boy bleed fotoğraf, Sağ sıcak editoryal zanaat hikayesi, ikincil zanaat görseli & 3 sütun teknik şematik.
              </p>
            </div>
          </div>
        </div>

        {/* 4. MODÜLER BÖLÜM VE SAYFA SEÇENEKLERİ */}
        <div className="space-y-2.5">
          <label className="text-[9.5px] font-semibold tracking-[0.2em] text-neutral-400 uppercase flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            3. Bölüm & Sayfa Eklentileri
          </label>
          <div className="space-y-2 bg-neutral-900/70 p-3 rounded-lg border border-neutral-800 text-[10.5px]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Ana Kapak (Master Cover)</span>
              <input
                type="checkbox"
                checked={includeCover}
                onChange={(e) => onToggleCover(e.target.checked)}
                className="rounded border-neutral-700 text-neutral-100 focus:ring-0 w-3.5 h-3.5 accent-white"
              />
            </label>

            {includeCover && onChangeCoverVariant && (
              <div className="pt-2 pb-1 border-t border-neutral-800/80 space-y-2">
                <div className="flex justify-between items-center text-[9px] text-neutral-400">
                  <span className="uppercase tracking-wider font-medium">Kapak Tasarımı:</span>
                  <span className="font-mono text-neutral-300">
                    {coverVariant === 'alt-1' ? 'Alt. 1 (Yatay Minimal)'
                      : coverVariant === 'alt-2' ? 'Alt. 2 (Yatay 26)'
                      : coverVariant === 'alt-3' ? 'Alt. 3 (Yatay Mimari)'
                      : coverVariant === 'alt-4' ? 'Alt. 4 (Dikey Sol)'
                      : coverVariant === 'alt-5' ? 'Alt. 5 (Dikey Siyah Blok)'
                      : coverVariant === 'alt-6' ? 'Alt. 6 (Dikey Sağ)'
                      : coverVariant === 'alt-7' ? 'Alt. 7 (Galeri Çerçeve)'
                      : coverVariant === 'alt-8' ? 'Alt. 8 (Koyu Monolit)'
                      : 'Alt. 9 (İsviçre Izgara)'}
                  </span>
                </div>

                {/* Yatay Logo Alternatifleri */}
                <div className="space-y-1">
                  <div className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">
                    Yatay Logo
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onChangeCoverVariant('alt-1')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-1'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 1: Minimal Swiss Monolith"
                    >
                      Alt. 1
                    </button>
                    <button
                      onClick={() => onChangeCoverVariant('alt-2')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-2'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 2: Tipografik 26 & Siyah Sırt"
                    >
                      Alt. 2
                    </button>
                    <button
                      onClick={() => onChangeCoverVariant('alt-3')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-3'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 3: Mimari Geometri & Katmanlar"
                    >
                      Alt. 3
                    </button>
                  </div>
                </div>

                {/* Dikey Logo Alternatifleri */}
                <div className="space-y-1 pt-1">
                  <div className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">
                    Dikey Logo
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onChangeCoverVariant('alt-4')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-4'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 4: Dikey Sol Minimal Monolith"
                    >
                      Alt. 4 (Sol)
                    </button>
                    <button
                      onClick={() => onChangeCoverVariant('alt-5')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-5'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 5: Dikey Siyah Monolit Kolon & Beyaz Logo"
                    >
                      Alt. 5 (Blok)
                    </button>
                    <button
                      onClick={() => onChangeCoverVariant('alt-6')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-6'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 6: Dikey Sağ Kılavuz & Poster Tipografisi"
                    >
                      Alt. 6 (Sağ)
                    </button>
                  </div>
                </div>

                {/* Modern & Editoryal Alternatifler */}
                <div className="space-y-1 pt-1">
                  <div className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">
                    Modern Monograf & Koyu
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onChangeCoverVariant('alt-7')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-7'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 7: Galeri Çerçeveli Minimalist Monograf"
                    >
                      Alt. 7 (Galeri)
                    </button>
                    <button
                      onClick={() => onChangeCoverVariant('alt-8')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-8'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 8: Koyu Stüdyo Monolit (Mat Antrasit)"
                    >
                      Alt. 8 (Koyu)
                    </button>
                    <button
                      onClick={() => onChangeCoverVariant('alt-9')}
                      className={`py-1.5 px-1.5 text-[9px] rounded font-medium transition-all text-center border ${
                        coverVariant === 'alt-9'
                          ? 'bg-neutral-100 text-neutral-950 border-white shadow'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                      }`}
                      title="Alternatif 9: İsviçre Izgara & Brütalist Tipografi"
                    >
                      Alt. 9 (Izgara)
                    </button>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Manifesto / Editorial</span>
              <input
                type="checkbox"
                checked={includeEditorial}
                onChange={(e) => onToggleEditorial(e.target.checked)}
                className="rounded border-neutral-700 text-neutral-100 focus:ring-0 w-3.5 h-3.5 accent-white"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">İçindekiler Sayfası (TOC)</span>
              <input
                type="checkbox"
                checked={includeTableOfContents}
                onChange={(e) => onToggleTableOfContents?.(e.target.checked)}
                className="rounded border-neutral-700 text-neutral-100 focus:ring-0 w-3.5 h-3.5 accent-white"
              />
            </label>

            {selectedFormat !== 'product' && (
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-neutral-300">Kategori Ara Kapakları</span>
                <input
                  type="checkbox"
                  checked={includeCategoryDividers}
                  onChange={(e) => onToggleCategoryDividers(e.target.checked)}
                  className="rounded border-neutral-700 text-neutral-100 focus:ring-0 w-3.5 h-3.5 accent-white"
                />
              </label>
            )}

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Malzeme Kartela Sayfası</span>
              <input
                type="checkbox"
                checked={includeMaterials}
                onChange={(e) => onToggleMaterials(e.target.checked)}
                className="rounded border-neutral-700 text-neutral-100 focus:ring-0 w-3.5 h-3.5 accent-white"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Fiyat Listesi Sayfası</span>
              <input
                type="checkbox"
                checked={includePrices}
                onChange={(e) => onTogglePrices(e.target.checked)}
                className="rounded border-neutral-700 text-neutral-100 focus:ring-0 w-3.5 h-3.5 accent-white"
              />
            </label>
          </div>
        </div>

        {/* 4. GÖRSEL KADRAJ & PRESET YÖNETİMİ */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[9.5px] font-semibold tracking-[0.2em] text-neutral-400 uppercase flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5 text-neutral-400" />
              4. Kadraj Ayarları & Preset
            </label>
            {savedCount > 0 && (
              <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/60">
                {savedCount} Kadraj
              </span>
            )}
          </div>

          <div className="space-y-2.5 bg-neutral-900/70 p-3 rounded-lg border border-neutral-800 text-[10.5px]">
            {saveMsg && (
              <div className="text-[9px] text-emerald-400 bg-emerald-950/70 p-2 rounded border border-emerald-800/80 font-medium">
                {saveMsg}
              </div>
            )}

            {/* A. Özel İsimle Kaydet & İndir */}
            <div className="space-y-1.5 border-b border-neutral-800/80 pb-2.5">
              <label className="text-[8.5px] text-neutral-400 font-medium uppercase tracking-wider block">
                Özel İsimle Kaydet:
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Örn: Koltuklar-V1, Baski-Kadraj..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600 font-mono"
              />
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={handleSaveNamedPreset}
                  disabled={isSaving}
                  className="py-1.5 px-2 bg-neutral-100 hover:bg-white text-neutral-950 text-[9.5px] font-semibold rounded flex items-center justify-center gap-1 transition-all shadow-sm"
                  title="Bu isimle diske ve tarayıcıya preset olarak kaydeder"
                >
                  <Save className="w-3 h-3 text-neutral-900" />
                  <span>{isSaving ? '...' : 'İsimle Kaydet'}</span>
                </button>
                <button
                  onClick={handleDownloadNamed}
                  className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[9.5px] font-medium rounded flex items-center justify-center gap-1 transition-all border border-neutral-700"
                  title="Bu isimle .json dosyası olarak indirir"
                >
                  <Download className="w-3 h-3 text-neutral-400" />
                  <span>İsimle İndir</span>
                </button>
              </div>
            </div>

            {/* B. Kayıtlı Presetlerden Yükle */}
            {availablePresets.length > 0 && (
              <div className="space-y-1.5 border-b border-neutral-800/80 pb-2.5">
                <label className="text-[8.5px] text-neutral-400 font-medium uppercase tracking-wider block">
                  Kayıtlı Preset'ten Yükle ({availablePresets.length}):
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 font-mono"
                  >
                    {availablePresets.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleLoadSelectedPreset}
                    disabled={isSaving}
                    className="py-1 px-3 bg-neutral-100 hover:bg-white text-neutral-950 text-[9.5px] font-semibold rounded transition-colors shadow-sm"
                    title="Seçili preset'i anında yükle ve uygula"
                  >
                    Yükle
                  </button>
                </div>
              </div>
            )}

            {/* C. Dosyadan JSON Yükle & Hızlı İşlemler */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[9.5px] text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                title="Bilgisayarınızdaki herhangi bir isimdeki .json kadraj dosyasını yükleyin"
              >
                <Upload className="w-3 h-3 text-neutral-400" />
                <span>Dosyadan JSON Yükle</span>
              </button>

              <button
                onClick={handleSaveDisk}
                disabled={isSaving}
                className="text-[9.5px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                title="Varsayılan catalog-image-transforms.json dosyasına hızlı kaydet"
              >
                <Save className="w-3 h-3" />
                <span>Hızlı Kaydet</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileImport}
              />
            </div>

            {savedCount > 0 && (
              <div className="pt-1 border-t border-neutral-800/60">
                <button
                  onClick={() => {
                    if (window.confirm('Tüm görsel kadrajlarını sıfırlamak istediğinize emin misiniz?')) {
                      resetAllTransforms();
                    }
                  }}
                  className="w-full text-[9px] text-neutral-500 hover:text-red-400 transition-colors text-center block"
                >
                  Tüm Kadrajları Sıfırla
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Zoom Controls & High-Res PDF Action */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 space-y-3">
        {/* Zoom & Page Count */}
        <div className="flex justify-between items-center text-[10px] text-neutral-400">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onChangeZoom(-10)}
              className="p-1 rounded hover:bg-neutral-800 hover:text-white transition-colors"
              title="Uzaklaş"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-neutral-300 w-10 text-center">{zoom}%</span>
            <button
              onClick={() => onChangeZoom(10)}
              className="p-1 rounded hover:bg-neutral-800 hover:text-white transition-colors"
              title="Yakınlaş"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetZoom}
              className="p-1 rounded hover:bg-neutral-800 hover:text-white transition-colors"
              title="Sıfırla"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          <div className="font-mono">
            {totalPages} Sayfa Derlendi
          </div>
        </div>

        {/* Direct High-Res PDF / Print Export */}
        <button
          onClick={onPrint}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-neutral-100 hover:bg-white text-neutral-950 font-medium text-[11px] tracking-wider uppercase rounded-lg shadow-lg transition-all active:scale-[0.98]"
        >
          <Printer className="w-4 h-4 text-neutral-900" />
          <span>300 DPI PDF İndir / Yazdır</span>
        </button>
      </div>
    </aside>
  );
};
