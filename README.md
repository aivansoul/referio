# Referio

Referio est une plateforme SaaS belge francophone de visibilité locale, réputation et fidélité pour les commerces indépendants.

Ce dépôt contient actuellement les phases 0 et 1 : architecture, modèle multi-tenant, schéma Convex initial, identité, organisations, RBAC, vérification d’e-mail, réinitialisation de mot de passe, audit et primitives de sécurité.

## Démarrage

```bash
npm install
npm run typecheck
npm run test
npm run lint
```

Pour connecter un déploiement Convex :

```bash
npm run convex:dev
```

## Documentation

- `docs/product/FEATURES.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/database/SCHEMA.md`
- `docs/security/THREAT_MODEL.md`
- `docs/api/PHASE-1-FUNCTIONS.md`

## État

Les adaptateurs de production pour l’authentification, le hashage de mots de passe et l’e-mail transactionnel doivent être configurés avant toute mise en production. La Phase 2 ajoutera l’onboarding professionnel par numéro de TVA belge et le claim d’entreprise.
