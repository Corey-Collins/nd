import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./gallery";
const outputFullDir = "./public/images/gallery/full";
const outputThumbDir = "./public/images/gallery/thumbnails";
const manifestPath = "./public/images/gallery/manifest.json";

const fullWidth = 1200;
const fullHeight = 800;
const thumbWidth = 600;
const thumbHeight = 400;

for (const dir of [outputFullDir, outputThumbDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const files = fs.readdirSync(inputDir);

const manifest = [];

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const inputPath = path.join(inputDir, file);

  if (![".jpg", ".jpeg", ".png", ".webp", ".tiff"].includes(ext)) {
    console.log(`Skipping non-image file: ${file}`);
    continue;
  }

  const outputFullPath = path.join(outputFullDir, `${base}.webp`);
  const outputThumbPath = path.join(outputThumbDir, `${base}.webp`);

  let alreadyProcessed = fs.existsSync(outputFullPath) && fs.existsSync(outputThumbPath);

  if (!alreadyProcessed) {
    console.log(`Processing ${file}...`);

    // Full-size
    await sharp(inputPath)
      .resize(fullWidth, fullHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(outputFullPath);

    // Thumbnail
    await sharp(inputPath)
      .resize(thumbWidth, thumbHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputThumbPath);

    console.log(`Finished processing ${file}.`);
  } else {
    console.log(`Skipping ${file}: already processed.`);
  }

  // Get metadata of full-size output
  const metadata = await sharp(outputFullPath).metadata();

  manifest.push({
    name: base,
    full: `/images/gallery/full/${base}.webp`,
    thumb: `/images/gallery/thumbnails/${base}.webp`,
    width: metadata.width,
    height: metadata.height
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Manifest written to ${manifestPath} (${manifest.length} entries)`);
console.log("✅ All done!");
