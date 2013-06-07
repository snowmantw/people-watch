
(function()
{

window.Site =
{
     __paths__: function()
    {
        return {
            "classmates"        : "/pages/classmates"
        ,   "notes"             : "/pages/notes"
        ,   "presentations"     : "/pages/presentations"
        ,   "video"             : "/pages/video"
        ,   "information"       : "/pages/information"
        ,   "base"              : ""
        }
    }
    ,__urls__: function()
    {
        return {
            "base"              : ""
        }
    }
    ,__apis__: function()
    {   
        return {
            "notes"              : "/api/notes"
        ,   "user_profiles"       : "/api/user_profiles"
        }
    }
    ,pathClassmates: function(id)
    {
        if("undefined" == typeof id){ id = ""}
        return Site.__paths__()["classmates"]+"/"+id
    }
    ,pathNotes: function(id)
    {
        if("undefined" == typeof id){ id = ""}
        return Site.__paths__()["notes"]+"/"+id
    }
    ,pathPresentations: function(id)
    {
        if("undefined" == typeof id){ id = ""}
        return Site.__paths__()["presentations"]+"/"+id
    }
    ,pathVideo: function(id)
    {
        if("undefined" == typeof id){ id = ""}
        return Site.__paths__()["video"]+"/"+id
    }
    ,pathInformation: function(id)
    {
        if("undefined" == typeof id){ id = ""}
        return Site.__paths__()["information"]+"/"+id
    }
    ,apiNotes: function(id)
    {
        return Site.__apis__()["notes"]+"/"+id
    }
    ,apiUserProfile: function(id)
    {
        return Site.__apis__()["user_profiles"]+"/"+id
    }
    ,urlBase: function()
    {
        return Site.__urls__()["base"]
    }

    // Session info like username and current course.
    // Should be set while initialized.
    // Replaced while new session got established.
    ,session: function()
    {
        return {} 
    }
}

window.Main =
{
     setup: function()
    {
        $(document).on("mobileinit", function(){
            $.mobile.defaultPageTransition = 'slide';
        });

        $(document).on("ready", function(){

            // Simulate read environment and create new app.
            Site.session = function()
            {
                return { username: "dummy"
                       , course: "Dummy Course"
                       }
            }

            $.mobile.defaultPageTransition = 'slide';

            // Testing codes.
            
            $('.activity > span.from, .activity > span.subject').click(function(e)
            {
                if( "0" == e.target.parentElement.dataset.toggle )
                {
                    e.name = 'activity-expand'
                    e.target.parentElement.dataset.toggle  = "1"
                }
                else
                {
                    e.name = 'activity-collapse'
                    e.target.parentElement.dataset.toggle  = "0"
                }

                Notifier.trigger(e)
            })

            $('#media-page-comments').click(function(e)
            {   
                e.preventDefault()
                Notifier.trigger({'name': 'comments-expand'})
            })

            Notifier.on('activity-expand', function(e)
            {
                $(e.target.parentElement).find('.activity-content').slideDown()
            })
            Notifier.on('activity-collapse', function(e)
            {
                $(e.target.parentElement).find('.activity-content').hide()
            })
            Notifier.on('comments-expand', function(e)
            {
                var dummy_comments = [
                , {'contents': "Contents of comment", 'from': "Greg Weng", 'date': "2013/03/10"}
                , {'contents': "Contents of comment", 'from': "Greg Weng", 'date': "2013/03/10"}
                ] 

                UI()
                .tie( Main.templateComments(dummy_comments) )
                ._(function(html)
                {   
                    $('.content-detail-page.activitied .comments-wrapper').replaceWith( Main.genericRender(html) )
                })
                ._(function()
                {
                    // jQuery mobile need this.
                    $('.content-detail-page.activitied .comments [name="editor"]').textinput().css('min-height','130px')
                    $('.content-detail-page.activitied .comments .button.submit').button()
                })
                ._(function()
                {
                    $('.content-detail-page.activitied .comments').hide().slideDown()
                })
                .done()()
            })
            
            // Should be rewritten with Event.
            //
            // :: {'name': 'new-acitivity', 'type': activity-type,'data': described-as-protocol-based-on-the-type-of-activity }
            Notifier.on('new-activity', function(e)
            {
                switch(e.type)
                {
                // TODO: each handler functions
                case "Gazette":
                    Main.handleNewGazette(e.data)
                  break;
                case "News":
                    Main.handleNewNews(e.data)
                  break;
                case "Sharing":
                    Main.handleNewSharing(e.data)
                  break;
                default:
                    throw "Unknow type of activity: "+e.type
                }
            })

            Notifier.on('take-photo-initialize', function(e)
            {
                Main.handleCameraInitialize('#take-photos video')
            }) 

            Notifier.on('take-photo-snap', function(e)
            {
                Main.handleTakePhotoSnap()
            }) 
        });
    } // $ Setup

    // CommentData: {'contents': "Contents of comment", 'from': "Greg Weng", 'date': "2013/03/10"}
    //
    // [ CommentData ] -> (() -> UI HTML)
    ,templateComments: function(arr_comment)
    {
    return function()
    {
        var gen_cs = UI()
            ._(function()
            {
                return _.reduce(arr_comment, function(mem, cdata)
                {
                    mem.push( Main.templateComment(cdata)()().extract() )
                    return mem

                }, [])
            })
            ._(function(cs)
            {
                return cs.join("")
            })
            .idgen()

        return UI('#template-comments').$()
            .text()
            ._(function($s)
              {
                  return $s.replace(/^[\t\n\r ]*/,"")
              })
            .as('list-template')
            .tie(gen_cs)
            ._(function($tcs)
              {
                  return _.template(this['list-template'])({'comments_block':$tcs})
              })
            .done()
    }}

    // CommentData: {'contents': "Contents of comment", 'from': "Greg Weng", 'date': "2013/03/10"}
    //
    // :: CommentData -> (() -> UI HTML)
    ,templateComment: function(data_comment)
    {
    return function()   
    {
        return UI('#template-comment-block').$()
            .text()
            ._(function($s)
              {
                  return $s.replace(/^[\t\n\r ]*/,"")
              })
            ._(function($ts)
              {
                  return _.template($ts)(data_comment)
              })
            .done()
    }}

    // HTML -> DOM
    ,genericRender: function(html)
    {
        return $(html).get(0)
    }

    // :: Selector -> UI HTML
    ,template: function(slc)
    {
        return UI(slc).$()
            .text()
            ._(function($s)
              {
                  return $s.replace(/^[\t\n\r ]*/,"")
              })
            .done()
    }

    // SlideData: {'img_url': "media/dummy-slide.png", 'title': "All thing about SlideShare", 'num_pages': 308}
    //
    // :: SlideData -> UI TemplateContent
    ,templateActivitySlide: function(data)
    {
        return UI()
            .tie( function(){ return Main.template('#template-activity-content-slide') } )
            ._(function(tpl)
            {
                return _.template(tpl)(data)
            })
            .done()
    }

    // MessageData: {'from': 'Greg Weng', 'message': "Message here"}
    //
    // :: MessageData -> UI TemplateContent
    ,templateActivityMessage: function(data)
    {
        return UI()
            .tie( function(){ return Main.template('#template-activity-content-message') } )
            ._(function(tpl)
            {
                return _.template(tpl)(data)
            })
            .done()
    }

    // fn_tpl: Depends on which type you want to generate. Like "Main.templateActivityMessage"
    //
    // ActivityData: {'from': 'Greg Weng', 'subject': "Some Subject", "star_activitied": true } 
    //
    // :: ActivityData -> (() -> UI TemplateContent) -> UI TemplateContent
    ,templateActivity: function(data, fn_tpl)
    {
        data['star_icon']       = data['star_activitied']? "icon-star" : "icon-star-empty"
        data['star_activitied'] = String(data['star_activitied'])
        
        return UI()
            .tie( fn_tpl ).as('html_content')
            .tie( function(){ return Main.template('#template-activity') } )
            ._(function(tpl_activity)
            {
                data['contents'] = this['html_content']
                return _.template(tpl_activity)(data)
            })
            .done()
    }

    // Should give a DOM initialize the page with the camera.
    //
    // :: DOMTrigger -> UI EventName
    ,forwardTakePhotosTrigger: function(dom)
    {
        return UI(dom).$().forward('click', function(e)
        {
            e.name = 'take-photo-initialize'
            return 'take-photo-initialize'
        }).done()
    }

    // :: DOM -> UI EventName
    ,forwardActivityClick: function(dom)
    {
        return UI(dom).$().select('.subject,.from').forward('click', function(e)
        {
            if( "0" == e.target.parentElement.dataset.toggle )
            {
                e.name = 'activity-expand'
                e.target.parentElement.dataset.toggle  = "1"
            }
            else
            {
                e.name = 'activity-collapse'
                e.target.parentElement.dataset.toggle  = "0"
            }
            return e.name

        }).done()
    }

    // {'activity': Activity, 'content': Content}
    ,handleNewActivity: function( data , fncontent)
    {
        UI()
            .tie( function(){ return Main.templateActivity(data['activity'], fncontent) } )
            ._(function(html)
            {
                var dom = $(html).get(0)
                $('#activities-wall').append(dom)
                return dom
            })
            .tie(function(dom)
            {
                return Main.forwardActivityClick(dom)
            })
            .done()()
    }

    // {'activity': Activity, 'content': Content}
    ,handleNewMessage: function(data)
    {
        var fncontent = function()
        {
            return Main.templateActivityMessage(data['content'])
        } 

        // Do nothing special.
        Main.handleNewActivity(data, fncontent)
    }

    // {'activity': Activity, 'content': Content}
    ,handleNewSlide: function(data)
    {
        var fncontent = function()
        {
            return Main.templateActivitySlide(data['content'])
        } 

        // Do nothing special.
        Main.handleNewActivity(data, fncontent)
    }

    // Handle with a fixed camera page.
    //
    // `slc` may be '#take-photos video' 
    ,handleCameraInitialize: function(slc)
    {
        UI(slc).$()._(function($video)
        {
            var video = $video.get(0)
            if(navigator.getUserMedia) { // Standard
                navigator.getUserMedia({'video': true}, function(stream) {
                    video.src = stream;
                    video.play();
                }, function(err){ throw "Can't get video device"});
            } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
                navigator.webkitGetUserMedia({'video':true}, function(stream){
                    video.src = window.webkitURL.createObjectURL(stream);
                    video.play();
                }, function(err){ throw "Can't get video device"});
            }

        }).done()()
    }

    ,handleTakePhotoSnap: function()
    {
        UI('#take-photos canvas').$()._(function($canvas)
        {
            var video = $('#take-photos video').get(0)
            var canvas = $canvas.get(0)
            context = canvas.getContext("2d")
            context.drawImage(video, 0, 0, 640, 480)

            $('#take-photos canvas').addClass('activated')
            $('#take-photos video').addClass('deactivated')
        }).done()() 
    }
}

Main.setup()

fluorine.infect()
fluorine.Notifier.init()

})()
