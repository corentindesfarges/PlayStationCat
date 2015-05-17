# PlayStation Cat

Jouer avec votre chat à distance en vous équipant d'un Raspberry PI et d'un laser.

## Comment lancer l'application

Cet équipement utlise python, un langage de programmation, pour faire fonctionner les différents membres du jouet.

### Par lancement du fichier python

Exécutez la commande suivante dans le répertoire **python** :

	sudo python server.py start

### Par le software développé en C

Compilez le fichier main.c et exécutez-le.  
Sélectionnez le menu "Launch server".



# Pour les développeurs

## Utiliser grunt pour le déploiement

- Si besoin, installer le client grunt (avec les droits d'administration sur Windows)


	sudo apt-get install nodejs-legacy
	npm install -g grunt-cli


- Installer les différentes dépendances grâce à la commande suivante:


	npm install

- Créer un fichier .ftppass et renseignez les identifiants (S)FTP comme ceci:


	{
		"key1": {
			"username": "usrnme",
			"password": "psswd"
		}
	}

- Exécuter la commande suivante


	grunt
