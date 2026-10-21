import React, { useState, useMemo, useEffect } from 'react';
import { 
  PanelLeft, 
  PanelLeftClose, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Columns,
  FileText,
  Download,
  Loader2,
  LayoutGrid,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import rawCatalogData from './data/catalog-products.json';
import { 
  CatalogData, 
  CatalogProduct, 
  CatalogTemplateType, 
  Language, 
  OutputFormat,
  CoverVariant,
  CategoryDividerVariant,
  EditorialVariant,
  PdfLayoutMode
} from './types/catalog';
import { Sidebar } from './components/Sidebar';
import { MasterCover } from './templates/MasterCover';
import { CategoryDivider } from './templates/CategoryDivider';
import { EditorialPage } from './templates/EditorialPage';
import { MinottiArchitecturalSpread } from './templates/MinottiArchitecturalSpread';
import { BBItaliaMonolithSpread } from './templates/BBItaliaMonolithSpread';
import { PoliformSpecSheet } from './templates/PoliformSpecSheet';
import { MaterialCatalogPage } from './templates/MaterialCatalogPage';
import { PriceListPage } from './templates/PriceListPage';
import { BirimCollectionSpread, getBirimCollectionPageCount } from './templates/BirimCollectionSpread';
import { CassinaTriennaleSpread } from './templates/CassinaTriennaleSpread';
import { FlexformCuratedSpread } from './templates/FlexformCuratedSpread';
import { TableOfContentsPage, TocEntry, paginateTocEntries, TocPageColumnData } from './templates/TableOfContentsPage';
import { 
  SystemElementsPage, 
  getSystemElementsPageCount, 
  getSystemElementsChunks 
} from './templates/SystemElementsPage';
import { BlankCatalogPage } from './templates/BlankCatalogPage';

const catalogData = rawCatalogData as unknown as CatalogData;

const getInitialParam = (key: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const val = new URLSearchParams(window.location.search).get(key);
  return val !== null ? val : fallback;
};
const getInitialBool = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') return fallback;
  const val = new URLSearchParams(window.location.search).get(key);
  return val !== null ? val === 'true' : fallback;
};

const isPuppeteer = typeof window !== 'undefined' && (
  new URLSearchParams(window.location.search).get('puppeteer') === 'true' ||
  navigator.userAgent.includes('HeadlessChrome')
);

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(
    () => (getInitialParam('format', 'category') as OutputFormat)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => getInitialParam('category', catalogData.categories[0]?.slug || 'tekli-ler')
  );
  const [selectedProduct, setSelectedProduct] = useState<string>(
    () => getInitialParam('product', catalogData.all_products[0]?.slug || 'tk0251-tayra')
  );
  const [selectedTemplate, setSelectedTemplate] = useState<CatalogTemplateType>(
    () => (getInitialParam('template', 'minotti-architectural') as CatalogTemplateType)
  );
  const [lang, setLang] = useState<Language>(
    () => (getInitialParam('lang', 'tr') as Language)
  );

  // Add-on options
  const [includeCover, setIncludeCover] = useState<boolean>(
    () => getInitialBool('cover', true)
  );
  const [coverVariant, setCoverVariant] = useState<CoverVariant>(
    () => (getInitialParam('coverVariant', 'alt-1') as CoverVariant)
  );
  const [includeEditorial, setIncludeEditorial] = useState<boolean>(
    () => getInitialBool('editorial', true)
  );
  const [editorialVariant, setEditorialVariant] = useState<EditorialVariant>(
    () => (getInitialParam('editorialVariant', 'alt-1') as EditorialVariant)
  );
  const [includeTableOfContents, setIncludeTableOfContents] = useState<boolean>(
    () => getInitialBool('toc', true)
  );
  const [includeCategoryDividers, setIncludeCategoryDividers] = useState<boolean>(
    () => getInitialBool('dividers', true)
  );
  const [categoryDividerVariant, setCategoryDividerVariant] = useState<CategoryDividerVariant>(
    () => (getInitialParam('dividerVariant', 'alt-1') as CategoryDividerVariant)
  );
  const [includeMaterials, setIncludeMaterials] = useState<boolean>(
    () => getInitialBool('materials', true)
  );
  const [includePrices, setIncludePrices] = useState<boolean>(
    () => getInitialBool('prices', false)
  );

  // Zoom, PDF Generation & Print States
  const [zoom, setZoom] = useState<number>(75);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pdfLayout, setPdfLayout] = useState<PdfLayoutMode>(
    () => (getInitialParam('layout', 'mixed') as PdfLayoutMode)
  );

  const handleSyncData = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      const response = await fetch('/api/sync-catalog-data', {
        method: 'POST',
      });
      const data = await response.json() as {
        success?: boolean;
        message?: string;
        error?: string;
        totalProducts?: number;
        totalCategories?: number;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Senkronizasyon başarısız oldu.');
      }

      setSyncFeedback({
        type: 'success',
        message: data.message || (lang === 'en' ? 'Catalog data synced! Reloading...' : 'Veriler güncellendi! Yenileniyor...')
      });

      // Allow user to see confirmation before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSyncFeedback({
        type: 'error',
        message: `${lang === 'en' ? 'Sync error: ' : 'Güncelleme hatası: '}${message}`
      });
      setTimeout(() => {
        setSyncFeedback(null);
      }, 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync state to URL search parameters for Puppeteer & Shareability
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('format', selectedFormat);
    params.set('category', selectedCategory);
    params.set('product', selectedProduct);
    params.set('template', selectedTemplate);
    params.set('layout', pdfLayout);
    params.set('lang', lang);
    params.set('cover', String(includeCover));
    params.set('coverVariant', coverVariant);
    params.set('editorial', String(includeEditorial));
    params.set('editorialVariant', editorialVariant);
    params.set('toc', String(includeTableOfContents));
    params.set('dividers', String(includeCategoryDividers));
    params.set('dividerVariant', categoryDividerVariant);
    params.set('materials', String(includeMaterials));
    params.set('prices', String(includePrices));

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [
    selectedFormat,
    selectedCategory,
    selectedProduct,
    selectedTemplate,
    pdfLayout,
    lang,
    includeCover,
    coverVariant,
    includeEditorial,
    editorialVariant,
    includeTableOfContents,
    includeCategoryDividers,
    categoryDividerVariant,
    includeMaterials,
    includePrices
  ]);

  useEffect(() => {
    document.body.classList.remove('pdf-spread-mode', 'pdf-mixed-mode');
    if (pdfLayout === 'spread') {
      document.body.classList.add('pdf-spread-mode');
    } else if (pdfLayout === 'mixed') {
      document.body.classList.add('pdf-mixed-mode');
    }
    return () => {
      document.body.classList.remove('pdf-spread-mode', 'pdf-mixed-mode');
    };
  }, [pdfLayout]);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(150, Math.max(30, prev + delta)));
  };

  const handleResetZoom = () => setZoom(75);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;

    const layoutSlug = pdfLayout === 'spread' ? 'ikili-acilim' : (pdfLayout === 'mixed' ? 'ekrandaki-gibi' : 'tekli-a4');
    let scopeSlug = 'tum-koleksiyon';
    if (selectedFormat === 'product') {
      const p = catalogData.all_products.find((prod) => prod.slug === selectedProduct);
      scopeSlug = p ? p.slug : (selectedProduct || 'urun');
    } else if (selectedFormat === 'category') {
      scopeSlug = selectedCategory || 'kategori';
    }
    let targetFilename = `birim-katalog-${scopeSlug}-${layoutSlug}.pdf`;

    let fileHandle: any = null;

    // 1. Tarayıcıda yerel "Farklı Kaydet" penceresini hemen aç: Nereye ve hangi adla kaydedileceğini sorar
    if ('showSaveFilePicker' in window) {
      try {
        fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: targetFilename,
          types: [
            {
              description: 'PDF Belgesi (*.pdf)',
              accept: {
                'application/pdf': ['.pdf'],
              },
            },
          ],
        });
      } catch (pickerErr: any) {
        // Kullanıcı "İptal" butonuna bastıysa işlemi durdur
        if (pickerErr?.name === 'AbortError') {
          return;
        }
        console.warn('showSaveFilePicker açılamadı, alternatif indirmeye geçiliyor:', pickerErr);
      }
    } else {
      // Desteklemeyen tarayıcılarda dosya adı sor
      const userPromptName = window.prompt(
        lang === 'tr' ? 'Lütfen kaydedilecek PDF dosya adını giriniz:' : 'Please enter PDF file name to save:',
        targetFilename
      );
      if (userPromptName === null) {
        return; // Kullanıcı iptal etti
      }
      if (userPromptName.trim()) {
        targetFilename = userPromptName.trim().endsWith('.pdf') ? userPromptName.trim() : `${userPromptName.trim()}.pdf`;
      }
    }

    setIsGeneratingPdf(true);
    try {
      const search = window.location.search || `?layout=${pdfLayout}&format=${selectedFormat}`;
      const savedTransforms = localStorage.getItem('birim_catalog_image_transforms');
      let clientTransforms = {};
      if (savedTransforms) {
        try {
          clientTransforms = JSON.parse(savedTransforms);
        } catch (e) {
          console.warn('Failed to parse saved image transforms', e);
        }
      }

      const response = await fetch(`/api/download-pdf${search}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transforms: clientTransforms })
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.statusText}`);
      }
      const blob = await response.blob();

      // Kullanıcının seçtiği konuma ve dosya adına doğrudan yaz
      if (fileHandle) {
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = targetFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn('Direct PDF generator failed, falling back to browser print:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Filter products by selected scope
  const targetCategories = useMemo(() => {
    if (selectedFormat === 'master') {
      return catalogData.categories;
    }
    if (selectedFormat === 'category') {
      return catalogData.categories.filter((c) => c.slug === selectedCategory);
    }
    // Single product: use its category
    const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
    if (prod) {
      return catalogData.categories.filter((c) => c.id === prod.category.id || c.slug === prod.category.slug);
    }
    return catalogData.categories.slice(0, 1);
  }, [selectedFormat, selectedCategory, selectedProduct]);

  const activeCategoryTitle = useMemo(() => {
    const cat = catalogData.categories.find((c) => c.slug === selectedCategory);
    if (!cat) return lang === 'en' ? 'BIRIM COLLECTION' : 'BİRİM KOLEKSİYONU';
    return lang === 'en' ? (cat.name.en || cat.name.tr) : cat.name.tr;
  }, [selectedCategory, lang]);

  // Render product with selected Italian template
  const renderProductItem = (
    product: CatalogProduct,
    leftPageNum: number,
    rightPageNum: number
  ) => {
    if (selectedTemplate === 'minotti-architectural') {
      return (
        <MinottiArchitecturalSpread
          key={product.id || product.slug}
          product={product}
          pageNumberLeft={leftPageNum}
          pageNumberRight={rightPageNum}
          lang={lang}
        />
      );
    }
    if (selectedTemplate === 'bb-italia-monolith') {
      return (
        <BBItaliaMonolithSpread
          key={product.id || product.slug}
          product={product}
          pageNumberLeft={leftPageNum}
          pageNumberRight={rightPageNum}
          lang={lang}
        />
      );
    }
    if (selectedTemplate === 'cassina-editorial') {
      return (
        <CassinaTriennaleSpread
          key={product.id || product.slug}
          product={product}
          pageNumberLeft={leftPageNum}
          pageNumberRight={rightPageNum}
          lang={lang}
        />
      );
    }
    if (selectedTemplate === 'flexform-curated') {
      return (
        <FlexformCuratedSpread
          key={product.id || product.slug}
          product={product}
          pageNumberLeft={leftPageNum}
          pageNumberRight={rightPageNum}
          lang={lang}
        />
      );
    }
    if (selectedTemplate === 'birim-collection') {
      return (
        <BirimCollectionSpread
          key={product.id || product.slug}
          product={product}
          startPageNumber={leftPageNum}
          lang={lang}
          isSpreadMode={pdfLayout === 'spread' || pdfLayout === 'mixed'}
        />
      );
    }
    // Poliform Spec Sheet (Single-Page)
    if (pdfLayout === 'spread' || pdfLayout === 'mixed') {
      return (
        <div key={product.id || product.slug} className="catalog-spread-row flex flex-row gap-0">
          <PoliformSpecSheet
            product={product}
            pageNumber={leftPageNum}
            lang={lang}
          />
          <BlankCatalogPage
            pageNumber={rightPageNum}
            lang={lang}
          />
        </div>
      );
    }
    return (
      <div key={product.id || product.slug} className="flex justify-center">
        <PoliformSpecSheet
          product={product}
          pageNumber={leftPageNum}
          lang={lang}
        />
      </div>
    );
  };

  // Compile entire catalog document page sequence
  const renderedDocument = useMemo(() => {
    const elements: React.ReactNode[] = [];
    let pageCounter = 1;

    const getProductStep = (product: CatalogProduct) => {
      if (selectedTemplate === 'birim-collection') {
        return getBirimCollectionPageCount(product, pdfLayout === 'spread' || pdfLayout === 'mixed');
      }
      if (selectedTemplate === 'poliform-specsheet') {
        return (pdfLayout === 'spread' || pdfLayout === 'mixed') ? 2 : 1;
      }
      const extraSystemPages = (
        selectedTemplate === 'minotti-architectural' || 
        selectedTemplate === 'bb-italia-monolith' ||
        selectedTemplate === 'cassina-editorial' ||
        selectedTemplate === 'flexform-curated'
      )
        ? getSystemElementsPageCount(product)
        : 0;
      let total = 2 + extraSystemPages;
      if ((pdfLayout === 'spread' || pdfLayout === 'mixed') && total % 2 !== 0) {
        total += 1; // Pad odd system pages with a blank page
      }
      return total;
    };

    const getCoverVisual = () => {
      if (selectedFormat === 'product') {
        const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
        return prod?.cover_image?.url || prod?.gallery_images?.[0]?.url;
      }
      if (selectedFormat === 'category') {
        const catProds = catalogData.all_products.filter(
          (p) => p.category.slug === selectedCategory || p.category.id === selectedCategory
        );
        return catProds[0]?.cover_image?.url || catProds[0]?.gallery_images?.[0]?.url;
      }
      return catalogData.featured_samples?.[0]?.cover_image?.url || catalogData.all_products[0]?.cover_image?.url;
    };

    const getCoverTitle = () => {
      if (selectedFormat === 'category') {
        const cat = catalogData.categories.find((c) => c.slug === selectedCategory);
        if (!cat) return lang === 'en' ? 'Collection' : 'Koleksiyon';
        const raw = lang === 'en' ? (cat.name.en || cat.name.tr) : cat.name.tr;
        const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
        return raw.charAt(0).toLocaleUpperCase(locale) + raw.slice(1).toLocaleLowerCase(locale);
      }
      if (selectedFormat === 'product') {
        const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
        return prod ? (lang === 'en' ? (prod.name.en || prod.name.tr) : prod.name.tr) : (lang === 'en' ? 'Collection' : 'Koleksiyon');
      }
      return lang === 'en' ? 'Design Collection' : 'Tasarım Koleksiyonu';
    };

    const getCoverSubtitle = () => {
      if (selectedFormat === 'category') {
        const cat = catalogData.categories.find((c) => c.slug === selectedCategory);
        if (cat) {
          return (lang === 'en' ? (cat.name.en || cat.name.tr) : cat.name.tr).toUpperCase();
        }
        return lang === 'en' ? 'DESIGN COLLECTION' : 'TASARIM KOLEKSİYONU';
      }
      return lang === 'en' ? 'DESIGN COLLECTION' : 'TASARIM KOLEKSİYONU';
    };

    // Pre-calculate Table of Contents entries structure
    const tocEntries: TocEntry[] = [];
    let orderIndex = 1;

    if (includeEditorial) {
      tocEntries.push({
        id: 'editorial',
        order: String(orderIndex++).padStart(2, '0'),
        title: lang === 'en' ? 'ARCHITECTURAL STATEMENT' : 'MİMARİ YAKLAŞIM',
        subtitle: lang === 'en' ? 'Birim Design Philosophy' : 'Birim Tasarım Felsefesi',
        pageNumber: 0,
        type: 'editorial',
      });
    }

    if (selectedFormat === 'product') {
      const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
      if (prod) {
        const prodTitle = lang === 'en' ? prod.name.en : prod.name.tr;
        const designer = prod.designers?.[0] ? (lang === 'en' ? prod.designers[0].name.en : prod.designers[0].name.tr) : undefined;
        tocEntries.push({
          id: `prod-${prod.slug}`,
          order: String(orderIndex++).padStart(2, '0'),
          title: prodTitle,
          subtitle: lang === 'en' ? 'Perspective & Architectural Hero' : 'Sinematik Perspektif & Mekân Kurgusu',
          designer,
          pageNumber: 0,
          thumbnail: prod.cover_image?.url || prod.gallery_images?.[0]?.url,
          type: 'product',
        });
      }
    } else {
      targetCategories.forEach((cat) => {
        const catProds = catalogData.all_products.filter(
          (p) => p.category.id === cat.id || p.category.slug === cat.slug
        );
        const catTitle = lang === 'en' ? (cat.name.en || cat.name.tr) : cat.name.tr;
        const subItems = catProds.map((prod) => {
          const prodTitle = lang === 'en' ? prod.name.en : prod.name.tr;
          const designer = prod.designers?.[0] ? (lang === 'en' ? prod.designers[0].name.en : prod.designers[0].name.tr) : undefined;
          return {
            title: prodTitle,
            designer,
            pageNumber: 0,
            modelCount: prod.models_and_variations?.length || 1,
          };
        });

        tocEntries.push({
          id: `cat-${cat.slug}`,
          order: String(orderIndex++).padStart(2, '0'),
          title: catTitle,
          subtitle: `${catProds.length} ${lang === 'en' ? 'Models' : 'Ürün / Model'}`,
          pageNumber: 0,
          thumbnail: catProds[0]?.cover_image?.url || catProds[0]?.gallery_images?.[0]?.url,
          type: 'category',
          subItems,
        });
      });
    }

    if (includeMaterials) {
      tocEntries.push({
        id: 'materials',
        order: String(orderIndex++).padStart(2, '0'),
        title: lang === 'en' ? 'MATERIAL PALETTE' : 'MALZEME & RENK KARTELASI',
        subtitle: lang === 'en' ? 'Fabric, Leather & Metal Finishes' : 'Kumaş, Deri, Masif ve Metal Kaplamalar',
        pageNumber: 0,
        type: 'materials',
      });
    }

    if (includePrices) {
      tocEntries.push({
        id: 'prices',
        order: String(orderIndex++).padStart(2, '0'),
        title: lang === 'en' ? 'PRICE & TECHNICAL LIST' : 'FİYAT VE TEKNİK LİSTE',
        subtitle: lang === 'en' ? 'Dimensional & Price Matrix' : 'Model Ölçüleri ve Fiyat Matrisi',
        pageNumber: 0,
        type: 'prices',
      });
    }

    // Dynamic TOC pagination calculation
    const initialTocPages = includeTableOfContents ? paginateTocEntries(tocEntries, 36) : [];
    const tocPageCount = initialTocPages.length;

    // Calculate actual starting page mapping
    let simPage = 1;
    if (includeCover) simPage += (pdfLayout === 'spread' ? 2 : 1);
    if (includeEditorial) {
      const ed = tocEntries.find((e) => e.id === 'editorial');
      if (ed) ed.pageNumber = simPage;
      simPage += (pdfLayout === 'spread' ? 2 : 1);
    }
    simPage += (pdfLayout === 'spread' ? Math.ceil(tocPageCount / 2) * 2 : tocPageCount);

    if (selectedFormat === 'product') {
      const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
      if (prod) {
        const prodEntry = tocEntries.find((e) => e.id === `prod-${prod.slug}`);
        if (prodEntry) prodEntry.pageNumber = simPage;
        simPage += getProductStep(prod);
      }
    } else {
      targetCategories.forEach((cat) => {
        const catEntry = tocEntries.find((e) => e.id === `cat-${cat.slug}`);
        if (catEntry) catEntry.pageNumber = simPage;
        if (includeCategoryDividers) simPage += (pdfLayout === 'spread' ? 2 : 1);

        const catProds = catalogData.all_products.filter(
          (p) => p.category.id === cat.id || p.category.slug === cat.slug
        );
        catProds.forEach((prod, pIdx) => {
          if (catEntry?.subItems?.[pIdx]) {
            catEntry.subItems[pIdx].pageNumber = simPage;
          }
          simPage += getProductStep(prod);
        });
      });
    }

    if (includeMaterials) {
      const mat = tocEntries.find((e) => e.id === 'materials');
      if (mat) mat.pageNumber = simPage;
      simPage += (pdfLayout === 'spread' ? 2 : 1);
    }

    if (includePrices) {
      const prc = tocEntries.find((e) => e.id === 'prices');
      if (prc) prc.pageNumber = simPage;
      simPage += (pdfLayout === 'spread' ? 2 : 1);
    }

    // 1. Master Cover
    if (includeCover) {
      if (pdfLayout === 'spread') {
        elements.push(
          <div key="cover" id={`page-${pageCounter}`} className="flex justify-center">
            <div className="catalog-spread-row flex flex-row gap-0">
              <MasterCover 
                metadata={catalogData.metadata} 
                title={getCoverTitle()}
                subtitle={getCoverSubtitle()}
                coverImage={getCoverVisual()}
                pageNumber={pageCounter}
                lang={lang}
                variant={coverVariant}
              />
              <BlankCatalogPage pageNumber={pageCounter + 1} lang={lang} />
            </div>
          </div>
        );
        pageCounter += 2;
      } else {
        elements.push(
          <div key="cover" id={`page-${pageCounter}`} className="catalog-page-single-wrap flex justify-center">
            <MasterCover 
              metadata={catalogData.metadata} 
              title={getCoverTitle()}
              subtitle={getCoverSubtitle()}
              coverImage={getCoverVisual()}
              pageNumber={pageCounter}
              lang={lang}
              variant={coverVariant}
            />
          </div>
        );
        pageCounter++;
      }
    }

    // 2. Brand Manifesto / Editorial
    if (includeEditorial) {
      if (pdfLayout === 'spread') {
        elements.push(
          <div key={`editorial-${editorialVariant}`} id={`page-${pageCounter}`} className="flex justify-center">
            <div className="catalog-spread-row flex flex-row gap-0">
              <EditorialPage 
                pageNumber={pageCounter} 
                lang={lang} 
                variant={editorialVariant}
                featuredVisual={catalogData.featured_samples?.[0]?.cover_image?.url || catalogData.all_products[0]?.cover_image?.url}
                secondaryVisual={catalogData.all_products[1]?.gallery_images?.[0]?.url || catalogData.all_products[1]?.cover_image?.url}
              />
              <BlankCatalogPage pageNumber={pageCounter + 1} lang={lang} />
            </div>
          </div>
        );
        pageCounter += 2;
      } else {
        elements.push(
          <div key={`editorial-${editorialVariant}`} id={`page-${pageCounter}`} className="catalog-page-single-wrap flex justify-center">
            <EditorialPage 
              pageNumber={pageCounter} 
              lang={lang} 
              variant={editorialVariant}
              featuredVisual={catalogData.featured_samples?.[0]?.cover_image?.url || catalogData.all_products[0]?.cover_image?.url}
              secondaryVisual={catalogData.all_products[1]?.gallery_images?.[0]?.url || catalogData.all_products[1]?.cover_image?.url}
            />
          </div>
        );
        pageCounter++;
      }
    }

    // 3. Table of Contents / İçindekiler (Multi-page support)
    if (includeTableOfContents) {
      const finalTocPages = paginateTocEntries(tocEntries, 36);
      if (pdfLayout === 'spread') {
        for (let pIdx = 0; pIdx < finalTocPages.length; pIdx += 2) {
          const leftPage = finalTocPages[pIdx];
          const rightPage = finalTocPages[pIdx + 1];
          const leftNum = pageCounter;
          const rightNum = pageCounter + 1;
          elements.push(
            <div key={`toc-spread-${pIdx}`} id={`page-${leftNum}`} className="flex justify-center">
              <div className="catalog-spread-row flex flex-row gap-0">
                <TableOfContentsPage
                  pageNumber={leftNum}
                  tocPageIndex={pIdx}
                  totalTocPages={finalTocPages.length}
                  totalSectionsCount={tocEntries.length}
                  leftColumnEntries={leftPage.left}
                  rightColumnEntries={leftPage.right}
                  format={selectedFormat}
                  categoryTitle={activeCategoryTitle}
                  lang={lang}
                  onNavigateToPage={(targetPage) => {
                    const el = document.getElementById(`page-${targetPage}`) || document.querySelector(`[data-page="${targetPage}"]`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
                {rightPage ? (
                  <TableOfContentsPage
                    pageNumber={rightNum}
                    tocPageIndex={pIdx + 1}
                    totalTocPages={finalTocPages.length}
                    totalSectionsCount={tocEntries.length}
                    leftColumnEntries={rightPage.left}
                    rightColumnEntries={rightPage.right}
                    format={selectedFormat}
                    categoryTitle={activeCategoryTitle}
                    lang={lang}
                    onNavigateToPage={(targetPage) => {
                      const el = document.getElementById(`page-${targetPage}`) || document.querySelector(`[data-page="${targetPage}"]`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  />
                ) : (
                  <BlankCatalogPage pageNumber={rightNum} lang={lang} />
                )}
              </div>
            </div>
          );
          pageCounter += 2;
        }
      } else {
        finalTocPages.forEach((pageData: TocPageColumnData, pIdx: number) => {
          elements.push(
            <div key={`toc-${pIdx}`} id={`page-${pageCounter}`} className="catalog-page-single-wrap flex justify-center">
              <TableOfContentsPage
                pageNumber={pageCounter}
                tocPageIndex={pIdx}
                totalTocPages={finalTocPages.length}
                totalSectionsCount={tocEntries.length}
                leftColumnEntries={pageData.left}
                rightColumnEntries={pageData.right}
                format={selectedFormat}
                categoryTitle={activeCategoryTitle}
                lang={lang}
                onNavigateToPage={(targetPage) => {
                  const el = document.getElementById(`page-${targetPage}`) || document.querySelector(`[data-page="${targetPage}"]`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            </div>
          );
          pageCounter++;
        });
      }
    }

    // 3. Category & Products
    if (selectedFormat === 'product') {
      const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
      if (prod) {
        const step = getProductStep(prod);
        elements.push(
          <div key={`prod-${prod.slug}`} id={`page-${pageCounter}`} className="flex justify-center">
            {renderProductItem(prod, pageCounter, pageCounter + 1)}
          </div>
        );
        if (
          selectedTemplate === 'minotti-architectural' || 
          selectedTemplate === 'bb-italia-monolith' ||
          selectedTemplate === 'cassina-editorial' ||
          selectedTemplate === 'flexform-curated'
        ) {
          const chunks = getSystemElementsChunks(prod);
          if (pdfLayout === 'spread' || pdfLayout === 'mixed') {
            for (let cIdx = 0; cIdx < chunks.length; cIdx += 2) {
              const chunkLeft = chunks[cIdx];
              const chunkRight = chunks[cIdx + 1];
              const pNumLeft = pageCounter + 2 + cIdx;
              const pNumRight = pageCounter + 3 + cIdx;
              elements.push(
                <div key={`system-spread-${prod.slug}-${cIdx}`} className="flex justify-center">
                  <div className="catalog-spread-row flex flex-row gap-0">
                    <SystemElementsPage
                      product={prod}
                      drawings={chunkLeft.drawings}
                      startIndex={chunkLeft.startIndex}
                      pageNumber={pNumLeft}
                      lang={lang}
                    />
                    {chunkRight ? (
                      <SystemElementsPage
                        product={prod}
                        drawings={chunkRight.drawings}
                        startIndex={chunkRight.startIndex}
                        pageNumber={pNumRight}
                        lang={lang}
                      />
                    ) : (
                      <BlankCatalogPage pageNumber={pNumRight} lang={lang} />
                    )}
                  </div>
                </div>
              );
            }
          } else {
            chunks.forEach((chunk, chunkIdx) => {
              elements.push(
                <div key={`system-${prod.slug}-${chunkIdx}`} className="catalog-page-single-wrap flex justify-center">
                  <SystemElementsPage
                    product={prod}
                    drawings={chunk.drawings}
                    startIndex={chunk.startIndex}
                    pageNumber={pageCounter + 2 + chunkIdx}
                    lang={lang}
                  />
                </div>
              );
            });
          }
        }
        pageCounter += step;
      }
    } else {
      // Loop target categories
      targetCategories.forEach((cat, catIdx) => {
        // Products in this category
        const catProds = catalogData.all_products.filter(
          (p) => p.category.id === cat.id || p.category.slug === cat.slug
        );

        // Category Divider
        if (includeCategoryDividers) {
          if (pdfLayout === 'spread') {
            elements.push(
              <div key={`cat-divider-${cat.slug}-${categoryDividerVariant}`} id={`page-${pageCounter}`} className="flex justify-center">
                <div className="catalog-spread-row flex flex-row gap-0">
                  <CategoryDivider
                    category={cat}
                    categoryIndex={catIdx}
                    featuredProduct={catProds[0]}
                    categoryProducts={catProds}
                    pageNumber={pageCounter}
                    lang={lang}
                    variant={categoryDividerVariant}
                    onSelectProduct={(p) => {
                      const targetEl = document.getElementById(`prod-${p.slug}`);
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  />
                  <BlankCatalogPage pageNumber={pageCounter + 1} lang={lang} />
                </div>
              </div>
            );
            pageCounter += 2;
          } else {
            elements.push(
              <div key={`cat-divider-${cat.slug}-${categoryDividerVariant}`} id={`page-${pageCounter}`} className="catalog-page-single-wrap flex justify-center">
                <CategoryDivider
                  category={cat}
                  categoryIndex={catIdx}
                  featuredProduct={catProds[0]}
                  categoryProducts={catProds}
                  pageNumber={pageCounter}
                  lang={lang}
                  variant={categoryDividerVariant}
                  onSelectProduct={(p) => {
                    const targetEl = document.getElementById(`prod-${p.slug}`);
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                />
              </div>
            );
            pageCounter++;
          }
        }

        catProds.forEach((prod) => {
          const step = getProductStep(prod);
          elements.push(
            <div key={`prod-${prod.slug}`} id={`prod-${prod.slug}`} data-page={pageCounter} className="flex justify-center">
              {renderProductItem(prod, pageCounter, pageCounter + 1)}
            </div>
          );
          if (
            selectedTemplate === 'minotti-architectural' || 
            selectedTemplate === 'bb-italia-monolith' ||
            selectedTemplate === 'cassina-editorial' ||
            selectedTemplate === 'flexform-curated'
          ) {
            const chunks = getSystemElementsChunks(prod);
            if (pdfLayout === 'spread' || pdfLayout === 'mixed') {
              for (let cIdx = 0; cIdx < chunks.length; cIdx += 2) {
                const chunkLeft = chunks[cIdx];
                const chunkRight = chunks[cIdx + 1];
                const pNumLeft = pageCounter + 2 + cIdx;
                const pNumRight = pageCounter + 3 + cIdx;
                elements.push(
                  <div key={`system-spread-${prod.slug}-${cIdx}`} className="flex justify-center">
                    <div className="catalog-spread-row flex flex-row gap-0">
                      <SystemElementsPage
                        product={prod}
                        drawings={chunkLeft.drawings}
                        startIndex={chunkLeft.startIndex}
                        pageNumber={pNumLeft}
                        lang={lang}
                      />
                      {chunkRight ? (
                        <SystemElementsPage
                          product={prod}
                          drawings={chunkRight.drawings}
                          startIndex={chunkRight.startIndex}
                          pageNumber={pNumRight}
                          lang={lang}
                        />
                      ) : (
                        <BlankCatalogPage pageNumber={pNumRight} lang={lang} />
                      )}
                    </div>
                  </div>
                );
              }
            } else {
              chunks.forEach((chunk, chunkIdx) => {
                elements.push(
                  <div key={`system-${prod.slug}-${chunkIdx}`} className="catalog-page-single-wrap flex justify-center">
                    <SystemElementsPage
                      product={prod}
                      drawings={chunk.drawings}
                      startIndex={chunk.startIndex}
                      pageNumber={pageCounter + 2 + chunkIdx}
                      lang={lang}
                    />
                  </div>
                );
              });
            }
          }
          pageCounter += step;
        });
      });
    }

    // 4. Material Catalog Swatches
    if (includeMaterials) {
      if (pdfLayout === 'spread') {
        elements.push(
          <div key="materials" id={`page-${pageCounter}`} className="flex justify-center">
            <div className="catalog-spread-row flex flex-row gap-0">
              <MaterialCatalogPage
                categoryTitle={activeCategoryTitle}
                pageNumber={pageCounter}
                lang={lang}
              />
              <BlankCatalogPage pageNumber={pageCounter + 1} lang={lang} />
            </div>
          </div>
        );
        pageCounter += 2;
      } else {
        elements.push(
          <div key="materials" id={`page-${pageCounter}`} className="catalog-page-single-wrap flex justify-center">
            <MaterialCatalogPage
              categoryTitle={activeCategoryTitle}
              pageNumber={pageCounter}
              lang={lang}
            />
          </div>
        );
        pageCounter++;
      }
    }

    // 5. Price List Table
    if (includePrices) {
      const activeProducts = selectedFormat === 'product'
        ? catalogData.all_products.filter(p => p.slug === selectedProduct)
        : catalogData.all_products.filter(p => targetCategories.some(c => c.id === p.category.id || c.slug === p.category.slug));

      if (pdfLayout === 'spread') {
        elements.push(
          <div key="prices" id={`page-${pageCounter}`} className="flex justify-center">
            <div className="catalog-spread-row flex flex-row gap-0">
              <PriceListPage
                products={activeProducts}
                categoryTitle={activeCategoryTitle}
                pageNumber={pageCounter}
                lang={lang}
              />
              <BlankCatalogPage pageNumber={pageCounter + 1} lang={lang} />
            </div>
          </div>
        );
        pageCounter += 2;
      } else {
        elements.push(
          <div key="prices" id={`page-${pageCounter}`} className="catalog-page-single-wrap flex justify-center">
            <PriceListPage
              products={activeProducts}
              categoryTitle={activeCategoryTitle}
              pageNumber={pageCounter}
              lang={lang}
            />
          </div>
        );
        pageCounter++;
      }
    }

    return { elements, totalPages: pageCounter - 1 };
  }, [
    includeCover,
    coverVariant,
    includeEditorial,
    editorialVariant,
    includeTableOfContents,
    includeCategoryDividers,
    categoryDividerVariant,
    includeMaterials,
    includePrices,
    selectedFormat,
    selectedCategory,
    selectedProduct,
    selectedTemplate,
    lang,
    targetCategories,
    activeCategoryTitle,
    pdfLayout
  ]);

  return (
    <div className="app-layout-root flex flex-col h-screen bg-[#0d0d10] text-neutral-100 overflow-hidden font-sans">
      {/* Top Header / Studio Bar */}
      <header className="h-14 border-b border-neutral-800/80 bg-[#0a0a0c] px-4 flex items-center justify-between no-print z-40 shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800/60 transition-colors"
            title={isSidebarOpen ? "Kenar çubuğunu gizle" : "Kenar çubuğunu göster"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-neutral-800" />

          <div className="flex items-center space-x-2.5">
            <span className="font-medium tracking-wide text-xs uppercase text-neutral-200">
              {selectedFormat === 'master' 
                ? (lang === 'en' ? 'Birim Collection (Complete Catalog)' : 'Birim Koleksiyonu (Tüm Katalog)')
                : selectedFormat === 'category' 
                ? activeCategoryTitle 
                : (catalogData.all_products.find(p => p.slug === selectedProduct)?.name[lang] || (lang === 'en' ? 'Product Spec Sheet' : 'Ürün Föyü'))}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {renderedDocument.totalPages} {lang === 'en' ? 'Pages · A4 300 DPI' : 'Sayfa · A4 300 DPI'}
            </span>
          </div>
        </div>

        {/* Center Quick Format Switcher */}
        <div className="hidden md:flex items-center p-0.5 bg-neutral-900/90 border border-neutral-800 rounded">
          <button
            onClick={() => setSelectedFormat('master')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFormat === 'master'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Full Catalog' : 'Tüm Katalog'}
          </button>
          <button
            onClick={() => setSelectedFormat('category')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFormat === 'category'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Category' : 'Kategori'}
          </button>
          <button
            onClick={() => setSelectedFormat('product')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              selectedFormat === 'product'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lang === 'en' ? 'Product' : 'Ürün Föyü'}
          </button>
        </div>

        {/* Right Controls: Sync, Layout Mode, Zoom & Print */}
        <div className="flex items-center space-x-2.5">
          {/* Direct Sync from Live Website CTA */}
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 py-1.5 px-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-neutral-300 hover:text-white border border-neutral-800 rounded transition-colors text-xs font-mono"
            title={lang === 'en' ? 'Sync live catalog data from web (Sanity CMS)' : 'Web sayfasından (Sanity CMS) güncel verileri çek'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-neutral-400'}`} />
            <span className="hidden xl:inline">
              {isSyncing ? (lang === 'en' ? 'Syncing...' : 'Güncelleniyor...') : (lang === 'en' ? 'Sync Web Data' : 'Verileri Güncelle')}
            </span>
          </button>

          {/* PDF Layout Mode Switcher */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-xs">
            <button
              onClick={() => setPdfLayout('mixed')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                pdfLayout === 'mixed'
                  ? 'bg-neutral-800 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={lang === 'en' ? 'As Seen on Screen (Cover Single A4 + Products 2-Page Spread)' : 'Ekrandaki Gibi (Kapak Tek A4 + Ürünler 2\'li Açılım)'}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{lang === 'en' ? 'Screen' : 'Ekrandaki Gibi'}</span>
            </button>
            <button
              onClick={() => setPdfLayout('spread')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                pdfLayout === 'spread'
                  ? 'bg-neutral-800 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={lang === 'en' ? '2-Page Spreads (A3 Landscape - 420x297mm)' : '2 Sayfa Yanyana Açılım (A3 Yatay - 420x297mm)'}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{lang === 'en' ? '2-Page Spread' : '2\'li Açılım'}</span>
            </button>
            <button
              onClick={() => setPdfLayout('single')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                pdfLayout === 'single'
                  ? 'bg-neutral-800 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title={lang === 'en' ? 'Single A4 Pages' : 'Tekli A4 Sayfalar'}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{lang === 'en' ? 'Single (A4)' : 'Tekli A4'}</span>
            </button>
          </div>

          {/* Zoom Capsule */}
          <div className="flex items-center space-x-1 bg-neutral-900/90 border border-neutral-800 rounded px-1.5 py-1 text-xs">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Uzaklaş"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-neutral-300 w-10 text-center select-none text-xs">
              {zoom}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Yakınlaş"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors border-l border-neutral-800 ml-0.5"
              title="Varsayılan Boyut (%75)"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Direct PDF Download CTA */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center space-x-1.5 py-1.5 px-3.5 bg-neutral-100 hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-medium text-xs rounded transition-all active:scale-[0.98] shadow-sm"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-950" />
                <span>{lang === 'en' ? 'Generating PDF...' : 'PDF İndiriliyor...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-neutral-950" />
                <span className="hidden sm:inline">
                  {pdfLayout === 'spread'
                    ? (lang === 'en' ? 'Download Spread PDF' : 'İkili Açılım PDF İndir')
                    : (lang === 'en' ? 'Download PDF' : 'PDF İndir')}
                </span>
              </>
            )}
          </button>

          {/* Quick Print Dialog Fallback */}
          <button
            onClick={handlePrint}
            title={lang === 'en' ? 'Print Dialog (Browser Preview)' : 'Yazıcı İletişim Kutusu (Önizleme)'}
            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Dynamic Print Page Size Styles */}
      <style>{`
        ${pdfLayout === 'mixed' ? `
          @page { margin: 0mm !important; }
          @page single-a4 { size: 210mm 297mm; margin: 0mm !important; }
          @page spread-a3 { size: 420mm 297mm; margin: 0mm !important; }
        ` : pdfLayout === 'spread' ? `
          @page { size: 420mm 297mm !important; margin: 0mm !important; }
        ` : `
          @page { size: 210mm 297mm !important; margin: 0mm !important; }
        `}
      `}</style>

      {/* Main Workspace: Sidebar + Canvas Viewport */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          categories={catalogData.categories}
          products={catalogData.all_products}
          selectedFormat={selectedFormat}
          onChangeFormat={setSelectedFormat}
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          onChangeProduct={setSelectedProduct}
          selectedTemplate={selectedTemplate}
          onChangeTemplate={setSelectedTemplate}
          pdfLayout={pdfLayout}
          onChangePdfLayout={setPdfLayout}
          lang={lang}
          onChangeLang={setLang}
          includeCover={includeCover}
          onToggleCover={setIncludeCover}
          coverVariant={coverVariant}
          onChangeCoverVariant={setCoverVariant}
          includeEditorial={includeEditorial}
          onToggleEditorial={setIncludeEditorial}
          editorialVariant={editorialVariant}
          onChangeEditorialVariant={setEditorialVariant}
          includeTableOfContents={includeTableOfContents}
          onToggleTableOfContents={setIncludeTableOfContents}
          includeCategoryDividers={includeCategoryDividers}
          onToggleCategoryDividers={setIncludeCategoryDividers}
          categoryDividerVariant={categoryDividerVariant}
          onChangeCategoryDividerVariant={setCategoryDividerVariant}
          includeMaterials={includeMaterials}
          onToggleMaterials={setIncludeMaterials}
          includePrices={includePrices}
          onTogglePrices={setIncludePrices}
          zoom={zoom}
          onChangeZoom={handleZoom}
          onResetZoom={handleResetZoom}
          isGeneratingPdf={isGeneratingPdf}
          onDownloadPdf={handleDownloadPdf}
          onPrint={handlePrint}
          totalPages={renderedDocument.totalPages}
          isOpen={isSidebarOpen}
          isSyncing={isSyncing}
          onSyncData={handleSyncData}
          lastSyncedAt={catalogData.metadata?.generated_at}
        />

        {/* Main Canvas / A4 Book Viewport */}
        <main className="catalog-viewport-main flex-1 overflow-auto bg-[#131316] p-8 md:p-12 flex flex-col items-center">
          {/* Printable Paper Canvas container */}
          <div 
            className="catalog-canvas-container transition-transform duration-200 origin-top flex flex-col gap-12 print:gap-0 print:transform-none"
            style={(isPrinting || isPuppeteer) ? undefined : { transform: `scale(${zoom / 100})` }}
          >
            {renderedDocument.elements}
          </div>
        </main>
      </div>

      {/* Sync Feedback Toast Notification */}
      {syncFeedback && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-2xl flex items-center space-x-2.5 text-xs transition-all border ${
          syncFeedback.type === 'success' 
            ? 'bg-[#0d0d10] border-emerald-500/60 text-emerald-300' 
            : 'bg-[#0d0d10] border-red-500/60 text-red-300'
        }`}>
          {syncFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span className="font-medium">{syncFeedback.message}</span>
        </div>
      )}
    </div>
  );
};
