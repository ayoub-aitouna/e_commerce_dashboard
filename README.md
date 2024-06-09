# E-Commerce Dashboard

This is a feature-rich e-commerce dashboard developed using Express.js as the backend, Sequelize as the ORM, and React as the frontend framework. The dashboard utilizes Horizon UI for a modern and responsive user interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- User Authentication and Authorization
- Product Management (CRUD)
- Order Management
- Sales Analytics and Reporting
- Responsive Design with Horizon UI

## Demo
| ![Image 1](https://github.com/ayoub-aitouna/e_commerce_dashboard/blob/devel/demo/auth_page.png?raw=true) | ![Image 2](https://github.com/ayoub-aitouna/e_commerce_dashboard/blob/devel/demo/home_page.png?raw=true) | ![Image 2](https://github.com/ayoub-aitouna/e_commerce_dashboard/blob/devel/demo/products_page.png?raw=true) |
|---------|---------|---------|


## Technologies Used

- **Backend**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Frontend**: React.js
- **UI Template**: Horizon UI
- **Authentication**: JWT

## Installation

### Prerequisites

- Docker
- Docker-compose

### How to Setup

1. Clone the repository

   ```sh
   git clone https://github.com/ayoub-aitouna/e_commerce_dashboard.git
   cd e_commerce_dashboard
   ```

2. Configure the database
   - Create a `.env` file in the backend directory
   - Add the following configuration
     ```env
        RESET=false
        PORT=8080

        #admin credentials
        admin_email=admin@iptv.com
        admin_pass=123456
        api_token=A1f3cCbd988Pdf7180a510b-51e462ae5654837c87f00392b9d2b72d-35ea6a5

        #jwt tokens
        ACCESS_TOKEN_SECRET=<your_jwt_secret>
        REFRESH_TOKEN_SECRET=<your_refresh_jwt_secret>

        #mailer credentials
        MAILER_HOST=<mailer host>
        MAILER_USER=<mailer user>
        MAILER_PASS=<mailer pass>

        #sms credentials
        PHONE_NUMBER=+212600000000


        #mysql credentials
        MYSQL_DATABASE=<your_database_name>
        MYSQL_ROOT_PASSWORD=<your_database_root_pass>
        MYSQL_USER=<your_database_user>
        MYSQL_PASSWORD=<your_database_pass>
        MYSQL_HOST=<your_database_host>

     ```

3. Start the app
   ```sh
   make
   ```

## Usage

- Navigate to `http://localhost:3000` to view the dashboard.
- Use the login credentials to access various features of the dashboard.

## Project Structure

```
e_commerce_dashboard
├── src
| ├── backend
| |   ├── plugins
| │   ├── public
| │   ├── src
| │   |  ├── config
| │   |  ├── controllers
| │   |  ├── errors
| │   |  ├── languages
| │   |  ├── mailer
| │   |  ├── middleware
| │   |  ├── migrations
| │   |  ├── models
| │   |  ├── routes
| │   |  ├── seeders
| │   |  ├── types
| │   |  ├── utils
| │   |  └── index.ts
| │   ├── .env
| │   └── Dockerfile
| └── dashboard
|    ├── app
|    |  ├── public
|    |  ├── src
|    |  │   ├── assets
|    |  │   ├── components
|    |  │   ├── contexts
|    |  │   ├── layouts
|    |  │   ├── state
|    |  │   ├── theme
|    |  │   ├── types
|    |  │   ├── utils
|    |  │   ├── variables
|    |  │   ├── views
|    |  │   └── index.ts
|    |  └── Dockerfile
|    └── docker-compose.yml
├── Makefile
└── README.md
```
