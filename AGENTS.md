## AGENTS.md

### Skills Obligatorias Segun La Tarea

- Usa `$brand-system` para identidad visual, tono premium, art direction y cohesion de producto.
- Usa `$copy-positioning` para headline, CTA, pricing language y valor comercial.
- Usa `$landing-page-director` para marketing site, pricing, launch pages y secciones de conversion.
- Usa `$dashboard-director` para overview, billing, history, create-video y superficies densas.
- Usa `$app-shell-architect` para shell del producto, navegacion, sidebar, header y estructura entre marketing y dashboard.
- Usa `$design-system-builder` para tokens, componentes base, theming y consistencia visual de la UI.
- Usa `$design-critic` para pulido visual y segunda pasada de calidad.
- Usa `$conversion-critic` para revisar persuasion, pricing y friccion comercial.
- Usa `$master-frontend` para marketing, dashboard shell, componentes, responsive, motion, theming y polish visual.
- Usa `$master-backend` para auth, server actions, route handlers, repositorios, Supabase, Stripe, storage, jobs y seguridad.
- Usa `$master-fullstack` cuando el cambio cruce UI, validacion, servicios, contratos, billing o datos persistidos.
- `$master-frontend` y `$master-fullstack` implican UI totalmente responsive como baseline obligatorio: mobile-first, sin overflow horizontal, con `max-width: 100%` donde haga falta, grids responsive, top navbar fija en mobile si existe navegacion superior, sidebar solo en desktop si existe navegacion lateral y cards apiladas verticalmente en mobile.

### Routing Recomendado

- Usa `$brand-system` + `$copy-positioning` + `$landing-page-director` antes de `$master-frontend` para el marketing site o pricing.
- Usa `$dashboard-director` + `$app-shell-architect` + `$design-system-builder` antes de `$master-frontend` para dashboard, billing, history y create-video.
- Usa `$master-fullstack` para auth, billing, create-video, credit enforcement, admin pages y cualquier flujo que conecte UI, contratos y servicios.
- Usa `$design-critic` despues de cambios visuales importantes y `$conversion-critic` para pricing o conversion-heavy pages.

### Orden De Lectura Antes De Cambiar Codigo

1. Leer `docs/contract.md`.
2. Leer `docs/context.md`.
3. Leer `docs/PROJECT_CONTEXT.md` solo como resumen derivado.
4. En cambios UI, usar tambien `README.md` y la estructura real de `src/app`, `src/components`, `src/features`, `src/server` y `src/services`.

### Reglas Especificas De VideoForge AI

- Mantener Firebase-first auth y no romper el fallback controlado cuando faltan env vars.
- Preservar la separacion entre `src/server`, `src/services`, `src/features` y `src/lib/schemas`.
- Mantener la abstraccion mock-first de video providers y no acoplar UI a un proveedor concreto.
- No romper el flujo de billing/credits ni la capa Stripe-ready aunque siga mockeada.
- Mantener la experiencia mobile-first con header fijo en mobile, sidebar solo en desktop, media con `max-width: 100%` y cero overflow horizontal.
- En cambios frontend, preservar el tono premium SaaS y la responsividad completa.
- Usar `docs/AI_ROUTING.md` como mapa rapido de skill stacks por area del producto.

### Validacion Obligatoria

- Ejecutar `npm run typecheck` despues de cambios relevantes.
- Ejecutar `npm run lint` cuando se toquen componentes, rutas o librerias compartidas.
- Ejecutar `npm run build` antes de cerrar cambios importantes o transversales.

### Flujo De Trabajo

- Mantener secretos y claves solo en env vars.
- No hacer commits, push ni deploy salvo que el usuario lo pida explicitamente.
- Si cambian contratos, arquitectura, integraciones o env vars, actualizar la documentacion correspondiente.
