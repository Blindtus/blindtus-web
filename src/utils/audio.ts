import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const trimAudioFile = async (
  mediaSlug: string,
  file: File,
  startAt: number = 0,
  endAt: number | null = 60,
): Promise<File> => {
  const ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }

  const duration = endAt ? endAt - startAt : 60;

  await ffmpeg.writeFile('input.mp3', await fetchFile(file));
  await ffmpeg.exec([
    '-i',
    'input.mp3',
    '-ss',
    startAt.toString(),
    '-t',
    duration.toString(),
    'output.mp3',
  ]);
  const data = await ffmpeg.readFile('output.mp3');
  const trimmedFile = new File([data], `${mediaSlug}_${file.name}`, { type: 'audio/mp3' });

  return trimmedFile;
};

export const secondsToMinutes = (sec: number | undefined) => {
  if (!sec) return '00:00';
  sec = Math.trunc(+sec);
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
