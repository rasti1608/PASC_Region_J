#!/usr/bin/env python3
"""
PASC Website Scraper
One-time script to download content from pasc.net for the AI knowledge base.

Usage:
    python scrape_pasc.py                    # Scrape default pages
    python scrape_pasc.py --url URL          # Scrape a specific URL
    python scrape_pasc.py --list-only        # Just list what would be scraped
"""

import requests
from bs4 import BeautifulSoup
import os
import re
import argparse
from urllib.parse import urljoin, urlparse
import time

# Output directory for scraped content
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge", "pasc_external")

# Default pages to scrape from pasc.net
DEFAULT_PAGES = {
    "pasc_about.md": {
        "url": "https://www.pasc.net/about",
        "title": "About PASC"
    },
    "pasc_mission.md": {
        "url": "https://www.pasc.net/about/mission-vision",
        "title": "PASC Mission & Vision"
    },
    "pasc_regions.md": {
        "url": "https://www.pasc.net/about/regions",
        "title": "PASC Regions"
    },
    "pasc_membership.md": {
        "url": "https://www.pasc.net/membership",
        "title": "PASC Membership"
    },
    "pasc_conferences.md": {
        "url": "https://www.pasc.net/conferences",
        "title": "PASC Conferences"
    },
    "pasc_awards.md": {
        "url": "https://www.pasc.net/awards",
        "title": "PASC Awards"
    },
    "pasc_resources.md": {
        "url": "https://www.pasc.net/resources",
        "title": "PASC Resources"
    },
}

# Request headers to mimic a browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


def clean_text(text):
    """Clean up extracted text."""
    # Remove excessive whitespace
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    # Remove leading/trailing whitespace from lines
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    # Remove empty lines at start/end
    text = text.strip()
    return text


def extract_main_content(soup):
    """Extract the main content from the page, removing navigation, headers, footers."""
    # Remove unwanted elements
    for element in soup.find_all(['nav', 'header', 'footer', 'script', 'style', 'noscript', 'iframe']):
        element.decompose()

    # Try to find main content area
    main_content = None

    # Common content containers
    content_selectors = [
        'main',
        'article',
        '[role="main"]',
        '.main-content',
        '.content',
        '.page-content',
        '#content',
        '#main',
        '.entry-content',
        '.post-content',
    ]

    for selector in content_selectors:
        main_content = soup.select_one(selector)
        if main_content:
            break

    # If no main content found, use body
    if not main_content:
        main_content = soup.find('body')

    if not main_content:
        return ""

    # Extract text
    text = main_content.get_text(separator='\n')
    return clean_text(text)


def extract_structured_content(soup, url):
    """Extract content with some structure preserved (headings, lists)."""
    # Remove unwanted elements
    for element in soup.find_all(['nav', 'header', 'footer', 'script', 'style', 'noscript', 'iframe', 'form']):
        element.decompose()

    # Try to find main content
    main = soup.select_one('main') or soup.select_one('article') or soup.select_one('.content') or soup.find('body')

    if not main:
        return ""

    content_parts = []

    # Process elements
    for element in main.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'div']):
        if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            level = int(element.name[1])
            prefix = '#' * level
            text = element.get_text(strip=True)
            if text:
                content_parts.append(f"\n{prefix} {text}\n")
        elif element.name == 'p':
            text = element.get_text(strip=True)
            if text and len(text) > 10:  # Skip very short paragraphs
                content_parts.append(f"{text}\n")
        elif element.name == 'li':
            text = element.get_text(strip=True)
            if text:
                content_parts.append(f"- {text}")
        elif element.name == 'div':
            # Only process divs that have direct text content
            if element.string:
                text = element.string.strip()
                if text and len(text) > 20:
                    content_parts.append(f"{text}\n")

    content = '\n'.join(content_parts)
    return clean_text(content)


def scrape_page(url, title=""):
    """Scrape a single page and return markdown content."""
    print(f"  Fetching: {url}")

    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: Failed to fetch {url}: {e}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')

    # Get page title if not provided
    if not title:
        title_tag = soup.find('title')
        title = title_tag.get_text(strip=True) if title_tag else urlparse(url).path

    # Extract content
    content = extract_structured_content(soup, url)

    if not content or len(content) < 50:
        # Fallback to simple extraction
        content = extract_main_content(soup)

    if not content:
        print(f"  WARNING: No content extracted from {url}")
        return None

    # Build markdown document
    markdown = f"# {title}\n\n"
    markdown += f"Source: {url}\n\n"
    markdown += "---\n\n"
    markdown += content

    return markdown


def save_content(filename, content):
    """Save content to a markdown file."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  Saved: {filepath} ({len(content)} chars)")
    return filepath


def scrape_default_pages():
    """Scrape all default PASC pages."""
    print(f"\nScraping PASC website (pasc.net)...")
    print(f"Output directory: {OUTPUT_DIR}\n")

    successful = 0
    failed = 0

    for filename, page_info in DEFAULT_PAGES.items():
        print(f"\nProcessing: {filename}")

        content = scrape_page(page_info["url"], page_info["title"])

        if content:
            save_content(filename, content)
            successful += 1
        else:
            failed += 1

        # Be polite - wait between requests
        time.sleep(1)

    print(f"\n{'='*50}")
    print(f"Scraping complete!")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Output: {OUTPUT_DIR}")


def scrape_single_url(url, output_name=None):
    """Scrape a single URL."""
    print(f"\nScraping: {url}")

    content = scrape_page(url)

    if content:
        if not output_name:
            # Generate filename from URL
            parsed = urlparse(url)
            path = parsed.path.strip('/').replace('/', '_')
            output_name = f"pasc_{path or 'home'}.md"

        if not output_name.endswith('.md'):
            output_name += '.md'

        save_content(output_name, content)
        print(f"\nSuccess! Content saved to {output_name}")
    else:
        print(f"\nFailed to extract content from {url}")


def list_pages():
    """List pages that would be scraped."""
    print("\nDefault pages to scrape from pasc.net:\n")
    for filename, page_info in DEFAULT_PAGES.items():
        print(f"  {filename}")
        print(f"    URL: {page_info['url']}")
        print(f"    Title: {page_info['title']}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description="Scrape PASC website content for AI knowledge base"
    )
    parser.add_argument(
        '--url',
        type=str,
        help='Scrape a specific URL'
    )
    parser.add_argument(
        '--output',
        type=str,
        help='Output filename (for --url)'
    )
    parser.add_argument(
        '--list-only',
        action='store_true',
        help='List pages that would be scraped without actually scraping'
    )

    args = parser.parse_args()

    if args.list_only:
        list_pages()
    elif args.url:
        scrape_single_url(args.url, args.output)
    else:
        scrape_default_pages()


if __name__ == "__main__":
    main()
