import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath);


export default async (req, res) => {
  const { id, format, name } = req.query;

  if (!id) {
    return res.status(400).send('Missing video id');
  }

  // Prepare a safe file name
  const fileName = decodeURIComponent(name).replace(/\W+/g, "_") || 'video';

  try {
    if (format === 'mp3') {
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.mp3"`);

      let stream = ytdl(`http://www.youtube.com/watch?v=${id}`, { quality: 'highestaudio' });
      ffmpeg(stream)
        .audioBitrate(128)
        .toFormat('mp3')
        .pipe(res);

    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.mp4"`);
      ytdl(`http://www.youtube.com/watch?v=${id}`, { format: 'mp4' }).pipe(res);
    }
  } catch (error) {
    res.status(500).send('Error downloading video');
  }
};
