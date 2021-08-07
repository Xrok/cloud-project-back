# CloudComputing Project Backend

## Run on dev

```bash
yarn dev 
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--cron\           # Chronological scrapping task    
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Architecture

<img width="818" alt="Screen Shot 2021-07-22 at 10 04 14" src="https://user-images.githubusercontent.com/28423571/126662136-db21c2ef-7ff0-4b05-86b1-4c0f3bb9d8e3.png">

## Features

- Chronologically visit the web pages of the stores registered in the database.
- Update the price and stock of the products in the database.
- Send the information of the products according to the category requested.

## Docker Image

[``` xrok/unleash-backend:latest```](https://hub.docker.com/repository/docker/xrok/unleash-backend)

## Kubernetes Architecture
[Deployed with Digital Ocean 🚀](http://143.244.215.119/)
![docker-structure](https://user-images.githubusercontent.com/28423571/128601608-f88a7b63-dc1b-485f-8664-e11e4318a578.png)
