export function normalize(value) { return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase(); }
export function searchItems(items, query) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return items.map(item => ({ item, score: terms.every(term => normalize(`${item.title} ${item.description} ${item.category} ${item.keywords || ''}`).includes(term)) ? terms.reduce((n, term) => n + (normalize(item.title).includes(term) ? 3 : 1), 0) : 0 })).filter(x => x.score).sort((a, b) => b.score - a.score).map(x => x.item).slice(0, 12);
}
if (typeof document !== 'undefined') {
  const input = document.querySelector('#search');
  if (input) {
    const results = document.querySelector('#search-results');
    const status = document.querySelector('#search-status');
    let request, generation = 0;
    async function update() {
      const current = ++generation;
      const query = input.value.trim();
      results.replaceChildren(); results.hidden = true;
      if (!query) { status.textContent = 'Busca entre nuestras guías y herramientas.'; return; }
      status.textContent = 'Buscando…';
      try {
        request ??= fetch('/editorial/search-index.json').then(response => { if (!response.ok) throw new Error('index'); return response.json(); }).catch(error => { request = undefined; throw error; });
        const items = await request;
        if (generation !== current) return;
        const found = searchItems(items, query);
        status.textContent = found.length ? `${found.length} resultados. Usa Tab para recorrerlos.` : 'Sin resultados. Prueba el nombre de un juego, un error o una herramienta.';
        for (const item of found) {
          const link = document.createElement('a'); link.href = item.path;
          const category = document.createElement('small'); category.textContent = item.category;
          const title = document.createElement('strong'); title.textContent = item.title;
          link.append(category, title); results.append(link);
        }
        results.hidden = !found.length;
      } catch { if (generation === current) status.textContent = 'No se pudo cargar la búsqueda. Puedes usar las categorías o volver a intentarlo.'; }
    }
    input.addEventListener('input', update);
    document.querySelector('#clear-search').addEventListener('click', () => { input.value = ''; update(); input.focus(); });
  }
  // No service-worker registration here: reading articles must not download tool runtimes.
}
