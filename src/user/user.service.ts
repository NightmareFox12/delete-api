import * as bcrypt from 'bcryptjs';

import { Injectable } from '@nestjs/common';

import { User } from 'src/entity/user.entity';
import { connection } from 'src/models/mysql';
import {
  nameSchema,
  lastNameSchema,
  emailSchema,
  passwordSchema,
  birthDateSchema,
} from 'src/utils/schemas';
import { Response } from 'express';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class UserService {
  async login(user: User, res: Response<any, Record<string, any>>) {
    const { email, password } = user;

    // validation
    if (email === undefined)
      return res
        .status(400)
        .json({ message: 'El correo electrónico es requerido.' });
    if (password === undefined)
      return res.status(400).json({ message: 'La contraseña es requerida.' });

    //zod validation
    const emailZod = emailSchema.safeParse(email);
    if (!emailZod.success)
      return res
        .status(400)
        .json({ message: emailZod.error.errors[0].message });

    const passwordZod = passwordSchema.safeParse(password);
    if (!passwordZod.success)
      return res
        .status(400)
        .json({ message: passwordZod.error.errors[0].message });

    // connection
    try {
      const conn = await connection();

      const [row] = await conn.query<RowDataPacket[]>(
        'SELECT userID, email, password FROM user WHERE email = ?',
        [email],
      );

      if (row.length === 0)
        return res
          .status(400)
          .json({ message: 'El usuario electrónico no existe' });
      const result = await bcrypt.compare(password, row[0].password);

      if (!result)
        return res
          .status(400)
          .json({ message: 'La contraseña no es correcta' });

      conn.end();
      return res.status(200).json({ userID: row[0].userID });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Ha ocurrido un error con la conexión.' });
    }
  }

  async createUser(user: User, res: Response<any, Record<string, any>>) {
    const { name, lastName, email, birthDate, password } = user;

    // validation
    if (name === undefined)
      return res.status(400).json({ message: 'El nombre es requerido.' });
    if (lastName === undefined)
      return res.status(400).json({ message: 'El apellido es requerido.' });
    if (email === undefined)
      return res
        .status(400)
        .json({ message: 'El correo electrónico es requerido.' });
    if (birthDate === undefined)
      return res
        .status(400)
        .json({ message: 'La fecha de nacimiento es requerida.' });
    if (password === undefined)
      return res.status(400).json({ message: 'La contraseña es requerida.' });

    // zod validation
    const nameZod = nameSchema.safeParse(name);
    if (!nameZod.success)
      return res.status(400).json({ message: nameZod.error.errors[0].message });

    const lastNameZod = lastNameSchema.safeParse(lastName);
    if (!lastNameZod.success)
      return res
        .status(400)
        .json({ message: lastNameZod.error.errors[0].message });

    const emailZod = emailSchema.safeParse(email);
    if (!emailZod.success)
      return res
        .status(400)
        .json({ message: emailZod.error.errors[0].message });

    const birthDateZod = birthDateSchema.safeParse(birthDate);
    if (!birthDateZod.success)
      return res
        .status(400)
        .json({ message: birthDateZod.error.errors[0].message });

    const passwordZod = passwordSchema.safeParse(password);
    if (!passwordZod.success)
      return res
        .status(400)
        .json({ message: passwordZod.error.errors[0].message });

    //connection
    const conn = await connection();

    const [row] = await conn.query<RowDataPacket[]>(
      'SELECT email FROM user WHERE email = ?',
      [email],
    );

    if (row.length > 0)
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya existe' });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const [row2] = await conn.query<any>(
      'INSERT user(name, last_name, email, birth_date, password) VALUES(?, ?, ?, ?, ?)',
      [name, lastName, email, birthDate, passwordHash],
    );

    conn.end();
    
    //firebase
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // const user = userCredential.user;
        // ...
      })
      .catch((err) => {
        const errCode = err.code;
        const errMessage = err.message;
        console.log(err);
        // ..
      });

    return res.status(201).json({ userID: row2.insertId });
  }

  async getUser(res: Response) {
    //connection
    try {
      const conn = await connection();
      const [row] = await conn.query<RowDataPacket[]>(
        'SELECT userID, name, last_name AS lastName, email, block, date FROM user',
      );
      conn.end();

      return res.status(200).send({ users: row });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: 'Ha ocurrido un error al obtener los usuarios' });
    }
  }

  async blockUser(res: Response, userID?: number) {
    if (userID === undefined)
      return res
        .status(200)
        .send({ message: 'El ID del usuario es requerido' });

    //connection
    try {
      const conn = await connection();
      const [row] = await conn.query<RowDataPacket[]>(
        'SELECT block FROM user WHERE userID = ?',
        [userID],
      );

      if (row.length === 0)
        return res.status(200).send({ message: 'El usuario no existe' });

      const block = row[0].block;

      await conn.query('UPDATE user SET block = ? WHERE userID = ?', [
        !block,
        userID,
      ]);

      return res.status(200).send({ success: true });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: 'Ha ocurrido un error al obtener los usuarios' });
    }
  }

  async getUserCount(res: Response) {
    //connection
    try {
      const conn = await connection();
      const [row] = await conn.query<RowDataPacket[]>(
        'SELECT COUNT(*) AS `unlock` FROM user WHERE block = 0',
      );

      const [row2] = await conn.query<RowDataPacket[]>(
        'SELECT COUNT(*) AS block FROM user WHERE block = 1',
      );

      return res
        .status(200)
        .send({ unlock: row[0].unlock, block: row2[0].block });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Ha ocurrido un error al obtener el conteo de usuarios',
      });
    }
  }
}
