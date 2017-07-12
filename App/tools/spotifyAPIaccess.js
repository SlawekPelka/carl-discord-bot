const SpotifyWebApi = require('spotify-web-api-node'),
    grab = require('./App/data_storage/grab');

module.exports = {
    get() {
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
    },
    refresh(spotiAuth) {
        let currToken;
        let tokenExpirationEpoch;

        spotiAuth.authorizationCodeGrant()
            .then(data => {
                spotiAuth.setAccessToken(data.body['access_token']);
                spotiAuth.setRefreshToken(data.body['refresh_token']);

                tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];
                console.log('Retrieved token. It expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');
            }, e => {
                console.log('Something went wrong while requesting refresh of spotify access! ', err);
            });

        let numberOfTimesUpdated = 0;

        if (++numberOfTimesUpdated > 5) {
            spotiAuth.refreshAccessToken()
                .then(data => {
                    tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];
                    console.log('Refreshed token. It now expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');
                }, e => {
                    console.log('Something went wrong while requesting refresh of spotify access! ', err);
                })
        }


    }
}