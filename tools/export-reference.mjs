import { createRequire } from 'node:module';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(import.meta.url);

global.window = {};
for (const file of [
    'offline/data.js',
    'offline/ref-html.js',
    'offline/ref-css.js',
    'offline/ref-js.js',
    'offline/ref-react.js',
    'offline/ref-java.js',
    'offline/generated-content.js',
]) {
    require(path.join(root, file));
}

function mergeContent(base, overrides, extras) {
    const map = new Map();

    for (const item of base) map.set(item.id, item);
    for (const [id, item] of Object.entries(overrides || {})) {
        map.set(id, { ...(map.get(id) || {}), ...item });
    }
    for (const item of extras || []) {
        map.set(item.id, { ...(map.get(item.id) || {}), ...item });
    }

    return [...map.values()];
}

const articles = mergeContent(
    global.window.WIKI_ARTICLES || [],
    global.window.WIKI_ARTICLE_OVERRIDES || {},
    global.window.WIKI_ARTICLES_EXTRA || []
);
const reference = mergeContent(
    global.window.WIKI_REFERENCE || [],
    global.window.WIKI_REFERENCE_OVERRIDES || {},
    global.window.WIKI_REFERENCE_EXTRA || []
);

const folder = {
    HTML: 'html',
    CSS: 'css',
    JavaScript: 'javascript',
    React: 'react',
    'Node.js': 'node',
    Java: 'java',
    JavaFX: 'javafx',
};

const fence = {
    HTML: 'html',
    CSS: 'css',
    JavaScript: 'js',
    React: 'jsx',
    'Node.js': 'js',
    Java: 'java',
    JavaFX: 'java',
};

const cheatFile = {
    HTML: 'html/cheatsheet.md',
    CSS: 'css/cheatsheet.md',
    JavaScript: 'javascript/cheatsheet.md',
    React: 'react/cheatsheet.md',
    'Node.js': 'node/cheatsheet.md',
    Java: 'java/cheatsheet.md',
    JavaFX: 'javafx/cheatsheet.md',
};

const output = path.join(root, 'reference');
await rm(output, { recursive: true, force: true });

const languages = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Java', 'JavaFX'];
const counts = {};

for (const language of languages) {
    const key = folder[language];
    await mkdir(path.join(output, key, 'topics'), { recursive: true });
    await mkdir(path.join(output, key, 'commands'), { recursive: true });

    const topics = articles.filter((article) => article.lang === language);
    const commands = reference.filter((entry) => entry.lang === language);

    const source = await readFile(path.join(root, cheatFile[language]), 'utf8');
    const chunks = source.split(/^## /m).slice(1);
    const seen = new Set();

    for (const chunk of chunks) {
        const [titleLine, ...rest] = chunk.split('\n');
        const title = titleLine.trim();
        const body = rest.join('\n').trim();
        const topic = topics.find((item) => item.title === title);

        if (!topic || topic.source) {
            if (!topic) console.warn(`No article matches "${title}" in ${language}`);
            continue;
        }

        const page = `# ${topic.title}

${language} topic · Exam Wiki

${body}
`;
        await writeFile(path.join(output, key, 'topics', `${topic.id}.md`), page, 'utf8');
        seen.add(topic.id);
    }

    for (const topic of topics) {
        if (seen.has(topic.id)) continue;

        let body = topic.html;

        if (topic.source) {
            const raw = await readFile(path.join(root, topic.source), 'utf8');
            const text = raw.replace(/\r\n/g, '\n');
            const withoutFront = text.startsWith('---\n')
                ? text.slice(text.indexOf('\n---', 4) + 4).replace(/^\n+/, '')
                : text;
            body = withoutFront.replace(/^#\s+.*\n+/, '');
        }

        const page = `# ${topic.title}

${language} topic · Exam Wiki

${body}
`;
        await writeFile(path.join(output, key, 'topics', `${topic.id}.md`), page, 'utf8');
    }

    for (const entry of commands) {
        const details = entry.markdown
            ? `\n## Details\n\n${entry.markdown}\n`
            : '';
        const body = `# ${entry.name}

${language} command · ${entry.group}

${entry.desc}

## Syntax

\`\`\`${fence[language]}
${entry.syntax}
\`\`\`

## Example

\`\`\`${fence[language]}
${entry.example}
\`\`\`
${details}`;
        await writeFile(path.join(output, key, 'commands', `${entry.id}.md`), body, 'utf8');
    }

    counts[language] = { topics: topics.length, commands: commands.length };
}

const index = [`# Offline reference`, ''];

index.push(
    `${reference.length} command pages and ${articles.length} topic pages.`,
    '',
    'Every file stands alone. Open the site at `offline/index.html` for search and navigation,',
    'or read the Markdown files here.',
    ''
);

for (const language of languages) {
    const key = folder[language];
    const topics = articles.filter((article) => article.lang === language);
    const commands = reference.filter((entry) => entry.lang === language);
    const groups = new Map();

    for (const entry of commands) {
        if (!groups.has(entry.group)) groups.set(entry.group, []);
        groups.get(entry.group).push(entry);
    }

    index.push(`## ${language}`, '', `${topics.length} topics · ${commands.length} commands`, '');

    index.push('### Topics', '');
    for (const topic of topics) {
        index.push(`- [${topic.title}](${key}/topics/${topic.id}.md)`);
    }
    index.push('');

    for (const [group, entries] of groups) {
        index.push(`### ${group}`, '');
        for (const entry of entries) {
            index.push(`- [\`${entry.name}\`](${key}/commands/${entry.id}.md)`);
        }
        index.push('');
    }
}

await writeFile(path.join(output, 'README.md'), index.join('\n'), 'utf8');

console.log(JSON.stringify({ counts, total: { topics: articles.length, commands: reference.length } }, null, 2));
