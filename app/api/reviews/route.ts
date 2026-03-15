import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const reviewFile = path.join(process.cwd(), 'ReviewLogs', 'reviews.json');

export async function GET() {
  let reviews = [];
  try {
    reviews = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
  } catch (e) {
    reviews = [];
  }
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const body = await req.json();
  let reviews = [];
  try {
    reviews = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
  } catch (e) {
    reviews = [];
  }
  reviews.unshift(body);
  fs.writeFileSync(reviewFile, JSON.stringify(reviews, null, 2));
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { index, review } = await req.json();
  let reviews = [];
  try {
    reviews = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
  } catch (e) {
    reviews = [];
  }
  if (typeof index === 'number' && reviews[index]) {
    reviews[index] = review;
    fs.writeFileSync(reviewFile, JSON.stringify(reviews, null, 2));
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false });
}

export async function DELETE(req: Request) {
  const { index } = await req.json();
  let reviews = [];
  try {
    reviews = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
  } catch (e) {
    reviews = [];
  }
  if (typeof index === 'number' && reviews[index]) {
    reviews.splice(index, 1);
    fs.writeFileSync(reviewFile, JSON.stringify(reviews, null, 2));
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false });
}
