# [Openclassrooms Project 6] API Sauces

Ceci est le backend pour le site web HotTakes réalisé avec NodeJS, Express & MongoDB

## Installation

1. Assurez vous que [Node.js](https://nodejs.org/en) et npm soient installés sur votre système.

2. Clonez le repo à partir de GitHub en utilisant la commande suivante

```bash
git clone https://github.com/GuillaumeBrx/HotTakes.git
```

3. Accédez au répertoire cloné

```bash
cd HotTakes/
```

4. Installez les dépendances

```bash
npm install
```

5. Configurez votre environnement en créant un fichier .env à la racine de votre projet avec les variables suivantes :

```bash
DB_USER=VotreUsernameMongoDB
DB_PASSWORD=VotrePasswordMongoDB
JWT_KEY=RANDOM_TOKEN_SECRET
```

6. Démarrer le serveur

```bash
node server
```

## Usage

Le serveur est accessible à l'adresse suivante : http://localhost:3000

**Vous pouvez utiliser les API suivantes :**

POST /api/auth/signup : inscription d'un nouvel utilisateur.

POST /api/auth/login : connexion d'un utilisateur existant.

POST /api/sauces : création d'une nouvelle sauce.

POST /api/sauces/:id/like : ajout d'un like ou d'un dislike à une sauce.

PUT /api/sauces/:id : modification d'une sauce existante.

DELETE /api/sauces/:id : suppression d'une sauce existante.

GET /api/sauces/:id : récupération d'une sauce spécifique.

GET /api/sauces : récupération de toutes les sauces.
