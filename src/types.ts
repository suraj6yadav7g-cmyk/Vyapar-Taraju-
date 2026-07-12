/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi';
export type ThemeMode = 'dark' | 'light';
export type ActiveScreen = 'home' | 'weight' | 'amount' | 'calculator' | 'settings' | 'history';

export interface HistoryItem {
  id: string;
  type: 'weight' | 'amount' | 'calculator';
  timestamp: number;
  inputDescription: string;
  formulaDescription: string;
  result: string;
  rawDetails: {
    price?: number;
    amount?: number;
    weight?: number;
    weightType?: 'kg' | 'g';
    expression?: string;
  };
}

export interface LanguagePack {
  appTitle: string;
  appSubtitle: string;
  weightCardTitle: string;
  weightCardDesc: string;
  amountCardTitle: string;
  amountCardDesc: string;
  calcCardTitle: string;
  calcCardDesc: string;
  settingsTitle: string;
  settingsDesc: string;
  
  // Weights screen
  pricePerKg: string;
  amountToPay: string;
  enterPrice: string;
  enterAmount: string;
  weightResult: string;
  calculatedWeight: string;
  kg: string;
  gram: string;
  
  // Amount screen
  weightAmount: string;
  enterWeight: string;
  weightType: string;
  calculatedAmount: string;
  amountResult: string;

  // Buttons & Generic
  calculate: string;
  clear: string;
  copyResult: string;
  shareResult: string;
  historyTitle: string;
  noHistory: string;
  clearHistory: string;
  historySaved: string;
  copied: string;
  shared: string;
  backToHome: string;

  // Settings
  themeSetting: string;
  langSetting: string;
  rateApp: string;
  shareApp: string;
  aboutDeveloper: string;
  kiranaAssistent: string;
  rateAppMessage: string;
  shareAppMessage: string;
}
