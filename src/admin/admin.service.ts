import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { emailSchema, passwordSchema } from 'src/utils/schemas';
import { Admin } from 'src/entity/Admin.entity';
import { connection } from 'src/models/mysql';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class AdminService {
  async isAdmin(admin: Admin, res: Response) {
    const { email, password } = admin;

    //validation
    if (admin.email === undefined)
      return res
        .status(400)
        .json({ message: 'El correo electrónico es requerido.' });
    if (admin.password === undefined)
      return res.status(400).json({ message: 'La contraseña es requerida.' });

    //zod validation
    const emailZod = emailSchema.safeParse(admin.email);
    if (!emailZod.success)
      return res
        .status(400)
        .json({ message: emailZod.error.errors[0].message });

    const passwordZod = passwordSchema.safeParse(admin.password);
    if (!passwordZod.success)
      return res
        .status(400)
        .json({ message: passwordZod.error.errors[0].message });

    //check admin
    try {
      const conn = await connection();
      const [rows] = await conn.query<RowDataPacket[]>(
        'SELECT * FROM admin WHERE email = ?',
        [email],
      );

      if (rows.length === 0) return res.status(200).json({ admin: false });

      const isPasswordValid = await bcrypt.compare(password, rows[0].password);
      if (!isPasswordValid) return res.status(200).json({ admin: false });

      //jwt
      const token = jwt.sign({ email }, process.env.JWT_KEY, {
        expiresIn: '2d',
      });

      return res.status(200).json({ admin: true, token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error checking admin.' });
    }
  }

  async createAdmin(admin: Admin, res: Response<any, Record<string, any>>) {
    const { email, password } = admin;

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

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create admin
    try {
      const conn = await connection();
      await conn.query('INSERT INTO admin (email, password) VALUES (?, ?)', [
        email,
        hashedPassword,
      ]);
      return res.status(200).json({ message: 'Admin created successfully.' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error creating admin.' });
    }
  }
}
