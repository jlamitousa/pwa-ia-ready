# RAG Admin Console

Console d'administration pour la gestion des métadonnées RAG (Retrieval-Augmented Generation) permettant aux administrateurs de marquer ce qui est trouvable, comparable, vérifiable, synthétisable et recommandable dans leur base de données.

## 🚀 Fonctionnalités

### 7 Écrans de la Console Admin

1. **Catalogue** - Vue d'ensemble des entités avec couverture des intents
2. **Détail d'entité** - Configuration des champs et métadonnées
3. **Rule Builder** - Création et test de règles de vérification
4. **Facettes & Comparaison** - Configuration des filtres et métriques
5. **Recommandation** - Paramétrage des moteurs de recommandation
6. **Permissions & Confidentialité** - Gestion des accès et PII
7. **Export & Validation** - Génération de manifests et validation

### Capacités RAG

- **Trouvable** : Champs indexables et filtrables
- **Comparable** : Métriques de comparaison avec normalisation
- **Vérifiable** : Règles de validation et contraintes
- **Synthétisable** : Champs pour la génération de résumés
- **Recommandable** : Signaux pour les recommandations

## 🛠️ Technologies

- **Frontend** : Next.js 14, React 18, TypeScript
- **Backend** : Supabase (PostgreSQL)
- **UI** : Tailwind CSS, Radix UI
- **Déploiement** : Vercel

## 📦 Installation

### Prérequis

- Node.js 18+
- Compte Supabase
- Compte Vercel

### 1. Cloner le projet

```bash
git clone <repository-url>
cd rag-admin-console
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créer un nouveau projet sur [Supabase](https://supabase.com)
2. Exécuter les migrations SQL dans l'ordre :
   - `supabase/migrations/001_create_rag_schema.sql`
   - `supabase/migrations/002_create_rag_functions.sql`

### 4. Variables d'environnement

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Développement local

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🚀 Déploiement Vercel

### 1. Connexion Vercel

```bash
npm i -g vercel
vercel login
```

### 2. Déploiement

```bash
vercel
```

### 3. Configuration des variables d'environnement

Dans le dashboard Vercel, ajouter les variables d'environnement :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## 📊 Structure de la Base de Données

### Schéma `rag_admin`

- **entity_type** : Types d'entités (person, product, article...)
- **field_catalog** : Catalogue des champs avec métadonnées RAG
- **rules** : Règles de validation et contraintes
- **relations** : Relations entre entités
- **embedding_specs** : Spécifications d'embeddings
- **facets** : Facettes de filtrage
- **comparison_metrics** : Métriques de comparaison
- **recommendation_configs** : Configurations de recommandation
- **permissions** : Permissions par rôle et intent

## 🔧 Utilisation

### 1. Ajouter une entité

1. Aller dans le catalogue
2. Cliquer sur "Ajouter une entité"
3. Remplir les informations de base (nom, table, clé primaire)

### 2. Configurer les champs

1. Sélectionner une entité
2. Aller dans l'onglet "Champs"
3. Configurer chaque champ selon les intents :
   - **Trouvable** : Synonymes, opérations de filtrage
   - **Comparable** : Groupe, unité, normalisateur
   - **Vérifiable** : Règle de validation
   - **Synthétisable** : Poids d'importance
   - **Recommandable** : Poids de recommandation, source d'embedding

### 3. Créer des règles

1. Aller dans "Rule Builder"
2. Définir le type de règle (compatibility, constraint, business)
3. Écrire la règle SQL/DSL
4. Tester avec des variables

### 4. Exporter le manifest

1. Aller dans "Export & Validation"
2. Cliquer sur "Générer le manifest"
3. Télécharger le fichier JSON/YAML

## 📈 Métriques et Validation

### Couverture des Intents

- **Trouvable** : % de champs indexables
- **Comparable** : % de champs comparables
- **Vérifiable** : % de champs avec règles
- **Synthétisable** : % de champs pour résumés
- **Recommandable** : % de champs pour recommandations

### Validation du Schéma

- Vérification de l'intégrité des données
- Détection des règles orphelines
- Avertissements de couverture faible
- Validation des relations circulaires

## 🔐 Sécurité

- Authentification Supabase
- Gestion des rôles et permissions
- Masquage des données PII
- Validation côté serveur

## 📝 API

### Endpoints principaux

- `GET /api/entities` - Liste des entités
- `POST /api/entities` - Créer une entité
- `GET /api/entities/[entityType]` - Détails d'une entité
- `GET /api/coverage` - Couverture des intents
- `GET /api/validation` - Validation du schéma
- `GET /api/export` - Export du manifest

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les issues GitHub
3. Créer une nouvelle issue si nécessaire

---

**Version** : 1.0.0  
**Dernière mise à jour** : $(date)
