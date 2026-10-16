import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move, Maximize, Minimize, Save, Check } from 'lucide-react';
import defaultTransforms from '../data/catalog-image-transforms.json';

export interface TransformState {
  scale: number;
  x: number;
  y: number;
}

const STORAGE_KEY = 'birim_catalog_image_transforms';

function loadInitialTransforms(): Map<string, TransformState> {
  const map = new Map<string, TransformState>();

  // 1. Base from bundled json file
  try {
    const bundled = defaultTransforms as unknown as Record<string, TransformState>;
    if (bundled && typeof bundled === 'object') {
      Object.entries(bundled).forEach(([k, v]) => {
        if (v && typeof v.scale === 'number') {
          map.set(k, { scale: v.scale, x: v.x || 0, y: v.y || 0 });
        }
      });
    }
  } catch (e) {
    console.error('Error reading bundled transforms:', e);
  }

  // 2. Overlay from localStorage
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, TransformState>;
        Object.entries(parsed).forEach(([k, v]) => {
          if (v && typeof v.scale === 'number') {
            map.set(k, { scale: v.scale, x: v.x || 0, y: v.y || 0 });
          }
        });
      }
    }
  } catch (e) {
    console.error('Error reading transforms from localStorage:', e);
  }

  return map;
}

const transformCache = loadInitialTransforms();

function persistToLocalStorage() {
  try {
    if (typeof window !== 'undefined') {
      const obj: Record<string, TransformState> = {};
      transformCache.forEach((val, key) => {
        obj[key] = val;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      window.dispatchEvent(new CustomEvent('catalog-transforms-updated', { detail: { count: transformCache.size } }));
    }
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getAllTransforms(): Record<string, TransformState> {
  const obj: Record<string, TransformState> = {};
  transformCache.forEach((val, key) => {
    obj[key] = val;
  });
  return obj;
}

export async function saveTransformsToDisk(): Promise<{ success: boolean; message: string }> {
  persistToLocalStorage();
  const transforms = getAllTransforms();
  try {
    const res = await fetch('/api/save-transforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transforms, null, 2),
    });
    if (res.ok) {
      return { success: true, message: 'Görsel kadraj ayarları projeye başarıyla kaydedildi.' };
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    // Fallback: trigger download
    exportTransformsAsJson();
    return { success: false, message: `Diske yazılamadı, dosya olarak indirildi (${errMsg}).` };
  }
}

export function exportTransformsAsJson(): void {
  exportTransformsWithCustomName('catalog-image-transforms');
}

export function exportTransformsWithCustomName(customName: string): void {
  persistToLocalStorage();
  const transforms = getAllTransforms();
  const safeName = customName.trim().replace(/[^a-zA-Z0-9_\-\u00C0-\u017F\s]/g, '').trim().replace(/\s+/g, '-') || 'catalog-kadraj';
  const blob = new Blob([JSON.stringify(transforms, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const PRESETS_LIST_KEY = 'birim_catalog_presets_list';

export function getLocalPresetNames(): string[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(PRESETS_LIST_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list.filter(x => typeof x === 'string');
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export async function getAvailablePresets(): Promise<string[]> {
  const localNames = getLocalPresetNames();
  try {
    const res = await fetch('/api/presets');
    if (res.ok) {
      const data = await res.json() as { success: boolean; presets?: string[] };
      if (data && Array.isArray(data.presets)) {
        const merged = Array.from(new Set([...data.presets, ...localNames]));
        return merged.sort();
      }
    }
  } catch {
    // If dev server endpoint is unavailable, return local presets
  }
  return localNames.sort();
}

export async function saveNamedPreset(name: string): Promise<{ success: boolean; message: string }> {
  const cleanName = name.trim().replace(/[^a-zA-Z0-9_\-\u00C0-\u017F\s]/g, '').trim().replace(/\s+/g, '-');
  if (!cleanName) {
    return { success: false, message: 'Lütfen geçerli bir preset adı girin.' };
  }

  persistToLocalStorage();
  const transforms = getAllTransforms();

  // 1. Save locally to localStorage
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`birim_preset_${cleanName}`, JSON.stringify(transforms));
      const currentList = getLocalPresetNames();
      if (!currentList.includes(cleanName)) {
        localStorage.setItem(PRESETS_LIST_KEY, JSON.stringify([...currentList, cleanName]));
      }
    }
  } catch (e) {
    console.error(e);
  }

  // 2. Save to disk via Vite API
  try {
    const res = await fetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cleanName, data: transforms }),
    });
    if (res.ok) {
      return { success: true, message: `"${cleanName}" başarıyla kaydedildi.` };
    }
  } catch {
    // Vite API fallback
  }

  return { success: true, message: `"${cleanName}" tarayıcı hafızasına kaydedildi.` };
}

export async function loadNamedPreset(name: string): Promise<boolean> {
  const cleanName = name.trim();
  if (!cleanName) return false;

  // 1. Try disk load
  try {
    const res = await fetch(`/api/load-preset?name=${encodeURIComponent(cleanName)}`);
    if (res.ok) {
      const text = await res.text();
      return importTransformsFromJson(text, false);
    }
  } catch {
    // fallback to local
  }

  // 2. Try localStorage
  try {
    const localRaw = localStorage.getItem(`birim_preset_${cleanName}`);
    if (localRaw) {
      return importTransformsFromJson(localRaw, false);
    }
  } catch {
    // fallback
  }

  return false;
}

export function importTransformsFromJson(jsonStr: string, shouldReload = true): boolean {
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, TransformState>;
    if (typeof parsed !== 'object' || parsed === null) return false;
    transformCache.clear();
    Object.entries(parsed).forEach(([k, v]) => {
      if (v && typeof v.scale === 'number') {
        transformCache.set(k, { scale: v.scale, x: v.x || 0, y: v.y || 0 });
      }
    });
    persistToLocalStorage();
    if (shouldReload) {
      window.location.reload();
    }
    return true;
  } catch {
    return false;
  }
}

export function resetAllTransforms(): void {
  transformCache.clear();
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('catalog-transforms-updated', { detail: { count: 0 } }));
      window.location.reload();
    }
  } catch (e) {
    console.error(e);
  }
}

export function getSavedTransformCount(): number {
  return transformCache.size;
}

interface InteractiveCatalogImageProps {
  id: string;
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  objectFit?: 'contain' | 'cover';
  initialScale?: number;
  isMirrored?: boolean;
}

export const InteractiveCatalogImage: React.FC<InteractiveCatalogImageProps> = ({
  id,
  src,
  alt,
  className = '',
  containerClassName = '',
  initialScale = 1,
  isMirrored = false
}) => {
  const [transform, setTransform] = useState<TransformState>(() => {
    return transformCache.get(id) || { scale: initialScale, x: 0, y: 0 };
  });
  const [savedFeedback, setSavedFeedback] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startMouseX: number; startMouseY: number; startX: number; startY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync to cache whenever transform changes
  useEffect(() => {
    transformCache.set(id, transform);
    persistToLocalStorage();
  }, [id, transform]);

  // Handle Drag Move
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: transform.x,
      startY: transform.y,
    };
  }, [transform.x, transform.y]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startMouseX;
      const dy = e.clientY - dragStartRef.current.startMouseY;
      setTransform(prev => ({
        ...prev,
        x: Math.round(dragStartRef.current!.startX + dx),
        y: Math.round(dragStartRef.current!.startY + dy),
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const [showCtrlHint, setShowCtrlHint] = useState(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Wheel Zoom: Only zooms when Ctrl/Cmd is pressed; otherwise lets normal page scrolling occur!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // If Ctrl (or Cmd on macOS) is NOT held down, allow standard page scrolling
      if (!e.ctrlKey && !e.metaKey) {
        setShowCtrlHint(true);
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = setTimeout(() => setShowCtrlHint(false), 1400);
        return; // DO NOT preventDefault! Page scrolls naturally!
      }

      // Ctrl IS held down: zoom the image
      e.stopPropagation();
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.4, Math.min(5, +(prev.scale + delta).toFixed(2))),
      }));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  const handleZoom = (delta: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.4, Math.min(5, +(prev.scale + delta).toFixed(2))),
    }));
  };

  const handleFitMode = (mode: 'fit' | 'fill') => {
    if (mode === 'fit') {
      setTransform({ scale: 1, x: 0, y: 0 });
    } else {
      // Fill: scale up to cover container, allow user to freely drag
      setTransform({ scale: 1.45, x: 0, y: 0 });
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTransform({ scale: initialScale, x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative group overflow-hidden select-none ${containerClassName}`}
      style={{ touchAction: 'none' }}
    >
      {/* Floating Toolbar on Hover (Baskıda gizlenir) */}
      <div 
        className="no-print absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/90 backdrop-blur-md rounded-lg p-1 flex items-center space-x-1 shadow-2xl border border-neutral-700/80"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center text-[10px] text-neutral-300 font-mono px-1.5 cursor-move" title="Sürükleyip Konumlandırın">
          <Move className="w-3 h-3 text-neutral-400 mr-1" />
          <span>{Math.round(transform.scale * 100)}%</span>
        </div>

        <button
          onClick={() => handleFitMode('fit')}
          className="px-1.5 py-0.5 text-[9px] hover:bg-neutral-800 text-neutral-300 rounded font-mono uppercase transition-colors"
          title="Tam Sığdır (Kesilmesiz)"
        >
          <Minimize className="w-3 h-3 inline mr-0.5" />
          Sığdır
        </button>

        <button
          onClick={() => handleFitMode('fill')}
          className="px-1.5 py-0.5 text-[9px] hover:bg-neutral-800 text-neutral-300 rounded font-mono uppercase transition-colors"
          title="Doldur & Konumlandır"
        >
          <Maximize className="w-3 h-3 inline mr-0.5" />
          Doldur
        </button>

        <div className="w-[1px] h-3 bg-neutral-700 mx-0.5" />

        <button
          onClick={() => handleZoom(0.1)}
          className="p-1 hover:bg-neutral-800 text-neutral-200 rounded transition-colors"
          title="Yakınlaştır (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-1 hover:bg-neutral-800 text-neutral-200 rounded transition-colors"
          title="Uzaklaştır (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3 bg-neutral-700 mx-0.5" />

        <button
          onClick={async (e) => {
            e.stopPropagation();
            await saveTransformsToDisk();
            setSavedFeedback(true);
            setTimeout(() => setSavedFeedback(false), 2000);
          }}
          className={`px-1.5 py-0.5 text-[9px] rounded font-mono uppercase transition-colors flex items-center gap-1 ${
            savedFeedback 
              ? 'bg-emerald-600 text-white font-medium' 
              : 'hover:bg-neutral-800 text-emerald-400'
          }`}
          title="Bu kadraj ve pozisyonu projeye / diske kaydet"
        >
          {savedFeedback ? (
            <>
              <Check className="w-3 h-3 text-white" />
              <span>Kayıt Tamam</span>
            </>
          ) : (
            <>
              <Save className="w-3 h-3 text-emerald-400" />
              <span>Kaydet</span>
            </>
          )}
        </button>

        {(transform.scale !== initialScale || transform.x !== 0 || transform.y !== 0) && (
          <button
            onClick={handleReset}
            className="p-1 hover:bg-neutral-800 text-amber-400 rounded transition-colors"
            title="Konumu ve Boyutu Sıfırla"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Ctrl + Scroll Information Toast Badge (Baskıda gizlenir) */}
      {showCtrlHint && (
        <div className="no-print absolute inset-0 z-40 flex items-center justify-center pointer-events-none transition-opacity">
          <div className="bg-black/80 backdrop-blur-md text-white text-[11px] font-sans px-3.5 py-1.5 rounded-full shadow-2xl border border-white/20 flex items-center space-x-1.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="bg-neutral-800 border border-neutral-600 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl</span>
            <span>+ Tekerlek ile yakınlaştırın</span>
          </div>
        </div>
      )}

      {/* Target Image: Uses pure object-contain baseline so 100% of original photo is accessible and never pre-cropped! */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <img
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          draggable={false}
          className={`pointer-events-none transition-transform duration-75 origin-center object-contain max-h-full max-w-full ${className}`}
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale * (isMirrored ? -1 : 1)}, ${transform.scale})`,
          }}
        />
      </div>
    </div>
  );
};
