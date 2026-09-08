# 🎓 Recherche Écoles d'Ingénierie IA

Agent IA automatisé pour suivre les portes ouvertes et les dates de concours des écoles d'ingénieurs spécialisées en IA.

## 📋 Écoles suivies

- INSA
- Telecom SudParis
- ENSEA
- IMT Atlantique
- ENSEEIHT
- UTC
- ICAM

## 🔄 Fonctionnement

- **Scraper**: Récupère automatiquement les informations des sites des écoles
- **Fréquence**: Tous les jours à 9h UTC
- **Stockage**: Les données sont sauvegardées en JSON
- **Dashboard**: Affichage en temps réel sur une page web

## 📊 Dashboard

Accédez au dashboard ici: [dashboard.html](dashboard.html)

Le dashboard affiche:
- Les dates de portes ouvertes détectées
- Les dates de concours
- Les liens vers les sites officiels
- Le statut du scraping

## 🚀 Mise à jour manuelle

Pour forcer une mise à jour, allez dans:
1. **Actions** → **Scrape Schools Data**
2. Cliquez sur **Run workflow**

## 📝 Données

Les données scrappées sont stockées dans `schools-data.json`

## ⚙️ Configuration

Modifiez les écoles à scraper dans `scraper.js` dans le tableau `schools`.

---

**Dernière mise à jour**: Check le fichier `schools-data.json` pour voir la date exacte
