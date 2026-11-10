const articles = window.WIKI_ARTICLES || [];
const reference = window.WIKI_REFERENCE || [];

const byId = new Map(articles.map((article) => [article.id, article]));
const refById = new Map(reference.map((entry) => [entry.id, entry]));

const languages = [
    {
        key: 'html',
        name: 'HTML',
        blurb: 'Markup, links, forms, tables, media, and accessibility.',
        accent: '#f0883e',
    },
    {
        key: 'css',
        name: 'CSS',
        blurb: 'Selectors, box model, flexbox, grid, and responsive layout.',
        accent: '#58a6ff',
    },
    {
        key: 'javascript',
        name: 'JavaScript',
        blurb: 'Types, arrays, DOM, events, fetch, and modules.',
        accent: '#f2cc60',
    },
    {
        key: 'react',
        name: 'React',
        blurb: 'JSX, props, state, hooks, routing, and forms.',
        accent: '#61dafb',
    },
    {
        key: 'java',
        name: 'Java',
        blurb: 'Syntax, OOP, collections, files, exceptions, and JDBC.',
        accent: '#ff7b72',
    },
];

const languageByName = new Map(languages.map((language) => [language.name, language]));
const languageByKey = new Map(languages.map((language) => [language.key, language]));

const articleIndex = articles.map((article) => ({
    type: 'article',
    id: article.id,
    lang: article.lang,
    title: article.title,
    plain: article.plain || `${article.lang} ${article.title}`,
    href: `#/article/${article.id}`,
}));

const referenceIndex = reference.map((entry) => ({
    type: 'reference',
    id: entry.id,
    lang: entry.lang,
    title: entry.name,
    plain: `${entry.lang} ${entry.group} ${entry.name} ${entry.syntax} ${entry.desc} ${entry.example}`,
    syntax: entry.syntax,
    href: `#/ref/${entry.id}`,
}));

const searchIndex = [...articleIndex, ...referenceIndex];

const content = document.getElementById('content');
const sidebarNav = document.getElementById('sidebar-nav');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const sidebarToggle = document.getElementById('sidebar-toggle');

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text, terms) {
    if (!terms.length) return escapeHtml(text);
    const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
    return escapeHtml(text).replace(pattern, '<mark>$1</mark>');
}

function makeSnippet(plain, terms, length = 220) {
    const lower = plain.toLowerCase();
    let index = -1;

    for (const term of terms) {
        const found = lower.indexOf(term);
        if (found !== -1 && (index === -1 || found < index)) index = found;
    }

    if (index === -1) {
        const cut = plain.slice(0, length);
        return cut + (plain.length > length ? '...' : '');
    }

    const start = Math.max(0, index - 60);
    const end = Math.min(plain.length, start + length);
    return (
        (start > 0 ? '...' : '') +
        plain.slice(start, end) +
        (end < plain.length ? '...' : '')
    );
}

function searchScore(item, terms) {
    const title = item.title.toLowerCase();
    const plain = item.plain.toLowerCase();
    const syntax = (item.syntax || '').toLowerCase();
    let score = 0;

    for (const term of terms) {
        if (title === term) score += 40;
        else if (title.startsWith(term)) score += 18;
        else if (title.includes(term)) score += 9;
        if (plain.includes(term)) score += 2;
        if (syntax.includes(term)) score += 4;
        if (item.type === 'reference') score += 1;
    }

    return score;
}

function setActive(id) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle('active', link.dataset.id === id);
    });

    if (id && window.matchMedia('(min-width: 901px)').matches) {
        const active = document.querySelector('.nav-link.active');
        if (active) active.scrollIntoView({ block: 'nearest' });
    }
}

function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    sidebarToggle.setAttribute('aria-expanded', 'false');
}

function replaceHash(value) {
    try {
        window.history.replaceState(null, '', value);
    } catch {
        // file:// pages in some browsers reject replaceState.
        window.location.hash = value.replace(/^#/, '');
    }
}

function articleCount(lang) {
    return articles.filter((article) => article.lang === lang).length;
}

function referenceCount(lang) {
    return reference.filter((entry) => entry.lang === lang).length;
}

function renderSidebar() {
    sidebarNav.innerHTML = languages
        .map((language) => {
            const items = articles.filter((article) => article.lang === language.name);
            if (!items.length) return '';

            return `
                <section class="nav-section">
                    <h3>${escapeHtml(language.name)}</h3>
                    <a
                        class="nav-link nav-ref"
                        href="#/reference/${language.key}"
                        data-id="reference-${language.key}"
                    >
                        <span>Command index</span>
                        <span class="nav-count">${referenceCount(language.name)}</span>
                    </a>
                    ${items
                        .map(
                            (article) => `
                        <a class="nav-link" href="#/article/${article.id}" data-id="${escapeHtml(article.id)}">
                            ${escapeHtml(article.title)}
                        </a>`
                        )
                        .join('')}
                </section>`;
        })
        .join('');
}

function renderHome() {
    document.title = 'Exam Wiki - Offline exam reference';
    setActive(null);

    const cards = languages
        .map((language) => {
            const topics = articles.filter((article) => article.lang === language.name);
            const first = topics[0];
            const samples = topics.slice(0, 2);

            return `
                <article class="lang-card" style="--accent: ${language.accent}">
                    <div class="lang-card-top">
                        <span class="lang-kicker">${escapeHtml(language.name)}</span>
                        <span class="lang-count">${topics.length} topics · ${referenceCount(language.name)} commands</span>
                    </div>
                    <h3>${escapeHtml(language.name)}</h3>
                    <p>${escapeHtml(language.blurb)}</p>
                    <ul class="sample-list">
                        ${samples
                            .map(
                                (article) =>
                                    `<li><a href="#/article/${article.id}">${escapeHtml(article.title)}</a></li>`
                            )
                            .join('')}
                    </ul>
                    <div class="card-actions">
                        <a class="card-link" href="#/reference/${language.key}">Command index</a>
                        ${
                            first
                                ? `<a class="card-link ghost" href="#/article/${first.id}">Start reading</a>`
                                : ''
                        }
                    </div>
                </article>`;
        })
        .join('');

    const chips = languages
        .map(
            (language) =>
                `<a class="chip" href="#/reference/${language.key}">${escapeHtml(language.name)}</a>`
        )
        .join('');

    content.innerHTML = `
        <section class="hero">
            <p class="hero-kicker">Offline exam reference</p>
            <h1 class="hero-title">Everything for the exam.<br><span>Without the internet.</span></h1>
            <p class="hero-sub">
                HTML, CSS, JavaScript, React, and Java. Topic pages, a command index for
                every language, and examples with comments. All of it local.
            </p>

            <form class="hero-search" id="hero-search" role="search">
                <input
                    id="hero-input"
                    type="search"
                    placeholder="Try ArrayList, useEffect, grid-template-columns..."
                    aria-label="Search the command index"
                    autocomplete="off"
                />
                <button type="submit">Search</button>
            </form>

            <div class="chips">${chips}<a class="chip chip-ghost" href="#/random">Random topic</a></div>

            <div class="hero-stats">
                <span><strong>${articles.length}</strong> topic pages</span>
                <span><strong>${reference.length}</strong> command pages</span>
                <span><strong>5</strong> languages</span>
                <span><strong>0</strong> external links</span>
            </div>
        </section>

        <section class="home-section">
            <div class="section-head">
                <h2>Featured libraries</h2>
                <p>Start with a language, or jump straight into its command index.</p>
            </div>
            <div class="lang-grid">${cards}</div>
        </section>

        <section class="home-section">
            <div class="section-head">
                <h2>How to use it</h2>
            </div>
            <div class="steps">
                <article class="step">
                    <span class="step-number">01</span>
                    <h3>Search a command</h3>
                    <p>Type a tag, property, method, hook, or exception. The search covers every command page.</p>
                </article>
                <article class="step">
                    <span class="step-number">02</span>
                    <h3>Open the index</h3>
                    <p>Each language has a command index grouped by topic, with syntax and a runnable example.</p>
                </article>
                <article class="step">
                    <span class="step-number">03</span>
                    <h3>Read the topic</h3>
                    <p>Topic pages explain the pattern and show the code. No external tutorial links are needed.</p>
                </article>
            </div>
        </section>

        <div class="notice">
            <p>
                This is an original exam reference. It has no external links and no copied
                tutorial text. The command index covers the standard tags, properties, methods,
                and APIs for these five languages.
            </p>
        </div>`;

    const heroForm = document.getElementById('hero-search');
    if (heroForm) {
        heroForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = document.getElementById('hero-input').value.trim();
            if (value.length < 2) return;
            searchInput.value = value;
            window.location.hash = `#/search?q=${encodeURIComponent(value)}`;
        });
    }

    window.scrollTo(0, 0);
}

function addCopyButtons() {
    content.querySelectorAll('pre').forEach((pre) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-button';
        button.textContent = 'Copy';

        button.addEventListener('click', async () => {
            const code = pre.querySelector('code') || pre;

            try {
                await navigator.clipboard.writeText(code.innerText);
                button.textContent = 'Copied';
            } catch {
                const range = document.createRange();
                range.selectNodeContents(code);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                button.textContent = 'Selected';
            }

            window.setTimeout(() => {
                button.textContent = 'Copy';
            }, 1200);
        });

        pre.append(button);
    });
}

function renderArticle(id) {
    const article = byId.get(id);

    if (!article) {
        renderNotFound();
        return;
    }

    const language = languageByName.get(article.lang);
    const related = articles
        .filter((item) => item.lang === article.lang && item.id !== article.id)
        .slice(0, 4);

    document.title = `${article.title} - Exam Wiki`;
    setActive(id);

    content.innerHTML = `
        <article class="article">
            <div class="article-head">
                <p class="eyebrow">${escapeHtml(article.lang)} topic</p>
                <h1 class="article-title">${escapeHtml(article.title)}</h1>
                <p class="article-subtitle">Exam Wiki · local notes and examples</p>
            </div>

            <div class="article-meta">
                <span class="lang-badge">${escapeHtml(article.lang)}</span>
            </div>

            <div class="article-body">${article.html}</div>

            <div class="article-footer">
                <div class="footer-block">
                    <h2>Keep going</h2>
                    <div class="related-links">
                        ${related
                            .map(
                                (item) =>
                                    `<a href="#/article/${item.id}">${escapeHtml(item.title)}</a>`
                            )
                            .join('')}
                    </div>
                </div>
                ${
                    language
                        ? `<a class="footer-cta" href="#/reference/${language.key}">
                            Open the ${escapeHtml(language.name)} command index
                        </a>`
                        : ''
                }
            </div>
        </article>`;

    addCopyButtons();
    closeSidebar();
    window.scrollTo(0, 0);
    content.focus({ preventScroll: true });
}

function renderReference(langKey) {
    const language = languageByKey.get(langKey);

    if (!language) {
        renderNotFound();
        return;
    }

    const entries = reference.filter((entry) => entry.lang === language.name);
    const groups = new Map();

    for (const entry of entries) {
        if (!groups.has(entry.group)) groups.set(entry.group, []);
        groups.get(entry.group).push(entry);
    }

    document.title = `${language.name} command index - Exam Wiki`;
    setActive(`reference-${language.key}`);

    const jump = [...groups.keys()]
        .map(
            (group) =>
                `<button type="button" class="jump" data-scroll="group-${escapeHtml(
                    group.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                )}">${escapeHtml(group)}</button>`
        )
        .join('');

    const sections = [...groups.entries()]
        .map(([group, items]) => {
            const groupId = `group-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

            return `
                <section class="ref-group" id="${groupId}">
                    <div class="ref-group-head">
                        <h2>${escapeHtml(group)}</h2>
                        <span>${items.length}</span>
                    </div>
                    <div class="ref-grid">
                        ${items
                            .map(
                                (entry) => `
                            <article class="ref-card" id="ref-${escapeHtml(entry.id)}">
                                <div class="ref-card-head">
                                    <h3>${escapeHtml(entry.name)}</h3>
                                    <a class="ref-open" href="#/ref/${entry.id}">Open</a>
                                </div>
                                <p>${escapeHtml(entry.desc)}</p>
                                <pre><code>${escapeHtml(entry.syntax)}</code></pre>
                            </article>`
                            )
                            .join('')}
                    </div>
                </section>`;
        })
        .join('');

    content.innerHTML = `
        <article class="article ref-page">
            <div class="article-head">
                <p class="eyebrow">Command index</p>
                <h1 class="article-title">${escapeHtml(language.name)} reference</h1>
                <p class="article-subtitle">
                    ${entries.length} commands · syntax and one example per command
                </p>
            </div>

            <p class="lead">
                Every entry below is its own page. Use the search box for a name, or scan a
                group. The examples are short on purpose so you can copy the pattern.
            </p>

            <div class="ref-jump">${jump}</div>
            ${sections || `<div class="empty"><p>No reference entries yet.</p></div>`}
        </article>`;

    addCopyButtons();
    closeSidebar();
    window.scrollTo(0, 0);
    content.focus({ preventScroll: true });
}

function renderReferenceEntry(id) {
    const entry = refById.get(id);

    if (!entry) {
        renderNotFound();
        return;
    }

    const language = languageByName.get(entry.lang);
    const related = reference
        .filter(
            (item) =>
                item.lang === entry.lang && item.group === entry.group && item.id !== entry.id
        )
        .slice(0, 6);

    document.title = `${entry.name} - ${entry.lang} reference - Exam Wiki`;
    if (language) setActive(`reference-${language.key}`);

    content.innerHTML = `
        <article class="article ref-entry">
            <div class="article-head">
                <p class="eyebrow">${escapeHtml(entry.lang)} reference</p>
                <h1 class="article-title">${escapeHtml(entry.name)}</h1>
                <div class="article-meta">
                    <span class="lang-badge">${escapeHtml(entry.lang)}</span>
                    <span class="group-badge">${escapeHtml(entry.group)}</span>
                </div>
            </div>

            <p class="lead">${escapeHtml(entry.desc)}</p>

            <h2>Syntax</h2>
            <pre><code>${escapeHtml(entry.syntax)}</code></pre>

            <h2>Example</h2>
            <pre><code>${escapeHtml(entry.example)}</code></pre>

            <div class="article-footer">
                <div class="footer-block">
                    <h2>Related in ${escapeHtml(entry.group)}</h2>
                    <div class="related-links">
                        ${related
                            .map(
                                (item) =>
                                    `<a href="#/ref/${item.id}">${escapeHtml(item.name)}</a>`
                            )
                            .join('')}
                    </div>
                </div>
                ${
                    language
                        ? `<a class="footer-cta" href="#/reference/${language.key}">
                            Back to the ${escapeHtml(language.name)} index
                        </a>`
                        : ''
                }
            </div>
        </article>`;

    addCopyButtons();
    closeSidebar();
    window.scrollTo(0, 0);
    content.focus({ preventScroll: true });
}

function renderSearch(query) {
    const terms = query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    const matches = searchIndex
        .filter((item) => {
            const plain = item.plain.toLowerCase();
            return terms.every((term) => plain.includes(term));
        })
        .sort((a, b) => searchScore(b, terms) - searchScore(a, terms));

    document.title = `Search: ${query} - Exam Wiki`;
    setActive(null);

    const resultList = matches
        .map((item) => {
            const snippet = makeSnippet(item.plain, terms);
            const typeLabel = item.type === 'reference' ? 'Reference' : 'Topic';
            return `
                <li class="result">
                    <div class="result-head">
                        <a class="result-title" href="${item.href}">
                            ${highlight(item.title, terms)}
                        </a>
                        <span class="result-type">${typeLabel}</span>
                        <span class="result-lang">${escapeHtml(item.lang)}</span>
                    </div>
                    <p class="result-snippet">${highlight(snippet, terms)}</p>
                </li>`;
        })
        .join('');

    content.innerHTML = `
        <article class="article">
            <div class="article-head">
                <p class="eyebrow">Search</p>
                <h1 class="article-title">Results</h1>
                <p class="article-subtitle">
                    ${matches.length} result${matches.length === 1 ? '' : 's'} for
                    “${escapeHtml(query)}”
                </p>
            </div>

            ${
                matches.length
                    ? `<ol class="search-results">${resultList}</ol>`
                    : `<div class="empty">
                        <p>No page matches every word in that search.</p>
                        <p>Try a shorter command, or open a command index from the sidebar.</p>
                    </div>`
            }
        </article>`;

    window.scrollTo(0, 0);
}

function renderNotFound() {
    document.title = 'Page not found - Exam Wiki';
    setActive(null);

    content.innerHTML = `
        <article class="article">
            <p class="eyebrow">404</p>
            <h1 class="article-title">Page not found</h1>
            <p class="article-subtitle">The link does not point to a topic or a command.</p>
            <p><a href="#/home">Go to the main page</a> or use the search box.</p>
        </article>`;
}

function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');

    if (!raw || raw === 'home') return { view: 'home' };

    if (raw.startsWith('article/')) {
        return { view: 'article', id: raw.slice('article/'.length) };
    }

    if (raw.startsWith('reference/')) {
        return { view: 'reference', lang: raw.slice('reference/'.length) };
    }

    if (raw.startsWith('ref/')) {
        return { view: 'ref', id: raw.slice('ref/'.length) };
    }

    if (raw.startsWith('search')) {
        const question = raw.indexOf('?');
        const params = new URLSearchParams(question >= 0 ? raw.slice(question + 1) : '');
        return { view: 'search', query: params.get('q') || '' };
    }

    if (raw === 'random') return { view: 'random' };

    return { view: 'notfound' };
}

function route() {
    const current = parseHash();

    if (current.view === 'article') {
        renderArticle(current.id);
        return;
    }

    if (current.view === 'reference') {
        renderReference(current.lang);
        return;
    }

    if (current.view === 'ref') {
        renderReferenceEntry(current.id);
        return;
    }

    if (current.view === 'search') {
        searchInput.value = current.query;
        renderSearch(current.query);
        return;
    }

    if (current.view === 'random') {
        if (!articles.length) {
            renderHome();
            return;
        }

        const pick = articles[Math.floor(Math.random() * articles.length)];
        window.location.replace(`#/article/${pick.id}`);
        return;
    }

    if (current.view === 'notfound') {
        renderNotFound();
        return;
    }

    renderHome();
}

let searchTimer;

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    window.clearTimeout(searchTimer);

    searchTimer = window.setTimeout(() => {
        if (query.length < 2) {
            if (window.location.hash !== '#/home') {
                replaceHash('#/home');
            }
            renderHome();
            return;
        }

        replaceHash(`#/search?q=${encodeURIComponent(query)}`);
        renderSearch(query);
    }, 180);
});

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query.length >= 2) {
        window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
    }
});

sidebarToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('sidebar-open');
    sidebarToggle.setAttribute('aria-expanded', String(isOpen));
});

sidebarNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeSidebar();
});

content.addEventListener('click', (event) => {
    const jump = event.target.closest('[data-scroll]');
    if (!jump) return;

    const target = document.getElementById(jump.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('click', (event) => {
    if (
        document.body.classList.contains('sidebar-open') &&
        !sidebarNav.contains(event.target) &&
        !sidebarToggle.contains(event.target)
    ) {
        closeSidebar();
    }
});

document.addEventListener('keydown', (event) => {
    const tag = document.activeElement.tagName;

    if (
        event.key === '/' &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA' &&
        tag !== 'SELECT'
    ) {
        event.preventDefault();
        searchInput.focus();
    }

    if (event.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        window.location.hash = '#/home';
    }
});

window.addEventListener('hashchange', route);

renderSidebar();
route();
