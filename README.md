# Eldoria

Eldoria est un jeu web en HTML, CSS et JavaScript. Pour que le jeu fonctionne correctement, il faut le lancer avec un petit serveur web local sur ton PC au lieu d'ouvrir directement `index.html`.

## Lancer le jeu sous Windows

### 1. Ouvrir un terminal dans le dossier du jeu

Ouvre le dossier `Eldoria`, puis clique dans la barre d'adresse de l'Explorateur Windows, tape `cmd` et appuie sur **Entrée**.

Tu dois être placé dans le dossier qui contient notamment :

- `index.html`
- `style.css`
- le dossier `assets`
- le dossier `pages`

### 2. Démarrer le serveur local

Dans la console, lance :

```bash
py -m http.server 8000
```

Si la commande `py` n'existe pas, essaie :

```bash
python -m http.server 8000
```

Le terminal doit rester ouvert pendant que tu joues.

### 3. Ouvrir le jeu

Dans ton navigateur, ouvre :

```text
http://localhost:8000
```

La page d'accueil d'Eldoria doit alors apparaître.

### 4. Arrêter le serveur

Quand tu as terminé, retourne dans la console et appuie sur :

```text
Ctrl + C
```

## Si Python n'est pas installé

Installe Python 3 depuis le site officiel de Python, puis relance la commande ci-dessus. Pendant l'installation sous Windows, il est conseillé d'activer l'option permettant d'ajouter Python au `PATH`.

## Important

Évite de lancer le jeu en double-cliquant directement sur `index.html` avec une adresse commençant par `file:///`. Certaines ressources du jeu peuvent être bloquées ou mal chargées par le navigateur. Utilise toujours le serveur local et `http://localhost:8000`.

## Structure principale du projet

```text
Eldoria/
|-- index.html
|-- style.css
|-- README.md
|-- arbre-navigation.pdf
|-- assets/
|   |-- backgrounds/
|   |-- characters/
|   |-- css/
|   |-- items/
|   |-- js/
|   `-- sounds/
`-- pages/
    |-- scene01.html
    |-- scene02.html
    |-- scene03.html
    |-- scene04.html
    |-- scene05.html
    |-- scene06.html
    |-- scene07.html
    |-- scene08.html
    |-- scene09.html
    `-- scene10.html
```

Le fichier `arbre-navigation.pdf` présente le parcours général entre les différentes scènes du jeu.

## Principaux probleme rencontré :

```text
Le someil (absent de ma vie)
Les COLLISIONS
Ajout de fonctionalité fun
```