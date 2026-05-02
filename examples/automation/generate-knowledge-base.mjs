#!/usr/bin/env node
/**
 * Knowledge Base Generator
 *
 * Scans content directory for markdown/mdx files, extracts structured content,
 * and outputs a knowledge-base.json file matching the spec format.
 *
 * Usage: node generate-knowledge-base.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - adjust these for your site
const CONFIG = {
  siteUrl: 'https://example.com',
  siteName: 'Example Site',
  siteDescription: 'A website built with Astro and Cloudflare Pages',
  contentDir: path.join(__dirname, '../src/content'),
  outputFile: path.join(__dirname, '../public/knowledge-base.json'),
  chunkSize: 3, // paragraphs per chunk
};

// Content type detection based on file path
function detectContentType(filePath) {
  if (filePath.includes('/blog/')) return 'blog-post';
  if (filePath.includes('/services/')) return 'service-page';
  if (filePath.includes('/portfolio/')) return 'portfolio';
  if (filePath.includes('/faq')) return 'faq';
  return 'general';
}

// Extract frontmatter from markdown content
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, body: content };

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  const body = content.slice(match[0].length).trim();
  return { frontmatter, body };
}

// Split text into chunks of paragraphs
function chunkContent(text, chunkSize = 3) {
  const paragraphs = text
    .split(/\n\n+/)
    .map(p => p.replace(/\n/g, ' ').trim())
    .filter(p => p.length > 10);

  const chunks = [];
  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    chunks.push({
      content: paragraphs.slice(i, i + chunkSize).join(' '),
      position: Math.floor(i / chunkSize) + 1,
    });
  }

  return chunks;
}

// Generate a unique ID from file path
function generateId(filePath) {
  return filePath
    .replace(/\.(md|mdx)$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();
}

// Build URL from file path
function buildUrl(filePath) {
  const relativePath = filePath
    .replace(CONFIG.contentDir, '')
    .replace(/\.(md|mdx)$/, '')
    .replace(/index$/, '');

  const urlPath = relativePath
    .split('/')
    .map(part => part.replace(/^\d{4}-\d{2}-\d{2}-/, '')) // remove date prefixes
    .join('/')
    .replace(/\/+/, '/');

  return `${CONFIG.siteUrl}${urlPath}/`;
}

// Process a single markdown file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  if (!body || body.length < 10) return null;

  const chunks = chunkContent(body, CONFIG.chunkSize);
  if (chunks.length === 0) return null;

  return {
    id: generateId(filePath),
    url: buildUrl(filePath),
    type: frontmatter.type || detectContentType(filePath),
    title: frontmatter.title || 'Untitled',
    meta: {
      ...(frontmatter.author && { author: frontmatter.author }),
      ...(frontmatter.pubDate && { pubDate: frontmatter.pubDate }),
      ...(frontmatter.tags && { tags: frontmatter.tags }),
      ...(frontmatter.description && { description: frontmatter.description }),
    },
    chunks,
  };
}

// Recursively find all markdown files
function findMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (entry.name.match(/\.(md|mdx)$/)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main generation function
function generateKnowledgeBase() {
  console.log('Generating knowledge base...');
  console.log(`Scanning: ${CONFIG.contentDir}`);

  if (!fs.existsSync(CONFIG.contentDir)) {
    console.error(`Content directory not found: ${CONFIG.contentDir}`);
    process.exit(1);
  }

  const markdownFiles = findMarkdownFiles(CONFIG.contentDir);
  console.log(`Found ${markdownFiles.length} content files`);

  const sections = [];
  for (const file of markdownFiles) {
    const section = processFile(file);
    if (section) {
      sections.push(section);
      console.log(`  Processed: ${section.id}`);
    }
  }

  const knowledgeBase = {
    name: CONFIG.siteName,
    description: CONFIG.siteDescription,
    baseUrl: CONFIG.siteUrl,
    generatedAt: new Date().toISOString(),
    sections,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    CONFIG.outputFile,
    JSON.stringify(knowledgeBase, null, 2)
  );

  console.log(`\nGenerated ${sections.length} sections`);
  console.log(`Output: ${CONFIG.outputFile}`);
}

generateKnowledgeBase();