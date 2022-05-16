# salesforceOAuthApp

##Usage
1. Create a aalesforce connected app
2. Update the redirect uri of the salesforce connected app to `http://localhost:3000/callback`
3. Relax the IP restrictions of the connected app
4. Clone the repository locally
5. Open a terminal with the repository as the working directory
6. Run `npm install`
7. Update the `clientId` and `clientSecret` in the config/default.json file to match that of your salesforce connected app
9. Run `npm start`
10. Navigate to `http://localhost:3000` in your browser to start the app.
