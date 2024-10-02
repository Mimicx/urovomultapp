export const Screens = Object.freeze({
  HOME_SCREEN: 'HOME_SCREEN',
  PROCESSING_SCREEN: 'PROCESSING_SCREEN',
  PAYMENT_RESULT_SCREEN: 'PAYMENT_RESULT_SCREEN',
});

export type Screen = (typeof Screens)[keyof typeof Screens];
