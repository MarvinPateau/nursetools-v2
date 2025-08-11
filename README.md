# NurseTools v2

Outil infirmier moderne construit avec React, TypeScript et Vite.

## Configuration de la météo

Le module météo nécessite une clé [WeatherAPI](https://www.weatherapi.com/).

1. Copier le fichier `.env.example` en `.env.local`.
2. Renseigner la variable `VITE_WEATHER_API_KEY` avec votre clé WeatherAPI.

### Déploiement sur Vercel

Dans les paramètres du projet Vercel : **Settings → Environment Variables**, ajouter `VITE_WEATHER_API_KEY` (scope « Production et Preview ») puis redéployer.

## Scripts

Développement local :

```bash
npm run dev
```

Lint :

```bash
npm run lint
```

Build de production :

```bash
npm run build
```
