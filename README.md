ESIR2 - DevOps -Cloud Native and Microservices
Ethan GAUTHIER & Roland KOFFI & Kechiedou MEDA

Schéma de notre architecture microservices


Pour utiliser l’application, il suffit d’utiliser la commande docker compose
sur le fichier prod ou dev afin de lancer l’application en mode production ou en
mode développement.
Comme énoncé plus haut, il faudra également lancer quarkus
manuellement afin que celui-ci puisse être utilisé.
Ensuite, il suffit de se rendre sur http://localhost pour pouvoir accéder au
site. Le site sera distribué par Nginx en production et par Angular en
développement.
Chaque donnée sera affichée suite à un appel au backend NestJS qui
lui-même communique avec la base de données PostgreSQL.
Pour lancer une notification, il faut être connecté, puis aller sur le détail
d’une association de laquelle on est président et cliquer sur le bouton Envoyer
Notification. Une requête sera alors envoyée au backend qui traitera la notification
avant de la mettre dans la file RabbitMQ, puis Quarkus videra la file RabbitMQ, et
affichera la notification dans la console.

