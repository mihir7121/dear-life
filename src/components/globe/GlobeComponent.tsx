"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { Memory } from "@/types";
import { getCategoryColor, clusterMemoriesByLocation } from "@/lib/utils";
import { COUNTRY_NAMES } from "@/data/countryNames";

// ── Container size observer ────────────────────────────────────────────────
function useContainerSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

// ── Dynamic import — SSR-safe ──────────────────────────────────────────────
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  ),
});

// ── Country polygon data (singleton fetch + cache) ─────────────────────────
let countriesCache: Promise<object[]> | null = null;

function loadCountries(): Promise<object[]> {
  if (!countriesCache) {
    countriesCache = fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    )
      .then((r) => r.json())
      .then(async (topology) => {
        const { feature } = await import("topojson-client");
        const col = feature(topology, topology.objects.countries) as unknown as GeoJSON.FeatureCollection;
        return col.features;
      })
      .catch((err) => {
        console.error("[Globe] Country data failed to load:", err);
        countriesCache = null;
        return [];
      });
  }
  return countriesCache;
}

// ── Types ──────────────────────────────────────────────────────────────────
export interface GlobePoint {
  lat: number;
  lng: number;
  memories: Memory[];
  color: string;
  size: number;
  label: string;
}

interface GlobeComponentProps {
  memories: Memory[];
  onMarkerClick: (memories: Memory[]) => void;
  className?: string;
}

// ── Memory marker clustering ───────────────────────────────────────────────
function buildMarkers(memories: Memory[]): GlobePoint[] {
  const clusters = clusterMemoriesByLocation(memories, 1);
  const markers: GlobePoint[] = [];
  clusters.forEach((mems) => {
    const first = mems[0];
    const avgLat = mems.reduce((s, m) => s + m.latitude, 0) / mems.length;
    const avgLng = mems.reduce((s, m) => s + m.longitude, 0) / mems.length;
    markers.push({
      lat: avgLat,
      lng: avgLng,
      memories: mems,
      color: getCategoryColor(first.category),
      size: mems.some((m) => m.favorite) ? 1.0 : mems.length > 1 ? 0.8 : 0.6,
      label:
        mems.length > 1
          ? `${first.city || first.locationName} (${mems.length})`
          : first.title,
    });
  });
  return markers;
}

// ── Theme-aware color palette ──────────────────────────────────────────────
interface GlobeColors {
  sphere: string;
  landFill: string;
  landHover: string;
  landSide: string;
  stroke: string;
  strokeHover: string;
  atmosphere: string;
}

function getColors(isDark: boolean): GlobeColors {
  return isDark
    ? {
        sphere: "#060c18",
        landFill: "rgba(18, 28, 56, 0.97)",
        landHover: "rgba(212, 160, 42, 0.30)",
        landSide: "rgba(10, 18, 40, 0.92)",
        stroke: "rgba(65, 105, 200, 0.40)",
        strokeHover: "rgba(230, 178, 56, 0.95)",
        atmosphere: "rgba(70, 110, 255, 0.06)",
      }
    : {
        sphere: "#9dc4d8",
        landFill: "rgba(238, 230, 210, 0.97)",
        landHover: "rgba(212, 160, 42, 0.28)",
        landSide: "rgba(205, 195, 170, 0.92)",
        stroke: "rgba(165, 148, 120, 0.52)",
        strokeHover: "rgba(160, 100, 12, 0.95)",
        atmosphere: "rgba(90, 155, 225, 0.14)",
      };
}

// ── Main component ─────────────────────────────────────────────────────────
export function GlobeComponent({
  memories,
  onMarkerClick,
  className,
}: GlobeComponentProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [countries, setCountries] = useState<object[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<object | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { width, height } = useContainerSize(
    containerRef as React.RefObject<HTMLDivElement>
  );
  const colors = useMemo(() => getColors(isDark), [isDark]);
  const markers = useMemo(() => buildMarkers(memories), [memories]);

  // Load country polygons once
  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  // ── Globe ready: configure controls + renderer ─────────────────────────
  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.30;
    controls.enableZoom = true;
    controls.minDistance = 150;
    controls.maxDistance = 650;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.zoomSpeed = 0.7;

    globeRef.current.pointOfView({ lat: 25, lng: 10, altitude: 2.2 }, 1200);

    // Crisp HiDPI rendering
    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // Solid-color sphere (no texture — polygon layer provides all geography)
    const mat = globeRef.current.globeMaterial?.();
    if (mat) {
      mat.color?.set(isDark ? "#060c18" : "#9dc4d8");
      mat.needsUpdate = true;
    }

    setGlobeReady(true);
  }, [isDark]);

  // Sync sphere color on theme change after initial mount
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    const mat = globeRef.current.globeMaterial?.();
    if (!mat) return;
    mat.color?.set(colors.sphere);
    mat.needsUpdate = true;
  }, [isDark, globeReady, colors.sphere]);

  // ── Polygon color callbacks ────────────────────────────────────────────
  const polygonCapColor = useCallback(
    (feat: object) =>
      feat === hoveredCountry ? colors.landHover : colors.landFill,
    [hoveredCountry, colors]
  );

  const polygonSideColor = useCallback(() => colors.landSide, [colors]);

  const polygonStrokeColor = useCallback(
    (feat: object) =>
      feat === hoveredCountry ? colors.strokeHover : colors.stroke,
    [hoveredCountry, colors]
  );

  const polygonAltitude = useCallback(
    (feat: object) => (feat === hoveredCountry ? 0.013 : 0.004),
    [hoveredCountry]
  );

  const handlePolygonHover = useCallback((feat: object | null) => {
    setHoveredCountry(feat ?? null);
  }, []);

  // ── HTML marker factory ────────────────────────────────────────────────
  const htmlElementFactory = useCallback(
    (d: object) => {
      const point = d as GlobePoint;
      const count = point.memories.length;
      const el = document.createElement("div");
      el.className = "memory-pin-container";

      if (count > 1) {
        el.innerHTML = `
          <div class="cluster-pin" style="background:${point.color}">${count}</div>
        `;
      } else {
        const dotSize = point.memories[0].favorite ? "12px" : "8px";
        el.innerHTML = `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:20px;height:20px;">
            <div class="memory-pin-ring" style="color:${point.color};border-color:${point.color}"></div>
            <div class="memory-pin-ring memory-pin-ring-2" style="color:${point.color};border-color:${point.color}"></div>
            <div class="memory-pin-dot" style="background:${point.color};width:${dotSize};height:${dotSize}"></div>
          </div>
        `;
      }
      el.addEventListener("click", () => onMarkerClick(point.memories));
      return el;
    },
    [onMarkerClick]
  );

  // ── Country tooltip ────────────────────────────────────────────────────
  const hoveredCountryName = useMemo(() => {
    if (!hoveredCountry) return null;
    const id = String((hoveredCountry as GeoJSON.Feature).id ?? "");
    return COUNTRY_NAMES[id] ?? null;
  }, [hoveredCountry]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className ?? ""}`}
      onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
    >
      {hoveredCountryName && (
        <div
          className="globe-country-tooltip"
          style={{
            position: "fixed",
            left: cursorPos.x + 16,
            top: cursorPos.y - 48,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {hoveredCountryName}
        </div>
      )}

      <Globe
        ref={globeRef}
        width={width || undefined}
        height={height || undefined}
        // Transparent canvas background — CSS background shows through
        backgroundColor="rgba(0,0,0,0)"
        // No texture — solid sphere color set via globeMaterial() + polygon layer provides all geography
        globeImageUrl={"" as any}
        // ── Country polygon layer ──────────────────────────────────────
        polygonsData={countries}
        polygonCapColor={polygonCapColor}
        polygonSideColor={polygonSideColor}
        polygonStrokeColor={polygonStrokeColor}
        polygonAltitude={polygonAltitude}
        polygonsTransitionDuration={180}
        onPolygonHover={handlePolygonHover as any}
        // ── Memory HTML markers ────────────────────────────────────────
        htmlElementsData={markers}
        htmlElement={htmlElementFactory}
        htmlLat={(d: object) => (d as GlobePoint).lat}
        htmlLng={(d: object) => (d as GlobePoint).lng}
        htmlAltitude={0.016}
        htmlTransitionDuration={300}
        // ── Atmosphere ────────────────────────────────────────────────
        atmosphereColor={colors.atmosphere}
        atmosphereAltitude={0.10}
        onGlobeReady={handleGlobeReady}
      />
    </div>
  );
}
