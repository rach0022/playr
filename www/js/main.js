/*************************
 *
 *  @description Android media player app called PLAYR built using cordova 
 *
 *  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
 *
 *  @version Jan 18, 2020
 *
 ***********************/

//starter code was taken from the simple spa demo from MAD9014
//https://prof3ssorst3v3.github.io/simple-spa-demo/#green

const APP = {

    //the active and pages variables are used
    //to change the page and store which page we are currently on
    active: null,
    pages: [],
    baseURL: null,

    //base url for the filepath to the song assets in the www/media folder
    //volume is used to store the value of the current volume level for the PLAYR app
    //default volume for the app is 50% or 0.5
    mediaBaseURL: 'file:///android_asset/www/media/',
    imageBaseUrl: 'file:///android_asset/www/img/',
    volume: 1.0,
    
    //the media object 'currentTrack' used by the cordova media plugin
    //also the 'status' and 'err' object are used to understand the different status
    //and error codes given back by the cordova media plugin
    currentTrack: null,
    currentTrack_info: null,
    currentSongIndex: null,
    status: {
        '0': 'MEDIA_NONE',
        '1': 'MEDIA_STARTING',
        '2': 'MEDIA_RUNNING',
        '3': 'MEDIA_PAUSED',
        '4': 'MEDIA_STOPPED'
    },
    err:{
        '1': 'MEDIA_ERR_ABORTED',
        '2': 'MEDIA_ERR_NETWORK',
        '3': 'MEDIA_ERR_DECODE',
        '4': 'MEDIA_ERR_NONE_SUPPORTED'
    },

    //'currentposition' is used for the current position of the media file,
    //might switch to using just the function from the cordova media plugin
    //the use will be for incrementing the progress bar in time with the current song
    //playing, 'tickerindex' is used to move the ticker text displaying the song information
    //in the current playing screen of the song will use in conjunction with tickerTimeout so i can
    //setInterval and clearInterval when the song starts playing and clear it when it stops (or paused)
    currentSongTime: null,
    tickerIndex: 0,
    tickerTimeout: null,
    progressTimeout: null,
    audio: [
        {
            id: 343,
            artist: "At The Drive-In",
            track: "Invalid Letter Dept.",
            album: "Relationship of Command",
            length: "06:06",
            path: "at-the-drive-in/invalid_letter_dept.mp3",
            poster_path: "album-covers/relationship-of-command.jpg"
        },
        {
            id: 344,
            artist: "At The Drive-In",
            track: "One Armed Scissor",
            album: "Relationship of Command",
            length: "04:20",
            path: "at-the-drive-in/one_armed_scissor.mp3",
            poster_path: "album-covers/relationship-of-command.jpg"
        },
        {
            id: 434,
            artist: "MGMT",
            track: "Electric Feel",
            album: "Oracular Spectacular",
            length: "03:50",
            path: "mgmt/electric_feel.mp3",
            poster_path: "album-covers/oracular-spectacular.jpg"
        },
        {
            id: 842,
            artist: "Cloud Nothings",
            track: "Stay Useless",
            album: "Attack on Memory",
            length: "02:45",
            path: "cloud-nothings/stay-useless.mp3",
            poster_path: "album-covers/attack-on-memory.jpg"
        },
        {
            id: 843,
            artist: "Cloud Nothings",
            track: "Fall In",
            album: "Attack on Memory",
            length: "03:14",
            path: "cloud-nothings/fall-in.mp3",
            poster_path: "album-covers/attack-on-memory.jpg"
        }
    ],
    init: () => {
        APP.active = document.querySelector(".active").id;
        APP.pages = document.querySelectorAll(".page");
        console.log(APP.pages);
        let links = document.querySelectorAll("[data-href]");
        

        //start of adding click listeners to the
        //differnt elemnents on the page
        links.forEach(link => {
            link.addEventListener("click", APP.nav);
        });

        //Start of using the history API to control the back button
        //get the base url to use in the app
        APP.baseURL = location.href.split("#")[0];
        let hash = location.hash;
        //check for current url hash
        if (hash && hash != "#") {
            //there is an id in the url
            APP.active = hash.replace("#", "");
            APP.showPage(APP.active);
        } else {
            //no url so use our default
            history.replaceState({}, APP.active, `${APP.baseURL}#${APP.active}`);
            APP.showPage(APP.active);
        }
        //handle the back button
        window.addEventListener("popstate", APP.backbutton);

        //initialize the song list with the songs in our song array
        APP.music_init(APP.audio);
        APP.setPlayrListeners();

        //test timer for the progress bar
        // let progress_animation = setInterval(APP.progressBar, 100, null);
    },
    nav: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let link = ev.currentTarget;
        let target = link.getAttribute("data-href");

        //update URL
        history.pushState({}, target, `${APP.baseURL}#${target}`);
        //change the display of the "page"
        APP.showPage(target);
        //use switch case with target for page specific things
    },
    showPage: target => {
        console.log(target);
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`#${target}`).classList.add("active");
        

        //scroll the window to the top of the page when switch to a new page
        window.scrollTo(0,0);

        //depending on which page switch the button html to the proper page
        let btn = document.querySelector('button#pagelink');
        if(target == 'songlist'){
            btn.innerHTML = '<i class="fas fa-music"></i>';
            btn.setAttribute("data-href", 'currentsong');
        } else if (target == 'currentsong'){
            btn.innerHTML = '<i class="fas fa-list"></i>';
            btn.setAttribute("data-href", 'songlist');
        }
    },
    backbutton: ev => {
        //get the id
        let target = location.hash.replace("#", "");
        APP.showPage(target);
    }, 

    //starting of code for music player:
    //this function will take in an audio array
    //like APP.audio and will build the 
    //html elements for the song list
    music_init: audio => {

        //first lets sort the song array alphabetically
        //using an arrow function with the return value being
        //an if statement checking to compare the track value of the song
        audio = audio.sort((a,b) => (a.track > b.track) ? 1:-1)

        //locate the output location for the song data
        //this will be a flex item
        //that will have all the songs
        let songs = document.getElementById('songs');
        //create a document fragment to add all the entries
        let frag = document.createDocumentFragment();

        //now we go through each object in the audio 
        //and add their entries to the song list
        audio.forEach(song => {
            //first create all the elements to contain the information
            let entry = document.createElement('div');
            let title = document.createElement('p');
            let artist = document.createElement('p');
            let album = document.createElement('p');
            let duration = document.createElement('p');
            let poster = document.createElement('img');

            //create any wrapping elements
            let detail_wrapper = document.createElement('div');
            detail_wrapper.id = "detail-wrapper";

            //set the data-id attribute of the song entry
            entry.classList.add("song");
            entry.setAttribute("data-songid", song.id);
            
            //set the information of the song from each entry
            //and the src and alt text for the image
            title.textContent = song.track;
            artist.textContent = `    ${song.artist}`;
            album.textContent = `    ${song.album}`;
            duration.textContent = `    ${song.length}`;
            poster.src = APP.imageBaseUrl + song.poster_path;
            console.log(poster.src);
            poster.alt = `This is the Album cover for ${song.album} which was made by ${song.artist}`;

            //append the songs to the entry div and then to the song list
            //starting with the detail wrapper
            entry.appendChild(poster);
            detail_wrapper.appendChild(title);
            detail_wrapper.appendChild(artist);
            detail_wrapper.appendChild(album);
            detail_wrapper.appendChild(duration);
            entry.appendChild(detail_wrapper);
            

            //add the event listeners for the entry objevts
            entry.addEventListener('click', APP.buildSongPage);

            frag.appendChild(entry); 
        })
        songs.appendChild(frag);

    },

    //function to create songs based on which song is clicked
    //will use a click listerner to give an input event and
    //use this function as a callback'
    //this event will change to play song or
    //become a helper event to the play song event
    buildSongPage: ev => {

        //then build the page based on the new song
        console.log(ev.currentTarget.getAttribute("data-songid"));
        APP.currentTrack_info = APP.audio.find(entry => {
            return entry.id == ev.currentTarget.getAttribute("data-songid");
        });
        console.log(APP.currentTrack_info);

        APP.showPage('currentsong');

        //find the title and put the song title
        document.querySelector('#title').textContent= APP.currentTrack_info.track;
        document.querySelector('#artist').textContent= APP.currentTrack_info.artist;
        let album_art = document.getElementById('album-art');

        album_art.src = APP.imageBaseUrl + APP.currentTrack_info.poster_path;
        album_art.alt = `This is the Album cover for ${APP.currentTrack_info.album} which was made by ${APP.currentTrack_info.artist}`;

        //now to create the media object and play the users choice
        //using helper functions created below
        APP.createMedia(APP.currentTrack_info);
        APP.play();
    },

    //function to rebuild the song page after the current song is finished playing
    rebuildSongPage: function() {
        //first we will get refrences to the html elements and set their text content
        //to the values from the new song
        //find the title and put the song title
        document.querySelector('#title').textContent= APP.currentTrack_info.track;
        document.querySelector('#artist').textContent= APP.currentTrack_info.artist;

        let album_art = document.getElementById('album-art');
        album_art.src = APP.imageBaseUrl + APP.currentTrack_info.poster_path;
        album_art.alt = `This is the Album cover for ${APP.currentTrack_info.album} which was made by ${APP.currentTrack_info.artist}`;
    },


    //function to animate progress bars based on the current postion in the music
    //if and only if the APP.currentTrack is not falsy, we also update the time values
    //on the p tags in the page, this function should ideally be run every 400 ms so it re
    //checks the values times every 2 seconds 
    progressBar: song =>{
        if(APP.currentTrack){
            //set the current position and the end time as the text values
            //to get the current time we have callback currentTimeGood and currentTimeFail
            //we use those in the getCurrentPosition and update the APP.currentSongPos
            APP.currentTrack.getCurrentPosition(APP.currentTimeGood, APP.currentTimeFail);
            let dur = APP.currentTrack.getDuration();

            //start of the code for the progress bar
            //find a reference to the progress bar element
            let bar = document.querySelector('progress');
            
            //and then set its width (value )
            bar.value = APP.currentSongTime;

            //then i have to set the max value to make sure its the same on the song end time
            bar.max = dur;
            //find the two time p elements and then change them based on the progress in the song
            let start = document.querySelector('p.start-time');
            let end = document.querySelector('p.end-time');

            //start of logic to convert seconds values into proper time formats MM:SS
            //first we take the time value (in seconds) and we /60 and round down for the number of minutes
            //we use padStart to make sure it is the proper length and then we take the 
            //duration mod 60 (the remainder) and concat the rounded up value for the seconds
            //same logic is used for the current time
            start.textContent = Math.floor(APP.currentSongTime/60).toString().padStart(2, '0') + ":" + Math.ceil(APP.currentSongTime%60).toString().padStart(2,'0');
            end.textContent = Math.floor(dur/60).toString().padStart(2, '0') + ":" + Math.ceil(dur%60).toString().padStart(2,'0');
        }
        

        // //begins testing for ticker animation for text info
        // let ticker = document.querySelector('.ticker');
        // let tickerText = `SONG: ${APP.currentTrack.track} ALBUM: ${APP.currentTrack.album} ARTIST: ${APP.currentTrack.artist}`
        // APP.tickerPosition ++;
        // ticker.textContent = tickerText.substring(APP.tickerPosition) + tickerText.substring(0, APP.tickerPosition);
        // if(APP.tickerPosition >= tickerText.length){
        //     APP.tickerPosition = 0;
        // }
        // console.log(tickerText);
    },

    //function to run the ticker text
    //the full ticker text is a combination of the track details
    //the displayed ticker text will be the full ticker text starting from a counter (that we increment each 400ms)
    //plus the the remaining text from position 0 back to the current position of the ticker
    //we will use the APP.tickerIndex varaible to be the counter
    tickerFeature: function(){
        //first get a reference to the ticker output element in the html document
        //then increment the ticker and make sure it is within ticker text range and create the ticker text
        let ticker = document.querySelector('.ticker');
        let tickerText = `|| ${APP.currentTrack_info.track} || ${APP.currentTrack_info.album} || ${APP.currentTrack_info.artist}|| ${APP.currentTrack_info.track} || ${APP.currentTrack_info.album} || ${APP.currentTrack_info.artist}`
        APP.tickerIndex ++;
        
        if(APP.tickerIndex >= tickerText.length) APP.tickerIndex = 0;

        //then set the ticker with the proper ticker text
        ticker.textContent = tickerText.substring(APP.tickerIndex) + tickerText.substring(0, APP.tickerIndex);
    },

    //Starting of the callback functions used
    //for the cordova media plugin that are bound to the click
    //event of the buttons the code for the functions are all based on the
    //the codejist provided in the cordova video link: https://www.youtube.com/watch?v=Fk-DpOnuvmM&feature=emb_title

    //setting all the event listeners for the media playback controls
    setPlayrListeners: function(){

        //event listeners for media controls
        document.getElementById('play-pause-btn').addEventListener('click', APP.play);
        // document.getElementById('pause-btn').addEventListener('click', APP.pause);
        document.getElementById('ff-btn').addEventListener('click', APP.fastforward);
        document.getElementById('rew-btn').addEventListener('click', APP.rewind);
        document.getElementById('step-forward').addEventListener('click', APP.step_forward);
        document.getElementById('step-backward').addEventListener('click', APP.step_backward);
        document.getElementById('up-btn').addEventListener('click', APP.volumeUp);
        document.getElementById('down-btn').addEventListener('click', APP.volumeDown);

        //event listener for the progress bar to jump to a new position in the song
        document.querySelector('progress').addEventListener('click', APP.jump_position);

        //event listeners for the android system:
        document.addEventListener('pause',() =>{
            //when the android os pauses (suspends) this app it will release the media
            //to save on memory and will record the current positon before doing that
            console.log('system has paused the android playr app');
            // APP.currentTrack.getCurrentPosition(APP.currentPositionGood, APP.currentPositionFail);
            // APP.currentTrack.release();
            // APP.pause();

        });
        document.addEventListener('menubutton', () =>{
            //when the user clicks the menu button, record the current location of the song
            //to the playr app?
            // APP.currentTrack.getCurrentPosition(APP.currentPositionGood, APP.currentPositionFail);
            console.log('menu button was clicked by user')
        });
        document.addEventListener('resume', () =>{
            //when the android os resumes the PLAYR app after
            //being suspended. It will create a new media object
            //and place it in APP.currentTrack, and is rebuilt from currentTrack_info
            // if(APP.currentTrack_info){
            //     APP.createMedia(APP.currentTrack_info);
            //     APP.currentTrack.seekTo(APP.currentSongPos/1000);
            //     APP.play();
            // }
            // APP.currentTrack = new Media(APP.mediaBaseURL+this.currentTrack_info.path,
            //     APP.mediaSuccess, APP.mediaFailure, APP.mediaStatusChange);
            console.log("APP is resumed");
            // APP.play();
        });

        //to stop scrolling on the album art or song details page I am addinga  scroll
        //event with this callback function to prevent default and stop propogation of the scroll
        // document.getElementById('currentsong').addEventListener('scroll', ev =>{
        //     ev.preventDefault();
        //     ev.stopPropagation();
        // })
    },

    //Success callback function for the get current positon media function
    //it is given the pos parameter that is the value of the current postion in 
    //seconds
    currentTimeGood: pos => {
        APP.currentSongTime = pos;
    },

    //failure callback function for the get current position media function
    currentTimeFail: err =>{
        //change this to maybe a little something more verbose to both the user and 
        //the developer
        console.log(`An Error happened, oh no ${err}`);
    },
    //the success callback fucntion for the cordova media plugin create new Media
    mediaSuccess: function() {
        //this function is ran when the system finishes playing the song or finishes loading the new media object
        //is there a way to tell the difference?
        //we should make the next song in the playlist 
        //first we find the index of the array
        // if(APP.currentTrack){
        console.log("media success function ran from creating the media object");
    },

    //the failure callback function for the cordova media plugin
    mediaFailure: err => {
        //for now I am using console.log statements to warn me of the errors
        //should change these methods to warning the user with alerts or popups
        //in order to inform them of a failure and a status code
        console.warn(`Failure in loading of the Song Specified`);
        console.error(err);
        
    },

    //the change of status callback fucntion for the cordova media object
    mediaStatusChange: status => {
        //this is the function that will be called when the status is changed
        //for now I am just using console.log statements but should change later 
        //to display the information to the user with a kick popup or flash some text
        console.log(`media status is now ${APP.status[status]}`);

        switch(status){
            default:
                console.warn("Something funky is going on here");
                break;
            case 0:
                // Case 0 is what happens when there is no media object
                //I must refer to the documentation to understand what this means
                break;
            
            case 1:
                //When the Media object is Starting up
                //we can initialize the progress bar and the ticker animation
                //and also change the html elements to reflect the new song
                //using the rebuildSongPage helper function to accomplish this
                APP.rebuildSongPage();

                //also clear the intervals incase we are switching songs:
                APP.clear_intervals();
                break;
            
            case 2:
                //When the media objects starts running (playing)
                //we can increment the progress bar here, while the ticker runs independantly
                //or resume it based on the current progress of the song
                //set the interval for the ticker feature
                APP.clear_intervals();
                APP.tickerTimeout = setInterval(APP.tickerFeature, 50);
                APP.progressTimeout = setInterval(APP.progressBar, 200);
                break;
            
            case 3:
                //When the media Object Gets Paused we can suspend the ticker animation
                clearInterval(APP.tickerTimeout);
                break;
            
            case 4:
                //When the media obejct gets stopped, we could release the memory
                // if(APP.currentTrack) APP.currentTrack.release();
                //clear the interval on the timeout when the song stops or is reloaded
                APP.clear_intervals();
                //this case will run when either the song finishes or the APP.currentTrack.release() is run
                if(APP.currentTrack.getDuration() !== -1){
                    APP.playNextSong();
                    console.log(APP.currentTrack.getDuration());
                }
                break;
        }
    },

    //helper function to reduce the amount of code i write
    //when creating the new media objects
    //parameters are the song_info which is an entry from the APP.audio array
    createMedia: song_info => {
        //just to be sure, release the current media before procedding
        if(APP.currentTrack) APP.currentTrack.release();
        APP.currentTrack =  new Media(APP.mediaBaseURL+song_info.path,
            APP.mediaSuccess, APP.mediaFailure, APP.mediaStatusChange);
    },

    //this function is a helper function to increment to the next song in the array
    playNextSong: function(){
        //first get a reference to the current index number of the song that was just played
        let index = APP.audio.findIndex(song => song.id === APP.currentTrack_info.id);

        //then increment the index by one and check if it is still within the arry bound otherwise set to zero
        index ++;
        if(index >= APP.audio.length) index = 0;
        console.log(index);

        //since it is stopped we know that the song is released so just set the new
        //currentsong_info and create the media (do not play the song yet)
        APP.currentTrack_info = APP.audio[index];
        console.log(APP.currentTrack_info);
        APP.createMedia(APP.currentTrack_info);
        APP.play();
    },

    //the function to play a song using cordova media plugin
    play: () => {
        //if APP.currentTrack is null then lets initialize with the first song
        //from the APP.audio array
        //in case the user presses the play button before choosing a song
        if(!APP.currentTrack){
            APP.currentTrack_info = APP.audio[0];
            APP.createMedia(APP.currentTrack_info);
        }

        APP.currentTrack.play();

        //start of code to change the html play button to a pause button
        //first get a reference to the play button, remove the event listeners for the play
        //function and switch them to the pause function and then add the pause button
        //and switch the inner html to the pause button format
        let playbtn = document.getElementById('play-pause-btn');
        playbtn.removeEventListener('click', APP.play);
        playbtn.addEventListener('click', APP.pause);
        playbtn.innerHTML = '<i class="fas fa-pause"></i>';
    },

    //the function to pause a song using cordova media plugin
    pause: function() {
        APP.currentTrack.pause();

        //start of code to change the html pause button to a play button
        //its the reverse code of above, get a refernece, remove the pause add the play
        //listeners and switch the inner html to the play button format
        let playbtn = document.getElementById('play-pause-btn');
        playbtn.removeEventListener('click', APP.pause);
        playbtn.addEventListener('click', APP.play);
        playbtn.innerHTML = '<i class="fas fa-play"></i>';
    },

    //the volume up function, will check the current volume
    //and increase accordingly
    volumeUp: function() {
        //currently printing out the volume info in the console
        //need to change to also display this info to the user with dialog box
        //volume goes up in increments of 1 from 0 to 10 so i could use a slider
        console.log(`CURRENT VOLUME LEVEL: ${APP.volume}`);

        APP.volume += 0.1;
        if(APP.volume > 1) APP.volume = 1.0;
        console.log(APP.volume);
        APP.currentTrack.setVolume(APP.volume);
    },

    //the volume down function, works exactly liek above
    //except in reverse
    volumeDown: function() {
        //currently printing out the volume info in the console
        //need to change to also display this info to the user with dialog box
        //volume goes up in increments of 1 from 0 to 10 so i could use a slider
        console.log(`CURRENT VOLUME LEVEL: ${APP.volume}`);

        APP.volume -= 0.1;
        if(APP.volume < 0) APP.volume = 0;
        console.log(APP.volume);
        APP.currentTrack.setVolume(APP.volume);
    },

    //the fast forward function for the PLAYR app
    //it will skip the song by increments of 10s
    fastforward: function() {
        //for now we are displaying the fact the song changed only to the 
        //console, should change to give some output to the user to give a 
        //visual confirmation the track audio was fast forwarded
        APP.currentTrack.getCurrentPosition(position =>{
            let duration = APP.currentTrack.getDuration();
            console.log(`CURRENT SONG POSITION: ${position}`);
            console.log(`CURRENT SONG DURATION: ${duration}`);

            //adding ten seconds to the positon then setting that value
            position += 10; 
            if(position < duration) APP.currentTrack.seekTo(position*1000);
        });
    },

    //the rewind call back function
    //it will go back by increments of ten seconds and is very similar
    //to the above fast forward function
    rewind: function(){
        //for now we only display the information to the console
        //later on we could try and make the buttons shake to give
        //a visual queue that this operation was successful

        APP.currentTrack.getCurrentPosition(position =>{
            //subtract ten from the position to 
            //later then go back ten secodns
            position -= 10;
            if(position > 0 ){
                //if the position was properly set
                APP.currentTrack.seekTo(position*1000);
            } else {
                //if the position set is less then 0
                APP.currentTrack.seekTo(0);
            }
        });
    },


    //function to "step forward" play the next song
    step_forward: function(){
        if(APP.currentTrack) {
            APP.clear_intervals();
            APP.playNextSong();
        }
    },

    //function to "step backward" go to the previous
    step_backward: function(){
        if(APP.currentTrack){
            APP.clear_intervals();
            //first get a reference to the current index number of the song that was just played
            let index = APP.audio.findIndex(song => song.id === APP.currentTrack_info.id);

            //then increment the index by one and check if it is still within the arry bound otherwise set to zero
            index --;
            if(index < 0) index = APP.audio.length - 1;
            console.log(index);

            //since it is stopped we know that the song is released so just set the new
            //currentsong_info and create the media (do not play the song yet)
            APP.currentTrack_info = APP.audio[index];
            APP.createMedia(APP.currentTrack_info);
            APP.play();
        }
    },

    //callback function to seek to a different position in the song based on where the 
    //progress bar is clicked it will be bound to the progress bar in setPlayrListeneres
    //check the offsetX of the mouse event (where the mouse clicked relative to the element)
    //and divide that by the max value of the bar (to get a percent) and multiply that by the duration
    //if it is within range set that as the new song position (APP.currentTrack.seekto)
    jump_position: ev => {
        if(APP.currentTrack){
            let bar = document.querySelector('progress');
            let dur = APP.currentTrack.getDuration();
            let newPos = (ev.offsetX / bar.clientWidth) * dur;
            console.log(ev, ev.offsetX, dur, newPos);
            if(newPos <= dur && dur != -1){
                APP.currentTrack.seekTo(newPos*1000);
            }
        }
    },

    //helper function to clear intervals in the app so i dont have to keep
    //writing these two lines
    clear_intervals: function(){
        clearInterval(APP.tickerTimeout);
        clearInterval(APP.progressTimeout);
    }
};

//copied from https://prof3ssorst3v3.github.io/mad9014/modules/week13/#domcontentloaded-vs-deviceready
//check to see which device we are ready on:
let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";

document.addEventListener(ready, APP.init);