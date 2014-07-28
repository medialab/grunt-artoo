;(function(undefined) {

  // Settings
  var s = <%= settings %>;

  // Detecting artoo in page
  var inject = true;
  if (typeof this.artoo === 'object') {

    // artoo is already here, we act accordingly
    // If artoo wants to be reloaded, let him do it.
    if (!artoo.settings.reload) {
      artoo.log.verbose('artoo already exists within this page. No need to ' +
                        'inject him again.');

      // We reload the settings
      artoo.loadSettings(s);

      // If artoo has some scripts registered, we want to execute them again.
      artoo.hooks.trigger('exec');
      inject = false;
    }
  }

  // Do we need to inject?
  if (inject){

    // artoo is not here, we inject it
    var body = document.getElementsByTagName('body')[0],
        script = document.createElement('script');

    // Announcing
    <%= loadingText %>

    // Setting correct attributes
    script.src = '<%= url %>';
    script.type = 'text/javascript';
    script.id = 'artoo_injected_script';
    script.setAttribute('settings', JSON.stringify(s));

    <%= random %>

    // Appending to body
    body.appendChild(script);
  }
}).call(this);
