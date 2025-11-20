// src/utils/preload.ts
export async function preloadImages(urls: string[]) {
  await Promise.allSettled(
    urls.map(
      (u) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = u;
        })
    )
  );
}

export async function preloadAllAssets() {
  try {
    const products = (await import('../data/products.json')).default as any[];
    const imgs = products.flatMap((p) => p.images ?? (p.image ? [p.image] : []));
    await preloadImages(imgs);
    // opcional: joga no Cache API pra pesar mesmo
    if ('caches' in window) {
      const cache = await caches.open('wishlist-bad-assets');
      await Promise.allSettled(imgs.map((u) => cache.add(u).catch(() => {})));
    }
  } catch {}
}
