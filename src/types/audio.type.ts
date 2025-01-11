import type { Media } from './media.type';

export type Proposal = {
  titleFr: string;
  backdrop: string;
  poster: string;
};

export type Music = {
  _id: string;
  title: string;
  author: string;
  audioName: string;
  duration: number;
  startAt: number;
  media: Media;
  audioPath?: string | null;
};

export type NewMusic = {
  title: string;
  author: string;
  duration: number;
  startAt: number;
  media: string;
  audio: File;
};
