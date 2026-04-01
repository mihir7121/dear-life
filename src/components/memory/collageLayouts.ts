/**
 * Editorial collage layout data for the scrapbook cover.
 *
 * Each CollageSlot defines an absolutely-positioned tile within a
 * `padding-bottom`-based aspect-ratio container (width: 100%).
 *
 * Layout philosophy:
 *   - Photo 0 is always the hero (largest, top-left anchor).
 *   - Secondary photos orbit it with varied sizes and orientations.
 *   - Rotations alternate subtly — no tile shares the same angle.
 *   - zIndex creates layered depth: higher = in front.
 *   - Nothing exceeds ~98% right-edge so rotated corners stay visible.
 */

export interface CollageSlot {
  top: string;         // CSS percentage from container top
  left: string;        // CSS percentage from container left
  width: string;       // CSS percentage of container width
  aspectRatio: string; // CSS aspect-ratio property
  rotate: number;      // degrees (applied via Framer Motion)
  zIndex: number;
}

/**
 * padding-bottom percentage for the outer shell div.
 * Sets the container height proportional to its width, regardless of viewport.
 * Formula: height ÷ width × 100.
 */
export const COLLAGE_PADDING: Record<number, number> = {
  1: 56,
  2: 62,
  3: 70,
  4: 76,
  5: 82,
  6: 88,
  7: 95,
  8: 100,
  9: 104,
  10: 110,
};

export const COLLAGE_LAYOUTS: Record<number, CollageSlot[]> = {
  // ── 1 photo ─────────────────────────────────────────────
  1: [
    { top: "4%",  left: "10%", width: "80%", aspectRatio: "16/10", rotate:  1.2, zIndex: 2 },
  ],

  // ── 2 photos ────────────────────────────────────────────
  2: [
    { top: "3%",  left: "3%",  width: "60%", aspectRatio: "4/3",   rotate: -1.8, zIndex: 3 },
    { top: "18%", left: "52%", width: "44%", aspectRatio: "3/4",   rotate:  2.5, zIndex: 2 },
  ],

  // ── 3 photos ────────────────────────────────────────────
  3: [
    { top: "2%",  left: "2%",  width: "56%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 4 },
    { top: "4%",  left: "57%", width: "40%", aspectRatio: "3/4",   rotate:  2.8, zIndex: 3 },
    { top: "54%", left: "6%",  width: "45%", aspectRatio: "16/10", rotate:  1.2, zIndex: 2 },
  ],

  // ── 4 photos ────────────────────────────────────────────
  4: [
    { top: "2%",  left: "2%",  width: "54%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 5 },
    { top: "3%",  left: "55%", width: "38%", aspectRatio: "3/4",   rotate:  2.2, zIndex: 4 },
    { top: "52%", left: "5%",  width: "38%", aspectRatio: "4/3",   rotate:  1.8, zIndex: 3 },
    { top: "50%", left: "47%", width: "46%", aspectRatio: "16/10", rotate: -2.1, zIndex: 2 },
  ],

  // ── 5 photos ────────────────────────────────────────────
  5: [
    { top: "2%",  left: "2%",  width: "52%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 6 },
    { top: "4%",  left: "53%", width: "30%", aspectRatio: "3/4",   rotate:  2.8, zIndex: 5 },
    { top: "3%",  left: "80%", width: "18%", aspectRatio: "1/1",   rotate: -3.2, zIndex: 4 },
    { top: "52%", left: "5%",  width: "38%", aspectRatio: "16/10", rotate:  1.5, zIndex: 3 },
    { top: "50%", left: "47%", width: "44%", aspectRatio: "4/3",   rotate: -2.3, zIndex: 2 },
  ],

  // ── 6 photos ────────────────────────────────────────────
  6: [
    { top: "2%",  left: "2%",  width: "50%", aspectRatio: "4/3",   rotate: -1.2, zIndex: 7 },
    { top: "4%",  left: "51%", width: "27%", aspectRatio: "3/4",   rotate:  2.5, zIndex: 6 },
    { top: "2%",  left: "76%", width: "21%", aspectRatio: "1/1",   rotate: -2.8, zIndex: 5 },
    { top: "51%", left: "3%",  width: "34%", aspectRatio: "4/3",   rotate:  2.1, zIndex: 4 },
    { top: "53%", left: "40%", width: "30%", aspectRatio: "3/4",   rotate: -1.8, zIndex: 3 },
    { top: "49%", left: "72%", width: "25%", aspectRatio: "16/10", rotate:  1.4, zIndex: 2 },
  ],

  // ── 7 photos ────────────────────────────────────────────
  7: [
    { top: "2%",  left: "2%",  width: "48%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 8 },
    { top: "3%",  left: "49%", width: "27%", aspectRatio: "3/4",   rotate:  2.8, zIndex: 7 },
    { top: "2%",  left: "74%", width: "22%", aspectRatio: "1/1",   rotate: -2.1, zIndex: 6 },
    { top: "48%", left: "3%",  width: "30%", aspectRatio: "4/3",   rotate:  1.8, zIndex: 5 },
    { top: "50%", left: "35%", width: "27%", aspectRatio: "3/4",   rotate: -2.5, zIndex: 4 },
    { top: "48%", left: "62%", width: "27%", aspectRatio: "4/3",   rotate:  1.2, zIndex: 3 },
    { top: "73%", left: "8%",  width: "33%", aspectRatio: "16/10", rotate: -1.8, zIndex: 2 },
  ],

  // ── 8 photos ────────────────────────────────────────────
  8: [
    { top: "2%",  left: "2%",  width: "46%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 9 },
    { top: "3%",  left: "47%", width: "27%", aspectRatio: "3/4",   rotate:  2.8, zIndex: 8 },
    { top: "2%",  left: "72%", width: "22%", aspectRatio: "1/1",   rotate: -2.1, zIndex: 7 },
    { top: "47%", left: "3%",  width: "28%", aspectRatio: "4/3",   rotate:  1.8, zIndex: 6 },
    { top: "49%", left: "33%", width: "25%", aspectRatio: "3/4",   rotate: -2.5, zIndex: 5 },
    { top: "47%", left: "58%", width: "25%", aspectRatio: "4/3",   rotate:  1.2, zIndex: 4 },
    { top: "70%", left: "5%",  width: "29%", aspectRatio: "16/10", rotate: -1.8, zIndex: 3 },
    { top: "68%", left: "38%", width: "29%", aspectRatio: "4/3",   rotate:  2.2, zIndex: 2 },
  ],

  // ── 9 photos ────────────────────────────────────────────
  9: [
    { top: "2%",  left: "2%",  width: "44%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 10 },
    { top: "3%",  left: "45%", width: "25%", aspectRatio: "3/4",   rotate:  2.8, zIndex: 9  },
    { top: "2%",  left: "68%", width: "20%", aspectRatio: "1/1",   rotate: -2.1, zIndex: 8  },
    { top: "2%",  left: "86%", width: "12%", aspectRatio: "1/1",   rotate:  3.5, zIndex: 7  },
    { top: "46%", left: "3%",  width: "26%", aspectRatio: "4/3",   rotate:  1.8, zIndex: 6  },
    { top: "48%", left: "31%", width: "23%", aspectRatio: "3/4",   rotate: -2.5, zIndex: 5  },
    { top: "46%", left: "54%", width: "23%", aspectRatio: "4/3",   rotate:  1.2, zIndex: 4  },
    { top: "69%", left: "5%",  width: "29%", aspectRatio: "16/10", rotate: -1.8, zIndex: 3  },
    { top: "67%", left: "37%", width: "27%", aspectRatio: "4/3",   rotate:  2.2, zIndex: 2  },
  ],

  // ── 10 photos ───────────────────────────────────────────
  10: [
    { top: "2%",  left: "2%",  width: "42%", aspectRatio: "4/3",   rotate: -1.5, zIndex: 11 },
    { top: "3%",  left: "43%", width: "23%", aspectRatio: "3/4",   rotate:  2.8, zIndex: 10 },
    { top: "2%",  left: "64%", width: "19%", aspectRatio: "1/1",   rotate: -2.1, zIndex: 9  },
    { top: "2%",  left: "81%", width: "16%", aspectRatio: "1/1",   rotate:  3.5, zIndex: 8  },
    { top: "44%", left: "3%",  width: "23%", aspectRatio: "4/3",   rotate:  1.8, zIndex: 7  },
    { top: "46%", left: "28%", width: "21%", aspectRatio: "3/4",   rotate: -2.5, zIndex: 6  },
    { top: "44%", left: "49%", width: "21%", aspectRatio: "4/3",   rotate:  1.2, zIndex: 5  },
    { top: "66%", left: "4%",  width: "27%", aspectRatio: "16/10", rotate: -1.8, zIndex: 4  },
    { top: "64%", left: "35%", width: "25%", aspectRatio: "4/3",   rotate:  2.2, zIndex: 3  },
    { top: "62%", left: "64%", width: "22%", aspectRatio: "1/1",   rotate: -1.5, zIndex: 2  },
  ],
};
