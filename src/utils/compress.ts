import path from 'path';
import sharp from 'sharp';

export const compressImage = async (filePath: string) => {
  const outputFile = 'uploads/compressed_' + path.basename(filePath);
  await sharp(filePath)
    .resize(800) // Resize image width to 800px (you can adjust it)
    .toFile(outputFile);
  return outputFile;
};
