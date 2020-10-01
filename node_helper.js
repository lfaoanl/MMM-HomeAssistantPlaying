'use strict';

const NodeHelper = require('node_helper');


module.exports = NodeHelper.create({

  start: function () {
    this.expressApp.post('/MMM-HomeAutomationNotifications', function (req, res) {
      this.sendSocketNotification("UPDATE_CURRENT_SONG", req.query);
      res.status(204).end();
    });
  },


  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case 'UPDATE_CURRENT_SONG':
        this.sendRetrievedNotification(payload);
        break;
    }
  },

  sendRetrievedNotification: function (song) {
    let payload = songInfo;
    payload = {
      imgURL:       song.entity_picture,
      songTitle:    song.media_title,
      artist:       song.media_artist,
      album:        song.media_album_name,
      titleLength:  song.duration * 1000,
      progress:     song.position * 1000,
      isPlaying:    song.state == "playing",
      deviceName:   song.friendly_name,
      isSpotify:    song.app_name == "Spotify"
    };

    this.sendSocketNotification('RETRIEVED_SONG_DATA', payload);
  },


  getArtistName: function (artists) {
    return artists.map((artist) => {
      return artist.name;
    }).join(', ');
  },


  getImgURL(images) {
    let filtered = images.filter((image) => {
      return image.width >= 240 && image.width <= 350;
    });

    return filtered[0].url;
  }
});
