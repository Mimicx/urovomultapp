import * as z from 'zod';

export const PropietarioSchema = z.object({
    nombre_propietario: z.string().min(1, "Nombre es requerido"),
    apellido_paterno_propietario: z.string().min(1, { message: "Apellido Paterno es requerido" }),
    apellido_materno_propietario: z.string().min(1, { message: "Apellido Materno es requerido" }),
});