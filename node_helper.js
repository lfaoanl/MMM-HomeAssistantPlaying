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
        console.log("HASS: Received `" + notification + "` notification")
        switch (notification) {
            case 'CONNECT':
                this.sendSocketNotification("CONNECTED");
                break;
        }
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
