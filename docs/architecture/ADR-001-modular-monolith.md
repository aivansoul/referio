# ADR-001 — Monolithe modulaire

Statut : accepté

## Décision

Construire Referio comme monolithe modulaire avec frontières explicites et jobs asynchrones. Les règles métier sont indépendantes du runtime Convex.

## Conséquences

Déploiement et transactions restent simples. Les modules peuvent évoluer séparément et être extraits si la charge ou l’organisation le justifie. Les imports croisés non contractuels entre modules sont interdits.
