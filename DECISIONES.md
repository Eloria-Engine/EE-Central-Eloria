# DECISIONES — EE-Central-Eloria

> Registro de decisiones arquitecturales y técnicas del proyecto.
> Formato ADR simplificado: contexto → decisión → consecuencias.

---

## D-001 — Next.js 15 como framework

**Fecha:** 2026-03 (creación del proyecto)
**Contexto:** Hub central del ecosistema Eloria — necesita SSR, buena performance y consistencia con los demás proyectos del motor.
**Decisión:** Next.js 15 con App Router + TypeScript.
**Consecuencias:**
- Consistente con Dashboard, Studio y Monte Sion (todos Next.js)
- App Router permite Server Components → carga más rápida sin JS innecesario en cliente
- Deploy vía Dockerfile con `output: 'standalone'` — imagen compacta y compatible con Coolify

---

## D-002 — Output standalone para Docker

**Fecha:** 2026-03
**Contexto:** Deploy en Coolify sobre VPS Hostinger (77.37.122.191). Necesita imagen Docker pequeña y autónoma.
**Decisión:** `output: 'standalone'` en `next.config.js`. HOSTNAME configurado como `"::"` para dual-stack IPv4+IPv6.
**Consecuencias:**
- Imagen Docker ~50MB vs ~500MB sin standalone
- Sin dependencia de `node_modules` externos en runtime
- HOSTNAME `"::"` resuelve el problema de Alpine Linux donde `localhost` mapea a `::1` (IPv6) antes que `127.0.0.1`

---

## D-003 — Dominio central.eloria.paris

**Fecha:** 2026-03
**Contexto:** El hub central necesita una URL estable para ser el punto de entrada del ecosistema.
**Decisión:** `central.eloria.paris` — subdominio de `eloria.paris` (Gandi DNS).
**Consecuencias:**
- DNS gestionado en Gandi con registro A → VPS IP
- SSL automático vía Coolify + Let's Encrypt
- Acceso público sin autenticación — solo muestra links a productos activos

---

## D-004 — Tailwind CSS para estilos

**Fecha:** 2026-03
**Contexto:** Necesita consistencia visual con el resto del ecosistema.
**Decisión:** Tailwind CSS 3.x — mismo stack que Dashboard y Studio.
**Consecuencias:**
- No se usa CSS-in-JS ni módulos CSS propios
- Configuración en `tailwind.config.ts` con extensiones de colores del ecosistema

---

## D-005 — Sin autenticación en hub central

**Fecha:** 2026-03
**Contexto:** El hub solo muestra el estado y links de productos — no maneja datos sensibles.
**Decisión:** Página pública sin auth. No se implementa login.
**Consecuencias:**
- Sin surface de ataque de autenticación
- Si en el futuro se añaden métricas sensibles, se deberá añadir auth antes de exponer
