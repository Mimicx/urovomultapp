// TipoDeOrdenamientoSchema
export const TipoDeOrdenamientoSchema = {
    name: 'TipoDeOrdenamiento',
    properties: {
      id: 'int',
      descripcion: 'string?',
      estados_globales: 'int?',
    },
  };
  
  // AmbitoDeOrdenamientoSchema
  export const AmbitoDeOrdenamientoSchema = {
    name: 'AmbitoDeOrdenamiento',
    properties: {
      id: 'int',
      descripcion: 'string?',
      estados_globales: 'int?',
    },
  };
  
  // NombreDeOrdenamientoSchema
  export const NombreDeOrdenamientoSchema = {
    name: 'NombreDeOrdenamiento',
    properties: {
      id: 'int',
      fecha_de_vigencia: 'mixed?',
      autoridad_emite: 'mixed?',
      autoridad_aplica: 'mixed?',
      fecha_actualizada: 'mixed?',
      indice_regulacion: 'mixed?',
      objeto_regulacion: 'mixed?',
      materia: 'mixed?',
      sector: 'mixed?',
      sujetos_regulados: 'mixed?',
      nombre_tramites_relacionados: 'mixed?',
      identificacion_fundamentos: 'mixed?',
      otras_regulaciones_vinculadas: 'mixed?',
      descripcion: 'string?',
      fecha_de_publicacion: 'string?',
      fecha_de_vigor: 'string?',
      hipervinculo: 'string?',
      tipo_de_ordenamiento: 'TipoDeOrdenamiento',
      ambito_de_ordenamiento: 'AmbitoDeOrdenamiento',
      estados_globales: 'int?',
    },
  };
  
  // FundamentoSchema
  export const FundamentoSchema = {
    name: 'Fundamento',
    primaryKey: 'id',
    properties: {
      id: 'int',
      denominacion: 'string',
      articulo: 'string',
      fraccion: 'mixed?',
      inciso: 'mixed?',
      parrafo: 'mixed?',
      numero: 'mixed?',
      letra: 'mixed?',
      hipervinculo: 'string?',
      documento: 'mixed?',
      area_responsable: 'string?',
      fecha_publicacion: 'string?',
      otro: 'mixed?',
      otro_fundamento_legal: 'string?',
      nombre_de_ordenamiento: 'NombreDeOrdenamiento',
      normatividad: 'int?',
      estados_globales: 'int?',
    },
  };