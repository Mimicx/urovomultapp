import * as z from "zod";

const phoneNumberRegex = /^\d{10}$/;

export const ConductorSchema = z.object({
    licencia: z.string(),
    tipo_identificacion: z.string(),
    num_identificacion: z.string(),
    vigencia_licencia: z.date(),
    documento_garantia: z.string().min(3, {
        message: 'El documento de garantía es requerido'
    }),
    nombre_infractor: z.string().min(3, {
        message: 'El nombre es requerido'
    }),
    apellido_paterno_infractor: z.string().min(3, {
        message: 'El apellido paterno es requerido'
    }),
    apellido_materno_infractor: z.string().min(3, {
        message: 'El apellido materno es requerido'
    }),
    genero_infractor: z.string(),
    fecha_nacimiento_infractor: z.date(),
    estado_licencia: z.string(),
    estado_infractor: z.string(),
    licenciaSeleccionada: z.boolean()
})
    .superRefine((data, ctx) => {
        if (data.licenciaSeleccionada) {
            if (!data.licencia || data.licencia.trim().length < 3) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['licencia'],
                    message: 'El número de licencia es requerido',
                });
            }
        } else {
            if (!data.tipo_identificacion || data.tipo_identificacion.trim().length === 0) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['tipo_identificacion'],
                    message: 'El tipo de identificación es requerido',
                });
            }
            if (!data.num_identificacion || data.num_identificacion.trim().length < 3) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['num_identificacion'],
                    message: 'El número de identificación es requerido',
                });
            }
        }
    });

export const ConductorContactoSchema = z.object({
    calle_infractor: z.string(),
    num_exterior_infractor: z.string(),
    num_interior_infractor: z.string(),
    colonia_infractor: z.string(),
    codigo_postal_infractor: z.string(),
    municipio_infractor: z.string(),
    estado_infractor: z.string(),
    numero_de_celular: z.string().regex(phoneNumberRegex, { message: "El número debe contener 10 dígitos" }),
    email: z.string(),
    comentarios: z.string(),
});