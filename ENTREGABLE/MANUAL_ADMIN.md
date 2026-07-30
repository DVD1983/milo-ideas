# Milo Ideas — Manual del Panel de Administración

## Acceso

1. Abrí `https://miloideas.com/admin`
2. Usuario: `admin`
3. Contraseña: `milo2026`

> ⚠ Cambiá la contraseña apenas puedas desde el panel o pidiéndome que la actualice en el código.

---

## 1. Panel Principal (Dashboard)

Al iniciar sesión ves un resumen con:
- **Productos**: cantidad total
- **Categorías**: cantidad de categorías
- **Carrusel**: slides activos

---

## 2. Categorías

Desde **Categorías** podés:

### Crear una categoría
- **Nombre**: ej. "Ropa para Mascotas"
- **Slug**: identificador único en la URL (ej. `ropa`). Sin espacios ni mayúsculas.
- **Descripción**: texto que se muestra en la tarjeta del catálogo
- **Imagen**: URL de la imagen (ej. `/images/ropa1.jpeg`). Si usás el admin de fotos, subila primero y copiá la URL.

### Editar
Hacé clic en "Editar" en cualquier categoría para modificar sus datos.

### Eliminar
Eliminá una categoría (se desvincularán los productos que la tengan asignada).

---

## 3. Productos

### Agregar producto
- **Nombre**: nombre del producto
- **Slug**: para la URL (ej. `remera-perro-xl`)
- **Descripción**: texto detallado
- **Categoría**: seleccioná a qué categoría pertenece
- **Imagen**: URL de la foto
- **Precio**: visible solo en el admin (en la web se consulta por WhatsApp)
- **Stock**: cantidad disponible (0 = "Consultar disponibilidad")
- **Specs**: campo JSON para datos técnicos. Ejemplo:
  ```json
  [
    { "label": "Talle", "value": "XL" },
    { "label": "Color", "value": "Negro" },
    { "label": "Material", "value": "Algodón" }
  ]
  ```

### Subir fotos
Desde el admin de productos:
1. Andá a la solapa **Subir foto**
2. Seleccioná el archivo
3. Se va a subir a Supabase y te va a devolver la URL
4. Copiala y pegala en el campo "Imagen" del producto

> Las imágenes se optimizan automáticamente al subirse.

### Productos sin stock
Si un producto tiene `stock = 0`, en la web aparece como "Consultar disponibilidad" en vez del precio.

---

## 4. Carrusel (Galería)

Las slides se muestran en la sección Galería de la página principal.

### Agregar slide
- **Título**: texto principal (dorado)
- **Subtítulo**: texto secundario (blanco)
- **Imagen**: URL de la imagen
- **Orden**: número que indica la posición (1, 2, 3…)

### Reordenar
Cambiando el campo "Orden" podés acomodar las slides.

---

## 5. Subir Archivos

Desde cualquier parte del admin hay un botón o sección para **subir imágenes**:

1. Seleccioná el archivo desde tu computadora
2. Se sube automáticamente a Supabase Storage
3. La URL generada se copia al portapapeles o se inserta en el campo correspondiente

Formatos aceptados: JPG, PNG, WebP
Tamaño máximo: 5 MB por archivo

---

## 6. Cómo se ve cada cosa en la web

| Sección | Origen |
|---------|--------|
| Hero (portada) | Imagen fija `image_background.jpg` / `cartera2.jpeg` (mobile) |
| Nosotros | Texto fijo en About.astro |
| Catálogo | Categorías + Productos desde el admin |
| Galería | Slides del carrusel desde el admin |
| Contacto | Texto fijo, WhatsApp e Instagram desde Contact.astro |

---

## 7. Precios y WhatsApp

- Los precios **no se muestran** en la web pública
- Todos los botones de producto dicen "Consultar" y abren WhatsApp
- El número de WhatsApp es: `+5491131628169`

---

## 8. Preguntas frecuentes

### ¿Cómo cambio el logo?
El logo está en `public/images/` → reemplazá el archivo y avisame para actualizar las rutas si es necesario. Se puede hacer directo desde el admin de archivos si lo configuramos.

### ¿Cómo agrego más productos?
Desde Admin → Productos → Agregar producto. Completá todos los campos.

### ¿Cómo elimino un producto que ya no vendo?
Desde Admin → Productos → Editar → Eliminar.

### ¿Puedo tener más de 3 categorías?
Sí, las que quieras. Se muestran como tarjetas en el catálogo.

---

## Contacto Técnico

Si necesitás cambios en el diseño, funcionalidades nuevas o asistencia, contactame y lo resolvemos.
