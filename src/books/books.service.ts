import { Injectable } from '@nestjs/common';
import { Book } from 'src/entity/book.entity';
import { Request, Response } from 'express';
import { connection } from 'src/models/mysql';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class BooksService {
  async getBooks(res: Response) {
    try {
      const response = await fetch(
        'https://openlibrary.org/search.json?q=sostenibilidad&limit=30',
      );
      const data = await response.json();

      const books = data.docs.map((book: Book) => ({
        key: book.key,
        title: book.title,
        author: book.author_name
          ? book.author_name.join(', ')
          : 'Autor desconocido',
        coverImage: book.cover_edition_key
          ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
          : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
        firstPublishYear: book.first_publish_year,
        bookUrl: book.key ? `https://openlibrary.org${book.key}` : undefined,
      }));

      return res.status(200).json({ books: books });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ err: 'Ha ocurrido un error con la conexión.' });
    }
  }

  async getBookLikes(req: Request, res: Response) {
    const { book_key, userID } = req.query;

    if (!book_key || !userID) {
      return res.status(400).json({ message: 'Faltan parámetros.' });
    }

    //connection
    try {
      const conn = await connection();

      const [row] = await conn.query<RowDataPacket[]>(
        'SELECT COUNT(like_bookID) as total_likes FROM like_book WHERE book_key = ?',
        [book_key],
      );

      const [row2] = await conn.query<RowDataPacket[]>(
        `
      SELECT EXISTS(
        SELECT 1
        FROM like_book
        WHERE book_key = ? AND userID = ?
      ) AS userLiked;
      `,
        [book_key, userID],
      );

      conn.end();

      return res.status(200).json({
        likes: row[0].total_likes,
        userLiked: row2[0].userLiked === 0 ? false : true,
      });

    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ err: 'Ha ocurrido un error con la conexión.' });
    }
  }

  async likeBook(req: Request, res: Response) {
    const { book_key, book_title, userID } = req.body;

    if (!book_key)
      return res.status(400).json({ message: 'El book_key es requerido.' });
    if (!book_title)
      return res.status(400).json({ message: 'El book_title es requerido.' });
    if (!userID)
      return res.status(400).json({ message: 'El userID es requerido.' });

    try {
      //connection
      const conn = await connection();

      const [row] = await conn.query<RowDataPacket[]>(
        'SELECT like_bookID FROM like_book WHERE userID = ? AND book_key = ?',
        [userID, book_key],
      );

      if (row.length > 0) {
        await conn.query<RowDataPacket[]>(
          'DELETE FROM like_book WHERE userID = ? AND book_key = ?',
          [userID, book_key],
        );
      } else {
        await conn.query<RowDataPacket[]>(
          'INSERT INTO like_book(userID, book_key, book_title) VALUES(?, ?, ?)',
          [userID, book_key, book_title],
        );
      }
      conn.end();

      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ err: 'Ha ocurrido un error con la conexión.' });
    }
  }

  async getAllLikes(res: Response<any, Record<string, any>>) {
    try {
      //connection
      const conn = await connection();

      const [row] = await conn.query<RowDataPacket[]>(
        `SELECT lb.like_bookID AS likeBookID, 
          u.name AS userName, 
          lb.book_key AS bookKey, 
          lb.book_title AS bookTitle, 
          lb.date 
          FROM like_book AS lb
          JOIN user AS u 
          ON u.userID = lb.userID`,
      );

      conn.end();

      return res.status(200).json({ likes: row });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ err: 'Ha ocurrido un error con la conexión.' });
    }
  }

  async getLikeStats(res: Response) {
    try {
      const conn = await connection();

      const [row] = await conn.query<
        RowDataPacket[]
      >(`SELECT book_title AS bookTitle, COUNT(*) AS totalLikes
      FROM like_book
      GROUP BY book_key, book_title
      ORDER BY totalLikes DESC
      LIMIT 10`);

      conn.end();

      return res.status(200).json({ likes: row });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ err: 'Ha ocurrido un error con la conexión.' });
    }
  }
}
