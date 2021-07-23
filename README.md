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

#### Pending
- Deploy on Kubernetes
