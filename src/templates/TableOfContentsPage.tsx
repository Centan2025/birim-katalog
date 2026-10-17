import React from 'react';
import { Language, OutputFormat } from '../types/catalog';
import { BirimLogo } from '../components/BirimLogo';

export interface TocEntry {
  id: string;
  order: string;
  title: string;
  subtitle?: string;
  pageNumber: number;
  type: 'editorial' | 'category' | 'product' | 'materials' | 'prices';
  designer?: string;
  thumbnail?: string;
  subItems?: {
    title: string;
    designer?: string;
    pageNumber: number;
    modelCount?: number;
  }[];
}

export interface TocPageColumnData {
  left: TocEntry[];
  right: TocEntry[];
  leftWeight: number;
  rightWeight: number;
}

export function paginateTocEntries(entries: TocEntry[], maxCol = 36): TocPageColumnData[] {
  const pages: TocPageColumnData[] = [];
  let curr: TocPageColumnData = { left: [], right: [], leftWeight: 0, rightWeight: 0 };
  const getWeight = (e: TocEntry) => 2.5 + (e.subItems ? e.subItems.length : 0);

  for (const entry of entries) {
    const w = getWeight(entry);
    if (curr.leftWeight + w <= maxCol || curr.left.length === 0) {
      curr.left.push(entry);
      curr.leftWeight += w;
    } else if (curr.rightWeight + w <= maxCol || curr.right.length === 0) {
      curr.right.push(entry);
      curr.rightWeight += w;
    } else {
      pages.push(curr);
      curr = { left: [entry], right: [], leftWeight: w, rightWeight: 0 };
    }
  }

  if (curr.left.length > 0) {
    pages.push(curr);
  }

  return pages;
}

interface TableOfContentsPageProps {
  pageNumber: number;
  entries?: TocEntry[];
  leftColumnEntries?: TocEntry[];
  rightColumnEntries?: TocEntry[];
  tocPageIndex?: number;
  totalTocPages?: number;
  totalSectionsCount?: number;
  format: OutputFormat;
  categoryTitle?: string;
  lang?: Language;
  onNavigateToPage?: (pageNumber: number) => void;
}

export const TableOfContentsPage: React.FC<TableOfContentsPageProps> = ({
  pageNumber,
  entries = [],
  leftColumnEntries,
  rightColumnEntries,
  tocPageIndex = 0,
  totalTocPages: _totalTocPages = 1,
  totalSectionsCount: _totalSectionsCount,
  format: _format,
  categoryTitle: _categoryTitle,
  lang = 'tr',
  onNavigateToPage,
}) => {
  const isTr = lang === 'tr';

  let leftEntries = leftColumnEntries;
  let rightEntries = rightColumnEntries;

  if (!leftEntries || !rightEntries) {
    const fallbackPages = paginateTocEntries(entries, 36);
    const curr = fallbackPages[tocPageIndex] || fallbackPages[0] || { left: [], right: [] };
    leftEntries = curr.left;
    rightEntries = curr.right;
  }

  const renderEntry = (entry: TocEntry) => (
    <div
      key={entry.id}
      onClick={() => onNavigateToPage?.(entry.pageNumber)}
      className="group cursor-pointer space-y-1 transition-all"
    >
      {/* Category / Main Section Row */}
      <div className="flex items-baseline justify-between pb-1">
        <div>
          <h3 className="text-[12.5px] font-medium tracking-[0.08em] uppercase text-neutral-900 group-hover:text-neutral-950 leading-tight">
            {entry.title}
          </h3>
        </div>
        <div className="text-right pl-2 shrink-0">
          <span className="font-mono text-[11px] text-neutral-700 font-semibold group-hover:text-neutral-950 transition-colors">
            P. {String(entry.pageNumber).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Sub-Items (Products under this Category) */}
      {entry.subItems && entry.subItems.length > 0 && (
        <div className="pl-4 space-y-0.5 pt-0.5">
          {entry.subItems.map((sub, sIdx) => (
            <div
              key={sIdx}
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToPage?.(sub.pageNumber);
              }}
              className="flex items-baseline justify-between text-[9.5px] text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer group/sub py-0.5"
            >
              <div className="flex items-baseline gap-1.5 overflow-hidden pr-2">
                <span className="font-medium text-neutral-800 tracking-[0.04em] uppercase truncate group-hover/sub:text-neutral-950">
                  {sub.title}
                </span>
                {sub.designer && (
                  <span className="text-[7.5px] text-neutral-400 uppercase tracking-wider font-light truncate">
                    / {sub.designer}
                  </span>
                )}
              </div>
              <span className="font-mono text-[8.5px] text-neutral-500 font-medium group-hover/sub:text-neutral-900 shrink-0">
                P. {String(sub.pageNumber).padStart(3, '0')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="catalog-page bg-[#FFFFFF] p-[20mm] flex flex-col justify-between select-none">
      {/* 1. TOP FOLIO HEADER */}
      <div className="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase text-neutral-500 pb-3">
        <BirimLogo variant="black" className="h-6 w-auto object-contain" />
        <span className="font-mono text-neutral-400">
          {isTr ? 'KOLEKSİYON DİZİNİ / 2026' : 'CATALOG INDEX / 2026'}
        </span>
      </div>

      {/* 2. MAIN DIRECTORY BODY */}
      <div className="flex-1 my-auto py-4 grid grid-cols-2 gap-x-10 items-start">
        {/* Left Column */}
        <div className="space-y-4 flex flex-col">
          {leftEntries.map(renderEntry)}
        </div>

        {/* Right Column */}
        <div className="space-y-4 flex flex-col">
          {rightEntries.map(renderEntry)}
        </div>
      </div>

      {/* 4. BOTTOM FOLIO FOOTER */}
      <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-500 pt-3">
        <span className="font-mono text-neutral-400 lowercase">www.birim.com</span>
        <span className="font-mono text-neutral-700">{String(pageNumber).padStart(3, '0')}</span>
      </div>
    </div>
  );
};
