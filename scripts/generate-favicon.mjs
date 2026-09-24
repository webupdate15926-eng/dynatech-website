import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="92" fill="#07111f"/>
  <rect x="18" y="18" width="476" height="476" rx="76" fill="none" stroke="#15344d" stroke-width="12"/>
  <path fill="#0798d2" d="M116 112h138c99 0 166 57 166 144s-67 144-166 144H116V112Zm82 72v144h53c50 0 83-27 83-72s-33-72-83-72h-53Z"/>
  <path fill="#43becc" d="M285 112h73l-53 72h-71l51-72Z"/>
</svg>`;

const raster = sharp(Buffer.from(iconSvg));
await Promise.all([
  writeFile("app/icon.svg", iconSvg.trimStart()),
  raster.clone().resize(512, 512).png().toFile("app/icon.png"),
  raster.clone().resize(180, 180).png().toFile("app/apple-icon.png"),
]);

const sizes = [16, 32, 48, 64, 128, 256];
const images = await Promise.all(sizes.map((size) => raster.clone().resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entry);
  header.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entry + 1);
  header.writeUInt8(0, entry + 2);
  header.writeUInt8(0, entry + 3);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});

await writeFile("app/favicon.ico", Buffer.concat([header, ...images]));
