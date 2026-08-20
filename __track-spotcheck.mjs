import { chromium } from "playwright";

const SIZES = [
  [320, 568], [375, 812], [390, 844], [768, 1024], [1024, 768], [1440, 900],
];

const run = async () => {
  const browser = await chromium.launch();
  for (const [w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(3500);

    // scroll to roughly the middle of the services scroll range
    const services = await page.$("#services");
    const box = await services.boundingBox();
    await page.mouse.move(w / 2, h / 2);
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, 60);
      await page.waitForTimeout(30);
    }

    const info = await page.evaluate(() => {
      const track = document.querySelector("#services .flex.gap-5, #services .flex.gap-5.md\\:gap-6");
      const el = track || document.querySelector("#services [class*='gap-5']");
      const cs = el ? getComputedStyle(el) : null;
      const card = document.querySelector("#services .service-card");
      const cardBox = card ? card.getBoundingClientRect() : null;
      return {
        trackTransform: cs?.transform ?? null,
        cardWidth: cardBox?.width ?? null,
        cardHeight: cardBox?.height ?? null,
      };
    });

    console.log(`${w}x${h}:`, JSON.stringify(info));
    await page.close();
  }
  await browser.close();
};

run();
