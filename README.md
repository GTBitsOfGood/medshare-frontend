# Medshare

Work-in-progress inventory management system that is being developed for Medshare

## Setup

Clone the repo and install all dependencies:

```
git clone https://github.com/GTBitsOfGood/medshare
cd medshare/frontend
npm install
cd ../backend
npm install
```

Afterwards, copy `backend/.env.example` to `.env` and configure the environment variables.

## Running the Project

**NOTE**: make sure the URL of a running MongoDB instance is in the `MONGO_URI` environment variable

To run the project, go into the `backend` and `frontend` folders and run the commands `npm start` and `npm run dev` respectively.

```
cd frontend && npm start
...
cd backend && npm run dev
```
