/* -------------------------------------------------------------------------- */
/*  SHARED COLLECTION DATA                                                     */
/*  Used by the /men, /women grids and by the /canvas outfit stage.            */
/* -------------------------------------------------------------------------- */

export type Gender = "MEN" | "WOMEN";

export type ProductImage = {
  src: string;
  width: number;
  height: number;
};

export type Product = {
  id: string;
  name: string;
  meta: string;
  price: string;
  /** Ordered gallery views. The first image is the collection thumbnail. */
  images: ProductImage[];
  collection: Gender;
  code?: string;
};

export const OUTFIT_STORAGE_KEY = "meraki:outfit";
export const OUTFIT_CHANGE_EVENT = "meraki:outfit-change";

/** Sentinel used during SSR/hydration so an empty outfit is distinguishable. */
export const OUTFIT_SERVER_SNAPSHOT = "__meraki_server__";

export type StoredOutfit = {
  collection: Gender | null;
  ids: string[];
};

/* Placeholder transparent PNGs (pngimg.com) until studio photography lands. */
export const MEN: Product[] = [
  {
    id: "heavy-tee",
    name: "Heavy Cotton Tee",
    code: "TS-01",
    meta: "Raw Chalk / 240 gsm",
    price: "€ 95",
    images: [
      {
        src: "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
        width: 893,
        height: 1024,
      },
      {
        src: "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
        width: 871,
        height: 1024,
      },
    ],
    collection: "MEN",
  },
  {
    id: "architectural-hoodie",
    name: "Architectural Hoodie",
    code: "HD-01",
    meta: "Washer Black",
    price: "€ 210",
    images: [
      {
        src: "https://pngimg.com/uploads/hoodie/hoodie_PNG24.png",
        width: 1000,
        height: 1000,
      },
      {
        src: "https://pngimg.com/uploads/hoodie/hoodie_PNG25.png",
        width: 1000,
        height: 1000,
      },
    ],
    collection: "MEN",
  },
  {
    id: "wide-leg-denim",
    name: "Wide Leg Denim",
    code: "DN-01",
    meta: "Indigo Rinse",
    price: "€ 185",
    images: [
      {
        src: "https://pngimg.com/uploads/jeans/jeans_PNG5758.png",
        width: 1000,
        height: 1500,
      },
      {
        src: "https://pngimg.com/uploads/jeans/jeans_PNG5759.png",
        width: 1000,
        height: 1500,
      },
    ],
    collection: "MEN",
  },
  {
    id: "structured-overshirt",
    name: "Structured Overshirt",
    code: "JK-01",
    meta: "Basalt",
    price: "€ 240",
    images: [
      {
        src: "https://pngimg.com/uploads/jacket/jacket_PNG8037.png",
        width: 800,
        height: 1200,
      },
      {
        src: "https://pngimg.com/uploads/jacket/jacket_PNG8038.png",
        width: 800,
        height: 1200,
      },
    ],
    collection: "MEN",
  },
];

export const WOMEN: Product[] = [
  {
    id: "column-dress",
    name: "Column Dress",
    code: "DR-01",
    meta: "Linen Cream",
    price: "€ 260",
    images: [
      {
        src: "https://pngimg.com/uploads/dress/dress_PNG18.png",
        width: 2539,
        height: 1605,
      },
      {
        src: "https://pngimg.com/uploads/dress/dress_PNG19.png",
        width: 2539,
        height: 1605,
      },
    ],
    collection: "WOMEN",
  },
  {
    id: "cropped-leather",
    name: "Cropped Leather",
    code: "LJ-01",
    meta: "Espresso",
    price: "€ 420",
    images: [
      {
        src: "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG8.png",
        width: 679,
        height: 881,
      },
      {
        src: "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG9.png",
        width: 679,
        height: 881,
      },
    ],
    collection: "WOMEN",
  },
  {
    id: "boxy-heavy-tee",
    name: "Boxy Heavy Tee",
    code: "TS-03",
    meta: "Bone / 240 gsm",
    price: "€ 95",
    images: [
      {
        src: "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
        width: 871,
        height: 1024,
      },
      {
        src: "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
        width: 893,
        height: 1024,
      },
    ],
    collection: "WOMEN",
  },
  {
    id: "runner",
    name: "Runner",
    code: "SN-01",
    meta: "Ochre / Ink",
    price: "€ 165",
    images: [
      {
        src: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5783.png",
        width: 1500,
        height: 1500,
      },
      {
        src: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5784.png",
        width: 1500,
        height: 1500,
      },
    ],
    collection: "WOMEN",
  },
];

export const ALL_PRODUCTS: Product[] = [...MEN, ...WOMEN];

/** Resolve stored ids back into products, preserving the stored order. */
export function getProductsByIds(ids: string[]): Product[] {
  const byId = new Map(ALL_PRODUCTS.map((product) => [product.id, product]));

  return ids
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));
}

/** Parse a raw localStorage payload. Accepts the current shape or a bare id array. */
export function parseStoredOutfit(raw: string | null): StoredOutfit {
  if (!raw || raw === OUTFIT_SERVER_SNAPSHOT) {
    return { collection: null, ids: [] };
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    // Older/looser payloads may be a bare array of ids.
    if (Array.isArray(parsed)) {
      return {
        collection: null,
        ids: parsed.filter((id): id is string => typeof id === "string"),
      };
    }

    if (parsed && typeof parsed === "object") {
      const value = parsed as { collection?: unknown; ids?: unknown };

      return {
        collection:
          value.collection === "MEN" || value.collection === "WOMEN"
            ? value.collection
            : null,
        ids: Array.isArray(value.ids)
          ? value.ids.filter((id): id is string => typeof id === "string")
          : [],
      };
    }
  } catch {
    // Corrupt or blocked storage — fall back to an empty outfit.
  }

  return { collection: null, ids: [] };
}

/** Subscribe to outfit changes (this tab and other tabs). */
export function subscribeToOutfit(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(OUTFIT_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(OUTFIT_CHANGE_EVENT, onChange);
  };
}

/** Snapshot for useSyncExternalStore. Returns a stable primitive. */
export function getOutfitSnapshot(): string | null {
  try {
    return window.localStorage.getItem(OUTFIT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getServerOutfitSnapshot(): string {
  return OUTFIT_SERVER_SNAPSHOT;
}

/** Persist the selected outfit before routing to /canvas. */
export function writeStoredOutfit(outfit: StoredOutfit): void {
  try {
    window.localStorage.setItem(OUTFIT_STORAGE_KEY, JSON.stringify(outfit));
    window.dispatchEvent(new Event(OUTFIT_CHANGE_EVENT));
  } catch {
    // Storage can be unavailable (private mode / quota); navigation still works.
  }
}

/** Wipe the stored outfit and notify every canvas subscriber. */
export function clearStoredOutfit(): void {
  try {
    window.localStorage.removeItem(OUTFIT_STORAGE_KEY);
    window.dispatchEvent(new Event(OUTFIT_CHANGE_EVENT));
  } catch {
    // Storage can be unavailable (private mode / quota); the canvas still clears.
  }
}
