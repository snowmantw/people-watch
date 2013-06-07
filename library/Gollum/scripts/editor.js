
(function(){

// Initialize this pagelet.

initialize = function()
{
    // Move this pagelet in lightbox.
    // TODO: these lines should be contexted in some Event context.
    patchjQuery()
    activateWiki()
    UI('#note-editor').$().appendTo('#note-edit-box .lightbox-content').done()()
    UI('#gollum-editor-submit').forward('click', function(e){e.preventDefault(); return "note-editor-save"}).done()()
}

// Gollum use deprecated jQuery...
patchjQuery = function()
{
    var matched, browser;

    // Use of jQuery.browser is frowned upon.
    // More details: http://api.jquery.com/jQuery.browser
    // jQuery.uaMatch maintained for back-compat
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    browser = {};

    matched = jQuery.uaMatch( navigator.userAgent );
    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
        browser.webkit = true;
    } else if ( browser.webkit ) {
        browser.safari = true;
    }

    jQuery.browser = browser;
}

createPage = function(html)
{
    var record = { 'content': html
                 , 'username': Site.session()["username"]
                 , 'date': (new Date()).toLocaleDateString()
                 , 'time': (new Date()).toLocaleTimeString()
                 }
    return IO(record).
        post('/create').
        tie(function(result)
        {
            return Alert.success("note saved.")
        }
        ).
        _(function()
        {
            // Low level codes...
            Notifier.trigger('note-editor-preview-close')
        }).
        done()
}

// newtype Title = String
// Title -> HTML -> UI ()
renderPreview = function(title, html)
{

    return UI('#wiki-preview').$().
        as('$preview').
        tie(function()
        {
            return UI('#wiki-content').$().
                hide().
                done()
        }).
        tie(function()
        {
            // `let` is ok.
            // Preview's datetime will be different if saving it very late. 
            var content = _.template(Templates['pages-note-preview'])(
                          { _html_: html
                          , _username_: Site.session()["username"]
                          , _date_: (new Date()).toLocaleDateString()
                          , _time_: (new Date()).toLocaleTimeString()
                          })
            return UI(content).$().
                as('$content').
                tie( function()
                {
                    return UI(this.$content).$().
                        select('#note-preview-close').
                        forward('click', function(e){ return 'note-editor-preview-close'}).
                        done()
                } ).
                tie( function()
                {
                    return UI(this.$content).$().
                        select('#note-preview-create').
                        forward('click', function(e){ return 'note-editor-save'}).
                        done()
                } ).
                _(function(){ return this.$content }).
                done()
        }).
        tie(function($content)
        {
            return UI(this.$preview).$().append($content).done()
        }).
        show().
        find('#note-preview-title').
        text(title).
        done()
}

Event('note-editor-preview-close').
    tie
    (  function(e)
    {
        return UI('#wiki-preview').$().
            hide().
            empty().
            tie(function()
            {
                return UI('#wiki-content').$().
                show().
                done()
            }).
            done()
    }
    ).
    done()()

Event('note-editor-preview').
    tie
    ( function(e)
    {
      return UI('#gollum-editor-page-title').$().val().as('title').
        tie(function()
        {
            return UI('#gollum-editor-body').$().
            _( function(body)
               {
                    var converter = new Markdown.Converter()
                    return converter.makeHtml($(body).val())
               }
            ).
            done()
        }).
        tie( function(html)
        {
            return renderPreview(this.title, html)
        }).
        done() 
    }
    ).
    done()()

Event('note-editor-save').
    tie
    (  function(e)
    {
       return UI('#gollum-editor-body').$().
        _( function(body)
           {
                var converter = new Markdown.Converter()
                return converter.makeHtml($(body).val())
           }
         ).
        tie( createPage ).
        done() 
    }
    ).
    tie(function()
    {
        return UI('div.modal-backdrop.fade.in').$().
            _(function(dom)
            {
                // Low level codes.
                // Because lightbox didn't provide manipulating APIs.
                $(dom).click()
            }).
            done()
    }).
    done()()

initialize()

})()
