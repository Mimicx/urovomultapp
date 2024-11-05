import * as z from "zod";

export const DomicilioSchema = z.object({
    vialidad_principal_ubicacion: z.string().min(3, {
        message: 'La vialidad es requerida'
    }),
    tipo_vialidad_ubicacion: z.string().min(3, {
        message: 'El tipo de vialidad es requerido'
    }),
    num_exterior_ubicacion: z.string(),
    num_interior_ubicacion: z.string(),
    entre_primera_vialidad_ubicacion: z.string(),
    entre_primera_tipo_ubicacion: z.string(),
    entre_segunda_vialidad_ubicacion: z.string(),
    entre_segunda_tipo_ubicacion: z.string(),
    colonia_ubicacion: z.string(),
    codigo_postal_ubicacion: z.string(),
    municipio_ubicacion: z.string().min(3, {
        message: 'El municipio es requerido'
    }),
    estado_ubicacion: z.string().min(3, {
        message: 'El estado es requerido'
    }),
    descripcion_ubicacion: z.string(),
    lat_ubicacion: z.number(),
    lng_ubicacion: z.number(),
});