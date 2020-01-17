//starter code was taken from the simple spa demo from MAD9014
//https://prof3ssorst3v3.github.io/simple-spa-demo/#green

const APP = {
    active: null,
    pages: [],
    baseURL: null,
    currentTrack: null,
    currentPosition: 0,
    tickerPosition: 0,
    audio: [
        {
            id: 343,
            artist: "At The Drive-In",
            track: "Invalid Letter Dept.",
            album: "Relationship of Command",
            length: 0,
            path: "media/at-the-drive-in/invalid_letter_dept.mp3"
        },
        {
            id: 344,
            artist: "At The Drive-In",
            track: "One Armed Scissor",
            album: "Relationship of Command",
            length: 0,
            path: "media/at-the-drive-in/one_armed_scissor.mp3"
        },
        {
            id: 434,
            artist: "MGMT",
            track: "Electric Feel",
            album: "Oracular Spectacular",
            length: 0,
            path: "media/mgmt/electric_feel.mp3"
        },
        {
            id: 842,
            artist: "Cloud Nothings",
            track: "Stay Useless",
            album: "Attack on Memory",
            length: 0,
            path: "media/cloud-nothings/stay-useless.mp3"
        },
        {
            id: 843,
            artist: "Cloud Nothings",
            track: "Fall In",
            album: "Attack on Memory",
            length: 0,
            path: "media/cloud-nothings/fall-in.mp3"
        }
    ],
    init: () => {
        app.active = document.querySelector(".active");
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

        //test timer for the progress bar
        let progress_animation = setInterval(APP.progressBar, 100, null);
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
        console.log(ev.currentTarget.getAttribute("data-songid"));
        let song_choice = APP.audio.find(entry => {
            return entry.id == ev.currentTarget.getAttribute("data-songid");
        });
        console.log(song_choice);
        APP.currentTrack = song_choice;

        APP.showPage('currentsong');

        //find the title and put the song title
        document.querySelector('h3#title').textContent= song_choice.track;
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
    }

};

//copied from https://prof3ssorst3v3.github.io/mad9014/modules/week13/#domcontentloaded-vs-deviceready
//check to see which device we are ready on:
let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";

document.addEventListener(ready, APP.init);