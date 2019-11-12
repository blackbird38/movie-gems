import './style.scss';
//import '../node_modules/bootstrap/js/src/collapse.js';
import '../node_modules/bootstrap/js/src/scrollspy.js';
//import '../node_modules/bootstrap/js/src/tooltip.js';
import '../node_modules/bootstrap/js/src/dropdown.js';
import '../node_modules/bootstrap/js/src/tab.js';


require('slick-carousel');

require('bootstrap-select');

require('masonry-layout');

/*
const jQueryBridget = require('jquery-bridget'),
    Masonry = require('masonry-layout'),
    imagesLoaded = require('imagesloaded'),
    $grid = $( '.grid' )
;

// provide jQuery argument
imagesLoaded.makeJQueryPlugin( $ );

// make Masonry a jQuery plugin
jQueryBridget( 'masonry', Masonry, $ );

// Initialize the grid
$grid.masonry( {
    itemSelector: '.item',
    // use element for option
    columnWidth: '.grid-sizer',
    percentPosition: true,
    resize: true
} );

$grid.imagesLoaded().progress( () => {
    $grid.masonry('layout');
} );
*/



$(function() {

  let apiKey = 'f17ab1bc2896db1409b56b65ab7ca4d9',
      $navbar = $('#navbar'),
      $searchMovieForm = $('#search-movie-form'),
      $searchMovieBar = $('#search-movie-bar', $searchMovieForm),
      $searchedMovieList = $('#searched-movie-list'),
      $playingNowMovieCarousel = $('#playing-now-list-autoplay'),
      $popularMovieList =  $('#popular-movie-list'), //display popular movies
      $popularMovieCarousel = $('#popular-movies-list-autoplay'),
      $upcomingMovieCarousel = $('#upcoming-list-autoplay'),
      $infoMovieBox = $('#info-movie-box'), //displays info about a movie
      no_image = 'no-image.PNG',
      $mSearchMovieForm = $('#m-search-movies-form'),
      $mBtnSearchMovieYear = $('#dd-btn-search-movie-year', $mSearchMovieForm),
      $mDDMenuSearchMovieYear = $('#dd-menu-search-movie-year', $mSearchMovieForm),
      $mSearchMoviesDisplay =$('#submenu-search-movies-display'),
      $mBtnSearchMovieSortingCriteria = $('#dd-btn-search-movie-sort-by', $mSearchMovieForm),
      $movieSearchPagination = $('#movie-search-pagination'),
     // $genresInput = $('#genres'),
      genres = [],
      genresObjects = [],
      total_genres, //this solution for the moment!
      $genresList = $('#genres-list'),
      $selectedGenresList = $('#selected-genres-list'),
      $selectGenresDDMenu =$('#genres')
      ;

      getGenresAndAddToDOM($selectGenresDDMenu); //array objects (id, name) //fills the var genres! 
      //console.log("global after calling the function " +  genres.length); 
      $mDDMenuSearchMovieYear.html(`${generateYearsHTML()}`);
      //generateGenresHTML($genresList); //add genres to html 
      
      
      /*--------------------------------------------------search bar---------------------------------------- */
     

$searchMovieBar.on('keydown', function(e) {
  if (e.keyCode == 13) {
      e.preventDefault();

      let searchedWord = $searchMovieBar.val();
     // https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
      //https://api.themoviedb.org/3/search/movie?api_key=f17ab1bc2896db1409b56b65ab7ca4d9&language=en-US&query=avengers&page=1&include_adult=false
      $.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchedWord}&page=1`)
      .done(function (response) {
          $searchedMovieList.html(" ");
          $popularMovieList.html(" ");
          let tplMovie =`<li style="background-color:white;">
                          <button type="button" id="btn-hide-search" class="p-2 close btn btn-primary close-button float-right" data-toggle="tooltip" data-placement="left" title="Hide the search results" aria-label="Close"> 
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </li>`;

          //console.log(response);
          let returnedMovies = response.results;
          returnedMovies.forEach(movie => {
              tplMovie =  tplMovie + `<li class="movie list-group-item col-md-12 text-center" data-id="${movie.id}" style="padding: 2px;">
                                          <div data-sid="${movie.id}" class="text-left">
                                              <a href="#"><span style="color:gray">${movie.title} (${movie.release_date.substr(0,4)}) </span></a>
                                          </div>
                                      </li>`;
            // $movieList.append(tplMovie);

             //request movie info for a given id
           //  console.log(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`);
              $.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`)
                  .done(function (response){
                    //  console.log("search movie, 2nd get:"+ response.toSource());
                    //only movies with posters !!! find a default image to change this!!!!!!!
                   
                      let imgParent = $(`div[data-sid="${movie.id}"]`);
                  //    console.log(imgParent);
                 
                  
                  if (movie.poster_path == null){
                  //  console.log(movie.poster_path);
                //    console.log(no_image);
                        imgParent.prepend(`<img src="${no_image}">`);
                  }else {
                        imgParent.prepend(`<img src="https://image.tmdb.org/t/p/w45${movie.poster_path}">`);
                  }
                      
                    
                  })
                  .fail(function (data) {
                      alertify.error('API error.');
                      console.log('failed ' + data);
                  })
                  ;//get 2 (movie id)
          });
          $searchedMovieList.append(tplMovie);
          //append an event listener for the close button of the search list
         // console.log( $('#btn-hide-search'));
          $('#btn-hide-search').on('click', function(e) {
           $searchedMovieList.html("");

          });

          //append event listener for click => display the info for the movie
          let $links = $( '#searched-movie-list a' );
         // console.log( $links );
          $.each( $links, function( key, value ) {
           // console.log( $links[key] );
            $($links[key]).on('click', function(e){
              e.preventDefault();            
              let movieID = $($links[key]).closest("div").attr('data-sid');
            //  console.log(movieID);
              // display this in that fancy movie-box!!
              displayMovieInfo(movieID);
            }); 
          });
      })
      .fail(function (data) {
          alertify.error('API error.');
          console.log('failed');
      })
      ; //get 1 (movie search)
  }
});



/*
$searchMovieBar.focusout(function(e) {
  $searchedMovieList.addClass("hidden");
});

$searchMovieBar.focusin(function(e) {
  $searchedMovieList.removeClass("hidden");
});*/

/*--------------------------------------------------search bar---------------------------------------- */

/*--------------------------------------------------the slick carousel---------------------------------------- */

/*a carousel used by now_playing, popular, upcoming */
function displayCarousel(category){
  //console.log(category);
  //category = now_playing, popular, upcoming
  if (category){
    let $carousel,
        carouselClass,
        url;
     switch (category){
        case 'now_playing':
            $carousel = $playingNowMovieCarousel;
            url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&region=FR`;
            carouselClass = '.playing-now-autoplay';
            break;
        case 'upcoming':
            $carousel = $upcomingMovieCarousel;
            url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
            carouselClass = '.upcoming-autoplay';
            break;
        default: //popular
            $carousel = $popularMovieCarousel;
            url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
            carouselClass = '.popular-movies-autoplay';
            break; 
    }
    //making the request
    $.get(url)
    .done(function (response) {
      //console.log(response);
        $carousel.html("");
        let tplMovie ="";
       // console.log(url);
        //console.log(`${carouselClass}`);
       // console.log(response);
        let returnedMovies = response.results;
      //  console.log(returnedMovies);
        returnedMovies.forEach(movie => {
            tplMovie =  tplMovie + `<div class="movie-poster-box" data-id="${movie.id}" >
                                        <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}">
                                        <span class="movie-poster-box-text">${movie.title}</span>
                                    </div>`;
            
            /*`<div class="movie col-md-12 text-center" data-id="${movie.id}">
                                       <div>
                                            <h2>${movie.title} ${movie.vote_average}</h2>
                                            <p>${movie.overview}</p>
                                        </div>
                                        <div> 
                                            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
                                        </div>
                                    </div>`;*/
       });
        $carousel.append(tplMovie);
        $(`${carouselClass}`).slick({
            autoplay: true,
            dots: true,
            infinite: true,
            speed: 600,
            slidesToShow: 5,
            slidesToScroll: 3,
            responsive: [
              {
                breakpoint: 1300,
                settings: {
                  slidesToShow: 6,
                  slidesToScroll: 3,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 960,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 760,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 444,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 400,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
              
              // You can unslick at a given breakpoint now by adding:
              // settings: "unslick"
              // instead of a settings object
            ]
          });   
    })
    .fail(function (data) {
        alertify.error('API error.');
        console.log('failed');
    })
    ;  //get 

  } 

}

/*--------------------------------------------------playing now carousel------------------------------- */
/*display the movies that are playing now in the region (min pages = 5) */
/*https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=5&region=FR */
function displayPlayingNowMoviesCarousel(){
    displayCarousel('now_playing');
}

/* displaying more info about the movie when clicking on a carousel's slide*/
$('.playing-now-autoplay').on('click', '.slick-slide', function displayMovieDetails(){ //not working with an anonymous function
  /* https://github.com/kenwheeler/slick/issues/197 */
      //getting the id of the movie, it is stored in the 'data-id' attribute
      let movieID = $(this).find(".movie-poster-box").attr("data-id");
      displayMovieInfo(movieID);

});


//adding an event listener on the #info-movie-box, when user clicks on it, it hides the movie details
//should add an x to close the window
/* $infoMovieBox.on('click', function(e) {
  $infoMovieBox.css('display','none');
  $infoMovieBox.removeClass('active');
}); */

/*--------------------------------------------------playing now carousel end------------------------------- */

/*--------------------------------------------------upcoming carousel ------------------------------------- */

function displayUpcomingMoviesCarousel(){
  displayCarousel('upcoming');
  }

  $('.upcoming-autoplay').on('click', '.slick-slide', function displayMovieDetails(){
    //getting the id of the movie, it is stored in the 'data-id' attribute
    let movieID = $(this).find(".movie-poster-box").attr("data-id")
    displayMovieInfo(movieID);
    });

/*--------------------------------------------------upcoming carousel end------------------------------- */


/*--------------------------------------------------popular movies carousel ------------------------------- */
/*displaying the popular movies carousel*/
function displayPopularMoviesCarousel(){
  displayCarousel('popular');
}

$('.popular-movies-autoplay').on('click', '.slick-slide', function displayMovieDetails(){
//getting the id of the movie, it is stored in the 'data-id' attribute
let movieID = $(this).find(".movie-poster-box").attr("data-id")
displayMovieInfo(movieID);
});

/*-------------------------------------------------popular movies carousel end-------------------------------- */





/*--------------------------------------------------displayMovieInfo----------------------------------- */

function displayMovieInfo(movieID){
      //alert(movieID);

      //making a request to get data
      /* https://api.themoviedb.org/3/movie/384018?api_key=f17ab1bc2896db1409b56b65ab7ca4d9&language=en-US&append_to_response=alternative_titles%2Cvideos%2Ckeywords%2Ccredits%2Creviews%2Crecommendations%2Csimilar */
      
      let url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}&language=en-US&&append_to_response=alternative_titles%2Cvideos%2Ckeywords%2Ccredits%2Creviews%2Crecommendations%2Csimilar`;
      //console.log(url);
      $.get(url)
      .done(function (response) {

          /*adding a close button, to hide the movie info */
          $infoMovieBox.html(`<div>
                                  <button type="button" id="close-button" class="p-4 close btn btn-primary close-button float-right btn-lg" data-toggle="tooltip" data-placement="left" title="Close the window" aria-label="Close"> 
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                            </div>`);
          /*adding an event listener on this button, to make it do what it's meant to do= to close the window*/
          $('#close-button').on('click', function(e) {
            $infoMovieBox.css('display','none');
            $infoMovieBox.removeClass('active'); 
            $navbar.removeClass('hidden');
          });

          let tplMovie ="";
         // console.log(response);
          let movie = response;
          function tplVote(vote){ //round progressbar + not displaying the rating if it's 0
                  if(vote != 0) {
                   return  `<div class="progress" data-percentage="${(vote*10  % 10 == 0 ) ? vote*10 : vote*10 - (vote*10  % 10)}">
                                <span class="progress-left">
                                  <span class="progress-bar"></span>
                                </span>
                                <span class="progress-right">
                                  <span class="progress-bar"></span>
                                </span>
                              <div class="progress-value">        
                                  ${ parseFloat(vote).toFixed(1) }     
                              </div>
                          </div>`;
                        }
                  else {return ""}
              };

          function tplGenres(genres){
            if ((genres != null) && (genres.length != 0)){
              let names=[];
                genres.forEach(genre => {
                   names.push(genre["name"]) ;
                });
                return names.join(', ');
              }else {
                return "genres not known";
              }
          };    

          function tplRuntime(totalMinutes){
            if ((totalMinutes != null) && (totalMinutes != 0))
            {
                let hours = Math.floor(totalMinutes / 60);          
                let minutes = totalMinutes % 60;
                return `${hours}h${minutes}`;
            }else {
              return "runtime not known";
            }
          };

          function tplCast(castArray){
              if (castArray.length != 0){
                let tpl = `<ul class="col-9">`;
                castArray.forEach(cast =>{
                  if (cast["profile_path"] != null)
                  {
                  tpl = tpl + `<li data-id="${cast["id"]}" class="d-inline-block p-2  col-1 align-top">
                                  <img class="rounded-circle img-fluid" src="https://image.tmdb.org/t/p/w45${cast["profile_path"]}">
                                 
                                      <p class="small card-text">${cast["name"]}</p>
                                  
                              </li>`;
                  } //only adding profiles with picture (for the moment)
                  
                } );
                tpl = tpl + "</ul>";
                return tpl;
              }else{
                return "cast not provided"
              }
          };

          function tplCrew(crewArray){
            if (crewArray.length != 0){
              let tpl = `<ul class="col-9">`;
              crewArray.forEach(crew =>{
                if (crew["profile_path"] != null)
                {
                tpl = tpl + `<li data-id="${crew["id"]}" class="d-inline-block p-2 col-1 align-top">
                                <img class="rounded-circle img-fluid" src="https://image.tmdb.org/t/p/w45${crew["profile_path"]}">
                               
                                    <p class="small card-text">${crew["name"]}</p>
                                
                            </li>`;
                } //only adding profiles with picture (for the moment)
                
              } );
              tpl = tpl + "</ul>";
              return tpl;
            }else{
              return "crew not provided"
            }
        };

          tplMovie =  tplMovie +`<div class="movie-container" data-id="${movie.id}">
                                  <div class="m-5 text-center d-flex flex-row justify-content-center">
                                      <div class="pl-5 photo-movie-container col-3"> 
                                          <img class="img-fluid" src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
                                      </div>
                                      <div class="pl-5 text-left col-6 details-movie-container">
                                          <h2>${movie.title} (${movie.release_date.substr(0, 4)}) </h2> 
                                          <p>${tplGenres(movie.genres)} | ${tplRuntime(movie.runtime)} </p>
                                          <div class="mt-4 mb-5">${tplVote(movie.vote_average)}</div>
                                          <h3>Overview</h3>
                                          <p>${(movie.overview != "") ? movie.overview : "not provided"}</p>                                 
                                      </div>
                                  </div>
                                  
                                <div class="d-flex flex-row justify-content-center">
                                  <div><h3></h3></div>
                                  <div class="ml-5 pl-4 text-center d-flex flex-row justify-content-center align-items-center">     
                                        ${tplCast(movie.credits["cast"])}
                                  </div>
                                </div>


                                <div class="d-flex flex-row justify-content-center">
                                <div><h3></h3></div>
                                <div class="ml-5 pl-4 text-center d-flex flex-row justify-content-center align-items-center">     
                                      ${tplCrew(movie.credits["crew"])}
                                </div>
                              </div>

                                <div>`;
      
          $infoMovieBox.append(tplMovie);
          $infoMovieBox.css('display','block');
          $infoMovieBox.addClass('active');
          $navbar.addClass('hidden');
      })
      .fail(function (data) {
          console.log('failed');
          alertify.error('API error.');
      })
      ; //get 
};

/*--------------------------------------------------displayMovieInfo end----------------------------------- */



//https://api.themoviedb.org/3/movie/popular?api_key=f17ab1bc2896db1409b56b65ab7ca4d9&language=en-US&page=1
function displayPopularMovies(){
  $.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
  .done(function (response) {
      $popularMovieList.html(" ");
      let tplMovie ="";
      //console.log(response);
      let returnedMovies = response.results;
      //console.log(returnedMovies);
      returnedMovies.forEach(movie => {
          tplMovie =  tplMovie + `<li class="movie col-md-12 text-center" data-id="${movie.id}">
                                      <div>
                                          <h2>${movie.title} ${movie.vote_average}</h2>
                                          <p>${movie.overview}</p>
                                      </div>
                                      <div> 
                                          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                                      </div>
                                  </li>`;
      });
      $popularMovieList.append(tplMovie);
  })
  .fail(function (data) {
      console.log('failed');
      alertify.error('API error.');
  })
  ; //get 
}



//displayPopularMovies();
displayPlayingNowMoviesCarousel();
displayPopularMoviesCarousel();
displayUpcomingMoviesCarousel();



/*
$('.popular-movies-autoplay').slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1000,
  dots: true,

}); */

/*-------------------------------------------back to top button -------------------------------------- */
let btn = $('#back-to-top-button');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('active');
  } else {
    btn.removeClass('active');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});
/*-------------------------------------------back to top button -------------------------------------- */


/*--------------------------------------------------Search Movies by criteria----------------------------------- */

/*
console.log($mBtnSearchMovieYear);
$mBtnSearchMovieYear.on('click', updateMovieSearch()); //!
function updateMovieSearch(){
  //
  console.log('');
} */

$('#dd-menu-search-movie-year a').on('click', function(e){
    //select an a from the list
    //prevent default
    e.preventDefault();
    //console.log("a clicked!" + ' ' + $(this).text());
    //set class selected! (to be spotted by other events to inputs, sort, keywords, etc)
    //or set button's value to an year (!better)
    let searchByYear = $(this).text()
    $mBtnSearchMovieYear.text(searchByYear);
    
    //interogate the values for the other inputs
    //check for empty before the request !!!!
    //let searchByCriteria = $mBtnSearchMovieSortingCriteria.text(); //search for empty!
    searchMoviesBy(searchByYear, getSelectedCriteria(), 1, getSelectedGenres());
});

/*Allowed Values:
popularity.asc, popularity.desc,
release_date.asc, release_date.desc,
revenue.asc, revenue.desc,
primary_release_date.asc, primary_release_date.desc,
original_title.asc, original_title.desc,
vote_average.asc, vote_average.desc,
vote_count.asc, vote_count.desc

default: popularity.desc*/

$('#dd-menu-search-movie-sortby a').on('click', function(e){
  e.preventDefault();
  let sortByCriteria = $(this).attr('id');
  //alert(sortByCriteria);
  let sortBy;
  switch(sortByCriteria){
   // case "data-pop_desc":
    //      sortBy = "popularity.desc";
     //     break;
    case "data-pop_asc":
          sortBy = "popularity.asc";
          break;
    case "data-voteavg_desc":
          sortBy = "vote_average.desc";
          break;
    case "data-voteavg_asc":
          sortBy = "vote_average.asc";
          break;
    case "data-reldate_desc":
          sortBy = "release_date.desc";
          break;
    case "data-reldate_asc":
          sortBy = "release_date.asc";
          break;    
    case "data-origtitle_desc":
          sortBy = "original.title.desc";
          break;
    case "data-origtitle_asc":
        sortBy = "original.title.asc";
        break;
      default:
        sortBy = "popularity.desc";
  }
  //console.log(sortBy);
  //check the values for the other elements of the form
 // let year = getSelectedYear();
  //console.log(year);
  $mBtnSearchMovieSortingCriteria.text($(this).text());

  searchMoviesBy(getSelectedYear(), sortBy, 1, getSelectedGenres());

});

function getSelectedYear(){
//  console.log($mBtnSearchMovieYear.text());
  let $selectedYear = "";
  //no year selected, will set the current year

  if ($mBtnSearchMovieYear.text() ==  'Select year'){
      console.log('nesel');
      $selectedYear = (new Date).getFullYear();
      console.log($selectedYear);
  }else {
      console.log('sel');
      $selectedYear = $mBtnSearchMovieYear.text();
  }
  console.log($selectedYear);
  return $selectedYear;
}

function getSelectedCriteria(){
   // console.log($mBtnSearchMovieSortingCriteria);
    let sortBy;
    let sc = $mBtnSearchMovieSortingCriteria.text().trim();
    switch (sc){
        // case "Popularity Descending".trim():
        //      sortBy = "popularity.desc";
        //     break;
        case "Popularity Ascending".trim():
            sortBy = "popularity.asc";
            break;
        case "Rating Descending".trim():
            sortBy = "vote_average.desc";
            break;
        case "Rating Ascending".trim():
            sortBy = "vote_average.asc";
            break;
        case "Release Date Descending".trim():
            sortBy = "release_date.desc";
            break;
        case "Release Date Ascending".trim():
            sortBy = "release_date.asc";
            break;
        case "Title(Z-A)".trim():
            sortBy = "original.title.desc";
            break;
        case "Title(A-Z)".trim():
            sortBy = "original.title.asc";
            break;
        default: //'Select sorting criteria'.trim(), "Popularity Descending".trim():
            sortBy = "popularity.desc";
    }


   return  sortBy;
}

/*will be used by all the elements of the search form */
function searchMoviesBy(year, sortBy, page, genres){
    console.log(sortBy);
      //make the request and update html
      let genresSearchString = "";
     // console.log(genres);
      if (genres!=""){
        genresSearchString = genres.join("|");
        console.log(genresSearchString);
      }
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=${sortBy}&include_adult=false&include_video=true&page=${page}&year=${year}&with_genres=${genresSearchString}`;
      console.log(url);
      $.get(url)
      .done(function (response) {
         //console.log(response);
         //console.log(response.total_pages);
         $movieSearchPagination.text("");
         $movieSearchPagination.append(generatePageNumbersHTML(response.total_pages, page));
         $movieSearchPagination.removeClass('hidden');
       //  console.log($("#pagination li a"));
         $("#pagination li a").on('click', function(e){
             e.preventDefault();             
             let clickedPage = $(this).attr('data-id');
             searchMoviesBy(year, sortBy, clickedPage, genres);
             //console.log(clickedPage);
         });
          $mSearchMoviesDisplay.html("");
          let tplMovie =`<div class="container"><div class="row">`;
          let returnedMovies = response.results;
         // console.log(returnedMovies);
          let i = 0;
          returnedMovies.forEach(movie => {
          //  console.log(movie);
            
            tplMovie = tplMovie + `<div class="card col-md-12 bg-dark" style="max-width: 540px;">
                                      <div class="row no-gutters">
                                          <div class="col-md-4" style="display: flex; justify-content: center;">
                                            <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" class="card-img" alt="movie poster" style="align-self: center;">
                                            
                                          </div>
                                          <div class="col-md-8">
                                              <div class="card-body">
                                                  <h5 class="card-title">${movie.title}</h5> (${movie.release_date.substr(0, 4)})
                                                  <p class="card-text>${tplGenresFrom(movie.genre_ids)}</p>
                                                  <p class="card-text">${movie.overview.substr(0, 160)}</p> <button type="button" class="btn btn-primary btn-view-movie" data-id="${movie.id}">View movie</button>
                                                  <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`;
         });
          tplMovie = tplMovie + "</div></div>";
          $mSearchMoviesDisplay.append(tplMovie);
          $(".btn-view-movie").on('click', function(e){
              e.preventDefault();
              //alert($(this).attr('data-id'));
              let movieID = $(this).attr('data-id');
              displayMovieInfo(movieID);
          });

          //todo:
          //append a button "see more" and fix the size 
          //console.log($("ul.pagination > li a").html());
       //   console.log($("ul.pagination").find("a"));

      })
      .fail(function (data) {
          console.log('failed');
          alertify.error('API error.');
      })
      ;  //get 
}

//to fill the years for the searching dropdown-menu
function generateYearsHTML(){
  let codeHTML = '';
  let currentYear = new Date().getFullYear();
  for (let i = currentYear; i>= 1900; i--)
  {
    codeHTML = codeHTML +`<a class="dropdown-item" href="#">${i}</a>`;
  }
  return codeHTML;
}
//console.log(generateYearsHTML());



//pagination display
function generatePageNumbersHTML(number, active){
  let codeHTML=`<ul class="pagination" id="pagination">`;
  for(let i = 1; i <= number; i++){
    if (i == active) {
      codeHTML = codeHTML + `<li class="selected-page h2"> <a href="#" data-id="${i}"><span class="mx-1 text-white"> ${i} </a> </a></li>`;
    }else{
      codeHTML = codeHTML + `<li> <a href="#" data-id="${i}"><span class="mx-1"> ${i} </a> </a></li>`;
    }
  }
  codeHTML = codeHTML + `</ul>`;
  return codeHTML;
}
//console.log(generatePageNumbersHTML(500));

//getting the genres from themoviedb.org/ in an array
//https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}=en-US
//maybe worth trying with a callback
function getGenresAndAddToDOM($elem){
  //add in the global var 'genres'
  $.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
  .done(function (response) {

    //let genres = [];
      let returnedGenres = response.genres;
      let i = 0;
      returnedGenres.forEach(genre => {
        genres.push(genre); //fills the global variable 'genres' that will be used to display the genres for each movie displayed
        genresObjects.push(genre);
         //console.log(genre.name + " " + genre.id);
         let listItemInnerHTML = `<option></option>`;
         let option = document.createElement( 'option' );
         option.innerHTML = listItemInnerHTML;
         option.innerText = genre.name;
         option.setAttribute('data-value', genre.id);
       
         $elem.append( option ); 
      });
 
      /*
      setTimeout(function(){
        console.log('wait')

        $('.selectpicker').selectpicker({
          style: 'btn-primary',
          size: false
        });
        $('.selectpicker').selectpicker('refresh')
       }, 3000);
       */
     
      $('.selectpicker').selectpicker({
        style: 'btn-primary',
        size: false
      });
      $('.selectpicker').selectpicker('refresh');
    
    $('.selectpicker').change(function () {
      /*let $value =$('option:selected',this).attr('data-value');
      console.log($value);*/


      //getting the ids of the selected genres
      //https://stackoverflow.com/a/24398929
    /*  let ids = $('#genres > option:selected').map(function() {
        return this.getAttribute('data-value');
    }).get(); 
*/
  //let ids = getSelectedGenres();

    //try .get for the ajax genres request and keep genres in an array

     // console.log(ids); //array of ids 
     // console.log($(this).val()); //array of genres

     //refresh the search
     searchMoviesBy(getSelectedYear(), getSelectedCriteria(), 1, getSelectedGenres());
    });

  /*  $('#genres option:selected').each(function(){
      var $value =$(this).attr('data-value');
      console.log($value);
  }); */

  })
  .fail(function (data) {
      console.log('failed');
      alertify.error('API error: '+data+'.');
  })
  ;  //get 
};


//getting the ids of the selected genres
//https://stackoverflow.com/a/24398929
function getSelectedGenres(){
  let ids = $('#genres > option:selected').map(function() {
    return this.getAttribute('data-value');
}).get(); 
  console.log(ids);
  return ids;
}

 //console.log($selectGenresDDMenu);

 function tplGenresFrom(ids){
  //i have an array of ids and must return the corresponding names
//https://stackoverflow.com/a/43404086
  let return_first;
  function callback(response) {
  return_first = response;
  //use return_first variable here
  return return_first;
  }

$.ajax({
  'type': "GET",
  'global': false,
  'dataType': 'html',
  'url': `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
  'success': function(data){
       callback(data);
  },
});
  
 
}

//tplGenresFrom('');
let return_first;
function callback(response) {
return_first = response;
return return_first;
//use return_first variable here
}

let reqObj = $.ajax({
'type': "GET",
'global': false,
'dataType': 'json',
'url': `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
'success': function(data){
     callback(data);
},
});

//console.log(reqObj.responseJSON);
//https://www.freecodecamp.org/forum/t/assigning-ajax-response-to-variable/84991/10

});//doc ready








//autocomplete search: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete

/*
{
"images": {
  "base_url": "http://image.tmdb.org/t/p/",
  "secure_base_url": "https://image.tmdb.org/t/p/",
  "backdrop_sizes": [
    "w300",
    "w780",
    "w1280",
    "original"
  ],
  "logo_sizes": [
    "w45",
    "w92",
    "w154",
    "w185",
    "w300",
    "w500",
    "original"
  ],
  "poster_sizes": [
    "w92",
    "w154",
    "w185",
    "w342",
    "w500",
    "w780",
    "original"
  ],
  "profile_sizes": [
    "w45",
    "w185",
    "h632",
    "original"
  ],
  "still_sizes": [
    "w92",
    "w185",
    "w300",
    "original"
  ]
},
"change_keys": [
  "adult",
  "air_date",
  "also_known_as",
  "alternative_titles",
  "biography",
  "birthday",
  "budget",
  "cast",
  "certifications",
  "character_names",
  "created_by",
  "crew",
  "deathday",
  "episode",
  "episode_number",
  "episode_run_time",
  "freebase_id",
  "freebase_mid",
  "general",
  "genres",
  "guest_stars",
  "homepage",
  "images",
  "imdb_id",
  "languages",
  "name",
  "network",
  "origin_country",
  "original_name",
  "original_title",
  "overview",
  "parts",
  "place_of_birth",
  "plot_keywords",
  "production_code",
  "production_companies",
  "production_countries",
  "releases",
  "revenue",
  "runtime",
  "season",
  "season_number",
  "season_regular",
  "spoken_languages",
  "status",
  "tagline",
  "title",
  "translations",
  "tvdb_id",
  "tvrage_id",
  "type",
  "video",
  "videos"
]
}
*/





// displaying details, casting, reviews, images, trailers, similar movies, etc
// add as favorite icon to save it in storage
//add flip on slides
//clicking one item of the search result opens the info-display window
//adding fav + local storage (movie id as unique identifier)
//adding a horizontal scrollspy on the first page
// adding a move to top button
//searchbar in header + redimension
//facut logo movie gems


      //animation when details displayed
      //video carousel
// no search result?

//favorite + want to watch

//check scrollbar: click on search tv series to open the tab!!!