# React App Integrated with Authillo

This is a sample React App integrated with Authillo. It uses both Authillo's standard sign in flow as well as the embedded flow. More information on both flows can be found in the [Authillo documentation](https://authillo.com/developer).

## Getting Started

Note: the implementation of this sample app is not meant to be production ready. It is meant to be a simple example of how to integrate Authillo with a React app.

To get started, clone this repository and run npm install to install the dependencies.
Then, go to the [Authillo developer portal](https://authillo.com/developer/dashboard) and create a new platform. The frontend is set to run on port 3001, so make sure to add the redirect URLs http://localhost:3001 and http://localhost:3001/redirect to your platform.

Once you have created your platform, copy the client ID, client secret, and JWT key and paste them into a .env file in the backend folder. Also update the clientId in App.js to match the client ID of your platform.

Finally, to run the app, run npm start in the frontend folder and npm run server in the backend folder. The frontend should now be running on http://localhost:3001 with the backend running on http://localhost:5001.
