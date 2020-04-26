## Instagram Clone

### Environment
1. NodeJS 3+
2. Express JS
3. MongoDB ( Cloud Atlas )
4. ReactJS

### Useful commands
```shell
npm init
```
Inizializza un progetto nodejs con il file package.json e cartella node_modules

```shell
npm install <nome_modulo>
```
Installa un modulo all'interno del node_modules e lo aggiugne a package.json come dependency

```shell
node app
```
Lancia l'applicazione con file app.js

```shell
nodemon app
```
Permette di fare hot-swap e hot-redeploy di applicativi in Node JS

### Backend
1. npm install express
2. npm install nodemon
3. npm install mongoose
4. npm install bcryptjs
5. npm install jsonwebtoken

### Frontend
1. npx create-react-app client
2. npm install react-router-dom
3. npm start

### Docker
1. Build the image from dockerfile

```shell
docker build -t <your username>/node-web-app .
```

2. Run the image

```shell
docker run -p 49160:8080 -d <your username>/node-web-app
```

3. Get container ID
```shell
docker ps
```

4. Print app output

```shell
docker logs <container id>
```

5. Enter the container
```shell
docker exec -it <container id> /bin/bash
```