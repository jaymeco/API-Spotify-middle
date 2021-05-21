const SpotifyWebApi = require('spotify-web-api-node');
const credentials = require('./credentials');

exports.spotifyWebApi = new SpotifyWebApi({
  clientId: credentials.client_id,
  clientSecret: credentials.client_secret,
  redirectUri: 'http://localhost:3000'
})