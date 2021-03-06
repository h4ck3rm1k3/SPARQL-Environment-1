/** @namespace */
environment.resolver = {
  libraryFile:'library.json',
  library:null,
  resolved:{

  }
};


/**
 * Gets the contents of the library property or if they do not exist gets them from the library file.
 */
environment.resolver.getLibrary = function() {
  if (this.library == null) {
    var temp_library;
    $.ajax({
      url: "library.json",
      async: false,
      dataType:'json',
      success:function (data){
        temp_library = data;
      }
    });
    this.library = temp_library;
  }
  return this.library;
}

/**
 * Loads the files necessary for a given plugin based on the URN and then calls
 * the provided callback function.
 * @param {urn} string The URN for the plugin.
 * @param {callback} function The function called upon completion with one
 * boolean parameter for success.
 */

environment.resolver.resolvePluginURN = function (urn,callback) {
  if (this.resolved[urn]) {
    if (this.resolved[urn].status == "loaded") {
      callback();
    } else {
      this.resolved[urn].callbackFunctions.push(callback);
    }
    return;
  } else {
    this.resolved[urn] = {
      status:'loading',
      loaded:0,
      total: this.getLibrary()[urn].length,
      success:true,
      loadedResource:function (url) {
        this.loaded++;
        if (this.loaded == this.total) {
          this.status = 'loaded';
          for (var index in this.callbackFunctions) {
            this.callbackFunctions[index](this.success);
          }
        }
      },
      callbackFunctions:[callback]
    }
  }

  that = this;
  $.each(this.getLibrary()[urn],function(index, url) {
    var re = /(?:\.([^.]+))?$/;
    var extension = re.exec(url)[1];
    if (extension == "js") {
      $.ajax({
        url: url,
        dataType: 'script',
        async:false,
        success: function (data) {
          console.log('Loaded JS for Plugin: '+urn);
          that.resolved[urn].loadedResource(url);
        }
      });
    } else if (extension == "css") {
      $('<link/>', {
         rel: 'stylesheet',
         type: 'text/css',
         href: url
      }).appendTo('head');
      that.resolved[urn].loadedResource(url);
    } else {
      console.log('Failed to load resource (unrecognized extension): '+url);
      that.resolved[urn].loadedResource(url);
      that.resolved[urn].success = false;
    }
  });
}
