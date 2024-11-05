import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().min(3, {
        message: "El correo electrónico es requerido"
    }).email("Ingresa un correo electrónico válido"),
    password: z.string().min(3, {
        message: "La contraseña es requerida"
    })
});