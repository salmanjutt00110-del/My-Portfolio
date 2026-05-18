import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const soundsDir = path.join(__dirname, 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Different reliable sources to avoid rate limiting
const files = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/UI_Sound_Click_01.ogg', name: 'scroll.ogg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Typewriter_keyboard_sound.ogg', name: 'typing.ogg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Ambient_music_loop.ogg', name: 'about.ogg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Synth_loop.ogg', name: 'work.ogg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Pop_sound.ogg', name: 'bounce.ogg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Chime_sound.ogg', name: 'contact.ogg' }
];

const download = (file) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(soundsDir, file.name);
    const fileStream = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    const get = (url) => {
      https.get(url, options, response => {
        if (response.statusCode === 200) {
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            console.log('Downloaded:', file.name);
            resolve();
          });
        } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          get(response.headers.location.startsWith('http') ? response.headers.location : `https://upload.wikimedia.org${response.headers.location}`);
        } else {
          console.log(`Failed to download ${file.name}: ${response.statusCode}`);
          resolve(); // Resolve anyway to continue sequence
        }
      }).on('error', err => {
        console.log('Error downloading', file.name, err);
        resolve();
      });
    };
    get(file.url);
  });
};

async function run() {
  for (const file of files) {
    await download(file);
    // Wait 2 seconds between downloads to prevent 429 Too Many Requests
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
