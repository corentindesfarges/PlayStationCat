# PlayStation Cat

Jouer avec votre chat à distance en vous équipant d'un Raspberry PI et d'un laser.

## Comment lancer l'application

Cet équipement utlise python, un langage de programmation, pour faire fonctionner les différents membres du jouet.

### Par lancement du fichier python

Exécutez la commande suivante dans le répertoire `python` :

	sudo python server.py start

### Par l'intermédiaire du software développé en C

```C
gcc main.c -lpthread
```
Compilez le fichier main.c dans le répertoire `C` et exécutez-le.  
Sélectionnez le menu "Launch Application Server".


# Pour les développeurs

## Utiliser grunt pour le déploiement

- Si besoin, installer le client grunt (avec les droits d'administration sur Windows)


	sudo apt-get install nodejs-legacy
	
	npm install -g grunt-cli


- Installer les différentes dépendances npm grâce à la commande suivante:


	npm install

- Créer un fichier .ftppass et secret.json et renseignez les identifiants (S)FTP comme ceci:


	.ftppass  
	{  
	  "key1": {  
	    "username": "XXX",  
	    "password": "YYY"  
	  },  
	  "key2": {  
	    "username": "XXX",  
	    "password": "YYY"  
	  }  
	}  

	secret.json  
	{  
	  "toy" : {  
		"host": "XX",  
		"port": "YY"
	  },  
	  "cam" : {  
        "host": "XX",  
		"port": "YY"  
	  }  
	}  


- Exécuter la commande suivante


	grunt
