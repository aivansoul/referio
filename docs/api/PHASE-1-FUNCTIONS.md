# Fonctions backend Phase 1

Ces commandes forment le contrat applicatif à exposer par les mutations/actions Convex après génération du client du projet :

- `auth.signup({email,password,accountKind,requestId})`
- `auth.verifyEmail({token,requestId})`
- `auth.login({email,password,requestId})`
- `auth.logout({sessionId,requestId})`
- `auth.logoutAll({requestId})`
- `auth.forgotPassword({email})` — réponse publique constante
- `auth.resetPassword({token,password,revokeSessions,requestId})`
- `organizations.create({name,requestId})` — crée aussi le membership owner et l’audit
- `organizations.listMine({cursor})`
- `memberships.list({organizationId,cursor})`
- `memberships.invite({organizationId,email,role,requestId})`
- `memberships.changeRole({organizationId,membershipId,role,requestId})`
- `memberships.remove({organizationId,membershipId,requestId})`
- `sessions.listMine({cursor})`
- `sessions.revoke({sessionId,requestId})`
- `audit.list({organizationId,cursor})` — permission et pagination obligatoires

Le service de domaine `FoundationService` implémente les workflows signup, vérification, demande et consommation de reset. Les adaptateurs Convex doivent conserver les frontières transactionnelles documentées et ne jamais accepter un `userId` fourni par le navigateur comme identité de l’appelant.
