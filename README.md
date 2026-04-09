# EE-Central-Eloria

Hub central del ecosistema Eloria — `central.eloria.paris`

Muestra todos los productos activos del ecosistema con su estado y links directos.

## Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Deploy: Coolify (Docker standalone)

## Desarrollo local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Coolify

1. Crear nueva app en Coolify
2. Source: GitHub repo `Eloria-Engine/EE-Central-Eloria`
3. Build: Dockerfile (ya configurado para standalone)
4. Domain: `central.eloria.paris`
5. Variables de entorno: copiar de `.env.example`

## Heartbeat

```bash
# Actualiza last_heartbeat en el motor Eloria Engine
npm run heartbeat
```

Configurar en Coolify como Scheduled Task: `0 3 * * *`

## Estructura

```
src/
  app/
    page.tsx      ← Hub principal con grid de productos
    layout.tsx
    globals.css
scripts/
  heartbeat.js    ← Cliente heartbeat hacia la Raíz
```
