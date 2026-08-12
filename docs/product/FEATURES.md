# Referio — cadrage produit

## Portée de cette livraison

Cette première livraison couvre uniquement les fondations nécessaires aux phases suivantes : identité, organisations, memberships, RBAC, vérification d’e-mail, réinitialisation de mot de passe, audit et primitives de sécurité. Elle ne contient aucun dashboard SEO, Passeport Local, stamp, récompense ou assistant IA.

## Acteurs et contextes

- `professional` : agit au travers d’une ou plusieurs organisations et de leurs établissements.
- `customer` : futur utilisateur du Passeport Local. Le même compte d’identité pourra recevoir plusieurs contextes sans second système d’authentification.
- `platform_admin` : rôle de plateforme séparé des rôles d’organisation et réservé aux opérations Referio auditées.

## Capacités Phase 1

1. Créer un compte avec un e-mail normalisé et unique.
2. Vérifier l’e-mail avec un jeton opaque à durée limitée dont seul le hash est stocké.
3. Authentifier un compte sans révéler si un e-mail existe.
4. Créer et révoquer des sessions, y compris une déconnexion globale.
5. Demander et consommer une réinitialisation de mot de passe à usage unique.
6. Créer une organisation et y rattacher des utilisateurs par membership.
7. Autoriser chaque action côté serveur à partir du membership et des permissions.
8. Journaliser les événements de sécurité et les mutations sensibles.
9. Appliquer des limites distinctes aux opérations exposées aux abus.

## Hors portée explicite

- Le branchement d’un fournisseur d’e-mail transactionnel.
- L’authentification sociale et les passkeys.
- La recherche BCE/TVA et le workflow de claim, prévus en Phase 2.
- Les écrans produit au-delà des surfaces existantes dans le workspace.
- Les données synthétiques en production.

## Critères d’acceptation Phase 1

- Isolation multi-tenant imposée par les fonctions backend.
- Permissions refusées par défaut et testées.
- Jetons de vérification/reset aléatoires, hashés, expirables, révocables et non réutilisables.
- Réponse de reset identique pour un compte existant ou absent.
- Événements d’audit structurés sans secrets.
- Domaines indépendants de Convex afin de rester testables et extractibles.

## Enchaînement Phase 2

Le parcours professionnel réutilisera l’identité et le tenant : saisie TVA, lookup via `BelgianBusinessRegistryProvider`, confirmation, création atomique de l’organisation/business/location, puis claim en `pending`. Les capacités sensibles resteront bloquées jusqu’à validation du claim.
