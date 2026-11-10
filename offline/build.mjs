import { readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';

/**
 * Build data.js from the cheat sheets.
 *
 * The cheat sheets are the source of truth. Edit one, run `npm run build`,
 * and the static wiki picks up the new text and examples.
 */

const sources = [
    {
        lang: 'HTML',
        key: 'html',
        file: '../html/cheatsheet.md',
        w3: 'https://www.w3schools.com/html/',
    },
    {
        lang: 'CSS',
        key: 'css',
        file: '../css/cheatsheet.md',
        w3: 'https://www.w3schools.com/css/',
    },
    {
        lang: 'JavaScript',
        key: 'javascript',
        file: '../javascript/cheatsheet.md',
        w3: 'https://www.w3schools.com/js/',
    },
    {
        lang: 'React',
        key: 'react',
        file: '../react/cheatsheet.md',
        w3: 'https://www.w3schools.com/react/',
    },
    {
        lang: 'Java',
        key: 'java',
        file: '../java/cheatsheet.md',
        w3: 'https://www.w3schools.com/java/',
    },
];

marked.setOptions({ gfm: true, breaks: false });

function slug(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function stripHtml(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&mdash;/g, '-')
        .replace(/&ndash;/g, '-')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Split a cheat sheet on level two headings, but never inside a fenced
 * code block. Code examples may contain lines that look like headings.
 */
function splitSections(markdown) {
    const lines = markdown.split('\n');
    const sections = [];
    let current = null;
    let inFence = false;

    for (const line of lines) {
        if (line.trimStart().startsWith('```')) {
            inFence = !inFence;
        }

        if (!inFence && line.startsWith('## ')) {
            if (current) sections.push(current);
            current = { title: line.slice(3).trim(), lines: [] };
            continue;
        }

        if (current) current.lines.push(line);
    }

    if (current) sections.push(current);
    return sections;
}

const articles = [];
const usedIds = new Set();

function uniqueId(base) {
    let id = base;
    let number = 2;
    while (usedIds.has(id)) id = `${base}-${number++}`;
    usedIds.add(id);
    return id;
}

for (const source of sources) {
    const markdown = await readFile(new URL(source.file, import.meta.url), 'utf8');
    const sections = splitSections(markdown);

    for (const section of sections) {
        const html = marked.parse(section.lines.join('\n').trim());
        const plain = `${source.lang} ${section.title} ${stripHtml(html)}`;

        articles.push({
            id: uniqueId(slug(`${source.key}-${section.title}`)),
            lang: source.lang,
            title: section.title,
            html,
            plain,
            w3: source.w3,
        });
    }
}

const output = `window.WIKI_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`;
await writeFile(new URL('./data.js', import.meta.url), output, 'utf8');

console.log(`Wrote ${articles.length} articles to data.js.`);
