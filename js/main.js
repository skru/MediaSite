(function(){
    
    // simply makes the main navbar sticky depending on screen width.
    // ( quick fix to make the desktop site look a little nicer )
    if ( $(window).width() < 768 ) {
            $('#sticky-header').addClass( "navbar-fixed-top" );
        } else {
            $('#sticky-header').removeClass( "navbar-fixed-top" );
        }
    $( window ).resize(function() {
        if ( $(window).width() < 768 ) {
            $('#sticky-header').addClass( "navbar-fixed-top" );
        } else {
            $('#sticky-header').removeClass( "navbar-fixed-top" );
        }
    });
    
	// Dummy data (would come from server)
	var jsonData = {
    "headlines": [
        {
            "title": "Headline 1",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            "url": "http://lorempixel.com/400/200/"
        },
        {
            "title": "Headline 2",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            "url": "http://lorempixel.com/400/200/"
        }
    ]};


	 // adds one story to dom (data object, element to append to)
    var addStory = function(obj,el) {
        
        var article = $('<article class="news-article col-md-6"></article>');
        article.css({'left':'100%'}); // set display to none so it can be faded in
        
        // Article header
        $('<h3/>', {
            text: obj.title,
        }).appendTo(article);
        
        // append a dummy loading gif to article.
        var dummyImg = $('<img/>', {
            addClass: 'img-responsive dummy-img'
        }).appendTo(article);
        
        // real image 
        var img = $('<img/>', {
            src: obj.url,
            alt: obj.title,
            addClass: 'img-responsive news-img'
        });
        img.css('display','none');
        
        // Article content
        $('<p/>', {
            text: obj.content
        }).appendTo(article);
        
        article.appendTo(el); // Add to the dom
        article.animate({"left":"0"}, "fast"); //animate in to view
      
        
        //when real image has loaded replace dummyImg
        img.on('load', function(){
            dummyImg.replaceWith(img);
            img.fadeIn(1000);
        });
    };	
	  

	// add  headlines
	$.each( jsonData.headlines, function( index, value ){
        addStory(value, '#headline-cont');
	});
    
    // add Advert
    var addAdvert = function() {
        var article = $('<article class="col-md-6 advert">Advertisement</article>');
        article.appendTo('#newsStories-cont');
    };
 
 	// Listen for scroll event if content still to be loaded
 	// Throttles the events so not to fire evry pixel
 	// Adapted from this blog post:
	// https://dannyvankooten.com/delay-scroll-handlers-javascript/
    var content = true;
	var timer;
	if (content) {
		$(window).scroll(function() {
		    if(timer) {
		        window.clearTimeout(timer);
		    }
		    timer = window.setTimeout(function() {
		       if(($(window).scrollTop() + $(window).height() > $(document).height()) - 300 && content) {
		       		loadItems();
			    } 
		    }, 200);
		});
	}

	//  AJAX functionality.

	// Scroll globals
	var pageNum = 0; // Variable to pass to back end pagination
	var hasNextPage = true; // Indicates whether to expect another page after this one
	
    var loadItems = function() {
        // If the next page doesn't exist, just quit now 
        if (hasNextPage === false) {
            return false;
        }
        // Update the page number
        pageNum = pageNum + 1;
        // Configure the url we're about to hit
        $.ajax({
            type: 'GET',
            url: 'http://bapp.skru.webfactional.com/jsonp',

            dataType: 'jsonp',
            //data: {callback: pageNum}, // this is where i would pass the callback in
            success: function(data) {
                // Update global next page variable
                hasNextPage = true; 
                for (var i in data) {
                	// add story to dom
                    addStory(data[i], '#newsStories-cont');
                }
                addAdvert(); // Add Advert to DOM
            },
            error: function(data) {
            	$('#loading-image').hide();
                // When I get a 400 back, fail safely
                hasNextPage = false;
                content = false;
                // add "No more stories" to DOM
                var article = $('<article id="end-of-content" class="col-md-6">No more news</article>');
                article.appendTo('#newsStories-cont');
                
            },
        });
    };
    loadItems(); // loads first five stories on page load
    
   
    
    //binds ajax start/stop events to a loading gif
    $('#loading-image').bind('ajaxStart', function(){
        $(this).show();
    }).bind('ajaxStop', function(){
        $(this).hide();
    });
    
    //scroll back to top
    $("a[href='#top']").click(function() {
        $("html, body").animate({
            scrollTop: 0 
        }, "slow");
        return false;
    });
    
    // Swiping functionality. 

    var centered = true; // determines if on main page
    var menuopen = false;
    var commentsopen = false;
    var hammertime = new Hammer(document.getElementById("page-body"));
    
    hammertime.on('swipeleft', function(ev) {
        if (menuopen) {
            $('#menu').animate({"left":"-100%"}, "fast");
            $('.content-cont').delay(250).fadeIn(250);
            centered = true;
            menuopen = false;
        } else if (centered) {
            $('.content-cont').fadeOut(250);
            $('#comments').delay(250).animate({"left":"0"}, "fast");
            commentsopen = true;
            centered = false;
        }
        
    });
    hammertime.on('swiperight', function(ev) {
        if (centered) {
            $('.content-cont').fadeOut(250);
            $('#menu').delay(250).animate({"left":"0"}, "fast");
            centered = false;
            menuopen = true;
        } else if (commentsopen) {
            $('#comments').animate({"left":"100%"}, "fast");
            $('.content-cont').delay(250).fadeIn(250);
            commentsopen = false;
            centered = true;
            
            
        }
        
    });
    
    $("#myNav").affix({
        offset: { 
            top: 300
     	}
    });
    

    //superflous clock
    
    tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

    function GetClock(){
    var d=new Date();
    var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear(),nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;

     if(nhour===0){ap=" AM";nhour=12;}
    else if(nhour<12){ap=" AM";}
    else if(nhour===12){ap=" PM";}
    else if(nhour>12){ap=" PM";nhour-=12;}

    if(nyear<1000) nyear+=1900;
    if(nmin<=9) nmin="0"+nmin;
    if(nsec<=9) nsec="0"+nsec;

    $('.clockbox').html(""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"");
    }


    GetClock();
    setInterval(GetClock,1000);
    

 
	

}());