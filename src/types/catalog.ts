export interface LocalizedString {
  tr: string;
  en: string;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: LocalizedString;
  subtitle?: LocalizedString;
  product_count: number;
}

export interface Designer {
  id: string;
  slug: string;
  name: LocalizedString;
}

export interface PrintSuitability {
  max_print_size_300dpi_cm?: string;
  recommended_format?: string;
}

export interface ProductImage {
  url: string;
  is_cover?: boolean;
  is_mirrored?: boolean;
  width?: number;
  height?: number;
  aspect_ratio?: number;
  aspect_ratio_label?: string;
  mime_type?: string;
  alt?: string;
  print_suitability?: PrintSuitability;
}

export interface DimensionImage {
  key?: string;
  model_code: string;
  title: LocalizedString | string;
  url: string;
  is_mirrored?: boolean;
  width?: number;
  height?: number;
  aspect_ratio?: number;
  mime_type?: string;
}

export interface ModelVariation {
  model_code: string;
  name: LocalizedString | string;
  technical_drawing_url?: string;
  dimensions_text?: string;
  price?: {
    amount: number;
    currency: 'EUR' | 'USD' | 'TRY';
  };
}

export interface CatalogProduct {
  id: string;
  slug: string;
  is_published?: boolean;
  name: LocalizedString;
  category: {
    id: string;
    slug: string;
    name: LocalizedString;
  };
  subcategory?: string | null;
  designers: Designer[];
  design_year?: number;
  short_description?: LocalizedString;
  long_description?: LocalizedString;
  cover_image: ProductImage;
  gallery_images: ProductImage[];
  dimension_images: DimensionImage[];
  technical_pdf_links: string[];
  models_and_variations: ModelVariation[];
  collection_and_family?: {
    family_name?: string;
    related_products?: Array<{
      slug: string;
      name: string;
      category?: string;
    }>;
    has_art_edition?: boolean;
    art_edition?: {
      slug: string;
      name: LocalizedString;
      edition_type?: string;
      technique?: LocalizedString;
    };
  };
  missing_fields?: string[];
}

export interface CatalogMetadata {
  title: string;
  project_name: string;
  sanity_project_id: string;
  sanity_dataset: string;
  primary_asset_domain: string;
  worker_asset_domain: string;
  generated_at: string;
  total_published_products: number;
  total_categories: number;
  featured_sample_products_count: number;
  catalog_print_target: string;
}

export interface CatalogData {
  metadata: CatalogMetadata;
  categories: CatalogCategory[];
  featured_samples: CatalogProduct[];
  all_products: CatalogProduct[];
}

export type CatalogTemplateType = 
  | 'minotti-architectural' // 2-Sayfa Spread: Sol tam boy sinematik görsel, Sağ: Büyük mimari tipografi, kısa manifesto, 2D teknik çizim
  | 'bb-italia-monolith'    // 2-Sayfa Spread: Sol izole stüdyo heykelsi duruş + bol boşluk, Sağ: Detay grid'i + ölçü ve model tablosu
  | 'poliform-specsheet'    // 1-Sayfa Compact Föy: Üst yarı %55 mimari görsel, alt sol hikaye + tasarımcı, alt sağ CAD ölçüleri & model detayları
  | 'lookbook-gallery'     // Çoklu ürün grid sayfası (özet indeks veya 2 ürün/sayfa)
  | 'birim-collection';     // Birebir PDF Tasarımı: Üst logo çizgisi, büyük zarif tipografi, koleksiyonel hero görsel, alt detay ve teknik çizim gridi

export type OutputFormat = 'master' | 'category' | 'product';
export type Language = 'tr' | 'en';
export type CoverVariant = 'alt-1' | 'alt-2' | 'alt-3' | 'alt-4' | 'alt-5' | 'alt-6';
