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

    //base url for the filepath to the song assets in the www/media folder
    //volume is used to store the value of the current volume level for the PLAYR app
    //default volume for the app is 50% or 0.5
    mediaBaseURL: 'file:///android_asset/www/media/',
    imageBaseUrl: 'file:///android_asset/www/img/',
    volume: 0.5,
    
    //the media object 'currentTrack' used by the cordova media plugin
    //also the 'status' and 'err' object are used to understand the different status
    //and error codes given back by the cordova media plugin
    currentTrack: null,
    currentTrack_info: null,
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
    //playing, 'tickerposition' is used to move the ticker text displaying the song information
    //in the current playing screen of the song
    currentSongPos: null,
    currentPosition: 0,
    tickerPosition: 0,
    audio: [
        {
            id: 343,
            artist: "At The Drive-In",
            track: "Invalid Letter Dept.",
            album: "Relationship of Command",
            length: 0,
            path: "at-the-drive-in/invalid_letter_dept.mp3",
            poster_path: "album-covers/relationship-of-command.jpg"
        },
        {
            id: 344,
            artist: "At The Drive-In",
            track: "One Armed Scissor",
            album: "Relationship of Command",
            length: 0,
            path: "at-the-drive-in/one_armed_scissor.mp3",
            poster_path: "album-covers/relationship-of-command.jpg"
        },
        {
            id: 434,
            artist: "MGMT",
            track: "Electric Feel",
            album: "Oracular Spectacular",
            length: 0,
            path: "mgmt/electric_feel.mp3",
            poster_path: "album-covers/oracular-spectacular.jpg"
        },
        {
            id: 842,
            artist: "Cloud Nothings",
            track: "Stay Useless",
            album: "Attack on Memory",
            length: 0,
            path: "cloud-nothings/stay-useless.mp3",
            poster_path: "album-covers/attack-on-memory.jpg"
        },
        {
            id: 843,
            artist: "Cloud Nothings",
            track: "Fall In",
            album: "Attack on Memory",
            length: 0,
            path: "cloud-nothings/fall-in.mp3",
            poster_path: "album-covers/attack-on-memory.jpg"
        }
    ],
    init: () => {
        APP.active = document.querySelector(".active");
        APP.pages = document.querySelectorAll(".page");
        console.log(APP.pages);
        let links = document.querySelectorAll("[data-href]");
        

        //start of adding click listeners to the
        //differnt elemnents on the page
        links.forEach(link => {
            link.addEventListener("click", APP.nav);
        });



        //initialize the song list with the songs in our song array
        APP.music_init(APP.audio);
        APP.setPlayrListeners();

        //test timer for the progress bar
        // let progress_animation = setInterval(APP.progressBar, 100, null);
    },
    nav: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let link = ev.target;
        let target = link.getAttribute("data-href");
        //change the display of the "page"
        APP.showPage(target);
        //use switch case with target for page specific things
    },
    showPage: target => {
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`#${target}`).classList.add("active");
    },

    //starting of code for music player:
    //this function will take in an audio array
    //like APP.audio and will build the 
    //html elements for the song list
    music_init: audio => {

        //first we will locate the output location for the song data
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

            //set the data-id attribute of the song entry
            entry.classList.add("song");
            entry.setAttribute("data-songid", song.id);
            
            //set the information of the song from each entry
            title.textContent = song.track;
            artist.textContent = `    ${song.artist}`;
            album.textContent = `    ${song.album}`;
            duration.textContent = `    ${song.length}`;

            //append the songs to the entry div and then to the song list
            entry.appendChild(title);
            entry.appendChild(artist);
            entry.appendChild(album);
            entry.appendChild(duration);

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
        //first we must clear any song playing if if exists
        // if(APP.currentTrack) APP.currentTrack.release();

        //then build the page based on the new song
        console.log(ev.currentTarget.getAttribute("data-songid"));
        APP.currentTrack_info = APP.audio.find(entry => {
            return entry.id == ev.currentTarget.getAttribute("data-songid");
        });
        console.log(APP.currentTrack_info);

        APP.showPage('currentsong');

        //find the title and put the song title
        document.querySelector('h3#title').textContent= APP.currentTrack_info.track;
        document.querySelector('h4#artist').textContent= APP.currentTrack_info.artist;

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
        document.querySelector('h3#title').textContent= APP.currentTrack_info.track;
        document.querySelector('h4#artist').textContent= APP.currentTrack_info.artist;
    },


    //function to animate progress bars based on the current postion in teh music
    //for now input parameters are just not used just becuase timer is testing
    progressBar: song =>{
        let bar = document.querySelector('.currentstatus');
        APP.currentPosition += 1;

        bar.style.width = `${APP.currentPosition}%`

        if(APP.currentPosition >= 100){
            APP.currentPosition = 0;
        }

        //begins testing for ticker animation for text info
        let ticker = document.querySelector('.ticker');
        let tickerText = `SONG: ${APP.currentTrack.track} ALBUM: ${APP.currentTrack.album} ARTIST: ${APP.currentTrack.artist}`
        APP.tickerPosition ++;
        ticker.textContent = tickerText.substring(APP.tickerPosition) + tickerText.substring(0, APP.tickerPosition);
        if(APP.tickerPosition >= tickerText.length){
            APP.tickerPosition = 0;
        }
        // console.log(tickerText);
    },

    //Starting of the callback functions used
    //for the cordova media plugin that are bound to the click
    //event of the buttons the code for the functions are all based on the
    //the codejist provided in the cordova video link: https://www.youtube.com/watch?v=Fk-DpOnuvmM&feature=emb_title

    //setting all the event listeners for the media playback controls
    setPlayrListeners: function(){

        //event listeners for media controls
        document.getElementById('play-btn').addEventListener('click', APP.play);
        document.getElementById('pause-btn').addEventListener('click', APP.pause);
        document.getElementById('ff-btn').addEventListener('click', APP.fastforward);
        document.getElementById('rew-btn').addEventListener('click', APP.rewind);
        document.getElementById('up-btn').addEventListener('click', APP.volumeUp);
        document.getElementById('down-btn').addEventListener('click', APP.volumeDown);

        //event listeners for the android system:
        document.addEventListener('pause',() =>{
            //when the android os pauses (suspends) this app it will release the media
            //to save on memory and will record the current positon before doing that
            console.log('system has paused the android playr app');
            // APP.currentTrack.getCurrentPosition(APP.currentPositionGood, APP.currentPositionFail);
            APP.currentTrack.release();

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
        });
    },

    //Success callback function for the get current positon media function
    //it is given the pos parameter that is the value of the current postion in 
    //seconds
    currentPositionGood: pos => {
        APP.currentSongPos = pos;
    },

    //failure callback function for the get current position media function
    currentPositionFail: err =>{
        //change this to maybe a little something more verbose to both the user and 
        //the developer
        console.log(`An Error happened, oh no ${err}`);
    },
    //the success callback fucntion for the cordova media plugin create new Media
    mediaSuccess: function() {
        //this function is ran when the system finishes playing the song
        //we should make the next song in the playlist 
        //first we find the index of the array
        // if(APP.currentTrack){

        //first we have to check the current song duration
        //and our place in the song, if our placein the song is less than the duration 
        //then we do not increment the index number

        //failed code to increment the song, will keep incrementing constantly
        //must change logic
        // if(APP.currentTrack){
        //     let duration = APP.currentTrack.getDuration();
        //     let currentTime = APP.currentTrack.getCurrentPosition(time => time*1000);
        //     if(currentTime >= duration){
        //         //do nothing
        //         console.log("system has loaded the song");
        //     } else {
        //         let index = APP.audio.findIndex(song => song.id === APP.currentTrack_info.id);
        //         index = index + 1;
        //         if(index >= APP.audio.length){
        //             index = 0;
        //         }

        //         //after incrementing the index and checking if its in our range we set
        //         //the currentTrackinfo to the APP.audio[index] and then release the media object
        //         //and then play the new one
        //         if(APP.currentTrack) APP.currentTrack.release();
        //         APP.currentTrack_info = APP.audio[index];
        //         APP.createMedia(APP.currentTrack_info);
        //         APP.play();
        //     }
        //     // }
        //     console.log(currentTime, duration);
        // }
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
            // Case 0 is what happens when there is no media object
            //I must refer to the documentation to understand what this means
            case 0:
                break;
            //When the Media object is Starting up
            //we can initialize the progress bar and the ticker animation
            //and also change the html elements to reflect the new song
            //using the rebuildSongPage helper function to accomplish this
            case 1:
                APP.rebuildSongPage();
                break;
            //When the media objects starts running (playing)
            //we can increment the progress bar here, while the ticker runs independantly
            //or resume it based on the current progress of the song
            case 2:
                break;
            //When the media Object Gets Paused we can suspend the ticker animation
            case 3:
                break;
            //When the media obejct gets stopped, we could release the memory
            case 4:
                // if(APP.currentTrack) APP.currentTrack.release();
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
    },

    //the function to play a song using cordova media plugin
    play: () => {
        APP.currentTrack.play();
    },

    //the function to pause a song using cordova media plugin
    pause: function() {
        APP.currentTrack.pause();
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
    }

};

//copied from https://prof3ssorst3v3.github.io/mad9014/modules/week13/#domcontentloaded-vs-deviceready
//check to see which device we are ready on:
let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";

document.addEventListener(ready, APP.init);