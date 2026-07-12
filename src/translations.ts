/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, LanguagePack } from './types';

export const translations: Record<Language, LanguagePack> = {
  en: {
    appTitle: 'Vyapar Taraju',
    appSubtitle: 'Kirana & Merchant Smart Scale Assistent',
    weightCardTitle: 'Calculate Weight',
    weightCardDesc: 'Find correct weight from price and money amount',
    amountCardTitle: 'Calculate Amount',
    amountCardDesc: 'Find final cost from item weight and price per kg',
    calcCardTitle: 'Smart Calculator',
    calcCardDesc: 'Quick arithmetic builder with logs and direct copy',
    settingsTitle: 'Settings',
    settingsDesc: 'Theme, language toggle, rating, and app sharing options',
    
    // Weight Calculator Screen
    pricePerKg: 'Price per KG (₹)',
    amountToPay: 'Purchase Amount (₹)',
    enterPrice: 'Enter rate (e.g. 50)',
    enterAmount: 'Enter money paid (e.g. 20)',
    weightResult: 'Calculated Weight',
    calculatedWeight: 'You should give:',
    kg: 'KG',
    gram: 'Grams',
    
    // Amount Calculator Screen
    weightAmount: 'Item Weight',
    enterWeight: 'Enter weight quantity',
    weightType: 'Weight Unit',
    calculatedAmount: 'Final Amount to Charge:',
    amountResult: 'Payable Amount',

    // Buttons & generic
    calculate: 'Calculate',
    clear: 'Clear',
    copyResult: 'Copy Result',
    shareResult: 'Share',
    historyTitle: 'Calculation History',
    noHistory: 'No calculations saved yet.',
    clearHistory: 'Clear History',
    historySaved: 'History logged successfully',
    copied: 'Result copied to clipboard!',
    shared: 'Success! Share text copied for dispatch!',
    backToHome: 'Back to Main Panel',

    // Settings
    themeSetting: 'App Theme Mode',
    langSetting: 'Preferred Language',
    rateApp: 'Rate Us On PlayStore',
    shareApp: 'Share This App with Friends',
    aboutDeveloper: 'Vyapar Taraju is made for fast counter service. Designed with ❤️ in India.',
    kiranaAssistent: 'Smart Kirana Solutions',
    rateAppMessage: 'Thank you for your rating and feedback!',
    shareAppMessage: 'Hey! Check out Vyapar Taraju - the smartest calculator app for Kirana & Daily Stores. Highly recommended! Download & run offline instantly.'
  },
  hi: {
    appTitle: 'व्यापार तराजू',
    appSubtitle: 'किराना और व्यापारी के लिए डिजिटल वज़न सहायक',
    weightCardTitle: 'वज़न का हिसाब',
    weightCardDesc: 'भाव और दी गई रकम से सही वज़न निकालें',
    amountCardTitle: 'रकम का हिसाब',
    amountCardDesc: 'वज़न और प्रति किलो भाव से कुल कीमत निकालें',
    calcCardTitle: 'स्मार्ट कैलकुलेटर',
    calcCardDesc: 'दुकानदार के लिए आसान जोड़-घटाना और कॉपी',
    settingsTitle: 'सेटिंग्स',
    settingsDesc: 'थीम, भाषा बदलाव, रेटिंग और ऐप शेयर विकल्प',
    
    // Weight Calculator Screen
    pricePerKg: 'भाव प्रति किलो (₹)',
    amountToPay: 'ग्राहक की रकम (₹)',
    enterPrice: 'कीमत दर्ज़ करें (जैसे: 40)',
    enterAmount: 'ग्राहक ने कितने रूपये दिए (जैसे: 20)',
    weightResult: 'सही वज़न',
    calculatedWeight: 'इतना वज़न तौलें:',
    kg: 'किलोग्राम (Kg)',
    gram: 'ग्राम (Gram)',
    
    // Amount Calculator Screen
    weightAmount: 'सामान का वज़न',
    enterWeight: 'वज़न की मात्रा दर्ज़ करें',
    weightType: 'वज़न की इकाई',
    calculatedAmount: 'कुल देय राशि:',
    amountResult: 'कुल रूपये',

    // Buttons & generic
    calculate: 'हिसाब लगायें',
    clear: 'साफ़ करें',
    copyResult: 'नतीजा कॉपी करें',
    shareResult: 'शेयर करें',
    historyTitle: 'हिसाब-किताब का इतिहास',
    noHistory: 'कोई इतिहास दर्ज़ नहीं है।',
    clearHistory: 'इतिहास साफ़ करें',
    historySaved: 'इतिहास में दर्ज़ किया गया',
    copied: 'नतीजा कॉपी हो गया है!',
    shared: 'शेयर संदेश तैयार! (क्लिपबोर्ड में कॉपी हुआ)',
    backToHome: 'मुख्य पैनल पर वापस',

    // Settings
    themeSetting: 'ऐप थीम मोड',
    langSetting: 'पसंदीदा भाषा',
    rateApp: 'प्लेस्टोर पर रेट करें',
    shareApp: 'मित्रों और व्यापारियों को शेयर करें',
    aboutDeveloper: 'व्यापार तराजू ऑफलाइन तेज़ हिसाब-किताब के लिए बनाया गया है। गर्व से ❤️ भारत में निर्मित।',
    kiranaAssistent: 'स्मार्ट किराना सॉल्यूशंस',
    rateAppMessage: 'हमारी सहायता को रेटिंग देने के लिए धन्यवाद!',
    shareAppMessage: 'नमस्ते! व्यापार तराजू (Vyapar Taraju) ऐप को देखें, जो किराना दुकानदारों के लिए सबसे सरल तराजू कैलकुलेटर है। इसे अभी ऑफलाइन इस्तेमाल करें!'
  }
};
