"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { Memory } from "@/types";
import { getCategoryColor, clusterMemoriesByLocation } from "@/lib/utils";

// react-globe.gl requires explicit pixel dimensions — we read the container size
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

// Dynamically import to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  ),
});

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

function buildMarkers(memories: Memory[]): GlobePoint[] {
  const clusters = clusterMemoriesByLocation(memories, 1);
  const markers: GlobePoint[] = [];

  clusters.forEach((mems, _key) => {
    const first = mems[0];
    const hasMultiple = mems.length > 1;
    const hasFavorite = mems.some((m) => m.favorite);

    // Average coordinates for clustered memories
    const avgLat = mems.reduce((s, m) => s + m.latitude, 0) / mems.length;
    const avgLng = mems.reduce((s, m) => s + m.longitude, 0) / mems.length;

    const color = getCategoryColor(first.category);

    markers.push({
      lat: avgLat,
      lng: avgLng,
      memories: mems,
      color,
      size: hasFavorite ? 1.0 : hasMultiple ? 0.8 : 0.6,
      label: hasMultiple
        ? `${first.city || first.locationName} (${mems.length})`
        : first.title,
    });
  });

  return markers;
}

export function GlobeComponent({ memories, onMarkerClick, className }: GlobeComponentProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [ready, setReady] = useState(false);
  const { width, height } = useContainerSize(containerRef);

  const markers = buildMarkers(memories);

  // Setup globe on mount
  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 120;
    controls.maxDistance = 500;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Initial camera position
    globeRef.current.pointOfView({ lat: 25, lng: 10, altitude: 2.2 }, 1200);

    setReady(true);
  }, []);

  // Create custom HTML pin elements
  const htmlElementFactory = useCallback(
    (d: object) => {
      const point = d as GlobePoint;
      const count = point.memories.length;

      const el = document.createElement("div");
      el.className = "memory-pin-container";

      if (count > 1) {
        el.innerHTML = `
          <div class="cluster-pin" style="background: ${point.color}; color: white">
            ${count}
          </div>
        `;
      } else {
        el.innerHTML = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
            <div class="memory-pin-ring" style="color: ${point.color}; border-color: ${point.color}"></div>
            <div class="memory-pin-ring memory-pin-ring-2" style="color: ${point.color}; border-color: ${point.color}"></div>
            <div class="memory-pin-dot" style="background: ${point.color}; width: ${point.memories[0].favorite ? "12px" : "8px"}; height: ${point.memories[0].favorite ? "12px" : "8px"}"></div>
          </div>
        `;
      }

      el.addEventListener("click", () => onMarkerClick(point.memories));

      return el;
    },
    [onMarkerClick],
  );

  const globeTextures = isDark
    ? {
        globe: "//unpkg.com/three-globe/example/img/earth-night.jpg",
        bump: "//unpkg.com/three-globe/example/img/earth-topology.png",
        background: "//unpkg.com/three-globe/example/img/night-sky.png",
      }
    : {
        globe: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
        bump: "//unpkg.com/three-globe/example/img/earth-topology.png",
        background: null,
      };

  return (
    <div ref={containerRef} className={`w-full h-full ${className ?? ""}`}>
      <Globe
        ref={globeRef}
        width={width || undefined}
        height={height || undefined}
        globeImageUrl={globeTextures.globe}
        bumpImageUrl={globeTextures.bump}
        backgroundImageUrl={globeTextures.background ?? undefined}
        backgroundColor={isDark ? "rgba(10, 11, 20, 0)" : "rgba(250, 248, 245, 0)"}
        // HTML markers (pins)
        htmlElementsData={markers}
        htmlElement={htmlElementFactory}
        htmlLat={(d: object) => (d as GlobePoint).lat}
        htmlLng={(d: object) => (d as GlobePoint).lng}
        htmlAltitude={0.01}
        htmlTransitionDuration={500}
        // Atmosphere
        atmosphereColor={isDark ? "rgba(100, 120, 255, 0.15)" : "rgba(100, 180, 255, 0.25)"}
        atmosphereAltitude={0.18}
        // Globe visual
        onGlobeReady={() => setReady(true)}
      />
    </div>
  );
}
