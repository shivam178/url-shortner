import { Schema, model } from 'mongoose';
import { getRandomId } from '../utils/helper';

export interface IUrlModel {
  fullUrl: string;
  shortUrl: string;
  clicks: number;
}

export const UrlSchema = new Schema<IUrlModel>({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: getRandomId(10),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default model('urlModel', UrlSchema);