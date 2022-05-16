const express = require('express');
const request = require('request');
const http = require('http');
const config = require('config');

const app = express();
const port = 3000;
const baseURL = config.get('baseUrl');
const responseType = config.get('responseType');
const clientId = config.get('clientId');
const clientSecret = config.get('clientSecret');
const redirectURI = config.get('redirectURI');
const scope = config.get('scope');

var instanceUrl;
var accessToken;
var refreshToken;

app.get('/', (req, res) => {
    res.send('<button onclick="location.href = \'/oAuth\';">Start oAuth Flow</button>');
});

app.get('/oAuth', (req, res) => {
    
    var options = {
        'method': 'GET',
        'url': baseURL + '/services/oauth2/authorize?response_type=' + responseType + '&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&scope=' + scope,
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
            res.send(response.body);
    });
});

app.get('/callback', (req, res) => {
    var code = req.query.code;
    res.send(
        'Authorization Code: ' + code + '</br><button onclick="location.href = \'/exchange?code=' + code + '\';">Exchange</button>'
    );
});

app.get('/exchange', (req, res) => {
    var code = req.query.code;
    var options = {
        'method': 'POST',
        'url': baseURL + '/services/oauth2/token',
        formData: {
            'code': code,
            'grant_type': 'authorization_code',
            'client_id': clientId,
            'client_secret': clientSecret,
            'redirect_uri': redirectURI,
            'format': 'json'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
            var body = JSON.parse(response.body);
            instanceUrl = body.instance_url;
            accessToken = body.access_token;
            refreshToken = body.refresh_token;
            res.send(
                'Instance URL: ' + instanceUrl + '</br>Access Token: ' + accessToken + '</br>Refresh Token: ' + refreshToken + '</br><button onclick="location.href = \'/refresh\';" id="myButton">Refresh Token</button></br><button onclick="location.href = \'/callApi\';">Call API</button>'
            );
        });
});

app.get('/refresh', (req, res) => {
    var options = {
        'method': 'POST',
        'url': baseURL + '/services/oauth2/token',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': 'refresh_token',
            'client_id': clientId,
            'client_secret': clientSecret,
            'refresh_token': refreshToken
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
            var body = JSON.parse(response.body);
            accessToken = body.access_token;
            res.send(
                'Instance URL: ' + instanceUrl + '</br>Access Token: ' + accessToken + '</br>Refresh Token: ' + refreshToken + '</br><button onclick="location.href = \'/refresh\';">Refresh Token</button></br><button onclick="location.href = \'/callApi\';">Call API</button>'
            );
        });
});

app.get('/callApi', (req, res) => {
    var options = {
        'method': 'GET',
        'url': instanceUrl + '/services/data/v50.0/query/?q=SELECT+Id,Name+FROM+Account+LIMIT+1',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
            res.send(
                'Instance URL: ' + instanceUrl + '</br>Access Token: ' + accessToken + '</br>Refresh Token: ' + refreshToken + '</br><button onclick="location.href = \'/refresh\';">Refresh Token</button></br><button onclick="location.href = \'/callApi\';">Call API</button></br> Response Body: ' + response.body
            );
        });
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
