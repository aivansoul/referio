# ADR-002 — Multi-tenancy par organisation

Statut : accepté

## Décision

`Organization` est la racine de tenant. L’accès passe par `Membership`; aucun `businessId` n’est stocké directement comme propriété définitive d’un utilisateur.

## Conséquences

Chaque requête privée résout l’utilisateur, l’organisation et la permission. Les index tenant-first facilitent isolation et performance. Les tests d’isolation sont obligatoires pour chaque nouveau module.
