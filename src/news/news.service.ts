import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class NewsService {
  async getNews(res: Response) {
    if (!process.env.NEWS_API_KEY || !process.env.NEWS_HOST_KEY) {
      return res.status(500).json({ err: 'Ha ocurrido un error con la conexión.' });
    }
    const url =
      'https://news-api14.p.rapidapi.com/v2/search/articles?query=sostenibilidad+desarrollo+humano&language=es';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.NEWS_API_KEY,
        'x-rapidapi-host': process.env.NEWS_HOST_KEY,
      },
    };

    try {
      const request = await fetch(url, options);
      const response = await request.json();
      return res.status(200).json({ response });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: 'Ha ocurrido un error con la conexión.' });
    }
  }
}
