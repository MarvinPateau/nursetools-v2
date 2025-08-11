# NurseTools v2

Outil léger pour infirmières et infirmiers : calculs, repères et maintenant un widget météo sympathique.

## Configuration

1. Copier `.env.example` en `.env.local` et y renseigner votre clé [WeatherAPI](https://www.weatherapi.com/).

```
cp .env.example .env.local
# éditer le fichier et ajouter
VITE_WEATHER_API_KEY=votre_cle
```

2. Démarrer le serveur de dev :

```
npm install
npm run dev
```

### Déploiement Vercel

Dans Vercel, ajouter la variable d’environnement `VITE_WEATHER_API_KEY` dans *Project Settings → Environment Variables* puis redéployer.

## Tests

```
npm run lint
npm run build
```
