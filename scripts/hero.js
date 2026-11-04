// These image URLs give the hero a fresh, relevant photo on each page load.
const heroImages = [
  const heroImages = [
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2200&q=85",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2200&q=85",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=85",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2200&q=85"
];

// `document` represents the current webpage, and lets JavaScript find its elements.
// `querySelectorAll` finds every element that matches these CSS selectors.
const heroes = document.querySelectorAll(".hero, .report-hero");

// Pick one image at random and apply it to the hero present on this page.
const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)];
// `forEach` runs this function once for each matching hero element.
heroes.forEach((hero) => {
  // `.style` lets JavaScript read or change an element's inline CSS styles.
  // `setProperty` sets a CSS property by name; here it sets a custom property used by CSS.
  hero.style.setProperty("--hero-image", `url("${randomImage}")`);
});