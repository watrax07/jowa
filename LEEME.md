# Catálogo JW (web)

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `productos.json` | **El único archivo que tienes que editar**: nombres, descripciones, precios, imágenes y preguntas frecuentes. |
| `img/` | Aquí van las fotos de los perfumes y el logo. |
| `index.html`, `styles.css`, `app.js` | El diseño de la página. No hace falta tocarlos. |

## Cambiar un precio

En `productos.json`, busca el perfume y cambia el número:

```json
{ "nombre": "Bleu De Chanel", "descripcion": "Eau de Parfum 100ml", "precio": 2200, "precioOriginal": 3600, "imagen": "img/bleu-de-chanel.jpg" }
```

- `"precio"` es tu precio de venta.
- `"precioOriginal"` es el precio de tienda; sale **rojo y tachado** en la esquina de la foto. Si lo borras, ese perfume ya no muestra precio tachado.

Guarda el archivo (o súbelo a tu hosting) y la página ya muestra el precio nuevo.

## Cambiar una imagen

1. Copia la foto nueva a la carpeta `img/` (por ejemplo `img/sauvage.jpg`).
2. En `productos.json`, cambia `"imagen"` por la ruta: `"imagen": "img/sauvage.jpg"`.

Lo ideal es usar fotos cuadradas de al menos 600×600 px.

## Agregar, ocultar o quitar un perfume

- **Agregar:** copia una línea `{ ... }`, pégala debajo y cambia los datos. Separa cada línea de la siguiente con una coma `,` (la última de la lista **no** lleva coma).
- **Marcar como vendido:** pon `"vendido": true`. El perfume se sigue viendo, pero en gris y con un sello rojo **SOLD OUT** en diagonal. Para volver a ponerlo a la venta: `"vendido": false`.
- **Ocultar sin borrar:** pon `"aparece": false` y el perfume ya no sale en el catálogo. Para que vuelva a salir: `"aparece": true`.
- **Quitar:** borra la línea completa.

`"estilo": "oscuro"` es la sección negra con dorado (hombre) y `"estilo": "rosa"` es la sección rosa (mujer).

## Si la página sale vacía o con un aviso

Casi siempre falta o sobra una coma, o hay una comilla `"` sin cerrar en `productos.json`.
Puedes pegar el contenido en https://jsonlint.com para ver dónde está el error.

## Publicarlo

La página lee el JSON, así que **no funciona abriendo `index.html` con doble clic**. Hay que subirla a un hosting.
Cualquier hosting gratuito sirve (Netlify Drop, GitHub Pages, Vercel o Cloudflare Pages): sube la carpeta
`catalogo` completa y comparte el enlace. Cuando cambies un precio, vuelves a subir `productos.json` y listo.

Para verla en tu computadora antes de subirla, ejecuta esto dentro de la carpeta `catalogo`:

```
python -m http.server 5500
```

y abre http://localhost:5500
