const articles = window.WIKI_ARTICLES || [];
const byId = new Map(articles.map((article) => [article.id, article]));

const languages = [
    {
        name: 'HTML',
        blurb: 'Markup, links, forms, tables, and accessibility.',
    },
    {
        name: 'CSS',
        blurb: 'Selectors, box model, flexbox, grid, and responsive layout.',
    },
    {
        name: 'JavaScript',
        blurb: 'Types, arrays, DOM, events, fetch, and modules.',
    },
    {
        name: 'React',
        blurb: 'JSX, props, state, hooks, routing, and forms.',
    },
    {
        name: 'Java',
        blurb: 'Syntax, OOP, collections, files, exceptions, and JDBC.',
    },
];

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

function searchScore(article, terms) {
    const title = article.title.toLowerCase();
    const plain = article.plain.toLowerCase();
    let score = 0;

    for (const term of terms) {
        if (title === term) score += 20;
        else if (title.startsWith(term)) score += 10;
        else if (title.includes(term)) score += 5;
        if (plain.includes(term)) score += 1;
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

function renderSidebar() {
    sidebarNav.innerHTML = languages
        .map((language) => {
            const items = articles.filter((article) => article.lang === language.name);
            if (!items.length) return '';

            return `
                <section class="nav-section">
                    <h3>${escapeHtml(language.name)}</h3>
                    ${items
                        .map(
                            (article) => `
                        <a class="nav-link" href="#/article/${article.id}" data-id="${article.id}">
                            ${escapeHtml(article.title)}
                        </a>`
                        )
                        .join('')}
                </section>`;
        })
        .join('');
}

function renderHome() {
    document.title = 'Exam Wiki';
    setActive(null);

    const cards = languages
        .map((language) => {
            const count = articles.filter((article) => article.lang === language.name).length;
            const first = articles.find((article) => article.lang === language.name);
            const href = first ? `#/article/${first.id}` : '#/home';

            return `
                <a class="lang-card" href="${href}">
                    <h3>${escapeHtml(language.name)}</h3>
                    <p>${escapeHtml(language.blurb)}</p>
                    <span class="count">${count} topics</span>
                </a>`;
        })
        .join('');

    content.innerHTML = `
        <article class="article">
            <div class="article-head">
                <h1 class="article-title">Exam Wiki</h1>
                <p class="article-subtitle">A searchable reference for the exam languages. Original notes, examples, and comments.</p>
            </div>

            <div class="home-intro">
                <p>
                    This is a local, static wiki built from the cheat sheets in this repository.
                    It covers the commands and patterns you need for the exam, with code examples
                    and short explanations. Nothing here is copied from W3Schools.
                </p>
            </div>

            <h2>Languages</h2>
            <div class="lang-grid">${cards}</div>

            <h2>How to use it</h2>
            <ul>
                <li>Use the search box at the top for a command, tag, property, or method.</li>
                <li>Search covers article titles, explanations, and code examples.</li>
                <li>Click a language card or a sidebar link to browse the topics in order.</li>
                <li>Each article ends with a link to the matching W3Schools section for the full tutorial.</li>
            </ul>

            <h2>Search examples</h2>
            <p>
                Try <code>querySelector</code>, <code>useEffect</code>, <code>ArrayList</code>,
                <code>grid-template-columns</code>, <code>localStorage</code>, or
                <code>try-with-resources</code>.
            </p>

            <div class="notice">
                <p>
                    The text and examples are original exam notes. For the complete W3Schools
                    course, use the language link at the end of each article. The exact W3Schools
                    pages are not mirrored here.
                </p>
            </div>
        </article>`;

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

    document.title = `${article.title} - Exam Wiki`;
    setActive(id);

    content.innerHTML = `
        <article class="article">
            <div class="article-head">
                <h1 class="article-title">${escapeHtml(article.title)}</h1>
                <p class="article-subtitle">From Exam Wiki, the free exam reference</p>
            </div>

            <div class="article-meta">
                <span class="lang-badge">${escapeHtml(article.lang)}</span>
            </div>

            <div class="article-body">${article.html}</div>

            <div class="article-footer">
                <p>
                    Topic: ${escapeHtml(article.title)}. Full tutorial:
                    <a href="${article.w3}" target="_blank" rel="noopener">${escapeHtml(article.lang)} on W3Schools</a>.
                </p>
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

    const matches = articles
        .filter((article) => {
            const plain = article.plain.toLowerCase();
            return terms.every((term) => plain.includes(term));
        })
        .sort((a, b) => searchScore(b, terms) - searchScore(a, terms));

    document.title = `Search: ${query} - Exam Wiki`;
    setActive(null);

    const resultList = matches
        .map((article) => {
            const snippet = makeSnippet(article.plain, terms);
            return `
                <li>
                    <a class="result-title" href="#/article/${article.id}">
                        ${highlight(article.title, terms)}
                    </a>
                    <span class="result-lang">${escapeHtml(article.lang)}</span>
                    <p class="result-snippet">${highlight(snippet, terms)}</p>
                </li>`;
        })
        .join('');

    content.innerHTML = `
        <article class="article">
            <div class="article-head">
                <h1 class="article-title">Search results</h1>
                <p class="article-subtitle">
                    ${matches.length} result${matches.length === 1 ? '' : 's'} for
                    &ldquo;${escapeHtml(query)}&rdquo;
                </p>
            </div>

            ${
                matches.length
                    ? `<ol class="search-results">${resultList}</ol>`
                    : `<div class="empty">
                        <p>No article matches every word in that search.</p>
                        <p>Try a shorter command, or browse the sidebar.</p>
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
            <h1 class="article-title">Page not found</h1>
            <p class="article-subtitle">The link does not point to an article.</p>
            <p><a href="#/home">Go to the main page</a> or use the search box.</p>
        </article>`;
}

function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');

    if (!raw || raw === 'home') return { view: 'home' };

    if (raw.startsWith('article/')) {
        return { view: 'article', id: raw.slice('article/'.length) };
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
