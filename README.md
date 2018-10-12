![header](doc/header-simple.jpg "Pilgrims")

A clone of the popular "Settlers of Catan", written in Typescript.

To play run: 

    docker network create traefik_proxy
    docker build -t pilgrims/pilgrims-client ./pilgrims-client
    docker build -t pilgrims/pilgrims-server ./pilgrims-server
    docker-compose up -d

If you have a running traefik service you can access the app at pilgrims.localhost. 
Otherwise, run `docker inspect pilgrims-client | grep IPAddress` to find the ip address of the app.