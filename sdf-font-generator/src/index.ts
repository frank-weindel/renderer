import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const fontSrc_path = 'font-src';
const fontDst_path = 'font-dst';
const overrides_path = path.join(fontSrc_path, 'overrides.json');
const charset_path = path.join(fontSrc_path, 'charset.txt');
const font_exts = ['.ttf', '.otf', '.woff', '.woff2'];

/**
 * Generates a font file in the specified field type.
 * @param font_name - The name of the font.
 * @param field_type - The type of the font field (msdf or ssdf).
 * @returns {Promise<void>} - A promise that resolves when the font generation is complete.
 */
async function gen_font(font_name: string, field_type: string) {
  console.log(chalk.blue(`Generating ${font_name} ${field_type} font...`));
  if (field_type !== 'msdf' && field_type !== 'ssdf') {
    console.log(`Invalid field type ${field_type}`);
    process.exit(1);
  }

  if (!fs.existsSync(path.join(fontSrc_path, font_name))) {
    console.log(`Font ${font_name} does not exist`);
    process.exit(1);
  }

  let bmfont_field_type = field_type;
  if (bmfont_field_type === 'ssdf') {
    bmfont_field_type = 'sdf';
  }

  const font_name_no_ext = font_name.split('.')[0]!;
  const overrides = JSON.parse(fs.readFileSync(overrides_path, 'utf8'));
  const font_size = overrides[font_name_no_ext]?.[field_type]?.fontSize || 42;
  const distance_range =
    overrides[font_name_no_ext]?.[field_type]?.distanceRange || 4;

  await execa('msdf-bmfont', [
    '--field-type',
    bmfont_field_type,
    '--output-type',
    'json',
    '--round-decimal',
    '6',
    '--smart-size',
    '--pot',
    '--font-size',
    `${font_size}`,
    '--distance-range',
    `${distance_range}`,
    '--charset-file',
    charset_path,
    path.join(fontSrc_path, font_name),
  ]);

  fs.renameSync(
    path.join(fontSrc_path, `${font_name_no_ext}.json`),
    path.join(fontDst_path, `${font_name_no_ext}.${field_type}.json`),
  );
  fs.renameSync(
    path.join(fontSrc_path, `${font_name_no_ext}.png`),
    path.join(fontDst_path, `${font_name_no_ext}.${field_type}.png`),
  );
}

if (!fs.existsSync(fontDst_path)) {
  fs.mkdirSync(fontDst_path, { recursive: true });
}

async function generateFonts() {
  const files = fs.readdirSync(fontSrc_path);
  for (const file of files) {
    for (const ext of font_exts) {
      if (file.endsWith(ext)) {
        await gen_font(file, 'msdf');
        await gen_font(file, 'ssdf');
      }
    }
  }
}

generateFonts().catch((err) => {
  console.log(err);
});
