
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
    } else if(context.isSpotify) {
      content.appendChild(this.getIconImage('NPOS_logoImage'));
    }

    content.appendChild(this.getInfoDiv('fa fa-music', context.songTitle));
    content.appendChild(this.getInfoDiv('fa fa-user', context.artist));
    content.appendChild(this.getInfoDiv('fa fa-folder', context.album));
    content.appendChild(this.getInfoDiv(this.getPlayStatusIcon(context.isPlaying), this.getTimeInfo(context), "HAPlaying-timer"));
    content.appendChild(this.getProgressBar(context));
    content.appendChild(this.getInfoDiv('', context.deviceName));

    return content;
  }

  getProgressBar(context) {
    console.log(context)
    let progressBar = document.createElement('progress');
    progressBar.className = 'NPOS_progress';

    progressBar.value = context.progress;
    progressBar.max = context.titleLength;

    return progressBar;
  }

  getTimeInfo(context) {
    let currentPos = moment.duration(context.progress);
    let length = moment.duration(context.titleLength);

    return currentPos.format() + ' / ' + length.format();
  }

  getInfoDiv(symbol, text, idName) {
    let infoDiv = document.createElement('div');
    infoDiv.className = 'NPOS_infoText';

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
}
