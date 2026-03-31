"use client";

/**
 * MemoryConnectorOverlay
 *
 * Renders an SVG absolutely positioned over the full connectorWrapper div
 * (which spans from the scrapbook collage down through the story section).
 *
 * Each media tile and each story/caption node expose refs so D3 can
 * compute anchor points and draw curved connector paths between them.
 *
 * Behaviour:
 *  - On mount: paths draw in via stroke-dashoffset animation.
 *  - On hover (activeIndex prop change): D3 transitions highlight the
 *    active path (thicker, brighter gold) and dim all others.
 *  - On resize: ResizeObserver redraws at correct dimensions.
 *  - On mobile (tile has zero dimensions — hidden by CSS): skipped.
 */

import { useEffect, useRef, useCallback, RefObject } from "react";
import * as d3 from "d3";
import type { MediaItem } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Connection {
  tileIndex: number;
  sourceEl: HTMLDivElement;
  targetEl: HTMLElement;
}

export interface MemoryConnectorOverlayProps {
  wrapperRef: RefObject<HTMLDivElement>;
  tileRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  storyAnchorRef: RefObject<HTMLDivElement>;
  captionNodeRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  mediaItems: MediaItem[];
  /** Index of the tile currently hovered; null = no hover */
  activeIndex: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Geometry helpers
// ─────────────────────────────────────────────────────────────────────────────

function centerOf(el: Element, wrapper: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const w = wrapper.getBoundingClientRect();
  return { x: r.left - w.left + r.width / 2, y: r.top - w.top + r.height / 2 };
}

function topCenterOf(el: Element, wrapper: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const w = wrapper.getBoundingClientRect();
  return { x: r.left - w.left + r.width / 2, y: r.top - w.top + 4 };
}

/** Cubic bezier path with alternating lateral bow so paths don't overlap */
function makePath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  i: number,
): string {
  const dy = ty - sy;
  const dx = tx - sx;
  // Alternate bow direction and magnitude per index
  const sign = i % 2 === 0 ? 1 : -1;
  const bow = sign * (28 + (i % 4) * 18);
  const cp1x = sx + dx * 0.12 + bow;
  const cp1y = sy + dy * 0.38;
  const cp2x = tx - dx * 0.12 - bow * 0.6;
  const cp2y = ty - dy * 0.24;
  return `M ${sx} ${sy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${tx} ${ty}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function MemoryConnectorOverlay({
  wrapperRef,
  tileRefs,
  storyAnchorRef,
  captionNodeRefs,
  mediaItems,
  activeIndex,
}: MemoryConnectorOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);

  // ── Build connection list ────────────────────────────────────────────────
  const buildConnections = useCallback((): Connection[] => {
    if (!wrapperRef.current || !storyAnchorRef.current) return [];

    const out: Connection[] = [];

    tileRefs.current.forEach((sourceEl, i) => {
      // Skip hidden tiles (mobile grid is display:none — rect will be 0×0)
      const r = sourceEl.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      // Each tile connects to its caption card if it has one; else story anchor
      const captionEl = captionNodeRefs.current.get(i);
      const targetEl = captionEl ?? storyAnchorRef.current!;

      out.push({ tileIndex: i, sourceEl, targetEl });
    });

    return out;
  }, [wrapperRef, tileRefs, storyAnchorRef, captionNodeRefs]);

  // ── Full redraw ──────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const { width, height } = wrapper.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const connections = buildConnections();
    if (connections.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    // ── Defs ──────────────────────────────────────────────────────────────
    const defs = svg.append("defs");

    // Vertical gold gradient — fades at tile end, stronger mid-path
    const grad = defs
      .append("linearGradient")
      .attr("id", "conn-grad")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    grad.append("stop").attr("offset", "0%")
      .attr("stop-color", "hsl(38 78% 52%)").attr("stop-opacity", 0.05);
    grad.append("stop").attr("offset", "30%")
      .attr("stop-color", "hsl(38 78% 52%)").attr("stop-opacity", 0.55);
    grad.append("stop").attr("offset", "75%")
      .attr("stop-color", "hsl(38 78% 52%)").attr("stop-opacity", 0.4);
    grad.append("stop").attr("offset", "100%")
      .attr("stop-color", "hsl(38 78% 52%)").attr("stop-opacity", 0.15);

    // Glow filter for active paths
    const filter = defs.append("filter").attr("id", "conn-glow");
    filter.append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", "1.8")
      .attr("result", "blur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // ── Path group ────────────────────────────────────────────────────────
    const linesGroup = svg.append("g").attr("class", "conn-lines");

    connections.forEach((conn, ci) => {
      const src = centerOf(conn.sourceEl, wrapper);
      const tgt = topCenterOf(conn.targetEl, wrapper);
      const pathD = makePath(src.x, src.y, tgt.x, tgt.y, ci);

      const pathEl = linesGroup
        .append("path")
        .attr("class", "connector-path")
        .attr("data-tile", conn.tileIndex)
        .attr("d", pathD)
        .attr("fill", "none")
        .attr("stroke", "url(#conn-grad)")
        .attr("stroke-width", 1.4)
        .attr("stroke-linecap", "round")
        .attr("stroke-opacity", 0);

      const totalLen = (pathEl.node() as SVGPathElement).getTotalLength();

      // Set up dashoffset draw-in
      pathEl
        .attr("stroke-dasharray", totalLen)
        .attr("stroke-dashoffset", totalLen);

      // Draw-in transition — staggered per path
      pathEl
        .transition()
        .delay(450 + ci * 200)
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0)
        .attr("stroke-opacity", 0.38)
        .on("end", function () {
          // After draw-in: switch to fine dashed style for ambient texture
          d3.select(this).attr("stroke-dasharray", "4 9");
        });
    });

    // ── Tile anchor dots ──────────────────────────────────────────────────
    const nodesGroup = svg.append("g").attr("class", "conn-nodes");

    tileRefs.current.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      const pt = centerOf(el, wrapper);
      nodesGroup
        .append("circle")
        .attr("class", "tile-dot")
        .attr("data-tile", i)
        .attr("cx", pt.x)
        .attr("cy", pt.y)
        .attr("r", 0)
        .attr("fill", "hsl(38 78% 52%)")
        .attr("opacity", 0.55)
        .transition()
        .delay(350 + i * 90)
        .duration(480)
        .ease(d3.easeBackOut.overshoot(1.6))
        .attr("r", 3.5);
    });

    // ── Story anchor dot ──────────────────────────────────────────────────
    if (storyAnchorRef.current) {
      const pt = topCenterOf(storyAnchorRef.current, wrapper);
      nodesGroup
        .append("circle")
        .attr("class", "anchor-dot")
        .attr("cx", pt.x)
        .attr("cy", pt.y)
        .attr("r", 0)
        .attr("fill", "hsl(38 78% 52%)")
        .attr("opacity", 0.45)
        .transition()
        .delay(1000)
        .duration(500)
        .ease(d3.easeBackOut)
        .attr("r", 4.5);
    }

    // ── Caption node dots ─────────────────────────────────────────────────
    captionNodeRefs.current.forEach((el, i) => {
      const pt = topCenterOf(el, wrapper);
      nodesGroup
        .append("circle")
        .attr("class", "caption-dot")
        .attr("data-tile", i)
        .attr("cx", pt.x)
        .attr("cy", pt.y)
        .attr("r", 0)
        .attr("fill", "hsl(38 78% 52%)")
        .attr("opacity", 0.4)
        .transition()
        .delay(900 + i * 80)
        .duration(380)
        .ease(d3.easeBackOut)
        .attr("r", 3);
    });
  }, [buildConnections, wrapperRef, tileRefs, storyAnchorRef, captionNodeRefs]);

  // ── Hover highlight — separate effect, no redraw ─────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // Paths
    svg
      .selectAll<SVGPathElement, unknown>(".connector-path")
      .transition()
      .duration(200)
      .ease(d3.easeQuadOut)
      .attr("stroke-opacity", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        if (activeIndex === null) return 0.38;
        return idx === activeIndex ? 0.92 : 0.05;
      })
      .attr("stroke-width", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        if (activeIndex === null) return 1.4;
        return idx === activeIndex ? 2.8 : 0.6;
      })
      .attr("filter", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        return idx === activeIndex ? "url(#conn-glow)" : "none";
      });

    // Tile dots
    svg
      .selectAll<SVGCircleElement, unknown>(".tile-dot")
      .transition()
      .duration(200)
      .attr("r", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        if (activeIndex === null) return 3.5;
        return idx === activeIndex ? 6 : 1.8;
      })
      .attr("opacity", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        if (activeIndex === null) return 0.55;
        return idx === activeIndex ? 1 : 0.12;
      });

    // Caption dots
    svg
      .selectAll<SVGCircleElement, unknown>(".caption-dot")
      .transition()
      .duration(200)
      .attr("r", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        if (activeIndex === null) return 3;
        return idx === activeIndex ? 5 : 1.5;
      })
      .attr("opacity", function () {
        const idx = parseInt(d3.select(this).attr("data-tile"), 10);
        if (activeIndex === null) return 0.4;
        return idx === activeIndex ? 1 : 0.08;
      });

    // Story anchor dot — pulses whenever ANY tile is hovered
    svg
      .selectAll<SVGCircleElement, unknown>(".anchor-dot")
      .transition()
      .duration(200)
      .attr("r", activeIndex !== null ? 6 : 4.5)
      .attr("opacity", activeIndex !== null ? 0.85 : 0.45);
  }, [activeIndex]);

  // ── Initial draw (after tiles settle) ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(draw, 400);
    return () => clearTimeout(t);
  }, [draw, mediaItems.length]);

  // ── Resize observer ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw, wrapperRef]);

  return (
    // z-[1] sits above page background but below tile z-indexes (2-11)
    // → connector lines appear to emerge from behind photos, flowing down
    <div
      className="absolute inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="absolute top-0 left-0"
        style={{ pointerEvents: "none", overflow: "visible" }}
      />
    </div>
  );
}
