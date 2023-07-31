// API route
import ytdl from 'ytdl-core';

export default async (req, res) => {
  const { id, format, name } = req.query;

  if (!id) {
    return res.status(400).send('Missing video id');
  }

  let downloadFormat = 'mp4';
  if (format && format === 'mp3') {
    downloadFormat = 'mp3';
  }

    // Prepare a safe file name
  const fileName = decodeURIComponent(name).replace(/\W+/g, "_") || 'video';
  
  try {
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.${downloadFormat}"`);
    ytdl(`http://www.youtube.com/watch?v=${id}`, { format: downloadFormat }).pipe(res);
  } catch (error) {
    res.status(500).send('Error downloading video');
  }
};
