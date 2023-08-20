import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath);

async function downloadFunction(req, res) {
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
}

export default downloadFunction;




// import ytdl from 'ytdl-core';

// export default async (req, res) => {
//   const { id, format } = req.query;

//   if (!id) {
//     return res.status(400).send('Missing video id');
//   }

//   try {
//     const info = await ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
//     const formatInfo = ytdl.chooseFormat(info.formats, { quality: format === 'mp3' ? 'highestaudio' : 'highestvideo' });
//     if (formatInfo) {
//       res.status(200).send({ downloadUrl: formatInfo.url });
//     } else {
//       res.status(500).send('No suitable format found');
//     }
//   } catch (error) {
//     res.status(500).send('Error getting video info');
//   }
// };
