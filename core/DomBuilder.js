class DomBuilder {

    constructor(config, pathPrefix) {
        this.config = config;
        this.pathPrefix = pathPrefix + '/';
    }

    getDom(context) {
        if (context.noSong || context == {} || context.state == "off") {
            return this.getWrapper(this.getNothingIsPlayingContent());
        } else {
            return this.getWrapper(this.getPlayingContent(context));
        }
    }

    getInitDom(loadingText) {
        return this.getWrapper(this.getInitializingContent(loadingText));
    }

    getWrapper(content) {
        let wrapper = document.createElement('div');
        wrapper.className = 'small, HAPlaying-container';
        wrapper.appendChild(content);

        return wrapper;
    }

    getInitializingContent(loadingText) {
        let content = document.createElement('div');
        content.className = 'NPOS_initContent';

        let loadingDiv = document.createElement('div');
        loadingDiv.className = 'NPOS_loading medium';
        loadingDiv.innerHTML = loadingText;

        content.appendChild(loadingDiv);

        return content;
    }

    getNothingIsPlayingContent() {
        let content = document.createElement('div');
//    content.className = 'NPOS_nothingIsPlayingContent';
//    content.appendChild(this.getLogoImage());

        return content;
    }

    getLogoImage() {
        return this.getImage('img/Spotify_Logo_RGB_White.png', 'NPOS_nothingIsPlayingImage');
    }

    getIconImage(className) {
        return this.getImage('img/Spotify_Icon_RGB_White.png', className);
    }

    getImage(imageName, className) {
        let image = document.createElement('img');
        image.src = this.pathPrefix + imageName;
        image.className = className;

        return image;
    }

    /**
     * Returns a div configured for the given context.
     *
     * context = {
     *   imgURL: *an url*,
     *   songTitle: *string*,
     *   artist: *string*,
     *   album: *string*,
     *   titleLength: *num*,
     *   progress: *num*,
     *   isPlaying: *boolean*,
     *   isSpotify: *boolean*,
     *   deviceName: *string*
     * }
     *
     * @param context
     * @returns {HTMLDivElement}
     */
    getPlayingContent(context) {
        let content = document.createElement('div');

        if (this.config.showCoverArt) {
            content.appendChild(this.getCoverArtDiv(context.imgURL));
        } else if (context.isSpotify) {
            content.appendChild(this.getIconImage('NPOS_logoImage'));
        }

        content.appendChild(this.getInfoDiv('fa fa-music', context.songTitle));
        content.appendChild(this.getInfoDiv('fa fa-user', context.artist));
        content.appendChild(this.getInfoDiv('fa fa-folder', context.album));
        content.appendChild(this.getInfoDiv(this.getPlayStatusIcon(context.isPlaying), this.getTimeInfo(context), "timer"));
        content.appendChild(this.getProgressBar(context));
        content.appendChild(this.getInfoDiv('', context.deviceName));

        return content;
    }

    getProgressBar(context) {
        console.log(context)
        this.progressBar = document.createElement('progress');
        this.progressBar.className = 'NPOS_progress';

        this.progressBar.value = context.progress;
        this.progressBar.max = context.titleLength;

        return this.progressBar;
    }

    getTimeInfo(context) {
        let currentPos = moment.duration(context.progress);
        let length = moment.duration(context.titleLength);

        let progressFormat = currentPos.format();

        if (context.progress === 0) {
            progressFormat = "0:00";
        }
        return progressFormat + ' / ' + length.format();
    }

    updateTimer(progress, titleLength) {
        let text = document.querySelector("#" + this.getId("timer") + " span");
        text.innerText = this.getTimeInfo({progress, titleLength});

        this.progressBar.value = progress;
    }

    getInfoDiv(symbol, text, id) {
        let infoDiv = document.createElement('div');
        infoDiv.className = 'NPOS_infoText';

        if (typeof id !== "undefined") {
            infoDiv.id = this.getId(id);
        }

        if (symbol) {
            let icon = document.createElement('i');
            icon.className = 'NPOS_icon ' + symbol;
            infoDiv.appendChild(icon);
        }

        let span = document.createElement("span");
        span.innerText = text;

        infoDiv.appendChild(span);

        return infoDiv;
    }

    getCoverArtDiv(coverURL) {
        let coverArea = document.createElement('div');
        coverArea.className = 'NPOS_coverArtArea';

        let cover = document.createElement('img');
        cover.src = coverURL;
        cover.className = 'NPOS_albumCover';

        coverArea.appendChild(cover);

        return coverArea;
    }

    getPlayStatusIcon(isPlaying) {
        return isPlaying ? 'fa fa-play' : 'fa fa-pause';
    }

    getId(content) {
        return "HAPlaying-" + content;
    }
}
