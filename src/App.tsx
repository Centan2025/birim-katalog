import React, { useState, useMemo, useEffect } from 'react';
import rawCatalogData from './data/catalog-products.json';
import { 
  CatalogData, 
  CatalogProduct, 
  CatalogTemplateType, 
  Language, 
  OutputFormat,
  CoverVariant
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
import { BirimCategoryDivider } from './templates/BirimCategoryDivider';
import { CassinaTriennaleSpread } from './templates/CassinaTriennaleSpread';
import { FlexformCuratedSpread } from './templates/FlexformCuratedSpread';
import { TableOfContentsPage, TocEntry } from './templates/TableOfContentsPage';
import { 
  SystemElementsPage, 
  getSystemElementsPageCount, 
  getSystemElementsChunks 
} from './templates/SystemElementsPage';

const catalogData = rawCatalogData as unknown as CatalogData;

export const App: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    catalogData.categories[0]?.slug || 'tekli-ler'
  );
  const [selectedProduct, setSelectedProduct] = useState<string>(
    catalogData.all_products[0]?.slug || 'tk0251-tayra'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<CatalogTemplateType>(
    'minotti-architectural'
  );
  const [lang, setLang] = useState<Language>('tr');

  // Add-on options
  const [includeCover, setIncludeCover] = useState<boolean>(true);
  const [coverVariant, setCoverVariant] = useState<CoverVariant>('alt-1');
  const [includeEditorial, setIncludeEditorial] = useState<boolean>(true);
  const [includeTableOfContents, setIncludeTableOfContents] = useState<boolean>(true);
  const [includeCategoryDividers, setIncludeCategoryDividers] = useState<boolean>(true);
  const [includeMaterials, setIncludeMaterials] = useState<boolean>(true);
  const [includePrices, setIncludePrices] = useState<boolean>(false);

  // Zoom & Print States
  const [zoom, setZoom] = useState<number>(75);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

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
    if (!cat) return 'BİRİM KOLEKSİYONU';
    return lang === 'en' ? cat.name.en : cat.name.tr;
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
        />
      );
    }
    // Poliform Spec Sheet (Single-Page)
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
        return getBirimCollectionPageCount(product);
      }
      if (selectedTemplate === 'poliform-specsheet') {
        return 1;
      }
      const extraSystemPages = (
        selectedTemplate === 'minotti-architectural' || 
        selectedTemplate === 'bb-italia-monolith' ||
        selectedTemplate === 'cassina-editorial' ||
        selectedTemplate === 'flexform-curated'
      )
        ? getSystemElementsPageCount(product)
        : 0;
      return 2 + extraSystemPages;
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
        if (!cat) return 'Koleksiyon';
        const raw = lang === 'en' ? cat.name.en : cat.name.tr;
        return raw.charAt(0).toLocaleUpperCase('tr-TR') + raw.slice(1).toLocaleLowerCase('tr-TR');
      }
      if (selectedFormat === 'product') {
        const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
        return prod ? (lang === 'en' ? prod.name.en : prod.name.tr) : 'Koleksiyon';
      }
      return lang === 'en' ? 'Design Collection' : 'Koleksiyon';
    };

    const getCoverSubtitle = () => {
      if (selectedFormat === 'category') {
        const cat = catalogData.categories.find((c) => c.slug === selectedCategory);
        return cat?.name?.en ? cat.name.en.toUpperCase() : 'DESIGN COLLECTION';
      }
      return 'DESIGN COLLECTION';
    };

    // Pre-calculate page mapping for accurate Table of Contents
    let simPage = 1;
    if (includeCover) simPage++;
    if (includeEditorial) simPage++;
    if (includeTableOfContents) simPage++;

    const tocEntries: TocEntry[] = [];
    let orderIndex = 1;

    if (includeEditorial) {
      tocEntries.push({
        id: 'editorial',
        order: String(orderIndex++).padStart(2, '0'),
        title: lang === 'en' ? 'ARCHITECTURAL STATEMENT' : 'MİMARİ YAKLAŞIM',
        subtitle: lang === 'en' ? 'Birim Design Philosophy' : 'Birim Tasarım Felsefesi',
        pageNumber: includeCover ? 2 : 1,
        type: 'editorial',
      });
    }

    if (selectedFormat === 'product') {
      const prod = catalogData.all_products.find((p) => p.slug === selectedProduct);
      if (prod) {
        const prodTitle = lang === 'en' ? prod.name.en : prod.name.tr;
        const designer = prod.designers?.[0] ? (lang === 'en' ? prod.designers[0].name.en : prod.designers[0].name.tr) : undefined;
        const heroPage = simPage;
        tocEntries.push({
          id: `prod-${prod.slug}`,
          order: String(orderIndex++).padStart(2, '0'),
          title: prodTitle,
          subtitle: lang === 'en' ? 'Perspective & Architectural Hero' : 'Sinematik Perspektif & Mekân Kurgusu',
          designer,
          pageNumber: heroPage,
          thumbnail: prod.cover_image?.url || prod.gallery_images?.[0]?.url,
          type: 'product',
        });
        simPage += getProductStep(prod);
      }
    } else {
      targetCategories.forEach((cat) => {
        const catProds = catalogData.all_products.filter(
          (p) => p.category.id === cat.id || p.category.slug === cat.slug
        );
        const catTitle = lang === 'en' ? (cat.name.en || cat.name.tr) : cat.name.tr;
        const catStartPage = simPage;
        if (includeCategoryDividers) simPage++;

        const subItems = catProds.map((prod) => {
          const prodTitle = lang === 'en' ? prod.name.en : prod.name.tr;
          const designer = prod.designers?.[0] ? (lang === 'en' ? prod.designers[0].name.en : prod.designers[0].name.tr) : undefined;
          const prodPage = simPage;
          simPage += getProductStep(prod);
          return {
            title: prodTitle,
            designer,
            pageNumber: prodPage,
            modelCount: prod.models_and_variations?.length || 1,
          };
        });

        tocEntries.push({
          id: `cat-${cat.slug}`,
          order: String(orderIndex++).padStart(2, '0'),
          title: catTitle,
          subtitle: `${catProds.length} ${lang === 'en' ? 'Models' : 'Ürün / Model'}`,
          pageNumber: catStartPage,
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
        pageNumber: simPage,
        type: 'materials',
      });
      simPage++;
    }

    if (includePrices) {
      tocEntries.push({
        id: 'prices',
        order: String(orderIndex++).padStart(2, '0'),
        title: lang === 'en' ? 'PRICE & TECHNICAL LIST' : 'FİYAT VE TEKNİK LİSTE',
        subtitle: lang === 'en' ? 'Dimensional & Price Matrix' : 'Model Ölçüleri ve Fiyat Matrisi',
        pageNumber: simPage,
        type: 'prices',
      });
      simPage++;
    }

    // 1. Master Cover
    if (includeCover) {
      elements.push(
        <div key="cover" id={`page-${pageCounter}`} className="flex justify-center">
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

    // 2. Brand Manifesto / Editorial
    if (includeEditorial) {
      elements.push(
        <div key="editorial" id={`page-${pageCounter}`} className="flex justify-center">
          <EditorialPage pageNumber={pageCounter} lang={lang} />
        </div>
      );
      pageCounter++;
    }

    // 3. Table of Contents / İçindekiler
    if (includeTableOfContents) {
      elements.push(
        <div key="toc" id={`page-${pageCounter}`} className="flex justify-center">
          <TableOfContentsPage
            pageNumber={pageCounter}
            entries={tocEntries}
            format={selectedFormat}
            categoryTitle={activeCategoryTitle}
            lang={lang}
            onNavigateToPage={(targetPage) => {
              const el = document.getElementById(`page-${targetPage}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />
        </div>
      );
      pageCounter++;
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
          chunks.forEach((chunk, chunkIdx) => {
            elements.push(
              <div key={`system-${prod.slug}-${chunkIdx}`} className="flex justify-center">
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
          elements.push(
            <div key={`cat-divider-${cat.slug}`} id={`page-${pageCounter}`} className="flex justify-center">
              {selectedTemplate === 'birim-collection' ? (
                <BirimCategoryDivider
                  category={cat}
                  categoryIndex={catIdx}
                  featuredProduct={catProds[0]}
                  pageNumber={pageCounter}
                  lang={lang}
                />
              ) : (
                <CategoryDivider
                  category={cat}
                  categoryIndex={catIdx}
                  featuredProduct={catProds[0]}
                  categoryProducts={catProds}
                  lang={lang}
                />
              )}
            </div>
          );
          pageCounter++;
        }

        catProds.forEach((prod) => {
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
            chunks.forEach((chunk, chunkIdx) => {
              elements.push(
                <div key={`system-${prod.slug}-${chunkIdx}`} className="flex justify-center">
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
          pageCounter += step;
        });
      });
    }

    // 4. Material Catalog Swatches
    if (includeMaterials) {
      elements.push(
        <div key="materials" id={`page-${pageCounter}`} className="flex justify-center">
          <MaterialCatalogPage
            categoryTitle={activeCategoryTitle}
            pageNumber={pageCounter}
            lang={lang}
          />
        </div>
      );
      pageCounter++;
    }

    // 5. Price List Table
    if (includePrices) {
      const activeProducts = selectedFormat === 'product'
        ? catalogData.all_products.filter(p => p.slug === selectedProduct)
        : catalogData.all_products.filter(p => targetCategories.some(c => c.id === p.category.id || c.slug === p.category.slug));

      elements.push(
        <div key="prices" id={`page-${pageCounter}`} className="flex justify-center">
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

    return { elements, totalPages: pageCounter - 1 };
  }, [
    includeCover,
    coverVariant,
    includeEditorial,
    includeTableOfContents,
    includeCategoryDividers,
    includeMaterials,
    includePrices,
    selectedFormat,
    selectedCategory,
    selectedProduct,
    selectedTemplate,
    lang,
    targetCategories,
    activeCategoryTitle
  ]);

  return (
    <div className="app-layout-root flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Control Sidebar */}
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
        lang={lang}
        onChangeLang={setLang}
        includeCover={includeCover}
        onToggleCover={setIncludeCover}
        coverVariant={coverVariant}
        onChangeCoverVariant={setCoverVariant}
        includeEditorial={includeEditorial}
        onToggleEditorial={setIncludeEditorial}
        includeTableOfContents={includeTableOfContents}
        onToggleTableOfContents={setIncludeTableOfContents}
        includeCategoryDividers={includeCategoryDividers}
        onToggleCategoryDividers={setIncludeCategoryDividers}
        includeMaterials={includeMaterials}
        onToggleMaterials={setIncludeMaterials}
        includePrices={includePrices}
        onTogglePrices={setIncludePrices}
        zoom={zoom}
        onChangeZoom={handleZoom}
        onResetZoom={handleResetZoom}
        onPrint={handlePrint}
        totalPages={renderedDocument.totalPages}
      />

      {/* Main Canvas / A4 Book Viewport */}
      <main className="catalog-viewport-main flex-1 overflow-auto bg-[#181818] p-10 flex flex-col items-center">
        {/* Printable Paper Canvas container */}
        <div 
          className="catalog-canvas-container transition-transform duration-200 origin-top flex flex-col gap-14 print:gap-0 print:transform-none"
          style={isPrinting ? undefined : { transform: `scale(${zoom / 100})` }}
        >
          {renderedDocument.elements}
        </div>
      </main>
    </div>
  );
};
