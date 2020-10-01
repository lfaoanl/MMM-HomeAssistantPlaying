'use strict';

const NodeHelper = require('node_helper');


module.exports = NodeHelper.create({

  start: function () {
    let self = this
    this.expressApp.post('/MMM-HomeAssistantPlaying', function (req, res) {
      console.log("HASS: Request POST")
      self.sendSocketNotification("UPDATE_CURRENT_SONG", req.query);
      res.status(200).send(req.query);
    });
  },


  socketNotificationReceived: function (notification, payload) {
    console.log("HASS: Received `UPDATE_CURRENT_SONG` notification")
    switch (notification) {
      case 'UPDATE_CURRENT_SONG':
        this.parseAndSendSongData(payload);
        break;
      case 'CONNECT':
        this.sendSocketNotification("CONNECTED");
        break;
    }
  },

  parseAndSendSongData: function (song) {
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
