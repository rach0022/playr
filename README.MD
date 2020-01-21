# Android PlayR Cordova Application
## by: Ravi Rachamalla rach0022@algonquinlive.com


### Features to Work on (REQUIREMENTS):
- [x] Content Security policy and links to CDN for FontAwesome etc.
- [x] Pick some fonts from Google Fonts to user for the program (Play and Roboto-Slab)
- [x] create an x-icon to use for this page
- [x] Each of the entries in the playlist should show a title, an artist
- [x] thumbnail image that represents the audio file, typically the album cover | added poster_path value to each song and imageBaseUrl variable
- [x] Use tinyjpg to compress the image sizes
- [x] Nothing plays by default when the app loads
- [x] Choose a Color Scheme that the APP follows | Generated from colormind.io
- [x] (SORTA)The user will have to tap on an item in the list to play
- [x] When an audio file reaches its end, the next item in the list should play
- [x] Create an Object that contains all the information about the audio files
- [x] Minimum of 5 songs in the playlist, from a minimum of two artists. Store all the audio files in a media folder inside the www folder. | Song are stored with a path property built using mediaBaseUrl + APP.audio[i]
- [x] User should be able to click on another item in the list to start it playing. This will stop the current one playing. Use a global property to hold the media object that is playing the audio.
- [x] The user should be able to pause and resume the playback of the current song.
- [x] There should be some visual indication when a song is playing.
- [ ] Work on progress bar animation (use CSS transitions to make it increment slower)
- [x] Host font awesome offline so the app does not need an internet connection
- [x] Host google fonts offline so the app does not need an internet connection
- [ ] App design should reflect the Material Design guidelines

#### example of json data: 
```js
const app = {
  audio: [
    {
      id: 412,
      artist: "Green Day",
      album: "Dookie",
      track: "Basket case",
      length: 0,
      path: "media/green-day/basket-case.mp3"
    },
    {
      id: 222,
      artist: "Green Day",
      album: "American Idiot",
      track: "Jesus of suburbia",
      length: 0,
      path: "media/green-day/jesus.mp3"
    }
  ]};
```

#### useful links for learning:
- https://www.youtube.com/watch?v=Fk-DpOnuvmM

#### Submission Requirements
1. Do a demo during class of your app running on an Android device. The demo must include the custom app launcher icon, the custom splashscreen images, and the majority of the functionality

2. Add Steve to your private Github Repo.
    - [x] Add a gitignore file to the repo as well