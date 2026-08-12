# Architecture Referio

## Décision structurante

Referio adopte un monolithe modulaire TypeScript : Convex orchestre les mutations, requêtes et jobs, tandis que les règles métier résident dans des packages sans dépendance au runtime. Cette séparation permet de tester les invariants en mémoire et de déplacer ultérieurement un module vers PostgreSQL ou un worker sans réécrire son domaine.

## Couches

```text
apps/web ou apps/admin
        ↓ commandes validées
convex/{module} — authn, authz, transactions, persistence, jobs
        ↓
packages/domain — invariants et types métier
packages/permissions — rôles et permissions
packages/security — tokens, hashing, redaction, rate limits
packages/validation — parsing des entrées publiques
packages/integrations — ports de fournisseurs externes
```

Le frontend ne reçoit jamais les hashes, secrets, jetons d’intégration ou objets privés complets. Une fonction Convex authentifie l’appelant, résout son membership actif, vérifie la permission et seulement ensuite lit ou modifie les données du tenant.

## Modules Phase 1

- `auth` : comptes, credentials, sessions, vérification et reset.
- `organizations` : organisations, memberships, invitations futures.
- `permissions` : matrice RBAC déterministe, refus par défaut.
- `audit` : journal append-only des mutations sensibles.
- `security` : token opaque, hash, redaction, rate-limit et événements sécurité.

## Frontières transactionnelles

- Création d’organisation : organization + membership owner + audit.
- Consommation d’un token : vérification du hash, de l’expiration et de l’état, puis invalidation dans la même mutation.
- Changement de mot de passe : mise à jour credential + invalidation de tous les tokens reset + option de révocation des sessions + audit.
- Modification de membership : autorisation dans l’organisation cible + mutation + audit.

## Authentification

Le domaine expose des ports (`PasswordHasher`, `EmailSender`, `Clock`, `TokenGenerator`). Le fournisseur d’identité compatible Next.js/Convex sera choisi avant le déploiement public. Les règles Referio ne dépendent pas de ce choix. Aucun mot de passe ou token brut ne transite vers les logs.

## Scalabilité

- Index composés tenant + statut + temps pour éviter les scans.
- Pagination par curseur pour les collections.
- Agrégats matérialisés par jobs pour les futurs analytics.
- Idempotency keys sur les opérations économiques futures.
- Connecteurs et webhooks traités par files/jobs avec retries.

## Arborescence cible

La fondation est ajoutée sans détruire l’application préexistante du workspace. Les futurs écrans Referio iront dans `apps/web` et `apps/admin` lorsque le modèle métier sera validé. Les modules Convex et packages créés ici constituent la source de vérité backend.
