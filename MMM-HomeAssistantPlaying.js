'use strict';

Module.register('MMM-HomeAssistantPlaying', {

  // default values
  defaults: {
    // Module misc
    name: 'MMM-HomeAssistantPlaying',
    hidden: false,

    // user definable
    showCoverArt: true       // Do you want the cover art to be displayed?
  },


  start: function () {
    Log.info('Starting module: ' + this.name );

    this.sendSocketNotification("CONNECT");
    this.initialized = false;
    this.context = {};
  },

  getDom: function () {
    let domBuilder = new DomBuilder(this.config, this.file(''));

    if (this.initialized) {
      return domBuilder.getDom(this.context);
    }
    return domBuilder.getInitDom(this.translate("LOADING"));
  },

  getStyles: function () {
    return [
      this.file('css/styles.css'),
      this.file('node_modules/moment-duration-format/lib/moment-duration-format.js'),
      'font-awesome.css'
    ];
  },

  getScripts: function () {
    return [
      this.file('core/DomBuilder.js'),
      'moment.js'
    ];
  },

  socketNotificationReceived: function (notification, payload) {
    console.log("HASS: Socket notification received `"+notification+"`")
    switch (notification) {
      case 'UPDATE_CURRENT_SONG':
        this.initialized = true;
        this.context = this.parseSongData(payload);
        this.updateDom();
    }
  },

  parseSongData: function (song) {
    let payload = {
      imgURL:       song.entity_picture,
      songTitle:    song.media_title,
      artist:       song.media_artist,
      album:        song.media_album_name,
      titleLength:  Math.round(parseFloat(song.duration)) * 1000,
      progress:     Math.round(parseFloat(song.position)) * 1000,
      state:        song.state,
      isPlaying:    song.state == "playing",
      deviceName:   song.friendly_name,
      isSpotify:    song.app_name == "Spotify"
    };

    if (payload.imageUrl == "None" &&
        payload.album == "None" &&
        payload.artist == "None" &&
        payload.songTitle == "None" &&
        payload.titleLength == "None") {
        return { noSong: true };
    }

    return payload
  },
//
//  startFetchingLoop() {
//    // start immediately ...
//    let credentials = {
//      clientID: this.config.clientID,
//      clientSecret: this.config.clientSecret,
//      accessToken: this.config.accessToken,
//      refreshToken: this.config.refreshToken
//    };
//
//    this.sendSocketNotification('CONNECT_TO_SPOTIFY', credentials);
//
//    // ... and then repeat in the given interval
//    setInterval(() => {
//      this.sendSocketNotification('UPDATE_CURRENT_SONG');
//    }, this.config.updatesEvery * 1000);
//  }
});
