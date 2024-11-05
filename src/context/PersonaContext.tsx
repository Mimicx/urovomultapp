import { createContext, useState, useContext, ReactNode } from 'react';
import { Cargo, CargoSelected } from '../utils/catalogoCargos';

interface Persona {
  id?: string;
  nombre_infractor?: string;
  tipo_identificacion?: string;
  num_identificacion?: string;
  vigencia_licencia?: Date;
  apellido_paterno_infractor?: string;
  apellido_materno_infractor?: string;
  documento_garantia?: string;
  genero_infractor?: string;
  fecha_nacimiento_infractor?: Date | string;
  estado_licencia?: string;
  numero_de_celular?: string;
  email?: string;
  licencia?: string;
  calle_infractor?: string;
  num_exterior_infractor?: string;
  num_interior_infractor?: string;
  colonia_infractor?: string;
  codigo_postal_infractor?: string;
  municipio_infractor?: string;
  estado_infractor?: string;
  comentarios?: string;
  marca_vehicular_estatal_nay?: string;
  modelo?: string;
  numero_de_identificacion_vehicular?: string;
  submarca?: string;
  tipo_de_vehiculo?: number;
  folio?: string;
  direccion_infraccion?: string;
  numero_placa?: string;
  id_user?: string;
  cargos?: CargoSelected[];
  tipo_padron?: string;
  tipo_placa?: number;
  tipo_servicio?: string;
  num_economico?: string;
  sitio_ruta?: string;
  estado_placa?: string;
  nombre_propietario?: string;
  apellido_paterno_propietario?: string;
  apellido_materno_propietario?: string;
  imagenes?: any;
  fecha_hora?: string;
  agente_policial?: number;
  unidad?: number;
}

interface PersonaContextState {
  persona: Persona;
  addPersona: (values: Persona) => void;
  cleanPersona: () => void;
}

const defaultValue: PersonaContextState = {
  persona: {},
  addPersona: () => { },
  cleanPersona: () => { }
};

const PersonaContext = createContext<PersonaContextState>(defaultValue);

export const usePersona = () => useContext(PersonaContext);

interface PersonaProviderProps {
  children: ReactNode;
}

export const PersonaProvider = ({ children }: PersonaProviderProps) => {
  const [persona, setPersona] = useState<Persona>({});
  const addPersona = (values: Persona) => {
    setPersona(values);
  };
  const cleanPersona = () => setPersona({});

  const value: PersonaContextState = { persona, addPersona, cleanPersona };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};
