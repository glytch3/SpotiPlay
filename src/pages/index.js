import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import YouTube from "react-youtube";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

export default function Home() {
  const [playlistLink, setPlaylistLink] = useState("");
  const [songs, setSongs] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songVideos, setSongVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
          key: "AIzaSyC0mjl8fKIP08XOwPIczgOmAAiP82qthRs",
          type: "video",
          maxResults: 1,
        },
      }
    );

    return response.data.items[0].id.videoId;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
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

    const firstSongVideo = { name: songNames[0], id: await fetchSongVideoId(songNames[0]) };
    setSongVideos([firstSongVideo]);
    setIsLoading(false);
  };

  const handleSongEnd = async () => {
    setIsLoading(true);
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);

    const songAlreadyAdded = songVideos.some(songVideo => songVideo.name === songs[newIndex]);

    if (!songAlreadyAdded) {
      const nextSongVideo = { name: songs[newIndex], id: await fetchSongVideoId(songs[newIndex]) };
      setSongVideos([...songVideos, nextSongVideo]);
    }
    setIsLoading(false);
  };


  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <TextField
          id="outlined-basic"
          label="Spotify Playlist URL"
          variant="outlined"
          value={playlistLink}
          onChange={handleInputChange}
        />
        <Button type="submit" variant="contained">
          <PlayArrowOutlinedIcon />
        </Button>
      </form>

      {!isLoading && songVideos.length > 0 && (
        <YouTube
          videoId={songVideos[currentSongIndex].id}
          onEnd={handleSongEnd}
          opts={{ playerVars: { autoplay: 1, mute: 0 } }}
        />
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Song Name</TableCell>
              <TableCell align="right">YouTube Link</TableCell>
              <TableCell align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song, index) => {
              const songVideo = songVideos.find(songVideo => songVideo.name === song);
              return (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {song}
                  </TableCell>
                  <TableCell align="right">
                    {songVideo
                      ? <a href={`https://www.youtube.com/watch?v=${songVideo.id}`}>Link</a>
                      : "To be fetched..."
                    }
                  </TableCell>
                  <TableCell align="right">
                    {songVideo
                      ? <>
                        <a href={`/api/download?id=${songVideo.id}&format=mp4&name=${encodeURIComponent(songVideo.name)}`}>Video</a> |
                        <a href={`/api/download?id=${songVideo.id}&format=mp3&name=${encodeURIComponent(songVideo.name)}`}>Audio</a>

                      </>
                      : "Fetching video link..."
                    }
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
}
