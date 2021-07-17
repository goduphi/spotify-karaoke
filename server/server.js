const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const lyricsFinder = require('lyrics-finder');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '6fdf086484024334a1363d53f936740f',
        clientSecret: '7866cafab0ce4a279f89ad28eef7f9c3'
    });

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log('Token refreshed!');
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '0aee9d7a583740d4b8310dca3cebd2a2',
        clientSecret: 'ea95b8287c554aa6b662e0a3d83ad78c',
        refreshToken
    });

    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            });
        }
    ).catch((err) => {
        console.error(err);
        res.sendStatus(400);
    });
});

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No lyrics found!';
    res.json({ lyrics });
});

app.listen(3001, () => {
    console.log(`Listening on port ${3001}...`);
});