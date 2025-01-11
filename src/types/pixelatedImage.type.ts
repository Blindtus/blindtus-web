import type { Media } from './media.type';

export type PixelatedImage = {
  _id: string;
  referenceImage: string;
  images: string[];
  media: Media;
};
