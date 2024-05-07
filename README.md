ESIR2 - DevOps -Cloud Native and Microservices
Ethan GAUTHIER & Roland KOFFI & Kechiedou MEDA

Schéma de notre architecture microservices
Sur le schéma ci-dessus, nous avons représenté nos services et les ports
qu’ils utilisent pour communiquer entre eux.
On a fait le choix de créer un container par microservice, excepté Firefox
qui représente le navigateur de l’utilisateur, les autres logos représentent un
container chacun. Les containers PostgreSQL et RabbitMQ utilisent des volumes
afin d’avoir des données persistantes.
En production, nous n’avons pas de container pour Angular, en effet, nous
compilons nos fichiers TS en fichier JS à l’aide de npm run build puis nous
récupérons les fichiers dans le dossier dist ainsi créer. C’est ensuite Nginx qui va
se charger de redistribuer les fichiers statiques HTML/CSS et JS, ce qui va
permettre un temps de réponse plus rapide.
Development Vs Production containers
Nous avons décidé de créer des containers différents pour le
développement et pour la mise en production, car nous n’avons pas les mêmes
besoins dans ces deux cas.
Dans le cas du développement, nous avons besoin que dès qu’un
changement est fait sur un fichier, ce changement se répercute dans le container
concerné sans avoir à relancer celui-ci. C’est pourquoi nous avons voulu utiliser le
partage de fichier entre la machine et le container et lancer les applications en
mode développement afin qu’elles se relancent automatiquement dès qu’elles
détectent un changement dans les fichiers.
De plus, en développement, nous pouvons avoir besoin d'accéder à une
application directement depuis un port, c’est pourquoi nous avons fait le choix
d’ouvrir tous les ports, ainsi si, par exemple, nous souhaitons faire des appels au
backend depuis notre navigateur, nous pouvons sur le port 3000.
Dans le cas de la production, nous avons fait le choix de fermer tous les
ports (sauf le 80) car un utilisateur ne doit pas pouvoir accéder au backend
directement depuis le port 3000, mais à travers des requêtes faites sur le front sur
le port 80. Les applications communiquent donc à l’aide de leur nom de
container, par exemple le front peut accéder au back de cette manière:
http://backend:3000.


Notification service
Nous avons implémenté le service de notification. La file RabbitMQ est
contenue dans un container et écoute sur le port 5672.
Nous avons adapté notre backend pour qu’il puisse ajouter un message
dans la file RabbitMQ (voir sendNotification() dans
associations.service.ts) pour ce faire la fonction créer un objet JSON depuis
les données qu’elle récupère, puis elle le transforme en un tableau de bytes
lorsqu'elle l’ajoute dans la file.
Nous avons implémenté Quarkus afin qu’il lise la file RabbitMQ. Dès qu’un
message est ajouté à la file, Quarkus le récupère sous la forme d’un tableau de
bytes et le transforme en JSON puis l’affiche dans la console (voir screenshot
ci-dessous), en effet, nous n’avons pas eu le temps d’implémenter le serveur de
mail, cependant, on peut voir que l’on possède toutes les données nécessaires
pour l’envoi d’un mail (envoyeur, destinataires, message).
Nous avons rencontré des difficultés pour trouver des informations claires
sur comment mettre Quarkus dans un container donc nous avons utilisé Quarkus
en l’exécutant “à la main” avec la commande ./mvnw -f . quarkus:dev.

Load Testing
Nous avons opté pour l'utilisation de K6 pour nos besoins en tests de charge pour
les raisons suivantes :
● K6 utilise JavaScript, un langage que notre équipe connaît bien. Cela facilite
l'écriture et la maintenance des scripts de tests de charge
● K6 fonctionne bien avec Grafana pour la visualisation des résultats. Cette
intégration nous aide à analyser et interpréter efficacement les résultats
des tests de charge.
● K6 est open source et bénéficie d'une communauté de soutien. Cela
signifie des améliorations continues et un accès à des ressources
contribuées par la communauté.
● K6 s'adapte à différentes échelles de tests. Que nous testions avec quelques
utilisateurs virtuels ou un grand nombre, K6 peut simuler la charge sur nos
services backend.
En choisissant K6, nous nous attendons à obtenir des informations précieuses sur
des indicateurs de performance clés tels que le nombre de requêtes échouées, la
latence moyenne et les valeurs de latence extrêmes. Cette décision reflète notre
priorité accordée à l'efficacité, à la flexibilité et à l'efficacité globale de notre
processus de tests de charge.
❖ Utilisation de K6 pour ce projet
1. Test 1
Description :
Nous exécutons un test de charge avec K6 en effectuant 1000 requêtes GET vers
le backend sur http://localhost:3000. Nous ajoutons une pause de 0.5 secondes
entre chaque requête pour simuler un temps de réflexion utilisateur.
Le fichier de test est dans ce répertoire : test-load-k6/script-http-get.js
Résultat (Output) :
4
Explication :
Notre test K6 montre que l'application a bien répondu à une charge de 100
utilisateurs virtuels pendant 30 secondes. Aucune des 11 607 requêtes n'a échoué,
et le temps moyen de traitement des requêtes était d'environ 13.25 ms. En
résumé, l'application a montré une bonne stabilité et réactivité sous cette charge
simulée.
2. Test 2
Description :
On tente 1000 connexions de login avec un payload JSON qui inclut un username
et un mot de passe d'un user qui n'existe pas.
Le fichier de test est dans ce répertoire : test-load-k6/script-http-post.js
Résultat (Output) :
Explication :
Le résultat du test K6 montre que toutes les 9 902 requêtes vers
http://localhost:3000/auth/login ont échoué. Cela peut être dû au fait que
cet user n'existe pas dans la BD. Le temps moyen de traitement des requêtes est
d'approximativement 100.67 ms, avec une variabilité importante. Ce qui implique
que notre back est solide et résiste à un nombre important d'appels.
Application Monitoring, Telemetry or Tracing
...... Nous avons installé Prometheus et effectué quelques tests dessus pour essayer
de comprendre son fonctionnement et comment nous pourrions afficher les
graphiques des requêtes par minute et la durée des requêtes. Cependant, nous
n’avons pas eu le temps de modifier nos applications afin qu’elles envoient les
données à Prometheus donc nous n’avons pas pu implémenter cette
fonctionnalité.

Comment utiliser l’application
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

