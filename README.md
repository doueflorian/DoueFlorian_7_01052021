# GROUPOMANIA #

## Installation ##

Les dépendances suivantes sont nécessaires au fonctionnement de l'application:
- NodeJS 14.0.
- Vue CLI 4.5.14 & vuex

Clonez ce repo, et dans la console à la racine du projet lancez 

	npm install


## Initialisation de la base de données ##

Connectez vous à votre server MySQL et créez la base de donnée groupomania.

	CREATE DATABASE groupomania;

puis importez le fichier groupomania.sql.

. Depuis la commande line : 

  	use groupomania;

	source groupomania.sql;

. Depuis un terminal : 

	mysql -u root -p groupomania < groupomania.sql

en indiquant bien sûr le chemin qui mène à votre fichier en plus de "groupomania.sql"

Vous trouverez le fichier .env à la racine du dossier backend.
Vous pourrez y renseigner votre mot de passe MYSQL dans la variable MYSQLPW et changer les autres informations si besoin.
	

## Utilisation ##

dans la console à la racine du projet, lancez 

	npm start

pour lancer les serveurs côté "frontend" et "backend".

Votre navigateur devrait automatiquement lancer l'application, sinon ouvrez votre navigateur sur http://localhost:8081/

Utilisez `Ctrl+C` dans le terminal pour stopper les serveurs.

## Informations supplémentaires ##

Un compte administrateur est déjà stocké dans la base de données, vous trouverez ces identifiants dans le fichier admin.txt.
Ce fichier se situe dans le dossier "database"

Ce compte permettra la modification / suppression de n'importe quelle publication.
Afin de créer un nouvel administrateur, créez un utilisateur sur le site, et changez son "user_level" à 1 depuis MYSQL.
