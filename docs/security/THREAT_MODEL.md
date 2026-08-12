# Modèle de menaces — fondations

## Actifs

Comptes, credentials, sessions, memberships, permissions, jetons de vérification/reset, données d’organisation, secrets d’intégration futurs et audit.

## Frontières de confiance

- Navigateur : toujours non fiable.
- Fonctions backend : point unique de validation, authentification et autorisation.
- Base Convex : stockage de hashes et métadonnées minimisées, jamais de token brut.
- Fournisseurs externes : ports isolés, secrets côté serveur uniquement.

## Menaces et contrôles

| Menace | Contrôles Phase 1 |
|---|---|
| Énumération de comptes | Réponses publiques identiques, temps de traitement rapproché |
| Credential stuffing | Limites IP + e-mail hashé, backoff et lockout progressif |
| Vol de token | Token aléatoire 256 bits, hash en base, TTL court, usage unique |
| Rejeu reset/vérification | Consommation atomique, invalidation des autres tokens |
| IDOR / fuite tenant | Résolution du membership et permission dans chaque fonction |
| Escalade de rôle | Matrice centralisée, refus par défaut, audit des changements |
| Session fixation | Rotation après authentification et changement de privilège |
| Fuite par logs | Redaction récursive des clés sensibles, identifiants corrélables minimaux |
| CSRF | Cookies SameSite, validation Origin et jeton CSRF pour mutations cookie-auth |
| XSS | Encodage par défaut, CSP, contenu riche interdit en Phase 1 |
| Abus distribué | Buckets distincts par action, IP et identifiant pseudonymisé |
| Suppression de preuve | Audit append-only et rétention séparée |

## Données à ne jamais journaliser

Mot de passe, hash de mot de passe, token brut ou hash de token, cookie, Authorization, secret API, contenu de carte et payload OAuth.

## Risques résiduels

- Le choix et la configuration du fournisseur d’authentification public restent à finaliser.
- La protection DDoS globale dépendra de l’hébergeur en plus des limites applicatives.
- Le chiffrement applicatif des secrets d’intégration sera ajouté avec les intégrations.
- Les politiques de conservation RGPD doivent être validées juridiquement avant production.
