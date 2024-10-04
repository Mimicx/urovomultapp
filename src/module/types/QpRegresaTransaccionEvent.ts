export type QpRegresaTransaccionEvent = {
  eventName: 'qpRegresaTransaccion';
  resultado: QpTransaccion;
  codigo: number; // integer
};

type QpTransaccion = {
  NumeroTransaccion: string;
  TipoMovimiento: string;
  OrigenTransaccion: string;
  CanalTransaccion: string;
  CodigoAprobacion: string;
  DigitosTarjeta: string;
  FechaTransaccion: string;
  HoraTransaccion: string;
  Monto: string;
  TipoTarjeta: string;
  MarcaTarjeta: string;
  BancoEmisor: string;
  ARQC: string;
  AID: string;
  TSI: string;
  TVR: string;
  APN: string;
  AL: string;
  Titular: string;
  SerieLector: string;
  Referencia: string;
  ReferenciaBanco: string;
  Firmado: string;
  Usuario: string;
  Resultado: string;
  PosEntryMode: 'CONTACTLESSCHIP' | 'CONTACTLESSMAGSTRIPE' | 'CHIP' | 'MAGSTRIPE';
  RemoveCardHint: 'true' | 'false' | void;
};
