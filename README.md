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

DockerFile Back :

FROM node:18-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]




DockerFile Front : 

Stage 1: Compile and Build angular codebase

 Use official node image as the base image
FROM node:18-alpine as build

 Set the working directory
WORKDIR /usr/local/app

 Add the source code to app
COPY ./ /usr/local/app/

 Install all the dependencies
RUN npm install

 Generate the build of the application
RUN npm run build --prod


 Stage 2: Serve app with nginx server

 Use official nginx image as the base image
FROM nginx:latest

 Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/fr-administration-front /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

 Expose port 80
EXPOSE 80



DockerCompose :

version: '3'

services:

  frontend:

    build:
      context: ./front
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    restart: always

  backend:
    build:
      context: ./back
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    depends_on:
      - database
      - rabbitmq
    environment:
      - DATABASE_HOST=database
      - DATABASE_PORT=5432
      - DATABASE_USERNAME=postgres
      - DATABASE_PASSWORD=admin
      - DATABASE_NAME=mydatabase
    restart: always
    
  database:
    image: postgres:latest
    ports:
      - "5433:5432"
    volumes:
      - postgres-data:/var/lib/postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=mydatabase
    restart: always

  rabbitmq:
    image: rabbitmq:latest
    ports:
      - "5672:5672"
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq

  jenkins:
    image: jenkins/jenkins:lts
    ports:
      - "8081:8080"  # Port pour l'interface utilisateur Jenkins
      - "50000:50000"  # Port pour les agents Jenkins (JNLP)
    volumes:
      - jenkins-data:/var/jenkins_home  # Stockage des données Jenkins pour la persistance
    environment:
      JAVA_OPTS: "-Djenkins.install.runSetupWizard=false"  # Désactive le Wizard de setup initial si souhaité
    restart: always

volumes:
  postgres-data:
  rabbitmq-data:
  jenkins-data:  # Défini pour la persistance des données Jenkins
