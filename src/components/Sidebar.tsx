import React, { useState, useEffect, useRef } from 'react';
import { 
  CatalogCategory, 
  CatalogProduct, 
  CatalogTemplateType, 
  Language, 
  OutputFormat,
  CoverVariant,
  CategoryDividerVariant,
  EditorialVariant,
  PdfLayoutMode
} from '../types/catalog';
import { BirimLogo } from './BirimLogo';
import { 
  BookOpen, 
  Layers, 
  Sliders, 
  Check, 
  Printer, 
  Save, 
  Download, 
  Upload,
  ChevronDown,
  RotateCcw,
  Columns,
  FileText,
  Loader2,
  LayoutGrid,
  RefreshCw
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
  editorialVariant?: EditorialVariant;
  onChangeEditorialVariant?: (variant: EditorialVariant) => void;
  includeTableOfContents?: boolean;
  onToggleTableOfContents?: (val: boolean) => void;
  includeCategoryDividers: boolean;
  onToggleCategoryDividers: (val: boolean) => void;
  categoryDividerVariant?: CategoryDividerVariant;
  onChangeCategoryDividerVariant?: (variant: CategoryDividerVariant) => void;
  includeMaterials: boolean;
  onToggleMaterials: (val: boolean) => void;
  includePrices: boolean;
  onTogglePrices: (val: boolean) => void;
  pdfLayout?: PdfLayoutMode;
  onChangePdfLayout?: (layout: PdfLayoutMode) => void;
  zoom: number;
  onChangeZoom: (delta: number) => void;
  onResetZoom: () => void;
  isGeneratingPdf?: boolean;
  onDownloadPdf?: () => void;
  onPrint: () => void;
  totalPages: number;
  isOpen?: boolean;
  isSyncing?: boolean;
  onSyncData?: () => void;
  lastSyncedAt?: string;
}

type TabType = 'catalog' | 'pages' | 'presets';

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
  editorialVariant = 'alt-1',
  onChangeEditorialVariant,
  includeTableOfContents = false,
  onToggleTableOfContents,
  includeCategoryDividers,
  onToggleCategoryDividers,
  categoryDividerVariant = 'alt-1',
  onChangeCategoryDividerVariant,
  includeMaterials,
  onToggleMaterials,
  includePrices,
  onTogglePrices,
  pdfLayout = 'single',
  onChangePdfLayout,
  zoom: _zoom,
  onChangeZoom: _onChangeZoom,
  onResetZoom: _onResetZoom,
  isGeneratingPdf = false,
  onDownloadPdf,
  onPrint,
  totalPages,
  isOpen = true,
  isSyncing = false,
  onSyncData,
  lastSyncedAt
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
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
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const handleSaveNamedPreset = async () => {
    if (!presetName.trim()) {
      setSaveMsg('Lütfen bir isim girin.');
      setTimeout(() => setSaveMsg(null), 3000);
      return;
    }
    setIsSaving(true);
    const res = await saveNamedPreset(presetName.trim());
    setIsSaving(false);
    setSaveMsg(res.message);
    if (res.success) {
      setPresetName('');
      refreshPresets();
    }
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const handleDownloadNamed = () => {
    exportTransformsWithCustomName(presetName.trim() || 'birim-kadraj-ayarlari');
    setSaveMsg('JSON dosyası indirildi.');
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleLoadSelectedPreset = async () => {
    if (!selectedPreset) return;
    setIsSaving(true);
    const success = await loadNamedPreset(selectedPreset);
    setIsSaving(false);
    setSaveMsg(success ? 'Preset başarıyla yüklendi.' : 'Preset yüklenemedi.');
    setTimeout(() => setSaveMsg(null), 3500);
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
          setSaveMsg('Kadraj ayarları başarıyla yüklendi.');
        } else {
          setSaveMsg('Geçersiz dosya formatı.');
        }
        setTimeout(() => setSaveMsg(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isEn = lang === 'en';

  const templates: {
    id: CatalogTemplateType;
    title: string;
    tag: string;
    desc: string;
    isPrimary?: boolean;
  }[] = [
    {
      id: 'birim-collection',
      title: isEn ? 'Birim Collection' : 'Birim Koleksiyon',
      tag: isEn ? 'Official Format' : 'Resmi Format',
      desc: isEn ? 'Minimal top header, elegant typography, and 2D CAD technical drawing grid.' : 'Minimal üst aks, zarif tipografi ve 2D CAD teknik çizim gridi.',
      isPrimary: true
    },
    {
      id: 'minotti-architectural',
      title: isEn ? 'Architectural Spread' : 'Mimari Çift Sayfa',
      tag: 'Architectural',
      desc: isEn ? 'Left cinematic hero visual, right editorial manifesto and technical specs.' : 'Sol sinematik geniş görsel, sağ editoryal manifesto ve teknik detaylar.'
    },
    {
      id: 'bb-italia-monolith',
      title: isEn ? 'Monolith Studio' : 'Monolith Stüdyo',
      tag: 'Minimal Monolith',
      desc: isEn ? 'Generous negative space, isolated sculptural studio object and technical plan.' : 'Geniş negatif alan, izole heykelsi stüdyo objesi ve teknik plan.'
    },
    {
      id: 'cassina-editorial',
      title: isEn ? 'Editorial Monograph' : 'Editoryal Monograf',
      tag: 'Editorial',
      desc: isEn ? 'Left dual macro craft visual, right floating hero perspective and CAD strip.' : 'Sol çift makro zanaat karesi, sağ yüzen ana perspektif ve CAD bandı.'
    },
    {
      id: 'flexform-curated',
      title: isEn ? 'Craft & Bleed' : 'Zanaat & Bleed',
      tag: 'Curated',
      desc: isEn ? 'Left full-bleed visual, right material texture and 3-column schematic.' : 'Sol tam boy bleed görsel, sağ malzeme dokusu ve 3 sütunlu şematik.'
    },
    {
      id: 'poliform-specsheet',
      title: isEn ? 'Compact Spec Sheet' : 'Kompakt Ürün Föyü',
      tag: isEn ? 'Single Page' : 'Tek Sayfa',
      desc: isEn ? '1-page rapid catalog: 50% photo, description, and technical dimensions.' : '1 sayfalık hızlı katalog: %50 fotoğraf, açıklama ve teknik ölçüler.'
    }
  ];

  const coverOptions = isEn ? [
    { value: 'alt-1', label: 'Alt. 1 — Horizontal Minimal Swiss' },
    { value: 'alt-2', label: 'Alt. 2 — Typographic 26 & Black Spine' },
    { value: 'alt-3', label: 'Alt. 3 — Architectural Geometry & Layers' },
    { value: 'alt-4', label: 'Alt. 4 — Vertical Left Minimal' },
    { value: 'alt-5', label: 'Alt. 5 — Vertical Black Block Column' },
    { value: 'alt-6', label: 'Alt. 6 — Vertical Right Poster' },
    { value: 'alt-7', label: 'Alt. 7 — Gallery Frame Monograph' },
    { value: 'alt-8', label: 'Alt. 8 — Dark Matte Anthracite' },
    { value: 'alt-9', label: 'Alt. 9 — Swiss Grid / Brutalist' }
  ] : [
    { value: 'alt-1', label: 'Alt. 1 — Yatay Minimal Swiss' },
    { value: 'alt-2', label: 'Alt. 2 — Tipografik 26 & Siyah Sırt' },
    { value: 'alt-3', label: 'Alt. 3 — Mimari Geometri & Katmanlar' },
    { value: 'alt-4', label: 'Alt. 4 — Dikey Sol Minimal' },
    { value: 'alt-5', label: 'Alt. 5 — Dikey Siyah Blok Kolon' },
    { value: 'alt-6', label: 'Alt. 6 — Dikey Sağ Poster' },
    { value: 'alt-7', label: 'Alt. 7 — Galeri Çerçeve Monograf' },
    { value: 'alt-8', label: 'Alt. 8 — Koyu Mat Antrasit' },
    { value: 'alt-9', label: 'Alt. 9 — İsviçre Izgara / Brütalist' }
  ];

  const editorialOptions = isEn ? [
    { value: 'alt-1', label: 'Alt. 1 — Minotti Typographic Manifesto' },
    { value: 'alt-2', label: 'Alt. 2 — B&B Visual Anchor & Manifesto' },
    { value: 'alt-3', label: 'Alt. 3 — Flexform Craft & Materiality' },
    { value: 'alt-4', label: 'Alt. 4 — Living Divani Pure Silence' },
    { value: 'alt-5', label: 'Alt. 5 — Cassina 3 Core Principles Grid' }
  ] : [
    { value: 'alt-1', label: 'Alt. 1 — Minotti Tipografik Manifesto' },
    { value: 'alt-2', label: 'Alt. 2 — B&B Görsel Çıpa & Manifesto' },
    { value: 'alt-3', label: 'Alt. 3 — Flexform Zanaat & Malzeme' },
    { value: 'alt-4', label: 'Alt. 4 — Living Divani Saf Sessizlik' },
    { value: 'alt-5', label: 'Alt. 5 — Cassina 3 Temel İlke Gridi' }
  ];

  const dividerOptions = isEn ? [
    { value: 'alt-1', label: 'Alt. 1 — Minotti Cinematic Architecture' },
    { value: 'alt-2', label: 'Alt. 2 — B&B Sculptural Monolith & Index' },
    { value: 'alt-3', label: 'Alt. 3 — Flexform Full-Bleed & Card' },
    { value: 'alt-4', label: 'Alt. 4 — Living Divani Pure White' },
    { value: 'alt-5', label: 'Alt. 5 — Poliform Mosaic Grid' },
    { value: 'alt-6', label: 'Alt. 6 — Birim Classic Official Line' },
    { value: 'alt-7', label: 'Alt. 7 — Linear Volumetric & Typology Matrix (B&W)' }
  ] : [
    { value: 'alt-1', label: 'Alt. 1 — Minotti Sinematik Mimari' },
    { value: 'alt-2', label: 'Alt. 2 — B&B Heykelsi Monolit & Fihrist' },
    { value: 'alt-3', label: 'Alt. 3 — Flexform Full-Bleed & Kart' },
    { value: 'alt-4', label: 'Alt. 4 — Living Divani Sessiz Beyaz' },
    { value: 'alt-5', label: 'Alt. 5 — Poliform Mozaik Grid' },
    { value: 'alt-6', label: 'Alt. 6 — Birim Klasik Resmi Çizgi' },
    { value: 'alt-7', label: 'Alt. 7 — Çizgisel Hacim & Tipoloji Matrisi (S/B)' }
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-80 md:w-84 bg-[#0d0d10] border-r border-neutral-800/80 text-neutral-300 flex flex-col h-full select-none no-print transition-all duration-300 z-30 shrink-0">
      
      {/* 1. Header / Brand Strip */}
      <div className="h-14 px-5 border-b border-neutral-800/80 flex items-center justify-between bg-[#0a0a0c]">
        <div className="flex items-center space-x-2.5">
          <BirimLogo variant="white" className="h-5 w-auto object-contain" />
          <span className="text-[10px] tracking-widest text-neutral-400 font-mono border-l border-neutral-800 pl-2">
            STUDIO
          </span>
        </div>

        {/* Minimal Language Toggle */}
        <div className="inline-flex rounded border border-neutral-800 bg-neutral-900/80 p-0.5 text-[11px] font-mono shrink-0">
          <button
            onClick={() => onChangeLang('tr')}
            className={`px-2 py-0.5 rounded transition-colors ${
              lang === 'tr' 
                ? 'bg-neutral-100 text-neutral-950 font-semibold' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            TR
          </button>
          <button
            onClick={() => onChangeLang('en')}
            className={`px-2 py-0.5 rounded transition-colors ${
              lang === 'en' 
                ? 'bg-neutral-100 text-neutral-950 font-semibold' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* 2. Flat Minimal Tab Bar */}
      <div className="grid grid-cols-3 border-b border-neutral-800/80 bg-[#0d0d10] text-[11px]">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-2 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
            activeTab === 'catalog'
              ? 'border-neutral-100 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/20'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isEn ? 'Catalog' : 'Katalog'}</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`py-3 px-2 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
            activeTab === 'pages'
              ? 'border-neutral-100 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/20'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isEn ? 'Pages' : 'Sayfalar'}</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`py-3 px-2 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 relative ${
            activeTab === 'presets'
              ? 'border-neutral-100 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/20'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isEn ? 'Framing' : 'Kadraj'}</span>
          {savedCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-2.5 right-2" />
          )}
        </button>
      </div>

      {/* 3. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        
        {/* ================= TAB 1: KATALOG (Scope & Template) ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Web Sitesi Senkronizasyonu */}
            {onSyncData && (
              <div className="p-3 bg-neutral-900/60 rounded border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                    <span className="text-[11px] font-medium text-neutral-200">
                      {isEn ? 'Live Website Data' : 'Web Sayfası Verileri'}
                    </span>
                  </div>
                  {lastSyncedAt && (
                    <span className="text-[9px] font-mono text-neutral-500">
                      {new Date(lastSyncedAt).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {isEn
                    ? 'Sync latest products, categories and CAD drawings from the website.'
                    : 'Web sayfasındaki en son ürün, kategori ve CAD teknik çizimlerini günceller.'}
                </p>
                <button
                  onClick={onSyncData}
                  disabled={isSyncing}
                  className="w-full py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 text-neutral-200 hover:text-white rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 border border-neutral-700/60 active:scale-[0.99]"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>{isEn ? 'Syncing...' : 'Veriler Güncelleniyor...'}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 text-neutral-400" />
                      <span>{isEn ? 'Sync Data from Web' : 'Web Sayfasından Verileri Güncelle'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Kapsam Seçimi */}
            <div className="space-y-2">
              <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono block">
                {lang === 'en' ? 'Catalog Scope' : 'Katalog Kapsamı'}
              </span>
              <div className="grid grid-cols-3 p-1 bg-neutral-900/90 rounded border border-neutral-800">
                <button
                  onClick={() => onChangeFormat('master')}
                  className={`py-1.5 text-[11px] font-medium rounded transition-all ${
                    selectedFormat === 'master'
                      ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Full' : 'Tümü'}
                </button>
                <button
                  onClick={() => onChangeFormat('category')}
                  className={`py-1.5 text-[11px] font-medium rounded transition-all ${
                    selectedFormat === 'category'
                      ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Category' : 'Kategori'}
                </button>
                <button
                  onClick={() => onChangeFormat('product')}
                  className={`py-1.5 text-[11px] font-medium rounded transition-all ${
                    selectedFormat === 'product'
                      ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Product' : 'Ürün'}
                </button>
              </div>
            </div>

            {/* Kategori veya Ürün Dropdown */}
            {selectedFormat === 'category' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] tracking-wider uppercase text-neutral-400 font-mono">
                  <span>{isEn ? 'Target Category' : 'Hedef Kategori'}</span>
                  <span className="text-neutral-400">{isEn ? `${categories.length} categories` : `${categories.length} adet`}</span>
                </div>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => onChangeCategory(e.target.value)}
                    className="w-full appearance-none bg-neutral-900/90 border border-neutral-800 rounded px-3 py-2 text-neutral-100 text-xs focus:outline-none focus:border-neutral-500 pr-8 font-sans"
                  >
                    {categories.map((c) => {
                      const name = lang === 'en' ? (c.name.en || c.name.tr) : c.name.tr;
                      return (
                        <option key={c.slug} value={c.slug}>
                          {name} ({c.product_count} {isEn ? 'products' : 'ürün'})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {selectedFormat === 'product' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] tracking-wider uppercase text-neutral-400 font-mono">
                  <span>{isEn ? 'Target Product' : 'Hedef Ürün'}</span>
                  <span className="text-neutral-400">{isEn ? `${products.length} products` : `${products.length} adet`}</span>
                </div>
                <div className="relative">
                  <select
                    value={selectedProduct}
                    onChange={(e) => onChangeProduct(e.target.value)}
                    className="w-full appearance-none bg-neutral-900/90 border border-neutral-800 rounded px-3 py-2 text-neutral-100 text-xs focus:outline-none focus:border-neutral-500 pr-8 font-sans"
                  >
                    {products.map((p) => {
                      const prodName = lang === 'en' ? (p.name.en || p.name.tr) : p.name.tr;
                      const catName = lang === 'en' ? (p.category.name.en || p.category.name.tr) : p.category.name.tr;
                      return (
                        <option key={p.slug} value={p.slug}>
                          {prodName} — {catName}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Tasarım Şablonları */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono block">
                {isEn ? 'Design Template' : 'Tasarım Şablonu'}
              </span>

              <div className="space-y-2">
                {templates.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => onChangeTemplate(tpl.id)}
                      className={`p-3 rounded border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-neutral-300 bg-neutral-900/90 text-white shadow-sm'
                          : 'border-neutral-800/80 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-xs ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                            {tpl.title}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            isSelected 
                              ? 'border-neutral-700 text-neutral-300 bg-neutral-800' 
                              : 'border-neutral-800 text-neutral-400 bg-neutral-900'
                          }`}>
                            {tpl.tag}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: SAYFALAR (Pages & Add-ons) ================= */}
        {activeTab === 'pages' && (
          <div className="space-y-5">
            
            {/* 1. Ana Kapak */}
            <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-200 block text-xs">{isEn ? 'Front Cover' : 'Ana Kapak'}</span>
                  <span className="text-[10px] text-neutral-400">{isEn ? 'Front cover page' : 'Ön kapak sayfası'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeCover}
                  onChange={(e) => onToggleCover(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-0 w-4 h-4 accent-white cursor-pointer"
                />
              </label>

              {includeCover && onChangeCoverVariant && (
                <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    {isEn ? 'Cover Design' : 'Kapak Tasarımı'}
                  </label>
                  <div className="relative">
                    <select
                      value={coverVariant}
                      onChange={(e) => onChangeCoverVariant(e.target.value as CoverVariant)}
                      className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 pr-7 font-sans"
                    >
                      {coverOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Manifesto / Editorial */}
            <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-200 block text-xs">{isEn ? 'Architectural Statement' : 'Mimari Yaklaşım'}</span>
                  <span className="text-[10px] text-neutral-400">{isEn ? 'Manifesto & philosophy page' : 'Manifesto ve felsefe sayfası'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeEditorial}
                  onChange={(e) => onToggleEditorial(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-0 w-4 h-4 accent-white cursor-pointer"
                />
              </label>

              {includeEditorial && onChangeEditorialVariant && (
                <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    {isEn ? 'Manifesto Layout' : 'Manifesto Düzeni'}
                  </label>
                  <div className="relative">
                    <select
                      value={editorialVariant}
                      onChange={(e) => onChangeEditorialVariant(e.target.value as EditorialVariant)}
                      className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 pr-7 font-sans"
                    >
                      {editorialOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* 3. İçindekiler Sayfası (TOC) */}
            <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-200 block text-xs">{isEn ? 'Table of Contents (TOC)' : 'İçindekiler (TOC)'}</span>
                  <span className="text-[10px] text-neutral-400">{isEn ? 'Page directory' : 'Sayfa fihristi'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeTableOfContents}
                  onChange={(e) => onToggleTableOfContents?.(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-0 w-4 h-4 accent-white cursor-pointer"
                />
              </label>
            </div>

            {/* 4. Kategori Ara Kapakları */}
            {selectedFormat !== 'product' && (
              <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-medium text-neutral-200 block text-xs">{isEn ? 'Category Dividers' : 'Kategori Ara Kapakları'}</span>
                    <span className="text-[10px] text-neutral-400">{isEn ? 'Section divider pages' : 'Bölüm geçiş kapakları'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeCategoryDividers}
                    onChange={(e) => onToggleCategoryDividers(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-0 w-4 h-4 accent-white cursor-pointer"
                  />
                </label>

                {includeCategoryDividers && onChangeCategoryDividerVariant && (
                  <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                      {isEn ? 'Divider Style' : 'Ara Kapak Stili'}
                    </label>
                    <div className="relative">
                      <select
                        value={categoryDividerVariant}
                        onChange={(e) => onChangeCategoryDividerVariant(e.target.value as CategoryDividerVariant)}
                        className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 pr-7 font-sans"
                      >
                        {dividerOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Malzeme & Fiyat Sayfaları */}
            <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-200 block text-xs">{isEn ? 'Material Swatches' : 'Malzeme Kartelası'}</span>
                  <span className="text-[10px] text-neutral-400">{isEn ? 'Fabric, leather and finish samples' : 'Kumaş, deri ve kaplama örnekleri'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeMaterials}
                  onChange={(e) => onToggleMaterials(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-0 w-4 h-4 accent-white cursor-pointer"
                />
              </label>

              <div className="pt-2 border-t border-neutral-800/80">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-medium text-neutral-200 block text-xs">{isEn ? 'Price List' : 'Fiyat Listesi'}</span>
                    <span className="text-[10px] text-neutral-400">{isEn ? 'Tabular pricing and dimension specs' : 'Tablolu fiyat ve ölçü dökümü'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includePrices}
                    onChange={(e) => onTogglePrices(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-0 w-4 h-4 accent-white cursor-pointer"
                  />
                </label>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: KADRAJ & PRESET ================= */}
        {activeTab === 'presets' && (
          <div className="space-y-5">
            
            {saveMsg && (
              <div className="text-[11px] text-emerald-400 bg-emerald-950/60 p-2.5 rounded border border-emerald-800/60 font-medium">
                {saveMsg}
              </div>
            )}

            {/* Kadraj Durumu Bilgisi */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded border border-neutral-800/80">
              <span className="text-xs text-neutral-300">{isEn ? 'Custom Framed Images' : 'Özel Kadrajlanmış Görseller'}</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                {isEn ? `${savedCount} images` : `${savedCount} adet`}
              </span>
            </div>

            {/* Özel İsimle Kaydet & İndir */}
            <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80 space-y-3">
              <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block">
                {isEn ? 'Create Custom Preset' : 'Özel Preset Oluştur'}
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder={isEn ? 'e.g. Print-Framing, Catalog-2026...' : 'Örn: Baski-Kadraj, Katalog-2026...'}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600 font-mono"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSaveNamedPreset}
                  disabled={isSaving}
                  className="py-2 px-2 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-neutral-900" />
                  <span>{isSaving ? '...' : (isEn ? 'Save Preset' : 'Preset Kaydet')}</span>
                </button>
                <button
                  onClick={handleDownloadNamed}
                  className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-all border border-neutral-700"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{isEn ? 'Download JSON' : 'JSON İndir'}</span>
                </button>
              </div>
            </div>

            {/* Kayıtlı Presetler */}
            {availablePresets.length > 0 && (
              <div className="p-3.5 bg-neutral-900/50 rounded border border-neutral-800/80 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                  <span>{isEn ? 'Saved Presets' : 'Kayıtlı Presetler'}</span>
                  <span>{availablePresets.length}</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 pr-7 font-mono"
                    >
                      {availablePresets.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    onClick={handleLoadSelectedPreset}
                    disabled={isSaving}
                    className="py-1.5 px-3 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-medium rounded transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isEn ? 'Load' : 'Yükle'}
                  </button>
                </div>
              </div>
            )}

            {/* Hızlı İşlemler */}
            <div className="p-3 bg-neutral-900/30 rounded border border-neutral-800/60 flex items-center justify-between text-xs">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                <span>{isEn ? 'Import JSON' : 'JSON Yükle'}</span>
              </button>

              <button
                onClick={handleSaveDisk}
                disabled={isSaving}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isEn ? 'Quick Save' : 'Hızlı Kaydet'}</span>
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
              <button
                onClick={() => {
                  if (window.confirm(isEn ? 'Are you sure you want to reset all image framing?' : 'Tüm görsel kadrajlarını sıfırlamak istediğinize emin misiniz?')) {
                    resetAllTransforms();
                  }
                }}
                className="w-full py-2 text-[11px] text-neutral-400 hover:text-red-400 border border-transparent hover:border-red-900/50 rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isEn ? 'Reset All Framing' : 'Tüm Kadrajları Sıfırla'}</span>
              </button>
            )}

          </div>
        )}

      </div>

      {/* 4. Bottom Sticky Summary / Quick Actions */}
      <div className="p-4 border-t border-neutral-800/80 bg-[#0a0a0c] space-y-3">
        {/* PDF Layout Mode Switcher */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block">
            {isEn ? 'PDF Layout / Spread' : 'PDF Sayfa Düzeni'}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-neutral-900/90 p-1 rounded border border-neutral-800">
            <button
              onClick={() => onChangePdfLayout?.('mixed')}
              className={`py-1.5 px-1.5 rounded text-[10px] font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                pdfLayout === 'mixed'
                  ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={isEn ? 'As Seen on Screen (Cover Single A4 + Products 2-Page Spread)' : 'Ekrandaki Gibi (Kapak Tek A4 + Ürünler 2\'li Açılım)'}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>{isEn ? 'Screen' : 'Ekrandaki'}</span>
            </button>
            <button
              onClick={() => onChangePdfLayout?.('spread')}
              className={`py-1.5 px-1.5 rounded text-[10px] font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                pdfLayout === 'spread'
                  ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={isEn ? 'All 2-Page Spreads (A3 Landscape 420x297)' : 'Tüm Sayfalar 2\'li Açılım (A3 Yatay)'}
            >
              <Columns className="w-3 h-3" />
              <span>{isEn ? 'Spread' : 'Açılım'}</span>
            </button>
            <button
              onClick={() => onChangePdfLayout?.('single')}
              className={`py-1.5 px-1.5 rounded text-[10px] font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                pdfLayout === 'single'
                  ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={isEn ? 'All Single Pages (A4 Portrait 210x297)' : 'Tüm Sayfalar Tekli A4 Dikey'}
            >
              <FileText className="w-3 h-3" />
              <span>{isEn ? 'Single' : 'Tekli A4'}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-neutral-400">
          <span className="font-mono">{isEn ? 'Total Scope' : 'Toplam Hacim'}</span>
          <span className="font-mono text-white font-medium bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
            {pdfLayout === 'spread' 
              ? `${Math.ceil(totalPages / 2)} ${isEn ? 'Spreads (A3)' : 'Açılım (A3)'} · ${totalPages} S.`
              : `${totalPages} ${isEn ? 'Pages A4' : 'Sayfa A4'}`}
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={onDownloadPdf || onPrint}
            disabled={isGeneratingPdf}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-medium text-xs tracking-wider uppercase rounded transition-all active:scale-[0.99] shadow-sm"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-950" />
                <span>{isEn ? 'Generating PDF...' : 'PDF İndiriliyor...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-neutral-950" />
                <span>
                  {pdfLayout === 'spread'
                    ? (isEn ? 'Download Spread PDF' : 'İkili Açılım PDF İndir')
                    : (isEn ? 'Download PDF' : 'PDF İndir')}
                </span>
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            title={isEn ? 'Print Dialog (Preview)' : 'Yazıcı İletişim Kutusu (Önizleme)'}
            className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
};
