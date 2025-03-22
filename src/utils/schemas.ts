import { z } from 'zod';

export const nameSchema = z
  .string({
    message: 'El nombre no puede tener números ni caracteres especiales.',
  })
  .min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  })
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre no puede tener números ni caracteres especiales.',
  });

export const lastNameSchema = z
  .string({
    message: 'El apellido no puede tener números ni caracteres especiales.',
  })
  .min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  })
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El apellido no puede tener números ni caracteres especiales.',
  });

export const emailSchema = z
  .string()
  .email({ message: 'Correo inválido' })
  .min(5, { message: 'El correo debe tener al menos 5 caracteres.' });

export const passwordSchema = z
  .string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  .regex(/[A-Z]/, {
    message: 'La contraseña debe contener al menos una letra mayúscula.',
  })
  .regex(/[a-z]/, {
    message: 'La contraseña debe contener al menos una letra minúscula.',
  })
  .regex(/[0-9]/, {
    message: 'La contraseña debe contener al menos un número.',
  })
  .regex(/[^A-Za-z0-9]/, {
    message: 'La contraseña debe contener al menos un carácter especial.',
  });
