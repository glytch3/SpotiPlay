import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import YouTube from "react-youtube";

export default function Home() {
  const [playlistLink, setPlaylistLink] = useState("");
  const [songs, setSongs] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [videoIds, setVideoIds] = useState([]);

  useEffect(() => {
    const getClientCredentials = async () => {
      const data = {
        grant_type: "client_credentials",
        client_id: "3bbdcdbac77a43f8b4c5a0ff7c57005f",
        client_secret: "9282b9754e38462a9f787c37241ac7f9",
      };

      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: "https://accounts.spotify.com/api/token",
      };

      const response = await axios(options);

      setAccessToken(response.data.access_token);
    };

    getClientCredentials();
  }, []);

  const handleInputChange = (event) => {
    setPlaylistLink(event.target.value);
  };

  const fetchSongVideoId = async (songName) => {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          q: songName,
          key: "AIzaSyDW1r-edrxp0iTQXhCjHvS86wyBLnRIqfo",
          type: "video",
          maxResults: 1,
        },
      }
    );

    return response.data.items[0].id.videoId;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const playlistId = playlistLink.split("playlist/")[1].split("?")[0];

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const songNames = response.data.items.map((item) => item.track.name);
    setSongs(songNames);

    const firstSongVideoId = await fetchSongVideoId(songNames[0]);
    setVideoIds([firstSongVideoId]);
  };

  const handleSongEnd = async () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
   
    const nextSongVideoId = await fetchSongVideoId(songs[newIndex]);
    setVideoIds([...videoIds, nextSongVideoId]);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={playlistLink}
          onChange={handleInputChange}
          placeholder="Enter Spotify playlist link"
        />
        <button type="submit">Get Songs</button>
      </form>
      {songs.map((song, index) => (
        <p key={index}>{song}</p>
      ))}
      {videoIds.length > 0 && (
        <YouTube videoId={videoIds[currentSongIndex]} onEnd={handleSongEnd} />
      )}
    </div>
  );
}
