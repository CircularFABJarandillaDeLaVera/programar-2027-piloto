// Navegación de la portada: una vista por vez, sin recargar la página.
(() => {
  const landing = document.querySelector('.intro-dashboard');
  const barraVolver = document.querySelector('.view-toolbar');
  const botonVolver = document.querySelector('[data-view-home]');
  const bloques = document.getElementById('bloques');
  const vistas = new Map([...document.querySelectorAll('[data-course-view]')]
    .map((elemento) => [elemento.id, elemento]));
  const alias = {
    rutas: 'recorrido',
    'mi-proyecto': 'proyecto',
    bloques: 'aprender',
    'trabajar-ia': 'ia',
  };

  function nombreVista() {
    const fragmento = location.hash.slice(1);
    return { fragmento, nombre: alias[fragmento] || fragmento };
  }

  function mostrarVista(enfocar = false) {
    const { fragmento, nombre } = nombreVista();
    const vista = vistas.get(nombre);
    landing.hidden = Boolean(vista);
    barraVolver.hidden = !vista;
    for (const elemento of vistas.values()) elemento.hidden = elemento !== vista;
    bloques.hidden = fragmento !== 'bloques';
    window.scrollTo(0, 0);
    if (fragmento === 'bloques') {
      requestAnimationFrame(() => bloques.scrollIntoView({ block: 'start' }));
    }

    if (enfocar) {
      const destino = vista ? vista.querySelector('h2') : landing.querySelector('.action-card');
      if (destino && !destino.matches('a, button')) destino.tabIndex = -1;
      destino?.focus({ preventScroll: true });
    }
  }

  function navegar(fragmento) {
    const url = new URL(location.href);
    url.hash = fragmento;
    if (url.href !== location.href) history.pushState(null, '', url);
    mostrarVista(true);
  }

  document.addEventListener('click', (evento) => {
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey
      || evento.shiftKey || evento.altKey) return;
    const enlace = evento.target.closest('a[href]');
    if (!enlace) return;

    if (enlace.matches('.cf-topbar--course .brand, .cf-topbar--course .cf-nav__link[aria-current="page"]')) {
      evento.preventDefault();
      navegar('');
      return;
    }

    const fragmento = enlace.getAttribute('href');
    if (!fragmento?.startsWith('#')) return;
    const nombre = alias[fragmento.slice(1)] || fragmento.slice(1);
    if (!vistas.has(nombre)) return;
    evento.preventDefault();
    navegar(fragmento.slice(1));
  });

  botonVolver.addEventListener('click', () => navegar(''));
  window.addEventListener('popstate', () => mostrarVista(true));
  window.addEventListener('hashchange', () => mostrarVista(true));
  mostrarVista();
})();
