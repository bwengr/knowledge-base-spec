# Knowledge Base JSON Spec

A structured JSON format for creating machine-readable knowledge bases that ground AI responses in real content.

## Why This Exists

Flat text formats like llm.txt lose structural information. A structured JSON knowledge base preserves content relationships, source attribution, and metadata that AI can reason about.

This spec defines a format where every piece of content links back to its source URL, enabling AI to provide accurate, sourced answers instead of hallucinations.

## The Format

See [SPEC.md](SPEC.md) for the full technical specification.

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

## Examples

- [basic.json](examples/basic.json) - A small business website
- [bw-engineering.json](examples/bw-engineering.json) - Real-world civil engineering firm
- [automation/](examples/automation/) - GitHub Actions workflow and script for auto-generating your knowledge base

## Validation

Use the JSON Schema in `schema.json` to validate your knowledge base structure.

## Discovery

AI crawlers can find your knowledge-base.json through:

1. Add `<link rel="knowledge-base" type="application/json" href="/knowledge-base.json">` to your HTML head
2. Include it in your sitemap.xml
3. Allow it in robots.txt: `Allow: /knowledge-base.json`
4. Submit your format to AI company crawler documentation

## Why Not llm.txt?

llm.txt is a flat text file. Parsable by AI, but:

- No structural metadata for AI to reason about
- Source URLs buried in prose
- Content types indistinguishable from each other
- No support for chunks, positions, or content relationships

A knowledge base JSON preserves the information that makes content useful for grounding AI responses.

## License

MIT