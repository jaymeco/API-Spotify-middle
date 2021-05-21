const routes = require('express').Router();
const axios = require('axios').default;
const { spotifyWebApi } = require('./api');


routes.get('/albums/new-realeses', async (req, res) => {
  const { authorization } = req.headers;
  
  try {
    spotifyWebApi.setAccessToken(authorization);

    const { body } = await spotifyWebApi.getNewReleases({ limit: 15 });

    return res.status(200).json(body);
  } catch (error) {
    return res.status(400).json(error);
  }
});

routes.get('/artists/albums/:id', async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  try {
    spotifyWebApi.setAccessToken(authorization);

    const { body } = await spotifyWebApi.getArtistAlbums(id, { include_groups: 'album' });
    const artistResponse = await spotifyWebApi.getArtist(id);
    
    return res.status(200).json({
      albums: body,
      artist: artistResponse.body
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

routes.get('/artists/:id', async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  try {
    spotifyWebApi.setAccessToken(authorization);

    const { body } = await spotifyWebApi.getArtist(id);

    const responseTopTrack = await spotifyWebApi.getArtistTopTracks(id, 'BR');

    const responseSomeAlbuns = await spotifyWebApi.getArtistAlbums(id, { limit: 8,include_groups: 'album'});
    
    return res.status(200).json({
      artist: body,
      top_track: responseTopTrack.body,
      some_albums: responseSomeAlbuns.body
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

routes.get('/album/:id', async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  try {
    spotifyWebApi.setAccessToken(authorization);

    const responseAlbum = await spotifyWebApi.getAlbum(id);
    const artist_id = responseAlbum.body.artists[0].id;
    const responseArtist = await spotifyWebApi.getArtist(artist_id);
    const responseSomeAlbuns = await spotifyWebApi.getArtistAlbums(artist_id, { limit: 8,include_groups: 'album'});

    return res.status(200).json({
      artist: responseArtist.body,
      album: responseAlbum.body,
      some_albums: responseSomeAlbuns.body
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

routes.post('/search', async (req, res)=>{
  const { authorization } = req.headers;
  const { search, type } = req.body;

  try {
    spotifyWebApi.setAccessToken(authorization);

    const { body } = await spotifyWebApi.search(search, [type], { limit: 10 });

    return res.status(200).json(body);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

routes.post('/login', async (req, res) => {
  const { code } = req.body;
  try {
    const { body } = await spotifyWebApi.authorizationCodeGrant(code);

    return res.status(200).json({
      access_token: body.access_token,
      refresh_token: body.refresh_token,
      expires_in: body.expires_in
    })
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
});


module.exports = routes;