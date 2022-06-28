___
## **Docker File:**
*Set of Instruction to create layers in Docker Image*

Each line in docker file represents different layer of Docker Image

```
FROM node:16.15.0

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

In copy, 
* First . means from where the files will be copied
* Second . means in image where the src file will be pasted

With CMD in Docker File, we can run command when the container is launched with Image

EXPOSE is used for ports


---

## **Docker Image:** 

*Like a blueprint for docker container, which have all the files necessary for running the app*

Images cannot be modified. It has to be recreated

Images are build in a layer incrementally, So order of image matters

Parent image is the first Layer, which has runtime environment such as node 17 or 16

It has:
* Runtime environment
* Application Code
* Any Dependencies
* Extra config
* Commands
#### Cache Layer
If previous layers are already built before, docker just uses those as cache.

### **Building Docker Image with Docker File**
```
docker build -t pharma_back_end:version .
```

* -t is for Tags

* pharma_back_end is name which can be any

* . is the realtive path in the special docker file of the Docker Desktop
* Version is Optional 

### **Removing Images**
```
docker image rm image_name -f
```
Removing the Images with Command

-f Flag is used for forced Deletion


---
## **Docker Container:**

*Containers are runnable instances of images*

1. Container is a special process 
2. has its own slimmed down os.
3. Uses Host OS kernel
4. Isolated Process

### **Running Container With Commands**
#### **Create Container**

```
docker run --name ContainerName -p 5000:5000 ImageName
```

Here, --name tag is the name of the container which can be any

-p is the port, where left port is computer port and right port is docker container port.


#### **See All Container**
```
docker ps
```
To see all docker container


#### **Start Container**

```
docker start container_name
```

To stop any container


#### **Stop Container**


```
docker stop container_name
```

To stop any container

### **Removing Container**
```
docker container rm container_name
```

### **Removing Everything including Image**
```
docker system prune -a
```


## **Volumes**

*Volumes can be used to map Source Code to Docker Container*

With volume, images don't have to be created everytime, Container will be linked with Source Code.

For NodeJS nodemon is required to use Volumes.

```
nodemon -L app.js
```
This -L in script has to be added to work with Docker in windows.

```
docker run --name ContainerName -p 5000:5000 -v computer_path:dockerpath -v /node_modules ImageName
```

Second -v is used to keep the node_modules file unchanged

## **Docker Compose**

### **NODE JS**
```
version: "3.8"
services:
  backend:
    build: ./backend
    container_name: backend_pharma_container
    ports:
      -  '5000:5000'
    volumes:
      - ./backend:/
      - ./node_modules
```

* Services means what kind of task will be done
* build is the directory where docker file in
* ports are defined to map with OS
* volumes can be used to map directory to keep track of changes

### **React JS**
```
version: "3.8"
services:
  frontend:
    build: ./frontend
    container_name: frontend_pharma_container
    ports:
      -  '3000:3000'
    stdin_open: true
    tty: true
```
* stdin_open and tty is used for making it interactive, oposite of detached
### **Starting Docker Compose**
```
docker-compose up
```

### **Stopping Docker Compose**
```
docker-compose down
```

### **Removing Docker Compose**
```
docker-compose down --rmi all -v
```