ESIR2 - DevOps -Cloud Native and Microservices
Ethan GAUTHIER & Roland KOFFI & Kechiedou MEDA

Ce projet vise à convertir une application monolithique en une architecture de microservices, tout en intégrant divers outils de DevOps pour une approche Cloud Native.

##Notre travail
Notre apport sur ce projet a été d'ajouter plusieurs services :
 Monitoring : Prometheus et grafana (poour la visualisation) et cAdvisor pour récupérer les métriques des containers
 Build pour automatisation de test : Jenkins
 Analyse statique de code : SonarQube

Schéma de notre architecture microservices
![image](https://github.com/degrize/pullRequestDevopsCloudNative/assets/133746978/e3bc9aed-8a45-4e4a-a3c9-31129886464f)

##Lancement de l'application
Pour utiliser l’application, il suffit de lancer Quarkus d’utiliser la commande docker compose
sur le fichier prod ou dev afin de lancer l’application en mode production ou en
mode développement.
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

## *QUarkus*
```
./mvnw -f . quarkus:dev
```

## *DockerFile Back :*

```
FROM node:18-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
```




## *DockerFile Front :*
```
#### *Stage 1:* Compile and Build angular codebase

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


#### *Stage 2:* Serve app with nginx server

 Use official nginx image as the base image
FROM nginx:latest

 Copy the build output to replace the default nginx contents.
 
COPY --from=build /usr/local/app/dist/fr-administration-front /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

 Expose port 80
EXPOSE 80
```


### *DockerCompose :*
```Dockerfile
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

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    environment:
      - GF_INSTALL_PLUGINS=grafana-clock-panel
    ports:
      - '3001:3000'
    volumes:
      - ./grafana:/etc/grafana/provisioning/datasources

  prometheus:
    image: prom/prometheus
    container_name: prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - 9090:9090
    restart: unless-stopped
    volumes:
      - ./prometheus:/etc/prometheus
      - prom_data:/prometheus
    depends_on:
      - cadvisor
    
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    ports:
      - 8082:8080
    depends_on:
      - redis
    
  redis:
    image: redis:latest
    container_name: redis
    ports:
      - 6379:6379


volumes:
  postgres-data:
  rabbitmq-data:
  jenkins-data:  # Défini pour la persistance des données Jenkins
  grafana-storage: 
  prom_data:
```


