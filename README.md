# GamesApp

GamesApp es una app móvil hecha con Ionic y Angular para registrar y consultar información de videojuegos.

## Qué hace la app

- Permite iniciar sesión y crear una cuenta.
- Muestra un listado de registros guardados en tarjetas.
- Permite agregar nuevos registros desde un formulario dividido por pasos.
- Busca videojuegos free to play desde una API y completa datos como plataforma, género y comentario.
- Permite tomar una foto o subir una imagen del lugar.
- Permite obtener la ubicación del dispositivo.
- Muestra los datos guardados con paginación para evitar un scroll infinito.
- Incluye cierre de sesión desde la pantalla principal.

## Flujo principal

1. El usuario inicia sesión.
2. Entra a la pantalla principal de videojuegos.
3. Puede revisar los registros guardados.
4. Puede abrir el formulario para crear un nuevo registro.
5. Al guardar, el registro vuelve a aparecer en las tarjetas.

## Tecnología usada

- Angular
- Ionic
- Capacitor
- Supabase
- FreeToGame API
