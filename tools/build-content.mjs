import { createRequire } from 'node:module';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const contentRoot = path.join(root, 'content');
const outputFile = path.join(root, 'offline/generated-content.js');
const require = createRequire(import.meta.url);

global.window = {};
for (const file of [
    'offline/data.js',
    'offline/ref-html.js',
    'offline/ref-css.js',
    'offline/ref-js.js',
    'offline/ref-react.js',
    'offline/ref-java.js',
]) {
    require(path.join(root, file));
}

const baseArticles = global.window.WIKI_ARTICLES || [];
const baseReference = global.window.WIKI_REFERENCE || [];
const baseArticleIds = new Set(baseArticles.map((item) => item.id));
const baseReferenceIds = new Set(baseReference.map((item) => item.id));

const languages = new Set(['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Java', 'JavaFX']);
const refPrefix = {
    html: 'HTML',
    css: 'CSS',
    js: 'JavaScript',
    javascript: 'JavaScript',
    react: 'React',
    node: 'Node.js',
    java: 'Java',
    javafx: 'JavaFX',
};

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await walk(full)));
        else files.push(full);
    }

    return files;
}

function parseFrontMatter(raw) {
    const text = raw.replace(/\r\n/g, '\n');

    if (!text.startsWith('---\n')) return { data: {}, body: text };

    const end = text.indexOf('\n---', 4);
    if (end === -1) return { data: {}, body: text };

    const head = text.slice(4, end);
    const body = text.slice(end + 4).replace(/^\n+/, '');
    const data = {};

    for (const line of head.split('\n')) {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!match) continue;

        let value = match[2].trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        data[match[1]] = value;
    }

    return { data, body };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function inline(text) {
    const code = [];
    let output = escapeHtml(text).replace(/`([^`]+)`/g, (_, value) => {
        const token = `\u0000CODE${code.length}\u0000`;
        code.push(`<code>${value}</code>`);
        return token;
    });

    output = output.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    output = output.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    output = output.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => code[Number(index)]);

    return output;
}

function splitRow(line) {
    return line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());
}

function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let index = 0;

    while (index < lines.length) {
        const line = lines[index];

        if (!line.trim()) {
            index++;
            continue;
        }

        const fence = line.match(/^```\s*([A-Za-z0-9_-]*)\s*$/);
        if (fence) {
            const language = fence[1];
            const code = [];
            index++;

            while (index < lines.length && !/^```\s*$/.test(lines[index])) {
                code.push(lines[index]);
                index++;
            }
            index++;

            html.push(
                `<pre><code${
                    language ? ` class="language-${escapeHtml(language)}"` : ''
                }>${escapeHtml(code.join('\n'))}</code></pre>`
            );
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            html.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
            index++;
            continue;
        }

        if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
            html.push('<hr>');
            index++;
            continue;
        }

        if (/^\s*>\s?/.test(line)) {
            const quote = [];
            while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
                quote.push(lines[index].replace(/^\s*>\s?/, ''));
                index++;
            }
            html.push(`<blockquote>${markdownToHtml(quote.join('\n'))}</blockquote>`);
            continue;
        }

        if (/^\s*[-*+]\s+/.test(line)) {
            const items = [];
            while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
                items.push(lines[index].replace(/^\s*[-*+]\s+/, ''));
                index++;
            }
            html.push(
                `<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`
            );
            continue;
        }

        if (/^\s*\d+\.\s+/.test(line)) {
            const items = [];
            while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
                items.push(lines[index].replace(/^\s*\d+\.\s+/, ''));
                index++;
            }
            html.push(
                `<ol>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`
            );
            continue;
        }

        if (
            line.includes('|') &&
            index + 1 < lines.length &&
            /^\s*\|?[\s:-]+\|[\s:|-]*$/.test(lines[index + 1])
        ) {
            const header = splitRow(line);
            index += 2;
            const rows = [];

            while (
                index < lines.length &&
                lines[index].trim() &&
                lines[index].includes('|')
            ) {
                rows.push(splitRow(lines[index]));
                index++;
            }

            html.push(
                `<div class="table-wrap"><table><thead><tr>${header
                    .map((cell) => `<th>${inline(cell)}</th>`)
                    .join('')}</tr></thead><tbody>${rows
                    .map(
                        (row) =>
                            `<tr>${row
                                .map((cell) => `<td>${inline(cell)}</td>`)
                                .join('')}</tr>`
                    )
                    .join('')}</tbody></table></div>`
            );
            continue;
        }

        const paragraph = [];
        while (
            index < lines.length &&
            lines[index].trim() &&
            !/^```|^#{1,6}\s|^\s*[-*+]\s+|^\s*\d+\.\s+|^\s*>|^\s*(---|\*\*\*|___)\s*$/.test(
                lines[index]
            )
        ) {
            paragraph.push(lines[index].trim());
            index++;
        }

        if (paragraph.length) {
            html.push(`<p>${inline(paragraph.join(' '))}</p>`);
        } else {
            index++;
        }
    }

    return html.join('\n');
}

function toPlain(markdown) {
    return markdown
        .replace(/```[A-Za-z0-9_-]*\n?/g, ' ')
        .replace(/```/g, ' ')
        .replace(/`/g, '')
        .replace(/^#{1,6}\s+/gm, ' ')
        .replace(/^\s*[-*+]\s+/gm, ' ')
        .replace(/^\s*\d+\.\s+/gm, ' ')
        .replace(/^\s*>\s?/gm, ' ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\|/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const files = await walk(contentRoot);
const topicFiles = files.filter(
    (file) =>
        file.endsWith('.md') &&
        !file.endsWith('README.md') &&
        !file.endsWith('AGENT_GUIDE.md') &&
        !file.includes(`${path.sep}ref${path.sep}`)
);
const commandFiles = files.filter(
    (file) => file.endsWith('.json') && file.includes(`${path.sep}ref${path.sep}`)
);

const articleOverrides = {};
const articleExtras = [];
const referenceOverrides = {};
const referenceExtras = [];
const seenArticles = new Set();
const seenCommands = new Set();

for (const file of topicFiles) {
    const raw = await readFile(file, 'utf8');
    const { data, body: rawBody } = parseFrontMatter(raw);
    const body = rawBody.replace(/^\s*#\s+.*\n+/, '');
    const id = data.id;
    const language = data.lang;

    if (!id || !language || !data.title) {
        throw new Error(`${file}: front matter needs id, lang, and title`);
    }
    if (!languages.has(language)) {
        throw new Error(`${file}: unknown lang "${language}"`);
    }
    if (seenArticles.has(id)) {
        throw new Error(`${file}: duplicate article id "${id}"`);
    }
    seenArticles.add(id);

    const article = {
        id,
        lang: language,
        title: data.title,
        html: markdownToHtml(body),
        plain: `${language} ${data.title} ${toPlain(body)}`,
        source: path.relative(root, file),
    };

    if (baseArticleIds.has(id)) {
        articleOverrides[id] = article;
    } else {
        if (data.override === 'true') {
            console.warn(`${file}: override requested for new id "${id}", adding as new`);
        }
        articleExtras.push(article);
    }
}

for (const file of commandFiles) {
    const prefix = path.basename(file).split('-')[0];
    const fallbackLanguage = refPrefix[prefix];
    let entries;

    try {
        entries = JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
        throw new Error(`${file}: ${error.message}`);
    }

    if (!Array.isArray(entries)) {
        throw new Error(`${file}: expected one JSON array`);
    }

    for (const entry of entries) {
        const language = entry.lang || fallbackLanguage;

        if (!entry.id || !entry.group || !entry.name || !entry.syntax || !entry.desc || !entry.example) {
            throw new Error(
                `${file}: every entry needs id, group, name, syntax, desc, and example`
            );
        }
        if (!languages.has(language)) {
            throw new Error(
                `${file}: unknown lang "${language}". Use a ${Object.keys(refPrefix).join(
                    ', '
                )}- prefix or add a lang field.`
            );
        }
        if (seenCommands.has(entry.id)) {
            throw new Error(`${file}: duplicate command id "${entry.id}"`);
        }
        seenCommands.add(entry.id);

        const record = {
            id: entry.id,
            group: entry.group,
            name: entry.name,
            syntax: entry.syntax,
            desc: entry.desc,
            example: entry.example,
            lang: language,
            source: path.relative(root, file),
        };

        if (entry.body) {
            record.markdown = entry.body;
            record.html = markdownToHtml(entry.body);
        }

        if (baseReferenceIds.has(entry.id)) {
            referenceOverrides[entry.id] = record;
        } else {
            referenceExtras.push(record);
        }
    }
}

const generated = `// Generated by tools/build-content.mjs. Do not edit by hand.
window.WIKI_ARTICLE_OVERRIDES = ${JSON.stringify(articleOverrides, null, 2)};
window.WIKI_ARTICLES_EXTRA = ${JSON.stringify(articleExtras, null, 2)};
window.WIKI_REFERENCE_OVERRIDES = ${JSON.stringify(referenceOverrides, null, 2)};
window.WIKI_REFERENCE_EXTRA = ${JSON.stringify(referenceExtras, null, 2)};
`;

await writeFile(outputFile, generated, 'utf8');

console.log(
    JSON.stringify(
        {
            topics: {
                overrides: Object.keys(articleOverrides).length,
                extra: articleExtras.length,
            },
            commands: {
                overrides: Object.keys(referenceOverrides).length,
                extra: referenceExtras.length,
            },
            output: path.relative(root, outputFile),
        },
        null,
        2
    )
);
