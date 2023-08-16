
# SpotiPlay - Spotify Playlist to YouTube Player

This project uses Next.js to create a web app that allows users to enter a Spotify playlist URL and then play the songs in the playlist on YouTube.

The app uses the following APIs:

* Spotify API: To get the songs in the playlist
* YouTube API: To get the video ID for each song
* React YouTube: To embed YouTube videos in the app

## Getting Started

To get started, you will need to:

1. Install the dependencies:

```
npm install
```

2. Create a `.env` file and add the following environment variables:

```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

3. Run the development server:

```
npm run dev
```

The app will be available at http://localhost:3000.

## Getting API Keys

To get the Spotify API key, you will need to create a Spotify developer account. Once you have created an account, you can generate a client ID and client secret.<br>
&emsp;&emsp;&emsp;Spotify API: https://developer.spotify.com/documentation/web-api/

To get the YouTube API key, you will need to create a Google Cloud Platform project. Once you have created a project, you can enable the YouTube API and generate a key.<br>
&emsp;&emsp;&emsp;YouTube API: https://developers.google.com/youtube/v3/

## Usage

To use the app, enter the Spotify playlist URL in the form and click the "Play" button. The songs in the playlist will be played on YouTube.

You can also click on a song in the list to play it directly on YouTube.
