import * as z from 'zod';

export const VehiculoSchema = z.object({
    tipo_padron: z.string(),
    numero_placa: z.string(),
    tipo_placa: z.number(),
    numero_de_identificacion_vehicular: z.string(),
    marca_vehicular_estatal_nay: z.string().min(1, {
        message: 'La marca vehicular es requerida'
    }),
    submarca: z.string(),
    modelo: z.string().refine((val) => /^\d{4}$/.test(val) && parseInt(val) >= 1900 && parseInt(val) <= new Date().getFullYear() + 1, {
        message: 'El modelo debe ser un año válido de 4 dígitos'
    }),
    color_secundario: z.string().min(1, {
        message: 'El color es requerido'
    }),
    tipo_de_vehiculo: z.coerce.number(),
    estado_placa: z.string(),
    tipo_servicio: z.string(),
    num_economico: z.string(),
    sitio_ruta: z.string(),
})