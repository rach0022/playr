# Android PlayR Cordova Application
## by: Ravi Rachamalla rach0022@algonquinlive.com


### Features to Work on (REQUIREMENTS):
- [ ] Each of the entries in the playlist should show a title, an artist, and a thumbnail image that represents the audio file
- [ ] Nothing plays by default when the app loads
- [ ] The user will have to tap on an item in the list to play
- [ ] When an audio file reaches its end, the next item in the list should play
- [ ] Create an Object that contains all the information about the audio files
- [ ] Minimum of 5 songs in the playlist, from a minimum of two artists. Store all the audio files in a media folder inside the www folder.
- [ ] User should be able to click on another item in the list to start it playing. This will stop the current one playing. Use a global property to hold the media object that is playing the audio.
- [ ] The user should be able to pause and resume the playback of the current song.
- [ ] There should be some visual indication when a song is playing.
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