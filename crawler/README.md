# QR Ticket Documentation Scraper

An automated scraping tool that extracts authenticated content from QR Ticket dashboard pages using Firecrawl, organized for LLM-powered documentation generation.

## Features

- 🔐 **Authenticated Scraping**: Uses session cookies to access protected dashboard pages
- 🗺️ **Site Mapping**: Automatically discovers all dashboard pages and routes
- 📄 **Multi-format Export**: Saves data as JSON and organized Markdown files
- 🏷️ **Smart Categorization**: Groups pages by functionality (events, analytics, settings, etc.)
- 🤖 **LLM-Ready**: Structures data optimally for AI documentation generation

## Setup

1. Install dependencies:

```bash
bun install
```

2. Get a Firecrawl API key from [https://firecrawl.dev](https://firecrawl.dev)

3. Create `.env` file:

```bash
cp .env.example .env
# Edit .env and add your Firecrawl API key
```

## Usage

Run the scraper:

```bash
bun run index.ts
```

The script will:

1. Test authentication with your QR Ticket dashboard
2. Map all available dashboard pages
3. Scrape content from each page
4. Save organized data to `./scraped_data/` directory

## Output Structure

```
scraped_data/
├── README.md           # Overview and index
├── scraped_data.json   # Complete raw data
└── sections/           # Organized by functionality
    ├── dashboard/
    ├── events/
    ├── analytics/
    ├── team/
    └── settings/
```

## Authentication

The script uses a pre-configured session cookie. To update it:

1. Log into your QR Ticket dashboard
2. Open browser dev tools → Application → Cookies
3. Copy the `__Secure-authjs.session-token` value
4. Update the `authCookie` variable in `index.ts`

## Generated Documentation

After scraping, you can use the organized data with any LLM to generate Mintlify documentation:

- **JSON format**: For programmatic processing
- **Markdown sections**: For human-readable review
- **Indexed structure**: Easy navigation and reference

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
