# Repository Name

This repository contains two codebases: one for the web frontend and backend, and another one for the Python service worker.

## Web Frontend & Backend

The web frontend and backend code can be found in the `web` directory. This codebase is responsible for handling the user interface and server-side logic of the application.

## Python Service Worker

The Python service worker code can be found in the `worker` directory. This codebase is responsible for performing background tasks and handling asynchronous operations.

## Getting Started

### Web

Dependencies:

- Node.js `v20.11.0`
- npm `v10.2.4`

To get started with the web frontend and backend code, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the `web` directory: `cd web`
3. Install the dependencies: `npm install`
4. Start the development server: `npm run dev`

### Python Worker
Python version: `3.12`

Make sure you have python and pip installed and the following packages:
- pywin32 (`pip install pypiwin32`)

Make sure you have Postman installed to make API calls

To use firebase emulator:
1. Install: `npm install -g firebase-tools`
2. Login using your firebase account: `firebase login`
3. Check that acfirst-ordering project is in: `firebase projects:list`


To get started with the Python service worker code, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the `service-worker` directory: `cd service-worker`
3. Install the dependencies: `pip install -r requirements.txt`
4. Change credentials, database (DCF) file and database name for the SQL Accounting Software IN `Common.py`
4. Start the firebase emulator: `firebase emulators:start`
5. Follow the instructions on the Command Line Output


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
