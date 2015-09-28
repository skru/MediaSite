(function() {

    //makes the main navbar sticky depending on screen width.
    if ($(window).width() < 768) {
        $('#sticky-header').addClass("navbar-fixed-top");
    } else {
        $('#sticky-header').removeClass("navbar-fixed-top");
    }
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('#sticky-header').addClass("navbar-fixed-top");
        } else {
            $('#sticky-header').removeClass("navbar-fixed-top");
        }
    });

    //$(".navbar-collapse").css({ maxHeight: $(window).height() - $(".navbar-header").height() + "px" });

    // Dummy data normally fetched form server
    var jsonData = {
        "headlines": [{
            "title": "Headline 1",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            "url": "https://unsplash.it/800/600/?random"
        }, {
            "title": "Headline 2",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            "url": "https://unsplash.it/800/600/?random"
        }]
    };

    // adds one story to dom (data object, element to append to)
    var addStory = function(obj, el) {

        var article = $('<article class="news-article col-md-6"></article>');
        article.css('display', 'none'); // set display to none so it can be faded in

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
        img.css('display', 'none');

        // Article content
        $('<p/>', {
            text: obj.content
        }).appendTo(article);

        article.appendTo(el); //Add to the dom
        article.fadeIn(1000); //fade it in

        //when real image has loaded replace dummyImg wirh real one
        img.on('load', function() {
            dummyImg.replaceWith(img);
            //img.prependTo(article);
            img.fadeIn(1000);
        });
    };

    // add  headlines
    $.each(jsonData.headlines, function(index, value) {
        addStory(value, '#headline-cont');
    });


    var pageNum = 0; // The latest page loaded
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
            //data: {callback: pageNum}, 
            success: function(data) {
                // Update global next page variable
                hasNextPage = true; //.hasNext;
                for (var i in data) {
                    addStory(data[i], '#newsStories-cont');
                }
            },
            error: function(data) {
                // When I get a 400 back, fail safely
                hasNextPage = false;
                content = false;
                var article = $('<article id="end-of-content" class="col-md-6">No more news</article>');
                article.appendTo('#newsStories-cont');
                $('#loading-image').hide();
            },
        });
    };
    loadItems(); // loads first five stories on page load

    // Binds ajax start/stop events to a loading gif
    $('#loading-image').bind('ajaxStart', function() {
        $(this).show();
    }).bind('ajaxStop', function() {
        $(this).hide();
    });

    // Detect scroll events if available content from server
    // Uses setTimeout to limit amount of events fired 
    // https://dannyvankooten.com/delay-scroll-handlers-javascript/
    var content = true;
    var timer;
    if (content) {
        $(window).scroll(function() {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = window.setTimeout(function() {
                if (($(window).scrollTop() + $(window).height() > $(document).height()) - 300 && content) {
                    loadItems();
                }
            }, 200);
        });
    }

    //scroll back to top
    $("a[href='#top']").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        return false;
    });

    // Handles touch swibe event. http://hammerjs.github.io/
    var hammertime = new Hammer(document.getElementById("page-body"));
    hammertime.on('swipeleft', function(ev) {
        console.log(ev);
        /*         $('#hammer').hide(); */
        $('#hammer').animate({
            "left": "-100%"
        }, "fast");
        $('html, body').css({

        });

    });
    hammertime.on('swiperight', function(ev) {
        $('#hammer').animate({
            "left": "0"
        }, "fast");
        $('html, body').css({

        });
    });

    // Clock function. would normally get time/date from server but thought a realtime clock looked better
    tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    function GetClock() {
        var d = new Date();
        var nday = d.getDay(),
            nmonth = d.getMonth(),
            ndate = d.getDate(),
            nyear = d.getYear(),
            nhour = d.getHours(),
            nmin = d.getMinutes(),
            nsec = d.getSeconds(),
            ap;

        if (nhour === 0) {
            ap = " AM";
            nhour = 12;
        } else if (nhour < 12) {
            ap = " AM";
        } else if (nhour === 12) {
            ap = " PM";
        } else if (nhour > 12) {
            ap = " PM";
            nhour -= 12;
        }

        if (nyear < 1000) nyear += 1900;
        if (nmin <= 9) nmin = "0" + nmin;
        if (nsec <= 9) nsec = "0" + nsec;

        $('.clockbox').html("" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "");
    }

    GetClock();
    setInterval(GetClock, 1000);
}());