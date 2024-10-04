export const Screens = Object.freeze({
  INIT_POS_SCREEN: 'INIT_POS_SCREEN',
  HOME_SCREEN: 'HOME_SCREEN',
  PROCESSING_SCREEN: 'PROCESSING_SCREEN',
  PAYMENT_RESULT_SCREEN: 'PAYMENT_RESULT_SCREEN',
});

export type Screen = (typeof Screens)[keyof typeof Screens];
