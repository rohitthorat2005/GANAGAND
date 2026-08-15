# गणगंध — V1

A mobile-first retro Marathi Ganesh Utsav music experience.

## Folder structure

```text
ganagand_v1/
├── index.html
├── style.css
├── script.js
├── images/
│   └── background.jpg
└── songs/
    └── your-song.mp3
```

## Add your songs

1. Put your MP3 files inside `songs/`.
2. Open `script.js`.
3. Find the `const songs = [...]` section.
4. Add each song like:

```js
{
  title: "तुमच्या गाण्याचे नाव",
  artist: "कलाकाराचे नाव",
  file: "songs/song-01.mp3"
}
```

5. Save and open `index.html`.

## Features

- Random / shuffle playback
- Automatic next song
- Previous / next
- Play / pause
- Progress bar
- Volume and mute
- Mobile-first 9:16 visual design
- Replaceable background image

## Important

The included background is the current V1 visual. Later, replace:

`images/background.jpg`

with your new final background image.

Keep private/local audio files local unless you have the necessary rights to distribute them.
