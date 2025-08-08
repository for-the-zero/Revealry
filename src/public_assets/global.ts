import { init_cursor } from './components';
init_cursor();

import { init_i18n } from './i18n';
import config_static_global from '../_configs/static_info/global.yaml';
init_i18n(config_static_global);

import { setTheme, setColorScheme } from 'mdui';
setTheme('dark');
setColorScheme('#0059c7');
