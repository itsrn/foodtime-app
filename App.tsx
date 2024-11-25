import { I18nManager } from 'react-native';
import Index from './app/index';

// כפיית RTL
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function App() {
  return <Index />;
} 