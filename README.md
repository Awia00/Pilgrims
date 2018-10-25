![header](doc/header-simple.jpg "Pilgrims")

***

<p align="center"><b>Pilgrims</b> is an online real-time implementation of the magnificent <i>"The Settlers of Catan"</i> designed by Klaus Teuber.</p>

***

# Play 

Run the following on a system that has Docker installed:

    docker network create traefik_proxy
    docker build -t pilgrims/pilgrims-shared ./pilgrims-shared
    docker build -t pilgrims/pilgrims-client ./pilgrims-client
    docker build -t pilgrims/pilgrims-server ./pilgrims-server
    docker-compose up -d

If you have a running traefik service you can access the app at pilgrims.localhost. 
Otherwise, run `docker inspect pilgrims-client | grep IPAddress` to find the ip address of the app.

# Implementation
[![Build Status](https://jenkins.anderswind.dk/buildStatus/icon?job=Pilgrims/master)](https://jenkins.anderswind.dk/job/Pilgrims/job/master/)
[![codebeat badge](https://codebeat.co/badges/9fe73beb-c48f-4772-8d45-ab88e2241782)](https://codebeat.co/projects/github-com-awia00-pilgrims-master)
[![Maintainability](https://api.codeclimate.com/v1/badges/e9e2a40371b22a5460ad/maintainability)](https://codeclimate.com/github/Awia00/Pilgrims/maintainability)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com) 

The server, shared libraries and client are all written in TypeScript and transpiled to JavaScript. The server runs in node, and the client is built using Vue. 

All modification on the game world are expressed in a monadic form, and will return a new game world when applied on the current world. 
This gives us free "versioning" of the game world, gives us easy undo functionality and makes the real-time aspects of the game easier to work with and implement. 

Feel free to take a look at the code and throw a PR if you are missing any features/rules (there's plenty of expansions to the game that we haven't implemented - yet)!
