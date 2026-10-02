// Lee productos.json y dibuja el catálogo. Para cambiar precios, nombres o
// imágenes solo edita productos.json; esta página no necesita tocarse.

const ARCHIVO_DATOS = 'productos.json';
const catalogo = document.getElementById('catalogo');

const esc = (texto) =>
  String(texto ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

const usar = (id, clase) =>
  `<svg class="deco ${clase}" aria-hidden="true"><use href="#${id}"/></svg>`;

const DECORACION = {
  oscuro: () =>
    '<svg class="frascos tenue" aria-hidden="true"><use href="#frascos"/></svg>' +
    usar('curva-sup', 'curva-sup') +
    usar('estrella', 'estrella e1') +
    usar('curva-inf', 'curva-inf') +
    usar('estrella', 'estrella e3'),
  rosa: () =>
    usar('liston-a', 'liston liston-sup') +
    usar('liston-b', 'liston liston-inf') +
    usar('liston-b', 'liston liston-izq') +
    ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map((c) => usar('corazon', `corazon ${c}`)).join('')
};

// Acepta true/false con o sin comillas ("true" / "false").
const esVerdadero = (v) => v === true || v === 'true';
const esFalso = (v) => v === false || v === 'false';

function tarjeta(p, moneda, estilo) {
  const formato = (v) => (typeof v === 'number' ? `${moneda}${v}` : esc(v));
  const precio = formato(p.precio);
  const vendido = esVerdadero(p.vendido);
  const clase = vendido ? 'tarjeta vendido' : 'tarjeta';
  const original = p.precioOriginal
    ? `<s class="tarjeta__original" title="Precio original">${formato(p.precioOriginal)}</s>`
    : '';
  const sello = vendido
    ? '<span class="sello-vendido"><strong>Sold out</strong><small>Agotado</small></span>'
    : '';
  const imagen = `
    ${original}
    <div class="tarjeta__foto">
      <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy"
           onerror="this.parentNode.classList.add('sin-foto')">
      <span class="tarjeta__respaldo">${esc(p.nombre)}</span>
      ${sello}
    </div>
    <div class="tarjeta__nombre">${esc(p.nombre)}</div>`;

  if (estilo === 'rosa') {
    return `
      <article class="${clase}">
        ${imagen}
        <div class="tarjeta__info">
          <p class="tarjeta__desc">${esc(p.descripcion)}</p>
          <p class="tarjeta__precio"><span>Precio:</span> ${precio}</p>
        </div>
      </article>`;
  }

  return `
    <article class="${clase}">
      ${imagen}
      <p class="tarjeta__desc">${esc(p.descripcion)}</p>
      <p class="tarjeta__precio">Precio: ${precio}</p>
    </article>`;
}

function seccion(s, moneda) {
  const estilo = s.estilo === 'rosa' ? 'rosa' : 'oscuro';
  const seccionId = s.estilo === 'rosa' ? 'coleccion-dama' : 'coleccion-caballero';
  const productos = (s.productos || []).filter((p) => !esFalso(p.aparece) && !esVerdadero(p.oculto));
  return `
    <section class="pagina ${estilo}" id="${seccionId}">
      ${DECORACION[estilo]()}
      <h2 class="titulo">${esc(s.titulo || 'Perfumes')}</h2>
      <div class="rejilla">
        ${productos.map((p) => tarjeta(p, moneda, estilo)).join('')}
      </div>
    </section>`;
}

function preguntas(lista) {
  if (!lista || !lista.length) return '';
  return `
    <section class="pagina oscuro faq" id="faq">
      ${usar('lineas', 'lineas lineas-sup')}
      ${usar('lineas', 'lineas lineas-inf')}
      <h2 class="faq__titulo">Preguntas frecuentes</h2>
      ${lista.map((q) => `
        <div class="faq__item">
          <h3>${esc(q.pregunta)}</h3>
          <p>${esc(q.respuesta)}</p>
        </div>`).join('')}
      <img class="faq__logo" src="img/logo.png" alt="JW" loading="lazy">
    </section>`;
}

// Fondo interactivo con movimiento (Canvas de partículas doradas en suspensión)
function inicializarFondoPortada() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const header = canvas.closest('.portada') || canvas.parentElement;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let ancho = 0;
  let alto = 0;

  function redimensionar() {
    const rect = header.getBoundingClientRect();
    ancho = canvas.width = rect.width * dpr;
    alto = canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  redimensionar();
  window.addEventListener('resize', redimensionar);

  const totalParticulas = window.innerWidth < 768 ? 32 : 64;
  const particulas = [];
  const mouse = { x: -1000, y: -1000, activo: false };

  window.addEventListener('mousemove', (e) => {
    const rect = header.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.activo = e.clientY <= rect.bottom && e.clientY >= rect.top;
  });

  const paletaDorada = [
    { r: 243, g: 200, b: 67 },   // Oro clásico
    { r: 255, g: 224, b: 114 },  // Oro brillante
    { r: 255, g: 245, b: 215 },  // Champaña
    { r: 217, g: 181, b: 75 }    // Oro profundo
  ];

  class Particula {
    constructor() {
      this.reset(true);
    }
    reset(aleatorio = false) {
      const w = ancho / dpr;
      const h = alto / dpr;
      this.x = Math.random() * w;
      this.y = aleatorio ? Math.random() * h : h + 10;
      this.radio = Math.random() * 2.2 + 0.8;
      this.velY = -(Math.random() * 0.4 + 0.2);
      this.velX = (Math.random() - 0.5) * 0.2;
      this.fase = Math.random() * Math.PI * 2;
      this.velFase = Math.random() * 0.02 + 0.008;
      this.amplitud = Math.random() * 0.7 + 0.3;
      this.alfaBase = Math.random() * 0.45 + 0.2;
      this.pulso = Math.random() * Math.PI * 2;
      this.velPulso = Math.random() * 0.03 + 0.01;
      this.color = paletaDorada[Math.floor(Math.random() * paletaDorada.length)];
    }
    actualizar() {
      const w = ancho / dpr;
      this.fase += this.velFase;
      this.pulso += this.velPulso;
      this.y += this.velY;
      this.x += Math.sin(this.fase) * this.amplitud + this.velX;

      if (mouse.activo) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100 && dist > 0) {
          const f = (100 - dist) / 100;
          this.x += (dx / dist) * f * 1.5;
          this.y += (dy / dist) * f * 1.5;
        }
      }

      if (this.y < -15 || this.x < -20 || this.x > w + 20) {
        this.reset(false);
      }
    }
    dibujar(contexto) {
      const alfa = Math.max(0.08, this.alfaBase + Math.sin(this.pulso) * 0.18);
      contexto.beginPath();
      contexto.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
      contexto.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alfa})`;
      contexto.shadowBlur = this.radio > 1.8 ? 6 : 2;
      contexto.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alfa * 0.7})`;
      contexto.fill();
    }
  }

  for (let i = 0; i < totalParticulas; i++) {
    particulas.push(new Particula());
  }

  let animId;
  function animar() {
    const w = ancho / dpr;
    const h = alto / dpr;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particulas.length; i++) {
      particulas[i].actualizar();
      particulas[i].dibujar(ctx);
    }
    animId = requestAnimationFrame(animar);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animId = requestAnimationFrame(animar);
  });

  animar();
}

// Carga del catálogo desde productos.json
fetch(ARCHIVO_DATOS, { cache: 'no-store' })
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((datos) => {
    const moneda = datos.moneda ?? '$';
    catalogo.innerHTML =
      (datos.secciones || []).map((s) => seccion(s, moneda)).join('') +
      preguntas(datos.preguntas);
    inicializarFondoPortada();
  })
  .catch((err) => {
    console.error(err);
    catalogo.innerHTML = `
      <section class="pagina oscuro aviso">
        <p>No se pudo cargar <strong>productos.json</strong>.</p>
        <p>Revisa que el archivo no tenga errores (comas, comillas) y que la página
        se abra desde un servidor web, no con doble clic.</p>
      </section>`;
    inicializarFondoPortada();
  });
