# Intégration SCORM 2004 dans une application React

Ce projet montre comment intégrer SCORM 2004 dans une application React. SCORM (Sharable Content Object Reference Model) est un ensemble de standards qui permet de partager et de réutiliser des contenus e-learning à travers différents systèmes. Ce guide explique chaque fonction, son utilité, et comment utiliser le module pour interagir avec un Learning Management System (LMS) compatible avec SCORM 2004.

## Démarrage

### Aperçu des fonctions SCORM

L'objet `Scorm` de ce projet fournit plusieurs fonctions essentielles pour interagir avec un LMS compatible SCORM 2004. Voici une explication détaillée de chaque fonction.

- **init()** --> Initialise la communication avec le LMS. Cette fonction doit être appelée lors du chargement du cours pour établir une connexion avec le LMS.

- **getLearnerName()** --> Récupère le nom de l'apprenant à partir du LMS.

- **submitMCQ(correct, response)** --> Enregistre la réponse de l'apprenant pour une question à choix multiple (MCQ). Cette fonction crée une nouvelle interaction dans le SCORM pour suivre la réponse et si elle est correcte ou incorrecte.

- **setScormData(key, value)** --> Définit une valeur spécifique dans le SCORM. Utilisé pour enregistrer diverses informations comme le score, le statut de progression, etc.

- **setSuspendData(data)** --> Sauvegarde les données dans le SCORM, permettant à l'apprenant de reprendre la session là où elle a été interrompue.

- **getSuspendData()** --> Récupère les données sauvegardées pour restaurer l'état de progression de l'apprenant.

- **setProgress(progress)** --> Définit la mesure de progression de l'apprenant. Utilisé pour indiquer le pourcentage de progression dans le cours.

- **setScore(score, maxScore = 100, minScore = 0, scaledScore = null)** --> Définit le score de l'apprenant. Vous pouvez spécifier le score brut (`raw`), le score maximum (`max`), et le score minimum (`min`). Un score `scaled` peut également être défini pour représenter un pourcentage (entre 0 et 1).

- **setCompletionStatus(status)** --> Définit le statut de complétion du cours. Les statuts possibles sont `"completed"`, `"incomplete"`, etc.

- **setSuccessStatus(status)** --> Définit le statut de réussite de l'apprenant. Les statuts possibles sont `"passed"`, `"failed"`, etc.

- **setObjectiveCompletion(identifier, status)** --> Définit le statut de complétion pour un objectif spécifique dans le cours.

- **completeAndCloseCourse()** --> Sauvegarde les données et ferme la communication avec le LMS. Cette fonction doit être appelée lorsque le cours est terminé pour s'assurer que toutes les données sont correctement sauvegardées.

## Création et empaquetage du cours

- **Préparer les fichiers SCORM :** Incluez le fichier `imsmanifest.xml` et autres fichiers SCORM dans le répertoire `build`.

- **Compiler le projet :** Exécutez la commande pour compiler le projet React :

```bash
  npm run build
```

- **Créer le fichier .zip :** Accédez au répertoire build et compressez le contenu en un fichier .zip :

```bash
 cd build
 zip -r ../course-package.zip
```

- Assurez-vous que le fichier imsmanifest.xml est à la racine du fichier .zip.

- Télécharger sur le LMS : Téléchargez le fichier .zip sur le LMS pour déployer le cours.
