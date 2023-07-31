import { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs'; // Add this line

export default function Home() {
  const [playlistLink, setPlaylistLink] = useState('');
  const [songs, setSongs] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const getClientCredentials = async () => {
      const data = {
        grant_type: 'client_credentials',
        // client_id: process.env.CLIENT_ID,
        // client_secret: process.env.CLIENT_SECRET
        client_id:'3bbdcdbac77a43f8b4c5a0ff7c57005f',
        client_secret:'9282b9754e38462a9f787c37241ac7f9'
      };

      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: 'https://accounts.spotify.com/api/token',
      };

      const response = await axios(options);

      setAccessToken(response.data.access_token);
    };

    getClientCredentials();
  }, []);

  const handleInputChange = (event) => {
    setPlaylistLink(event.target.value);
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const playlistId = playlistLink.split('playlist/')[1].split('?')[0];

    console.log("accessToken:", accessToken);
  
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      }
    });
  
    const songNames = response.data.items.map(item => item.track.name);
    console.log("clientid: ",process.env.CLIENT_ID);
    console.log("clientsecret: ",process.env.CLIENT_SECRET);
    setSongs(songNames);
  };
  
  return (
    <div>
        
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={playlistLink} onChange={handleInputChange} placeholder="Enter Spotify playlist link" />
        <button type="submit">Get Songs</button>
      </form>
        {songs.map((song, index) => (
          <p key={index}>{song}</p>
        ))}
    </div>
  );
}
