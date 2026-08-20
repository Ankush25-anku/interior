import { chromium } from "playwright";

const WIDTH = Number(process.argv[2]) || 1440;
const HEIGHT = Number(process.argv[3]) || 900;
const CYCLES = Number(process.argv[4]) || 10;
const LABEL = process.argv[5] || "run";

const WAITS = [2000, 3000, 5000, 2500, 3500, 4500, 2200, 3800, 5500, 2800];

const run = async () => {
  const browser = await chromium.launch();
  let totalBlank = 0;
  let structuralIssues = [];
  const reports = [];

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    const wait = WAITS[cycle % WAITS.length];
    await page.waitForTimeout(wait);

    const structural = await page.evaluate(() => {
      const out = {};
      for (const id of ["#services", "#process"]) {
        const section = document.querySelector(id);
        if (!section) { out[id] = { error: "missing" }; continue; }
        const hasPinSpacer = !!section.closest(".pin-spacer") || !!section.querySelector(".pin-spacer");
        const sectionPos = getComputedStyle(section).position;
        const anyFixedDescendant = [...section.querySelectorAll("*")].some(
          (el) => getComputedStyle(el).position === "fixed"
        );
        out[id] = { hasPinSpacer, sectionPos, anyFixedDescendant };
      }
      return out;
    });
    const bad = Object.entries(structural).some(
      ([, s]) => s.hasPinSpacer || s.sectionPos === "fixed" || s.anyFixedDescendant || s.error
    );
    if (bad) structuralIssues.push({ cycle, structural });

    let cycleBlank = 0;
    const steps = 300;
    for (let step = 0; step < steps; step++) {
      await page.mouse.wheel(0, 55);
      await page.waitForTimeout(40);

      let state;
      try {
        state = await page.evaluate((ids) => {
          const results = {};
          for (const id of ids) {
            const el = document.querySelector(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
            const contentEls = el.querySelectorAll("h2, h3, p, img");
            let visibleTextCount = 0;
            contentEls.forEach((c) => {
              const r = c.getBoundingClientRect();
              const ccs = getComputedStyle(c);
              const onScreen = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
              const visible = ccs.opacity !== "0" && ccs.visibility !== "hidden" && ccs.display !== "none";
              if (onScreen && visible) visibleTextCount++;
            });
            results[id] = { top: rect.top, bottom: rect.bottom, contentEls: contentEls.length, visibleTextCount };
          }
          return results;
        }, ["#services", "#process"]);
      } catch (e) {
        continue;
      }

      for (const [id, s] of Object.entries(state)) {
        const inViewSubstantially = s.top < HEIGHT * 0.55 && s.bottom > HEIGHT * 0.45;
        if (inViewSubstantially && s.contentEls > 0 && s.visibleTextCount === 0) {
          cycleBlank++;
          totalBlank++;
          reports.push({ cycle, step, id, s });
        }
      }
    }

    console.log(`[${LABEL}] cycle ${cycle} (wait=${wait}ms): blankEvents=${cycleBlank}, pageErrors=${pageErrors.length}`);
    await page.close();
  }

  console.log(`[${LABEL}] TOTAL_BLANK_EVENTS:`, totalBlank);
  console.log(`[${LABEL}] STRUCTURAL_ISSUES:`, JSON.stringify(structuralIssues));
  if (reports.length) console.log(`[${LABEL}] DETAILS:`, JSON.stringify(reports.slice(0, 20), null, 2));
  await browser.close();
};

run();
