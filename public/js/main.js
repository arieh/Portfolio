(function($){
var fx = new Fx.Scroll(document.body);

$('site-nav').delegateEvent('click',{
    'a' :function(e){
            var target = $(e.target).get('href').substr(1)
                , pos = $(target).getPosition().y;
            
            fx.start(0,pos-109);
    }
} , true, false);

})(document.id);