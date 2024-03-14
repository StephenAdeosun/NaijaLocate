# NaijaLocate

## Introduction
NaijaLocate is an open-source platform that enables users to explore and share information about different regions, including states, LGAs (Local Government Areas), and their metadata.

## Features
- **Authentication and Authorization:** Locale requires developers to authenticate their requests using API keys generated upon signup. Each developer is issued a unique API key for secure access to the API.
  
- **Search Functionality:** Developers can search for information about Nigeria based on categories such as region, state, and local government area (LGA). Searches can be performed for regions with associated states or for states with associated LGAs. Locale returns detailed metadata for each region, state, or LGA in the search results.

- **General APIs:** Locale provides APIs to retrieve all regions, states, and LGAs, enabling developers to access comprehensive geographic data.

## Installation Guide
* Clone this repository by running 
  ```
     git clone https://github.com/StephenAdeosun/NaijaLocate.git
  ```
* Ensure you are working from the master branch, which is the most stable.
* Run `npm install` to install all dependencies.
* Configure the MongoDB connection in the application entry file (`index.ts`).
* Create a `.env` file in the project root folder and add your environment variables. Refer to `.env.sample` for guidance.

## Usage
* Run `npm run dev` to start the application.
* Access the API endpoints using Postman or any HTTP client.

## API Endpoints
| HTTP Method | Endpoint           | Description                      |
|-------------|--------------------|----------------------------------|
| POST        | /api/signup        | Sign up a new user               |
| GET         | /api/regions       | Get all regions                  |
| GET         | /api/states        | Get all states                   |
| GET         | /api/lgas          | Get all LGAs                     |
| GET         | /api/states/:region| Get states by region             |
| GET         | /api/lgas/:state   | Get LGAs by state                |
| GET         | /api/metadata/:lga | Get metadata by LGA              |
| GET         | /api/search        | Search geographic data           |
| GET        | /api/locations        | Get all locations               |



## Technologies Used
* [Node.js](https://nodejs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose ODM](https://mongoosejs.com/)

## Authors
* [Stephen Adeosun](https://github.com/StephenAdeosun)


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
