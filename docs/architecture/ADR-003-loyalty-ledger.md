# ADR-003 — Ledger de fidélité

Statut : accepté pour la Phase 5, non implémenté en Phase 1

## Décision

Les stamps seront représentés par des événements immuables et idempotents. Le solde sera dérivé ou matérialisé de façon transactionnelle ; aucune valeur mutable de type `user.stamps` ne sera la source de vérité.

## Conséquences

Les corrections deviennent de nouveaux événements auditables. Les doubles scans, replays et courses doivent être couverts par clés d’idempotence et tests concurrents.
