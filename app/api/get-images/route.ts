import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const categories = [
  { title: '2D Graphics Logo', folder: 'Logo' },
  { title: 'GFX Art', folder: 'GFX' },
  { title: 'Motion Graphics', folder: 'MotionGraphics' },
  { title: 'Pub Mats', folder: 'PubmatPosts' },
];

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public');
  const projects = categories.map(({ title, folder }) => {
    const folderPath = path.join(publicDir, folder);
    let images: string[] = [];
    try {
      images = fs
        .readdirSync(folderPath)
        .filter((file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .map((file) => `/${folder}/${file}`);
    } catch (e) {
      images = [];
    }
    return {
      title,
      desc: `Images from ${title}.`,
      images,
    };
  });
  return NextResponse.json({ projects });
}
