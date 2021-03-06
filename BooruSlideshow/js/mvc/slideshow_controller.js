function SlideshowController(uiElements) {
    this._model = new SlideshowModel();
    this._view = new SlideshowView(this._model, uiElements);
	this._model.view = this._view

    this._view.updateSitesToSearch();
    this._view.updateOptions();

    var _this = this;

    // Attach view listeners
    this._view.currentImageClickedEvent.attach(function() {
        _this.currentSlideClicked();
    });
	
	this._view.currentVideoClickedEvent.attach(function() {
        _this.currentSlideClicked();
    });
	
	this._view.currentVideoVolumeChangedEvent.attach(function() {
        _this.videoVolumeChanged();
    });

    this._view.firstNavButtonClickedEvent.attach(function () {
        _this.firstNavButtonClicked();
    });

    this._view.previousNavButtonClickedEvent.attach(function () {
        _this.previousNavButtonClicked();
    });

    this._view.nextNavButtonClickedEvent.attach(function () {
        _this.nextNavButtonClicked();
    });

    this._view.lastNavButtonClickedEvent.attach(function () {
        _this.lastNavButtonClicked();
    });
	
	this._view.goBackTenImagesPressedEvent.attach(function () {
        _this.goBackTenImagesPressed();
    });
	
	this._view.goForwardTenImagesPressedEvent.attach(function () {
        _this.goForwardTenImagesPressed();
    });

    this._view.playButtonClickedEvent.attach(function () {
        _this.playButtonClicked();
    });

    this._view.pauseButtonClickedEvent.attach(function () {
        _this.pauseButtonClicked();
    });

    this._view.enterKeyPressedOutsideOfSearchTextBoxEvent.attach(function () {
        _this.enterKeyPressedOutsideOfSearchTextBox();
    });

    this._view.searchTextChangedEvent.attach(function () {
        _this.searchTextChanged();
    });

    this._view.enterKeyPressedInSearchTextBoxEvent.attach(function () {
        _this.enterKeyPressedInSearchTextBox();
    });

    this._view.searchButtonClickedEvent.attach(function () {
        _this.searchButtonClicked();
    });

    this._view.sitesToSearchChangedEvent.attach(function (args) {
        _this.sitesToSearchChanged(args.checked, args.site);
    });

    this._view.secondsPerSlideChangedEvent.attach(function () {
		_this.secondsPerSlideChanged();
    });

    this._view.maxWidthChangedEvent.attach(function () {
        _this.maxWidthChanged();
    });

    this._view.maxHeightChangedEvent.attach(function () {
        _this.maxHeightChanged();
    });

    this._view.autoFitSlideChangedEvent.attach(function () {
        _this.autoFitSlideChanged();
    });
	
	this._view.includeImagesChangedEvent.attach(function () {
        _this.includeImagesChanged();
    });
	
	this._view.includeGifsChangedEvent.attach(function () {
        _this.includeGifsChanged();
    });
	
	this._view.includeWebmsChangedEvent.attach(function () {
        _this.includeWebmsChanged();
    });
	
	this._view.blacklistChangedEvent.attach(function () {
        _this.blacklistChanged();
    });
	
	this._view.derpibooruApiKeyChangedEvent.attach(function () {
        _this.derpibooruApiKeyChanged();
    });

    this._model.loadUserSettings();
	
	this._model.pingSites();
}

SlideshowController.prototype = {
	currentSlideClicked: function () {
        var currentSlide = this._model.getCurrentSlide();

        this._view.openUrlInNewWindow(currentSlide.viewableWebsitePostUrl);

        this._model.pauseSlideshow();
    },
	
	videoVolumeChanged: function () {
        var videoVolume = this._view.getVideoVolume();
        var videoMuted = this._view.getVideoMuted();
		
        this._model.setVideoVolume(videoVolume);
        this._model.setVideoMuted(videoMuted);
    },

    firstNavButtonClicked: function () {
        this._model.setSlideNumberToFirst();
    },

    previousNavButtonClicked: function () {
        this._model.decreaseCurrentSlideNumber();
    },

    nextNavButtonClicked: function () {
        this._model.increaseCurrentSlideNumber();
    },

    lastNavButtonClicked: function () {
        this._model.setSlideNumberToLast();
    },
	
	goBackTenImagesPressed: function () {
        this._model.decreaseCurrentSlideNumberByTen();
    },
	
	goForwardTenImagesPressed: function () {
        this._model.increaseCurrentSlideNumberByTen();
    },

    playButtonClicked: function () {
        this._model.startSlideshow();
    },

    pauseButtonClicked: function () {
        this._model.pauseSlideshow();
    },

    enterKeyPressedOutsideOfSearchTextBox: function () {
        this._model.tryToPlayOrPause();
    },

    searchTextChanged: function () {
        this._model.searchText = this._view.getSearchText();
    },

    enterKeyPressedInSearchTextBox: function () {
        this._model.searchText = this._view.getSearchText();
		this._view.removeFocusFromSearchTextBox();
        this.searchButtonClicked();
    },

    searchButtonClicked: function () {
        this._view.clearUI();
        this._view.removeFocusFromSearchButton();

        var searchText = this._model.searchText;

        if (searchText == '')
        {
            this._view.displayWarningMessage('The search query is blank.');
            return;
        }

        var selectedSitesToSearch = this._model.getSelectedSitesToSearch();

        if (selectedSitesToSearch.length == 0)
        {
            this._view.displayWarningMessage('No sites were selected to be searched.');
            return;
        }
		
		var includingImagesOrGifs = (this._model.includeImages || this._model.includeGifs);
		
		if (!includingImagesOrGifs && !this._model.includeWebms)
		{
			this._view.displayWarningMessage('You must select at least one of: Images, GIFs, and WEBMs.');
            return;
		}
		
		var message = '';
		
		if (includingImagesOrGifs && this._model.includeWebms)
			message = 'Searching for images and videos...';
		else if (includingImagesOrGifs && !this._model.includeWebms)
			message = 'Searching for images...';
		else if (!includingImagesOrGifs && this._model.includeWebms)
			message = 'Searching for videos...';
		
		this._view.displayInfoMessage(message);
		
        this._model.performSearch(searchText);
    },

    sitesToSearchChanged: function (checked, site) {
        this._model.setSiteToSearch(site, checked);
    },

    secondsPerSlideChanged: function () {
        var secondsPerSlideText = this._view.getSecondsPerSlide();

        this._model.setSecondsPerSlideIfValid(secondsPerSlideText);
    },

    maxWidthChanged: function () {
        var maxWidthText = this._view.getMaxWidth();

        if (maxWidthText == '')
        {
			maxWidthText = null;
            //this._model.maxWidth = null;
            //return;
				
        }
		else if (isNaN(maxWidthText))
			return;
		else if (maxWidthText < 1)
            return;
        
        this._model.setMaxWidth(maxWidthText);
    },

    maxHeightChanged: function () {
        var maxHeightText = this._view.getMaxHeight();
        
        if (maxHeightText == '') {
            maxHeight = null;
        }
        else if (isNaN(maxHeightText))
            return;
        else if (maxHeightText < 1)
            return;
        
        this._model.setMaxHeight(maxHeightText);
    },

    autoFitSlideChanged: function () {
        var autoFitSlide = this._view.getAutoFitSlide();

        this._model.setAutoFitSlide(autoFitSlide);
    },
	
	includeImagesChanged: function () {
        var includeImages = this._view.getIncludeImages();

        this._model.setIncludeImages(includeImages);
    },
	
	includeGifsChanged: function () {
        var includeGifs = this._view.getIncludeGifs();

        this._model.setIncludeGifs(includeGifs);
    },
	
	includeWebmsChanged: function () {
        var includeWebms = this._view.getIncludeWebms();

        this._model.setIncludeWebms(includeWebms);
    },
	
	blacklistChanged: function () {
        var blacklist = this._view.getBlacklist();

        this._model.setBlacklist(blacklist);
    },
	
	derpibooruApiKeyChanged: function () {
        var derpibooruApiKey = this._view.getDerpibooruApiKey();

        this._model.setDerpibooruApiKey(derpibooruApiKey);
    }
};