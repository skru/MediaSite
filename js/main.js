(function(){

	// Dummy data fetched from server
	var jsonData = {
    "headlines": [
        {
            "title": "Headline 1",
            "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            "image": "https://unsplash.it/800/600/?random"
        },
        {
            "title": "Headline 2",
            "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            "image": "https://unsplash.it/800/600/?random"
        }
    ],
    "newsStories": [
        {
            "today": [
                {
                    "title": "Story 1",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                },
                {
                    "title": "Story 2",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                },
                {
                    "title": "Story 3",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                },
                {
                    "title": "Story 4",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                }
            ]
        },
        {
            "yesterday": [
                {
                    "title": "Story 5",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                },
                {
                    "title": "Story 6",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                },
                {
                    "title": "Story 7",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                },
                {
                    "title": "Story 8",
                    "blurb": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                    "image": "https://unsplash.it/800/600/?random"
                }
	            ]
	        }
	    ]
	}


		
	  
	  
	
	var data = jsonData;

	// add  headlines
	$.each( data['headlines'], function( index, value ){
		var article = $('<article class="headline-article"></article>');
		$('<h3/>', {
		    text: value['title']
		}).appendTo(article);
		$('<img/>', {
			src: value['image'],
			alt: value['title'],
			addClass: 'img-responsive headline-img'
		}).appendTo(article);
		$('<p/>', {
		    text: value['blurb']
		}).appendTo(article);
		article.appendTo('#headline-cont');
	});

	var stories = []
	//add news stories
	$.each( data['newsStories'], function( index, value ){
		$.each( value, function( index, value ){
			$.each( value, function( index, value ){
				stories.unshift(value)
			});	
		});
	});

	var amount = 2;
	function addStories(amount) {
		var count = 0;
		for (x = 0; x < amount; x++) {
			var story = stories.pop()
			var article = $('<article class="news-article"></article>');

    		$('<h3/>', {
			    text: story['title']
			}).appendTo(article);

			$('<img/>', {
				src: story['image'],
				alt: story['title'],
				addClass: 'img-responsive news-img'
			}).appendTo(article);

			$('<p/>', {
			    text: story['blurb']
			}).appendTo(article);

			article.appendTo('#newsStories-cont');
		}


	}



	var content = true;
	//https://dannyvankooten.com/delay-scroll-handlers-javascript/
	var timer;
	if (content) {
		$(window).scroll(function() {
		    if(timer) {
		        window.clearTimeout(timer);
		    }
		    timer = window.setTimeout(function() {
		       if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && content) {
		       		if (stories.length > 0 ) {
		       			addStories(amount);
		       		} else {
		       			var article = $('<article id="end-of-content">No more news</article>');
       					article.appendTo('#newsStories-cont');
       					content = false;
		       		}
			        
			    } 
		    }, 300);
		});
	}



	var date = new Date();

	$('.date').text(date)
}());