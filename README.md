# OBS Social CTA Overlay

Overlay transparent pour **OBS Studio** (source navigateur) affichant une séquence animée de CTA sociaux :

👍 Like → 💬 Commenter → ↗ Partager → ♥ S'abonner

## Utilisation

1. Dans OBS Studio, ajouter une **Source navigateur**.
2. Pointer vers `stream.html` (live) ou `record.html` (enregistrement).
3. Dimensions recommandées : 1920×1080, fond transparent.

## Configuration

Éditer `CONFIG` dans `cta.js` (durées, boucles, autoplay) ou surcharger via `window.CTA_CONFIG` dans le HTML (ex. délai entre deux boucles différent par page).

## Contrôle à distance

Fonctions exposées sur `window` : `showCTA()`, `hideCTA()`, `nextCTA()`, `restartCTA()`.

## Licence

Usage personnel.