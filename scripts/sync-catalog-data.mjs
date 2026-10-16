import fs from 'fs';
import path from 'path';

const SANITY_PROJECT_ID = 'wn3a082f';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2025-01-01';

// Helper to extract text from Sanity localized strings or PortableText blocks
function extractText(val, lang = 'tr') {
  if (!val) return '';
  if (typeof val === 'string') return sanitizeTerminology(val);
  
  // Localized string { tr: "...", en: "..." }
  if (typeof val === 'object') {
    const textVal = val[lang] || val['tr'] || val['en'];
    if (typeof textVal === 'string') return sanitizeTerminology(textVal);
    
    // PortableText array
    if (Array.isArray(textVal)) {
      const extracted = textVal
        .map(block => {
          if (block?._type === 'block' && Array.isArray(block.children)) {
            return block.children.map(c => c?.text || '').join('');
          }
          return '';
        })
        .filter(Boolean)
        .join('\n\n');
      return sanitizeTerminology(extracted);
    }
  }
  return '';
}

// Strictly remove any instance of "varyasyon" or "varyant"
function sanitizeTerminology(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/varyasyonlar/gi, 'modeller')
    .replace(/varyasyon/gi, 'seçenek')
    .replace(/varyantlar/gi, 'modeller')
    .replace(/varyant/gi, 'model')
    .replace(/edisyonlu/gi, 'koleksiyon')
    .replace(/edisyon/gi, 'seri');
}

function calculatePrintSuitability(width, height) {
  if (!width || !height) return null;
  const dpi = 300;
  const cmPerInch = 2.54;
  const widthCm = ((width / dpi) * cmPerInch).toFixed(1);
  const heightCm = ((height / dpi) * cmPerInch).toFixed(1);
  const sizeStr = `${widthCm} x ${heightCm} cm`;

  let format = 'A4 Standart';
  if (width >= 5000) format = 'A3+ Çift Sayfa Açılım (Spread) @ 300 DPI';
  else if (width >= 3500) format = 'A4 Tam Sayfa Bleed / A3 Sayfa @ 300 DPI';
  else if (width >= 2000) format = 'A4 Standart Görsel @ 300 DPI';

  return {
    max_print_size_300dpi_cm: sizeStr,
    recommended_format: format
  };
}

async function fetchSanityQuery(query) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity fetch error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.result;
}

async function syncAllCatalogData() {
  console.log('1. Sanity CMS üzerinden güncel kategoriler ve ürünler çekiliyor...');

  const categoriesQuery = `*[_type == "category" && !(_id in path("drafts.**"))] | order(coalesce(orderRank, sortOrder) asc, name.tr asc) {
    _id,
    "slug": coalesce(id.current, slug.current),
    name,
    subtitle
  }`;

  const productsQuery = `*[_type == "product" && !(_id in path("drafts.**"))] | order(coalesce(orderRank, sortOrder) asc, name.tr asc) {
    _id,
    "slug": coalesce(id.current, slug.current),
    name,
    category->{
      _id,
      "slug": coalesce(id.current, slug.current),
      name
    },
    designers[]->{
      _id,
      "slug": coalesce(id.current, slug.current),
      name
    },
    designer->{
      _id,
      "slug": coalesce(id.current, slug.current),
      name
    },
    year,
    shortDescription,
    description,
    media[]{
      _key,
      isCover,
      title,
      imageR2{ url, width, height },
      imageDesktopR2{ url, width, height },
      imageMobileR2{ url, width, height },
      "sanityAssetUrl": image.asset->url
    },
    dimensionImages[]{
      _key,
      title,
      imageR2{ url, width, height },
      imageDesktopR2{ url, width, height },
      imageMobileR2{ url, width, height },
      "sanityAssetUrl": image.asset->url
    },
    collectionFamily
  }`;

  const [rawCategories, rawProducts] = await Promise.all([
    fetchSanityQuery(categoriesQuery),
    fetchSanityQuery(productsQuery)
  ]);

  console.log(`- ${rawCategories.length} kategori ve ${rawProducts.length} ürün başarıyla alındı.`);

  // Process categories
  const categories = rawCategories.map(c => ({
    id: c._id,
    slug: c.slug || '',
    name: {
      tr: sanitizeTerminology(c.name?.tr || c.name?.en || ''),
      en: sanitizeTerminology(c.name?.en || c.name?.tr || '')
    },
    subtitle: {
      tr: sanitizeTerminology(c.subtitle?.tr || ''),
      en: sanitizeTerminology(c.subtitle?.en || '')
    },
    product_count: rawProducts.filter(p => p.category?._id === c._id).length
  }));

  // Process products
  const all_products = rawProducts.map(p => {
    const slug = p.slug || '';
    const titleTr = sanitizeTerminology(p.name?.tr || p.name?.en || '');
    const titleEn = sanitizeTerminology(p.name?.en || p.name?.tr || '');

    // Designers
    let designersList = [];
    if (Array.isArray(p.designers) && p.designers.length > 0) {
      designersList = p.designers.map(d => ({
        id: d._id,
        slug: d.slug || '',
        name: {
          tr: sanitizeTerminology(d.name?.tr || d.name?.en || ''),
          en: sanitizeTerminology(d.name?.en || d.name?.tr || '')
        }
      }));
    } else if (p.designer) {
      designersList = [{
        id: p.designer._id,
        slug: p.designer.slug || '',
        name: {
          tr: sanitizeTerminology(p.designer.name?.tr || p.designer.name?.en || ''),
          en: sanitizeTerminology(p.designer.name?.en || p.designer.name?.tr || '')
        }
      }];
    }

    // Media
    const mediaList = (p.media || []).map(m => {
      const imgObj = m.imageR2 || m.imageDesktopR2 || m.imageMobileR2 || {};
      const url = imgObj.url || m.sanityAssetUrl || '';
      const width = imgObj.width || 3840;
      const height = imgObj.height || 2160;
      const aspect = width && height ? Number((width / height).toFixed(3)) : 1.778;

      return {
        url,
        is_cover: Boolean(m.isCover),
        width,
        height,
        aspect_ratio: aspect,
        aspect_ratio_label: aspect > 1.3 ? '16:9 Landscape' : aspect < 0.9 ? 'Portrait' : 'Square',
        mime_type: 'image/webp',
        alt: m.title?.tr || m.title?.en || slug,
        print_suitability: calculatePrintSuitability(width, height)
      };
    }).filter(m => Boolean(m.url));

    const cover = mediaList.find(m => m.is_cover) || mediaList[0] || null;

    // Dimension Images (CAD Technical schematics)
    const dimImages = (p.dimensionImages || []).map((di, idx) => {
      const imgObj = di.imageR2 || di.imageDesktopR2 || di.imageMobileR2 || {};
      const url = imgObj.url || di.sanityAssetUrl || '';
      const rawTitle = typeof di.title === 'string' ? di.title : (di.title?.tr || di.title?.en || '');
      const modelCode = sanitizeTerminology(rawTitle.trim() || `${slug.toUpperCase()}-${idx + 1}`);

      return {
        key: di._key || `dim-${slug}-${idx}`,
        model_code: modelCode,
        title: {
          tr: modelCode,
          en: modelCode
        },
        url,
        width: imgObj.width || 3840,
        height: imgObj.height || 2160,
        aspect_ratio: 1.778,
        mime_type: 'image/webp'
      };
    }).filter(di => Boolean(di.url));

    // Special fallback / inheritance for Feel T if Sanity has the drawing under Feel collection
    if (slug === 'tk0227-feel' && dimImages.length === 0) {
      const feelParent = rawProducts.find(rp => (rp.slug || rp.id?.current) === 'kn0227-feel');
      const feelTDim = (feelParent?.dimensionImages || []).find(di => {
        const titleStr = typeof di.title === 'string' ? di.title : (di.title?.tr || di.title?.en || '');
        return titleStr.toLowerCase().includes('92x91') || titleStr.toLowerCase().endsWith('-t');
      });
      if (feelTDim) {
        const imgObj = feelTDim.imageR2 || feelTDim.imageDesktopR2 || feelTDim.imageMobileR2 || {};
        const url = imgObj.url || feelTDim.sanityAssetUrl || '';
        if (url) {
          dimImages.push({
            key: feelTDim._key || 'dim-tk0227-feel-1',
            model_code: 'TK0227-92X91-T',
            title: {
              tr: 'TK0227-92X91-T',
              en: 'TK0227-92X91-T'
            },
            url,
            width: imgObj.width || 3840,
            height: imgObj.height || 2160,
            aspect_ratio: 1.778,
            mime_type: 'image/webp'
          });
        }
      }
    }

    // Models
    const modelsList = dimImages.map(di => ({
      model_code: di.model_code,
      name: {
        tr: di.model_code,
        en: di.model_code
      },
      technical_drawing_url: di.url
    }));

    // Descriptions
    const shortTr = extractText(p.shortDescription, 'tr') || extractText(p.description, 'tr');
    const shortEn = extractText(p.shortDescription, 'en') || extractText(p.description, 'en');
    const longTr = extractText(p.description, 'tr') || shortTr;
    const longEn = extractText(p.description, 'en') || shortEn;

    return {
      id: p._id,
      slug,
      name: {
        tr: titleTr,
        en: titleEn
      },
      category: {
        id: p.category?._id || '',
        slug: p.category?.slug || '',
        name: {
          tr: sanitizeTerminology(p.category?.name?.tr || p.category?.name?.en || ''),
          en: sanitizeTerminology(p.category?.name?.en || p.category?.name?.tr || '')
        }
      },
      subcategory: null,
      designers: designersList,
      design_year: p.year || 2024,
      short_description: {
        tr: shortTr,
        en: shortEn
      },
      long_description: {
        tr: longTr,
        en: longEn
      },
      cover_image: cover,
      gallery_images: mediaList,
      dimension_images: dimImages,
      technical_pdf_links: [],
      models_and_variations: modelsList,
      collection_and_family: {
        family_name: null,
        related_products: [],
        has_art_edition: false,
        art_edition: null
      },
      missing_fields: []
    };
  });

  const finalOutput = {
    metadata: {
      title: "BİRİM — Otomatik Katalog Üretim Veri Tabanı (Catalog Data Export)",
      project_name: "Birim Web & Sanity CMS",
      sanity_project_id: SANITY_PROJECT_ID,
      sanity_dataset: SANITY_DATASET,
      primary_asset_domain: "https://assets.birim.com",
      worker_asset_domain: "https://birim-assets.web-birim.workers.dev",
      generated_at: new Date().toISOString(),
      total_published_products: all_products.length,
      total_categories: categories.length,
      featured_sample_products_count: Math.min(6, all_products.length),
      catalog_print_target: "A4 / A3 Yüksek Çözünürlüklü Otomatik Baskı Kataloğu (300 DPI)"
    },
    categories,
    featured_samples: all_products.slice(0, 6),
    all_products
  };

  const jsonStr = JSON.stringify(finalOutput, null, 2);

  // Write to F:\_Katalog\src\data\catalog-products.json
  const targetPath1 = path.resolve('src/data/catalog-products.json');
  fs.writeFileSync(targetPath1, jsonStr, 'utf8');
  console.log(`- Yazıldı: ${targetPath1}`);

  // Write to F:\Calisan-birim-web\catalog-products.json
  const targetPath2 = 'F:/Calisan-birim-web/catalog-products.json';
  if (fs.existsSync(path.dirname(targetPath2))) {
    fs.writeFileSync(targetPath2, jsonStr, 'utf8');
    console.log(`- Yazıldı: ${targetPath2}`);
  }

  console.log('2. Veri senkronizasyonu tamamlandı!');
}

syncAllCatalogData().catch(err => {
  console.error('Senkronizasyon hatası:', err);
  process.exit(1);
});
