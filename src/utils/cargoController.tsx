import Realm from 'realm';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import {API_FULL} from './urls';
import {getToken} from './tokenStorage';
import { INFRACCION_SCHEMA, InfraccionSchema, CATALOGO_SCHEMA, CatalogoSchema, EVIDENCIA_SCHEMA, EvidenciaSchema, ResponsePayObjectSchema, RESPONSE_PAY_OBJECT_SCHEMA } from '../models/infracciones';
import { FundamentoSchema, TipoDeOrdenamientoSchema, AmbitoDeOrdenamientoSchema, NombreDeOrdenamientoSchema  } from '../models/fundamentoSchema';
import { TiposConceptosSchema } from '../models/tipoConceptosSchema';
import { AuthSchema } from '../models/authSchema';
import { AgenteSchema, UnidadSchema } from '../models/agentesSchema';


const realmConfig: any = {
  schema: [InfraccionSchema, CatalogoSchema, EvidenciaSchema, AuthSchema, AgenteSchema, UnidadSchema,TipoDeOrdenamientoSchema,
    AmbitoDeOrdenamientoSchema,
    NombreDeOrdenamientoSchema,
    FundamentoSchema,
    TiposConceptosSchema,
    ResponsePayObjectSchema
  ],
  schemaVersion: 25,
};

let realmInstance: any;

export const getRealmInstance = () => {
  if (!realmInstance) {
    realmInstance = new Realm(realmConfig);
  }
  return realmInstance;
};


export const saveCharge = (obj: any) => {
  console.log('cargo ', obj);
  obj.fecha_nacimiento = obj.fecha_nacimiento?.toString() || '';
  try {
    const realm = getRealmInstance();
    realm.write(() => {
      realm.create(INFRACCION_SCHEMA, obj);
    });
    console.log('Se ha guardado correctamente');
  } catch (error) {
    console.log('Error al guardar el cargo', error);
  }
};


export const deleteAllData = () => {
  try {
    const realm = getRealmInstance();
    realm.write(() => {
      // Obtener todos los objetos de cada esquema y eliminarlos
      const allInfracciones = realm.objects(INFRACCION_SCHEMA);
      if (allInfracciones) {
        realm.delete(allInfracciones);
      }

      const allOtros = realm.objects(CATALOGO_SCHEMA);
      if (allOtros) {
        realm.delete(allOtros);
      }

      const allEvidencias = realm.objects(EVIDENCIA_SCHEMA);
      if (allEvidencias) {
        realm.delete(allEvidencias);
      }
    });
    console.log("Todos los datos han sido eliminados exitosamente.");
  } catch (error) {
    console.error("Error al eliminar los datos:", error);
  }
};


export const updateStatus = (id: any) => {
  try {
    const realm = getRealmInstance();
    realm.write(() => {

      const obj = realm.objectForPrimaryKey(INFRACCION_SCHEMA, id);
      if (obj) {
        obj.status = true;
        console.log(`El objeto con ID ${id} ha sido actualizado correctamente.`);
      } else {
        console.log(`No se encontro un objeto con ID ${id}.`);
      }
    });
  } catch (error) {
    console.error('Error al actualizar el campo status:', error);
  }
};


export const insertNewObjects = (data: any) => {
  try {
    const realm = getRealmInstance();
    let count = 0;
    realm.write(() => {
      data.forEach((obj: any) => {
        const existingObject = realm.objectForPrimaryKey(INFRACCION_SCHEMA, obj.id);
        if (!existingObject) {
          realm.create(INFRACCION_SCHEMA, obj);
          console.log('Se ha guardado correctamente');
          count = count + 1;
        }
        else {
          console.log('Ya existe') // de prueba..
        }
      });
    });
    console.log('Objetos guardados! ', count);
  } catch (error) {
    console.log('Error al guardar el cargo', error);
  }
};



export const insertSampleData = () => {
  try {
    const realm = getRealmInstance();
    realm.write(() => {
      realm.deleteAll();
      for (let i = 1; i <= 15; i++) {
        realm.create(INFRACCION_SCHEMA, {
          tipo_de_cargo: 5043 + i,
          padron_id: 7,
          importe: 85.0 + i,
          padron: 4,
          propietario_id: i,
          clave_ciudadana: `149-${i}`,
          nombre_completo: `GONZALEZ TELLO JOSE ALONSO ${i}`,
          numero_de_placa_vigente: `REA734${i}`,
          placa_id: 7 + i
        });
      }
    });
    console.log('Infracciones añadidas correctamente');
  } catch (error) {
    console.log('Error al añadir infracciones:', error);
  }
};


export const getAllInfracciones = () => {
  let infraccionesList = [];
  try {
    const realm = getRealmInstance();
    const infracciones = realm.objects(INFRACCION_SCHEMA);
    infraccionesList = infracciones.map(infraccion => ({
      id: infraccion.id,
      apellido_materno: infraccion.apellido_materno,
      apellido_paterno: infraccion.apellido_paterno,
      email: infraccion.email,
      estado: infraccion.estado,
      fecha_nacimiento: infraccion.fecha_nacimiento,
      genero: infraccion.genero,
      licencia: infraccion.licencia,
      marca_vehicular_estatal_nay: infraccion.marca_vehicular_estatal_nay,
      modelo: infraccion.modelo,
      nombre: infraccion.nombre,
      numero_de_celular: infraccion.numero_de_celular,
      numero_de_identificacion_vehicular: infraccion.numero_de_identificacion_vehicular,
      submarca: infraccion.submarca,
      tipo_de_vehiculo: infraccion.tipo_de_vehiculo,
      folio: infraccion.folio,
      id_user: infraccion.user_id || null,
      status: infraccion.status || false,
    }));
  } catch (error) {
    console.log('Error al obtener las infracciones:', error);
  }
  return infraccionesList;
};


export const findInfraccionByPlaca = (numeroPlaca) => {
  console.log('Buscando infracciones para la placa:', numeroPlaca);
  let infraccionesList = [];
  try {
    const realm = getRealmInstance();
    const searchPattern = `${numeroPlaca}`;
    const infracciones = realm.objects(INFRACCION_SCHEMA).filtered('numero_de_identificacion_vehicular CONTAINS $0', searchPattern);
    infraccionesList = infracciones.map(infraccion => ({
      id: infraccion.id,
      apellido_materno: infraccion.apellido_materno,
      apellido_paterno: infraccion.apellido_paterno,
      email: infraccion.email,
      estado: infraccion.estado,
      fecha_nacimiento: infraccion.fecha_nacimiento,
      genero: infraccion.genero,
      licencia: infraccion.licencia,
      marca_vehicular_estatal_nay: infraccion.marca_vehicular_estatal_nay,
      modelo: infraccion.modelo,
      nombre: infraccion.nombre,
      numero_de_celular: infraccion.numero_de_celular,
      numero_de_identificacion_vehicular: infraccion.numero_de_identificacion_vehicular,
      submarca: infraccion.submarca,
      tipo_de_vehiculo: infraccion.tipo_de_vehiculo,
      folio: infraccion.folio,
      id_user: infraccion.user_id || null,
      status: infraccion.status || false,
    }));
    // console.log('Infracciones encontradas:', infraccionesList);
    return infraccionesList;
  } catch (error) {
    console.log('Error al buscar la infracción:', error);
    return undefined;
  }
};


export const findInfraccionById = (id: any) => {
  console.log('ID:', id);
  let infraccionesList = [];
  try {
    const realm = getRealmInstance();
    const searchPattern = `${id}`;
    const infracciones = realm.objects(INFRACCION_SCHEMA).filtered('id == $0', searchPattern);
    infraccionesList = infracciones.map((infraccion:any) => ({
      id: infraccion.id,
      apellido_materno: infraccion.apellido_materno,
      apellido_paterno: infraccion.apellido_paterno,
      email: infraccion.email,
      estado: infraccion.estado,
      fecha_nacimiento: infraccion.fecha_nacimiento,
      genero: infraccion.genero,
      licencia: infraccion.licencia,
      marca_vehicular_estatal_nay: infraccion.marca_vehicular_estatal_nay,
      modelo: infraccion.modelo,
      nombre: infraccion.nombre,
      numero_de_celular: infraccion.numero_de_celular,
      numero_de_identificacion_vehicular: infraccion.numero_de_identificacion_vehicular,
      submarca: infraccion.submarca,
      fecha_hora: infraccion.fecha_hora,
      tipo_de_vehiculo: infraccion.tipo_de_vehiculo,
      direccion_infraccion: infraccion.direccion_infraccion,
      folio: infraccion.folio,
      numero_placa: infraccion.numero_placa,
      cargo_total: infraccion.cargo_total,
      id_user: infraccion.id_user,
      status: infraccion.status || false,
      evidencias: infraccion.evidencias,
      cargos: infraccion.cargos,

    }));
    console.log('Infraccion encontrada:', infraccionesList.cargos);
    return infraccionesList;
  } catch (error) {
    console.log('Error al buscar la infracción:', error);
    return undefined;
  }
};

export const findEvidenciasByID = (id: any) => {
  console.log('ID:', id);
  let infraccionesList = [];
  try {
    const realm = getRealmInstance();
    const searchPattern = `${id}`;
    const infracciones = realm.objects(INFRACCION_SCHEMA).filtered('id == $0', searchPattern);
    infraccionesList = infracciones.map((infraccion: any) => ({
      evidencias: infraccion.evidencias,
    }));
    console.log('Evidencias encontradas:', infraccionesList);
    return infraccionesList;
  } catch (error) {
    console.log('Error al buscar la infracción:', error);
    return undefined;
  }
};



/////////// CONCEPTOS //////////////

export const getFundamentos = async (type:string = 'online') => {
  
  let token = await getToken();  
  console.log('token', token);
    if(type === 'online'){
        try {
            let response = await axios.get(`${API_FULL}configuracion/fundamentos-legales/`,{
                headers: {
                  'Accept': '*/*',
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                  }
              });
            if(response.status === 200)
            {
              //console.log('token', response.data);
              return response.data;
            }
            else{
              console.log('Error al traer los fundamentos', response.status);
              return false;
            }
            
          } catch (error) {
            console.log('Error al traer el los fundamentos', error);            
          }
    }

  };


  export const getTipoConcepto = async (type:string = 'online') => {
    let token = await getToken();      

        if(type === 'online'){
          
            try {
              
                let response = await axios.get(`${API_FULL}recaudacion/tipos-de-conceptos-de-infracciones`,{
                    headers:{
                      'Accept': '*/*',
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                      }
                  });

                  if(response.status === 200)
                  {                    
                    return response.data;
                  }
                  else{
                    console.log('Error al traer los tipo de conceptos', response.status);
                    return false;
                  }
                                
            } catch (error) {
                console.log('Error al guardar el cargo', error);
            }
        }
      

  };



  export const createInfraccion = async (object:any) => {
    let token = await getToken();      
               
            try {
              
                let response = await axios.get(`${API_FULL}/recaudacion/infracciones/`,{
                    headers:{
                      'Accept': '*/*',
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                      }
                  });

                  if(response.status === 200)
                  {                    
                    return response.data;
                  }
                  else{
                    console.log('Error al guardar la infraccion', response.status);
                    return false;
                  }
                                
            } catch (error) {
                console.log('Error al guardar el cargo', error);
            }
       
      

  };

 
 //////////////// OFFLINE ///////////////////
 export const getLocalConceptos = async (q:any) => {    
  try {
    const realm = getRealmInstance();

    // Obtener fundamentos que coinciden con la búsqueda
    const fundamentos = realm
      .objects('Fundamento')
      .filtered('denominacion CONTAINS[c] $0', q);

    // Mapear y aplanar los tiposConcepto para obtener un arreglo de Cargos
    const cargosList = fundamentos.flatMap((fundamento:any) => {
      const tiposConcepto = realm
        .objects('TiposConcepto')
        .filtered('fundamento_legal == $0', fundamento.id);

      // Mapear cada tipoConcepto a un objeto Cargo
      return tiposConcepto.map((tipo:any) => ({
        id: tipo.id,
        clave: tipo.clave,
        descripcion: tipo.descripcion,
        es_concepto_capturable: tipo.es_concepto_capturable,
        es_visible: tipo.es_visible,
        es_concepto_repetible: tipo.es_concepto_repetible,
        maximo_de_concepto_repetido: tipo.maximo_de_concepto_repetido,
        es_importe_capturable: tipo.es_importe_capturable,
        importe_de_moneda_fija_inicial: tipo.importe_de_moneda_fija_inicial,
        importe_de_moneda_minima: tipo.importe_de_moneda_minima,
        importe_de_moneda_maxima: tipo.importe_de_moneda_maxima,
        fundamento_legal: tipo.fundamento_legal,
        descripcion_corta: tipo.descripcion_corta,
        monedas: tipo.monedas,
        capturable_de_fecha_inicial: tipo.capturable_de_fecha_inicial,
        capturable_de_fecha_final: tipo.capturable_de_fecha_final,
        capturable_de_nota_de_concepto: tipo.capturable_de_nota_de_concepto,
        periodo_fiscal: tipo.periodo_fiscal,
        clase_de_concepto_de_infraccion: tipo.clase_de_concepto_de_infraccion,
        tipo_de_cargo: tipo.tipo_de_cargo,
        grua: tipo.grua,
        examen_medico: tipo.examen_medico,
        yarda: tipo.yarda,
      }));
    });

    console.log('Cargos encontrados:', cargosList);
    return cargosList;
  } catch (error) {
    console.log('Error al obtener los conceptos:', error);
    return [];
  }
};


/////////////// INSERT TIPOS CONCEPTOS /////////////
export const insertLocalTiposConceptos = async (data:any) =>{
  const realm = getRealmInstance();
  let count:number = 0;
  try{    
   
      let result = realm.write(() => {
        data.forEach((obj: any) => {
          const existingObject = realm.objectForPrimaryKey('TiposConcepto', obj.id);
          if (!existingObject) {
            realm.create('TiposConcepto', obj);
            console.log('Se ha guardado correctamente el tipo de concepto');
            count = count + 1;
          }
          else {
            console.log('Ya existe el concepto') 
          }
      });
  
      return result;


  });
  }catch(error){

    console.log('Error al guardar el tipo de concepto', error);

  }


 };



/////////////// INSERT FUNDAMENTOS /////////////
export const insertLocalFundamentos = async (data:any) =>{
  const realm = getRealmInstance();
  let count:number = 0;
  try{    
    let result = realm.write(() => {
      data.forEach((obj: any) => {
        const existingObject = realm.objectForPrimaryKey('Fundamento', obj.id);
        if (!existingObject) {
          realm.create('Fundamento', obj);
          console.log('Se ha guardado correctamente');
          count = count + 1;
        }
        else {
          console.log('Ya existe el fundamento') 
        }
    });

    return result;
  });

  }catch(error){

    console.log('Error al guardar el fundamento', error);

  }


 };