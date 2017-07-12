const SpotifyWebApi = require('spotify-web-api-node'),
    grab = require('../data_storage/grab');

module.exports = () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: grab.securityTokens('spotify_clientId'),
        clientSecret: grab.securityTokens('spotify_secret')
    });

    spotifyApi.clientCredentialsGrant()
        .then(data => {
            spotifyApi.setAccessToken(data.body['access_token']);
        }, e => {
            console.log('Something went wrong while requesting spotify access! ', err);
        });

    return spotifyApi;
}