# Knowledge Base JSON Specification

## Overview

A structured JSON format for creating machine-readable knowledge bases that ground AI responses in real content. Each knowledge base contains organized sections of content with source attribution, enabling AI to provide accurate, sourced answers.

## Why Structured JSON Over Flat Text

Flat text formats like llm.txt lose structural information. A structured JSON knowledge base preserves:

- **Content relationships** - sections know their parent page and position
- **Attribution chains** - every chunk links back to its source URL
- **Content types** - blog posts, services, portfolio projects, FAQ are distinguishable
- **Granular retrieval** - AI can find exact information without parsing prose
- **Metadata** - dates, authors, tags provide context AI can reason about

## Format

```json
{
  "name": "Site Name",
  "description": "What this knowledge base covers",
  "baseUrl": "https://example.com",
  "generatedAt": "2026-05-02T12:00:00Z",
  "sections": [
    {
      "id": "unique-section-id",
      "url": "https://example.com/page",
      "type": "blog-post | service-page | portfolio | faq | general",
      "title": "Page Title",
      "meta": {
        "author": "Author Name",
        "pubDate": "2026-05-02",
        "tags": ["tag1", "tag2"]
      },
      "chunks": [
        {
          "content": "Text content of this chunk...",
          "position": 1
        }
      ]
    }
  ]
}
```

## Section Types

| Type | Description |
|------|-------------|
| `blog-post` | Blog article with optional author, date, tags |
| `service-page` | Service offering description |
| `portfolio` | Project case study |
| `faq` | Frequently asked questions |
| `general` | General page content |

## Chunk Guidelines

- Each chunk should be 1-3 paragraphs covering a single topic
- Chunks within a section should be ordered by position
- Keep chunks focused rather than cramming multiple topics
- Every chunk must have a source URL for attribution

## Discovery

AI crawlers can find knowledge-base.json through:

1. `<link rel="knowledge-base" type="application/json" href="/knowledge-base.json">` in HTML head
2. Sitemap inclusion (`<loc>knowledge-base.json</loc>`)
3. robots.txt (`Allow: /knowledge-base.json`)
4. Direct submission to AI company crawler documentation

## Validation

Use the JSON Schema in `schema.json` to validate knowledge base structure.

## Examples

See the `examples/` directory for implementations from real websites.