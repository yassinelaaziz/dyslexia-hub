#!/usr/bin/env python3
"""
Convert markdown documentation files to HTML format.
"""

import re
import os
from pathlib import Path

# HTML template
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Dyslexia Grand Hub Documentation</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f9fafb;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}

        header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }}

        header .container {{
            padding: 0 2rem;
        }}

        h1 {{
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }}

        .subtitle {{
            font-size: 1.1rem;
            opacity: 0.9;
        }}

        nav {{
            background: white;
            padding: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }}

        nav .container {{
            padding: 0 2rem;
        }}

        nav ul {{
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }}

        nav a {{
            color: #667eea;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background 0.2s;
        }}

        nav a:hover {{
            background: #f3f4f6;
        }}

        .content {{
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}

        h1 {{
            font-size: 2rem;
            margin: 2rem 0 1rem;
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0.5rem;
        }}

        h2 {{
            font-size: 1.5rem;
            margin: 1.5rem 0 0.75rem;
            color: #374151;
        }}

        h3 {{
            font-size: 1.25rem;
            margin: 1.25rem 0 0.5rem;
            color: #4b5563;
        }}

        h4 {{
            font-size: 1.1rem;
            margin: 1rem 0 0.5rem;
            color: #6b7280;
        }}

        p {{
            margin: 1rem 0;
        }}

        ul, ol {{
            margin: 1rem 0;
            padding-left: 2rem;
        }}

        li {{
            margin: 0.5rem 0;
        }}

        code {{
            background: #f3f4f6;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }}

        pre {{
            background: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1rem 0;
        }}

        pre code {{
            background: none;
            padding: 0;
            color: inherit;
        }}

        blockquote {{
            border-left: 4px solid #667eea;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #6b7280;
            font-style: italic;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }}

        th, td {{
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            text-align: left;
        }}

        th {{
            background: #f9fafb;
            font-weight: 600;
        }}

        hr {{
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 2rem 0;
        }}

        a {{
            color: #667eea;
            text-decoration: none;
        }}

        a:hover {{
            text-decoration: underline;
        }}

        .meta {{
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }}

        .back-link {{
            display: inline-block;
            margin-bottom: 1rem;
            color: #667eea;
            text-decoration: none;
        }}

        .back-link:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>{title}</h1>
            <p class="subtitle">{subtitle}</p>
        </div>
    </header>

    <nav>
        <div class="container">
            <ul>
                <li><a href="index.html">Documentation Index</a></li>
                <li><a href="architecture.html">Architecture</a></li>
                <li><a href="monorepo-structure.html">Monorepo Structure</a></li>
                <li><a href="database-schema.html">Database Schema</a></li>
                <li><a href="api-specification.html">API Specification</a></li>
                <li><a href="component-library.html">Component Library</a></li>
                <li><a href="user-journeys.html">User Journeys</a></li>
                <li><a href="wireframes.html">Wireframes</a></li>
                <li><a href="development-plan.html">Development Plan</a></li>
                <li><a href="testing-strategy.html">Testing Strategy</a></li>
                <li><a href="deployment-plan.html">Deployment Plan</a></li>
                <li><a href="monitoring-plan.html">Monitoring Plan</a></li>
                <li><a href="maintenance-plan.html">Maintenance Plan</a></li>
                <li><a href="technical-specification.html">Technical Specification</a></li>
                <li><a href="training-system.html">Training System</a></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="content">
            {body}
        </div>
    </div>
</body>
</html>
"""

def convert_markdown_to_html(md_content):
    """Convert markdown content to HTML."""
    html = md_content

    # Convert headers
    html = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)

    # Convert bold and italic
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

    # Convert code blocks
    html = re.sub(r'```(\w+)?\n(.*?)```', r'<pre><code>\2</code></pre>', html, flags=re.DOTALL)

    # Convert inline code
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)

    # Convert links
    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', html)

    # Convert unordered lists
    lines = html.split('\n')
    in_ul = False
    result = []
    for line in lines:
        if line.startswith('- '):
            if not in_ul:
                result.append('<ul>')
                in_ul = True
            result.append(f'<li>{line[2:]}</li>')
        else:
            if in_ul:
                result.append('</ul>')
                in_ul = False
            result.append(line)
    if in_ul:
        result.append('</ul>')
    html = '\n'.join(result)

    # Convert ordered lists
    lines = html.split('\n')
    in_ol = False
    result = []
    for line in lines:
        if re.match(r'^\d+\. ', line):
            if not in_ol:
                result.append('<ol>')
                in_ol = True
            result.append(f'<li>{re.sub(r"^\d+\. ", "", line)}</li>')
        else:
            if in_ol:
                result.append('</ol>')
                in_ol = False
            result.append(line)
    if in_ol:
        result.append('</ol>')
    html = '\n'.join(result)

    # Convert horizontal rules
    html = re.sub(r'^---+$', '<hr>', html, flags=re.MULTILINE)

    # Convert blockquotes
    html = re.sub(r'^> (.+)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)

    # Convert paragraphs (lines that are not already wrapped in tags)
    lines = html.split('\n')
    result = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('<'):
            result.append(f'<p>{line}</p>')
        else:
            result.append(line)
    html = '\n'.join(result)

    # Clean up empty paragraphs
    html = re.sub(r'<p></p>', '', html)

    return html

def extract_title_and_subtitle(md_content):
    """Extract title and subtitle from markdown content."""
    lines = md_content.split('\n')
    title = "Documentation"
    subtitle = ""

    for line in lines:
        if line.startswith('# '):
            title = line[2:]
        elif line.startswith('**') and ':' in line:
            if 'Version' in line:
                pass
            elif 'Date' in line:
                pass
            elif 'Author' in line:
                pass
            elif 'Status' in line:
                subtitle = line.replace('**', '').replace('Status:', '').strip()

    return title, subtitle

def convert_file(md_path, html_path):
    """Convert a single markdown file to HTML."""
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    title, subtitle = extract_title_and_subtitle(md_content)
    body = convert_markdown_to_html(md_content)

    html = HTML_TEMPLATE.format(
        title=title,
        subtitle=subtitle,
        body=body
    )

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Converted {md_path} -> {html_path}")

def main():
    """Main conversion function."""
    docs_dir = Path(__file__).parent.parent / 'docs'

    # Mapping of MD files to HTML files
    conversions = {
        'API_SPECIFICATION.md': 'api-specification.html',
        'ARCHITECTURE.md': 'architecture.html',
        'COMPONENT_LIBRARY.md': 'component-library.html',
        'DATABASE_SCHEMA.md': 'database-schema.html',
        'DEPLOYMENT_PLAN.md': 'deployment-plan.html',
        'DEVELOPMENT_PLAN.md': 'development-plan.html',
        'MAINTENANCE_PLAN.md': 'maintenance-plan.html',
        'MONITORING_PLAN.md': 'monitoring-plan.html',
        'MONOREPO_STRUCTURE.md': 'monorepo-structure.html',
        'TECHNICAL_SPECIFICATION_SUMMARY.md': 'technical-specification.html',
        'TESTING_STRATEGY.md': 'testing-strategy.html',
        'TRAINING_SYSTEM_IMPLEMENTATION.md': 'training-system.html',
        'USER_JOURNEYS.md': 'user-journeys.html',
        'WIREFRAMES.md': 'wireframes.html',
    }

    for md_file, html_file in conversions.items():
        md_path = docs_dir / md_file
        html_path = docs_dir / html_file

        if md_path.exists():
            convert_file(md_path, html_path)
        else:
            print(f"Warning: {md_path} does not exist")

if __name__ == '__main__':
    main()
