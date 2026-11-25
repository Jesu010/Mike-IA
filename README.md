# Mikey AI — Gratis V1

Primera versión web instalable (PWA), preparada para probarse en iPhone y Android una vez publicada en un hosting HTTPS.

## Incluye
- Interfaz responsive con identidad visual Mikey AI.
- Selector visual Personal / Empresarial.
- Chat demostrativo con respuestas locales (NO conectado a un modelo de IA).
- Lista de tareas guardada localmente en el navegador.
- Manifest y service worker para instalación y uso básico sin conexión.

## Limitaciones importantes
- No hay registro de usuarios ni base de datos remota.
- Las tareas quedan guardadas únicamente en el dispositivo/navegador.
- El chat es demostrativo; no es inteligencia artificial real.
- No hay voz, pagos, suscripciones ni sincronización entre dispositivos.
- No se ha probado en todos los navegadores ni publicado en una tienda.

## Publicación gratuita
Subir el contenido de esta carpeta a un repositorio GitHub y habilitar GitHub Pages. Luego abrir la URL HTTPS desde Safari en iPhone y elegir Compartir > Añadir a pantalla de inicio. GitHub Pages y las condiciones de uso gratuito pueden cambiar; revisar los límites vigentes.

## Seguridad
No colocar claves API ni contraseñas dentro de `app.js` o de otros archivos del navegador. La conexión a un proveedor de IA debe hacerse mediante un backend seguro.
