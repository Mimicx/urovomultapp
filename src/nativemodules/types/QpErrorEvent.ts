export type QpErrorEvent = {
  eventName: 'qpError';
  resultado: string;
  codigo: number; // integer
  removeCardHint?: boolean;
  numeroTransaccion?: string;
};
