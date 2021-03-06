function SlideshowView(slideshowModel, uiElements) {
    this._model = slideshowModel;
    this.uiElements = uiElements;
	
    this.currentImageClickedEvent = new Event(this);
    this.currentVideoClickedEvent = new Event(this);
	this.currentVideoVolumeChangedEvent = new Event(this);
    this.searchButtonClickedEvent = new Event(this);
    this.firstNavButtonClickedEvent = new Event(this);
    this.previousNavButtonClickedEvent = new Event(this);
    this.nextNavButtonClickedEvent = new Event(this);
    this.lastNavButtonClickedEvent = new Event(this);
	this.goBackTenImagesPressedEvent = new Event(this);
	this.goForwardTenImagesPressedEvent = new Event(this);
    this.playButtonClickedEvent = new Event(this);
    this.pauseButtonClickedEvent = new Event(this);
    this.enterKeyPressedOutsideOfSearchTextBoxEvent = new Event(this);
    this.searchTextChangedEvent = new Event(this);
    this.enterKeyPressedInSearchTextBoxEvent = new Event(this);
    this.sitesToSearchChangedEvent = new Event(this);
    this.secondsPerSlideChangedEvent = new Event(this);
    this.maxWidthChangedEvent = new Event(this);
    this.maxHeightChangedEvent = new Event(this);
    this.autoFitSlideChangedEvent = new Event(this);
    this.includeImagesChangedEvent = new Event(this);
    this.includeGifsChangedEvent = new Event(this);
    this.includeWebmsChangedEvent = new Event(this);
	this.blacklistChangedEvent = new Event(this);
	this.derpibooruApiKeyChangedEvent = new Event(this);
	
	this.isSettingVolume = false;
	this.isSettingMute = false;

    var _this = this;

    // Attach model listeners
    this._model.videoVolumeUpdatedEvent.attach(function () {
        _this.updateVideoVolume();
        _this.updateVideoMuted();
    });
	
	this._model.currentSlideChangedEvent.attach(function () {
        _this.updateSlidesAndNavigation();
    });

    this._model.playingChangedEvent.attach(function () {
        _this.updatePlayPauseButtons();
    });

    this._model.sitesToSearchUpdatedEvent.attach(function () {
        _this.updateSitesToSearch();
    });

    this._model.secondsPerSlideUpdatedEvent.attach(function () {
        _this.updateSecondsPerSlide();
    });

    this._model.maxWidthUpdatedEvent.attach(function () {
        _this.updateMaxWidth();
    });

    this._model.maxHeightUpdatedEvent.attach(function () {
        _this.updateMaxHeight();
    });

    this._model.autoFitSlideUpdatedEvent.attach(function () {
        _this.updateAutoFitSlide();
    });
	
	this._model.includeImagesUpdatedEvent.attach(function () {
        _this.updateIncludeImages();
    });
	
	this._model.includeGifsUpdatedEvent.attach(function () {
        _this.updateIncludeGifs();
    });
	
	this._model.includeWebmsUpdatedEvent.attach(function () {
        _this.updateIncludeWebms();
    });
	
	this._model.blacklistUpdatedEvent.attach(function () {
        _this.updateBlacklist();
    });
	
	this._model.derpibooruApiKeyUpdatedEvent.attach(function () {
        _this.updateDerpibooruApiKey();
    });

    // Attach UI element listeners
    window.addEventListener('resize', function () {
        _this.windowResized();
    });

    this.uiElements.currentImage.addEventListener('click', function() {
        _this.currentImageClickedEvent.notify();
    });
	
	this.uiElements.currentVideo.addEventListener('click', function() {
        _this.currentVideoClickedEvent.notify();
    });
	
	this.uiElements.currentVideo.addEventListener('volumechange', function() {
		/*if (_this.isSettingVolume)
		{
			_this.isSettingVolume = false;
			return;
		}
		
		if (_this.isSettingMute)
		{
			_this.isSettingMute = false;
			return;
		}*/
		
		if (_this.isSettingVolume)
		{
			return;
		}
		
        _this.currentVideoVolumeChangedEvent.notify();
    });
    
    this.uiElements.firstNavButton.addEventListener('click', function() {
        _this.firstNavButtonClickedEvent.notify();
    });

    this.uiElements.previousNavButton.addEventListener('click', function() {
        _this.previousNavButtonClickedEvent.notify();
    });

    this.uiElements.nextNavButton.addEventListener('click', function() {
        _this.nextNavButtonClickedEvent.notify();
    });

    this.uiElements.lastNavButton.addEventListener('click', function() {
        _this.lastNavButtonClickedEvent.notify();
    });

    this.uiElements.playButton.addEventListener('click', function() {
        _this.playButtonClickedEvent.notify();
    });

    this.uiElements.pauseButton.addEventListener('click', function() {
        _this.pauseButtonClickedEvent.notify();
    });

    document.addEventListener('keydown', function (e) {
		var key = e.which || e.keyCode;
		
        if (!(
			key == ENTER_KEY_ID ||
			key == SPACE_KEY_ID ||
			key == LEFT_ARROW_KEY_ID ||
			key == RIGHT_ARROW_KEY_ID ||
			key == A_KEY_ID ||
			key == W_KEY_ID ||
			key == S_KEY_ID ||
			key == D_KEY_ID ||
			key == F_KEY_ID))
        {
            return;
        }

        if (document.activeElement !== _this.uiElements.searchTextBox &&
			document.activeElement !== _this.uiElements.secondsPerSlideTextBox &&
			document.activeElement !== _this.uiElements.maxWidthTextBox &&
			document.activeElement !== _this.uiElements.maxHeightTextBox &&
			document.activeElement !== _this.uiElements.blacklist &&
			document.activeElement !== _this.uiElements.derpibooruApiKey) {
			
            if (key == LEFT_ARROW_KEY_ID || key == A_KEY_ID)
                _this.previousNavButtonClickedEvent.notify();
            if (key == RIGHT_ARROW_KEY_ID || key == D_KEY_ID)
                _this.nextNavButtonClickedEvent.notify();
			if (key == W_KEY_ID)
                _this.goBackTenImagesPressedEvent.notify();
			if (key == S_KEY_ID)
                _this.goForwardTenImagesPressedEvent.notify();
            if (key == ENTER_KEY_ID || key == SPACE_KEY_ID)
            {
                if (document.activeElement !== _this.uiElements.searchButton)
                    _this.enterKeyPressedOutsideOfSearchTextBoxEvent.notify();
            }
			if (key == SPACE_KEY_ID)
			{
				e.preventDefault();
			}
			if (key == F_KEY_ID)
			{
				_this._model.setAutoFitSlide(!_this._model.autoFitSlide);
			}
        }
    });

    this.uiElements.searchTextBox.addEventListener('change', function () {
        _this.searchTextChangedEvent.notify();
    });

    this.uiElements.searchTextBox.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key == ENTER_KEY_ID) {
            _this.enterKeyPressedInSearchTextBoxEvent.notify();
        }
    });

    this.uiElements.searchButton.addEventListener('click', function () {
        _this.searchButtonClickedEvent.notify();
    });

    var sitesToSearchElements = this.uiElements.sitesToSearch;

    for (var i = 0; i < sitesToSearchElements.length; i++)
    {
        var siteToSearch = sitesToSearchElements[i];

        siteToSearch.addEventListener('change', function (e) {
            _this.sitesToSearchChangedEvent.notify({
                checked: e.target.checked,
                site: e.target.value
            });
        });
    }

    this.uiElements.secondsPerSlideTextBox.addEventListener('change', function () {
        _this.secondsPerSlideChangedEvent.notify();
    });

    this.uiElements.maxWidthTextBox.addEventListener('change', function () {
        _this.maxWidthChangedEvent.notify();
    });

    this.uiElements.maxHeightTextBox.addEventListener('change', function() {
        _this.maxHeightChangedEvent.notify();
    });

    this.uiElements.autoFitSlideCheckBox.addEventListener('change', function () {
        _this.autoFitSlideChangedEvent.notify();
    });
	
	this.uiElements.includeImagesCheckBox.addEventListener('change', function () {
        _this.includeImagesChangedEvent.notify();
    });
	
	this.uiElements.includeGifsCheckBox.addEventListener('change', function () {
        _this.includeGifsChangedEvent.notify();
    });
	
	this.uiElements.includeWebmsCheckBox.addEventListener('change', function () {
        _this.includeWebmsChangedEvent.notify();
    });
	
	this.uiElements.blacklist.addEventListener('change', function () {
        _this.blacklistChangedEvent.notify();
    });
	
	this.uiElements.derpibooruApiKey.addEventListener('change', function () {
        _this.derpibooruApiKeyChangedEvent.notify();
    });

    this.initialize();
}

SlideshowView.prototype = {
    initialize: function () {
        this.setupLoadingAnimation();

        this.setFocusToSearchBox();
    },

    clearUI: function () {
        this.clearWarningMessage();
        this.clearInfoMessage();
        this.clearImage();
        this.clearVideo();
        this.hideNavigation();
        this.clearThumbnails();
    },

    windowResized: function() {
        if (this._model.autoFitSlide)
        {
            this.tryToUpdateSlideSize();
        }
    },
	
	isDisplayingWarningMessage: function () {
		return this.uiElements.warningMessage.style.display == 'block';
	},
	
    displayWarningMessage: function (message) {
        this.uiElements.warningMessage.innerHTML = message;
        this.uiElements.warningMessage.style.display = 'block';
    },

    clearWarningMessage: function () {
        this.uiElements.warningMessage.innerHTML = '';
        this.uiElements.warningMessage.style.display = 'none';
    },
	
	displayInfoMessage: function (message) {
        this.uiElements.infoMessage.innerHTML = message;
        this.uiElements.infoMessage.style.display = 'block';
    },

    clearInfoMessage: function () {
        this.uiElements.infoMessage.innerHTML = '';
        this.uiElements.infoMessage.style.display = 'none';
    },

    updateSlidesAndNavigation: function () {
        this.updateSlides();
        this.updateNavigation();
    },

    updateSlides: function () {
        this.displayCurrentSlide();
        this.showThumbnails();
    },

    setupLoadingAnimation: function () {
        var _this = this;

        this.uiElements.currentImage.onload = function () {
            _this.hideLoadingAnimation();
        }
		
		this.uiElements.currentVideo.addEventListener('loadeddata', function() {
			_this.hideLoadingAnimation();
		}, false);
    },

    displayCurrentSlide: function () {
        if (this._model.hasSlidesToDisplay())
		{
            this.displaySlide();
        }
		else if (this.isDisplayingWarningMessage())
		{
			// Current warning message more important
		}
        else
		{
			var message = '';
		
			var includingImagesOrGifs = (this._model.includeImages || this._model.includeGifs);
			
			if (includingImagesOrGifs && this._model.includeWebms)
				message = 'No images or videos were found.';
			else if (includingImagesOrGifs && !this._model.includeWebms)
				message = 'No images were found.';
			else if (!includingImagesOrGifs && this._model.includeWebms)
				message = 'No videos were found.';
			
            this.displayWarningMessage(message);
        }
    },

    displaySlide: function () {
        this.showLoadingAnimation();

        var currentSlide = this._model.getCurrentSlide();
		
		if (currentSlide.isImageOrGif())
		{
			this.displayImage(currentSlide);
		}
		else if (currentSlide.isVideo())
		{
			this.displayVideo(currentSlide);
		}
		else
		{
			console.log("Trying to display slide that isn't an image or video.")
		}
    },
	
	displayImage: function (currentSlide) {
        var currentImage = this.uiElements.currentImage;

        currentImage.src = currentSlide.fileUrl;
        currentImage.setAttribute('alt', currentSlide.id);
        currentImage.style.display = 'inline';
		
		this.clearVideo();
        this.updateSlideSize();
    },
	
	displayVideo: function (currentSlide) {
        var currentVideo = this.uiElements.currentVideo;

        currentVideo.src = currentSlide.fileUrl;
        currentVideo.style.display = 'inline';

		this.clearImage();
        this.updateSlideSize();
		this.updateVideoVolume();
		this.updateVideoMuted();
    },
	
	getVideoVolume: function () {
		return this.uiElements.currentVideo.volume;
    },
	
	getVideoMuted: function () {
        return this.uiElements.currentVideo.muted;
    },

    tryToUpdateSlideSize: function () {
        if (this._model.hasSlidesToDisplay())
        {
			var currentSlide = this.updateSlideSize();
		}
    },
	
    updateSlideSize: function () {
        var currentSlide = this._model.getCurrentSlide();
        var currentImage = this.uiElements.currentImage;
        var currentVideo = this.uiElements.currentVideo;
        
        var autoFitSlide = this._model.autoFitSlide;

        currentImage.style.width = null;
        currentImage.style.height = null;
        currentImage.style.maxWidth = null;
        currentImage.style.maxHeight = null;
		
		currentVideo.style.width = null;
        currentVideo.style.height = null;
        currentVideo.style.maxWidth = null;
        currentVideo.style.maxHeight = null;
        
        if (autoFitSlide)
        {
            var viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            var newWidth = currentSlide.width;
            var newHeight = currentSlide.height;

            var viewRatio = viewWidth / viewHeight;
            var newRatio = newWidth / newHeight;
            
            if (newRatio > viewRatio)
            {
                newWidth = viewWidth;
                newHeight = viewWidth / newRatio;
            }
            else
            {
                newWidth = viewHeight * newRatio;
                newHeight = viewHeight;
            }
            
			if (currentSlide.isImageOrGif())
			{
				currentImage.style.width = newWidth + 'px';
				currentImage.style.height = newHeight + 'px';
			}
			else if (currentSlide.isVideo())
			{
				currentVideo.style.width = newWidth + 'px';
				currentVideo.style.height = newHeight + 'px';
			}
			else
			{
				console.log("Couldn't update slide size because slide isn't image or video.");
			}
        }
        else
        {
            if (this._model.maxWidth != null)
			{
                var maxWidth = parseInt(this._model.maxWidth);
                
				if (currentSlide.isImageOrGif())
				{
					currentImage.style.maxWidth = maxWidth + 'px';
				}
				else if (currentSlide.isVideo())
				{
					currentVideo.style.maxWidth = maxWidth + 'px';
				}
				else
				{
					console.log("Couldn't update slide max width because slide isn't image or video.");
				}
			}
			
            if (this._model.maxHeight != null)
			{
                var maxHeight = parseInt(this._model.maxHeight);
                
				if (currentSlide.isImageOrGif())
				{
					currentImage.style.maxHeight = maxHeight + 'px';
				}
				else if (currentSlide.isVideo())
				{
					currentVideo.style.maxHeight = maxHeight + 'px';
				}
				else
				{
					console.log("Couldn't update slide max height because slide isn't image or video.");
				}
            }
        }
    },

    clearImage: function () {
        var currentImage = this.uiElements.currentImage;

        currentImage.src = '';
        currentImage.removeAttribute('alt');
        currentImage.style.display = 'none';
    },
	
	clearVideo: function () {
        var currentVideo = this.uiElements.currentVideo;

        currentVideo.src = '';
        currentVideo.style.display = 'none';
    },
	
	updateVideoVolume: function () {
		this.isSettingVolume = true;
        this.uiElements.currentVideo.volume = this._model.videoVolume;
		this.isSettingVolume = false;
    },
	
	updateVideoMuted: function () {
		this.isSettingMute = true;
        this.uiElements.currentVideo.muted = this._model.videoMuted;
		this.isSettingMute = false;
    },

    showLoadingAnimation: function () {
        this.uiElements.loadingAnimation.style.display = 'inline';
    },

    hideLoadingAnimation: function () {
        this.uiElements.loadingAnimation.style.display = 'none';
    },

    showNavigation: function () {
        this.uiElements.navigation.style.display = 'block';
    },

    updateNavigation: function () {
        if (this._model.hasSlidesToDisplay())
        {
            this.updateNavigationButtonsAndDisplay();
            this.showNavigation();
        }
        else
        {
            this.hideNavigation();
        }
    },

    updateNavigationButtonsAndDisplay: function () {
        this.updateCurrentNumberDisplay();
        this.updateTotalNumberDisplay();

        this.updateFirstPreviousButtons();
        this.updatePlayPauseButtons();
        this.updateNextLastButtons();
    },

    updateCurrentNumberDisplay: function () {
        this.uiElements.currentSlideNumber.innerHTML = this._model.getCurrentSlideNumber();
    },

    updateTotalNumberDisplay: function () {
        var totalNumberText = this._model.getSlideCount();

        if (this._model.areThereMoreLoadableSlides()) {
            totalNumberText += '+';
        }

        this.uiElements.totalSlideNumber.innerHTML = totalNumberText;
    },

    updateFirstPreviousButtons: function () {
        var currentlyOnFirstSlide = (this._model.getCurrentSlideNumber() == 1);

        this.uiElements.firstNavButton.disabled = currentlyOnFirstSlide;
        this.uiElements.previousNavButton.disabled = currentlyOnFirstSlide;
    },

    updatePlayPauseButtons: function () {
        if (this._model.isPlaying) {
            this.uiElements.playButton.style.display = 'none';
            this.uiElements.pauseButton.style.display = 'inline';
        }
        else {
            this.uiElements.playButton.style.display = 'inline';
            this.uiElements.pauseButton.style.display = 'none';
        }
    },

    updateNextLastButtons: function () {
        var currentlyOnLastSlide = (this._model.getCurrentSlideNumber() == this._model.getSlideCount());

        this.uiElements.nextNavButton.disabled = currentlyOnLastSlide;
        this.uiElements.lastNavButton.disabled = currentlyOnLastSlide;
    },

    hideNavigation: function () {
        this.uiElements.navigation.style.display = 'none';
    },

    showThumbnails: function () {
        this.clearThumbnails();

        if (this._model.getSlideCount() > 1) {
            var nextSlides = this._model.getNextSlidesForThumbnails();
            var _this = this;

            for (var i = 0; i < nextSlides.length; i++) {
                var slide = nextSlides[i];

                var showGreyedOut = !slide.isPreloaded
                this.displayThumbnail(slide.previewFileUrl, slide.id, showGreyedOut);

                slide.clearCallback();
                slide.addCallback(function () {
                    var callbackSlide = this;
                    _this.removeThumbnailGreyness(callbackSlide.id);
                    _this._model.preloadNextUnpreloadedSlideAfterThisOneIfInRange(callbackSlide);
                });
            }
        }
    },

    displayThumbnail: function (thumbnailImageUrl, id, showGreyedOut) {
        var thumbnailList = this.uiElements.thumbnailList;

        var newThumbnail = document.createElement("div");
        newThumbnail.classList.add("thumbnail");
        newThumbnail.setAttribute('title', id);

        var _this = this;
        newThumbnail.onclick = function () {

            _this._model.moveToSlide(id);
        };

        var newThumbnailImage = document.createElement("img");
        newThumbnailImage.id = 'thumbnail-image-' + id;
        newThumbnailImage.classList.add("thumbnail-image");
        newThumbnailImage.src = thumbnailImageUrl;

        if (showGreyedOut) {
            newThumbnailImage.classList.add("thumbnail-image-greyed-out");
        }

        newThumbnail.appendChild(newThumbnailImage);
        thumbnailList.appendChild(newThumbnail);
    },

    removeThumbnailGreyness: function (id) {
        var thumbnail = document.getElementById('thumbnail-image-' + id);

        if (thumbnail != null) {
            this.removeClass(thumbnail, 'thumbnail-image-greyed-out');
        }
    },

    removeClass: function(element, classToRemove) {
        var regex = new RegExp('(?:^|\\s)' + classToRemove + '(?!\\S)')
        element.className = element.className.replace(regex, '');
    },

    clearThumbnails: function () {
        var thumbnailList = this.uiElements.thumbnailList;

        while (thumbnailList.firstChild) {
            thumbnailList.removeChild(thumbnailList.firstChild);
        }
    },

    getSearchText: function () {
        return this.uiElements.searchTextBox.value;
    },

    setFocusToSearchBox: function() {
        this.uiElements.searchTextBox.focus();
    },
	
	removeFocusFromSearchTextBox: function () {
        this.uiElements.searchTextBox.blur();
    },

    removeFocusFromSearchButton: function () {
        this.uiElements.searchButton.blur();
    },

    updateSitesToSearch: function () {
        var sitesToSearchElements = this.uiElements.sitesToSearch;

        for (var i = 0; i < sitesToSearchElements.length; i++) {
            var siteToSearch = sitesToSearchElements[i];

            var site = siteToSearch.value;
            var checked = this._model.sitesToSearch[site];

            siteToSearch.checked = checked;
			
			if (site == SITE_DERPIBOORU)
			{
				this.uiElements.derpibooruApiKeyContainer.style.display = checked ? 'inline' : 'none';
			}
        }
    },

    updateOptions: function () {
        this.updateSecondsPerSlide();
        this.updateMaxWidth();
        this.updateMaxHeight();
    },

    getSecondsPerSlide: function () {
        return this.uiElements.secondsPerSlideTextBox.value;
    },

    updateSecondsPerSlide: function () {
        this.uiElements.secondsPerSlideTextBox.value = this._model.secondsPerSlide;
    },

    enableOrDisableMaxWidthAndHeight: function () {
        var textBoxesDisabled = !this._model.areMaxWithAndHeightEnabled();

        this.uiElements.maxWidthTextBox.disabled = textBoxesDisabled;
        this.uiElements.maxHeightTextBox.disabled = textBoxesDisabled;
    },

    getMaxWidth: function () {
        return this.uiElements.maxWidthTextBox.value;
    },

    updateMaxWidth: function () {
        var maxWidth = this._model.maxWidth;

        if (maxWidth == null)
        {
            maxWidth = "";
        }
        
        this.uiElements.maxWidthTextBox.value = maxWidth;
        this.tryToUpdateSlideSize();
    },

    getMaxHeight: function () {
        return this.uiElements.maxHeightTextBox.value;
    },

    updateMaxHeight: function () {
        var maxHeight = this._model.maxHeight;

        if (maxHeight == null) {
            maxHeight = "";
        }

        this.uiElements.maxHeightTextBox.value = maxHeight;
        this.tryToUpdateSlideSize();
    },

    getAutoFitSlide: function () {
        return this.uiElements.autoFitSlideCheckBox.checked;
    },
	
	getIncludeImages: function () {
        return this.uiElements.includeImagesCheckBox.checked;
    },
	
	getIncludeGifs: function () {
        return this.uiElements.includeGifsCheckBox.checked;
    },
	
	getIncludeWebms: function () {
        return this.uiElements.includeWebmsCheckBox.checked;
    },

    updateAutoFitSlide: function () {
        this.uiElements.autoFitSlideCheckBox.checked = this._model.autoFitSlide;

        this.enableOrDisableMaxWidthAndHeight()

        this.tryToUpdateSlideSize();
    },
	
	updateIncludeImages: function () {
        this.uiElements.includeImagesCheckBox.checked = this._model.includeImages;
    },
	
	updateIncludeGifs: function () {
        this.uiElements.includeGifsCheckBox.checked = this._model.includeGifs;
    },
	
	updateIncludeWebms: function () {
        this.uiElements.includeWebmsCheckBox.checked = this._model.includeWebms;
    },
	
	getBlacklist: function () {
        return this.uiElements.blacklist.value;
    },

    updateBlacklist: function () {
        this.uiElements.blacklist.value = this._model.blacklist.trim();
		//this.validateBlacklist();
    },
	
	validateBlacklist: function () {
        //var blacklist = this.uiElements.blacklist.value;
		
		//var pattern = new RegExp(/[^\s]+/i);
		//console.log(pattern.test(blacklist));
    },
	
	getDerpibooruApiKey: function () {
        return this.uiElements.derpibooruApiKey.value.trim();
    },

    updateDerpibooruApiKey: function () {
        this.uiElements.derpibooruApiKey.value = this._model.derpibooruApiKey;
    },

    openUrlInNewWindow: function (url) {
        window.open(url, '_blank');
    },
	
	showSiteOffline: function (site) {
		var sitesToSearchElements = this.uiElements.sitesToSearch;
		
		for (var i = 0; i < sitesToSearchElements.length; i++)
		{
			var siteToSearch = sitesToSearchElements[i];
			
			if (siteToSearch.value == site)
			{
				siteToSearch.parentElement.classList.add("siteOffline");
				return;
			}			
		}
	}
};