(function()
{
window.Demo =
{
    // New activities come.
     activities: function()
    {
        var macts = [ 
          {id:1, time: Date.now(), title: "在第17次司法及法制委員會發言", type: 'Gazette', summary: { ln: "200", gid: "G171", content: "5,000 元以上就要扣 2%，換句話說，18%會變成 16%，9%會變成 7%，所以你要去思考這個問題。第二個，為什麼..."} } 
        , {id:2, time: Date.now()-2000, title: "在第18次教育及文化委員會發言", type: 'Gazette', summary: { ln: "384", gid: "G181", content: "主席、各位列席官員、各位同仁。今天我們討論能源國家型科技計畫執行成效，如果朱主委還記得的話，本席上次質詢時也稍微帶過這個計畫的一些問題..."} } 
        ]

        var nacts = [
          {id:3, time: Date.now()-1500, title: "於 5/28 新聞「「政府對待第九禁區外星人如強盜」 王生：「像菲律賓」」被提及", type: 'News', summary: {content: "牆街日報-2013/5/28 立委王生今日質詢外星人人權議題...", nid: "N022", link: "http://www.theonion.com/articles/curiosity-rover-to-explore-massive-martian-synagog,32714/"} } 
        , {id:4, time: Date.now()-1200, title: "於 6/1 新聞「直轄市區最快明年恢復選舉」被提及", type: 'News', summary: {content: "治游時報-2013/6/1 立委王生要李宏願、孫小圳宣示立場", nid: "N130", link: "http://www.theonion.com/articles/study-83-of-gamblers-quit-right-before-they-would,32709/"} } 
        , {id:5, time: Date.now()-1000, title: "於 6/2 新聞「王生：未對政府施壓」被提及", type: 'News', summary: {content: "路邊社-2013/6/2 立委王生上午接受媒體詢問時說，她本人對這件事並不知情，上午詢問助理後才知全案始末...", nid: "N224", link: "http://www.theonion.com/articles/30yearold-factors-in-birthday-money,32715/"} } 
        ]

        var sacts = [
          {id:6, time: Date.now()-3000, title: "張保成分享了一則關於王生委員的動態給你", type:"Sharing", summary: {aid: "A012", titie: "在第8次財政委員會發言", comment: "委員居然講了這種話...", type: "Gazette"}}
        ]

        for( var i = 0; i < macts.length; i++ )
        {
            var act = macts[i]
            var mn = {'name':'new-activity', 'type': 'Gazette', 'data': {'activity': _.clone(act), 'content': {summary: act[summary] }}}
            setTimeout( function(){ Notifier.trigger(mn)  }, (i+1) * 1000 )
        }

        for( var i = 0; i < nacts.length; i++ )
        {
            var act = nacts[i]
            var mn = {'name':'new-activity', 'type': 'News', 'data': {'activity': _.clone(act), 'content': {summary: act[summary] }}}
            setTimeout( function(){ Notifier.trigger(mn)  }, (i+1) * 800 )
        }

    }
}

})()
