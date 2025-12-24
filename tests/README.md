# Tests Suite

## Structure des Tests

### test_cors.py
Tests existants pour la configuration CORS :
- ✅ Vérification des origines autorisées
- ✅ Blocage des origines non autorisées

### test_api.py (NOUVEAU)
Tests pour les endpoints de l'API :
- ✅ Endpoint root `/api/` retourne "Hello World"
- ✅ Healthcheck `/health` retourne le status
- ✅ Création de status check valide
- ✅ Nettoyage des espaces dans client_name
- ✅ Validation : client_name vide rejeté
- ✅ Validation : client_name uniquement espaces rejeté
- ✅ Validation : client_name trop long (>128) rejeté
- ✅ Validation : champ manquant rejeté
- ✅ Récupération de la liste des status checks
- ✅ Limite de 100 éléments dans le store mémoire
- ✅ Ordre chronologique inversé (plus récent en premier)
- ✅ Unicité des IDs générés

### test_database.py (NOUVEAU)
Tests d'intégration pour les opérations base de données :
- ✅ Sauvegarde dans le store mémoire
- ✅ Récupération depuis le store mémoire
- ✅ Sauvegarde dans MongoDB (mocké)
- ✅ Récupération depuis MongoDB (mocké)
- ✅ Headers CORS sur tous les endpoints
- ✅ Status de la base dans healthcheck

## Exécution des Tests

### Prérequis
```bash
pip install -r backend/requirements.txt
```

### Lancer tous les tests
```bash
pytest tests/ -v
```

### Lancer un fichier de test spécifique
```bash
pytest tests/test_api.py -v
pytest tests/test_cors.py -v
pytest tests/test_database.py -v
```

### Avec coverage
```bash
pytest tests/ --cov=backend --cov-report=html
```

## Couverture de Test

### Endpoints Couverts
- ✅ `GET /api/` - root endpoint
- ✅ `POST /api/status` - création status check
- ✅ `GET /api/status` - liste status checks
- ✅ `GET /health` - healthcheck

### Fonctionnalités Testées
- ✅ CORS policy
- ✅ Validation des données entrantes
- ✅ Stockage mémoire avec limite
- ✅ Stockage MongoDB (mocké)
- ✅ Génération d'IDs uniques
- ✅ Gestion des timestamps
- ✅ Ordre chronologique

## Améliorations Futures

Pourrait être ajouté si nécessaire :
- Tests de performance/charge
- Tests de sécurité (injection, XSS)
- Tests end-to-end avec vraie base MongoDB
- Tests de migration de données
- Tests de rollback
