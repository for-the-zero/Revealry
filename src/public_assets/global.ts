import { init_cursor } from './components';
init_cursor();

import { init_i18n } from './i18n';
import config_static_global from '../_configs/global.static.yaml';
init_i18n(config_static_global as staticinfo);

import { setTheme, setColorScheme } from 'mdui';
import config_contents_global from '../_configs/global.static.yaml';
setTheme('dark');
setColorScheme(config_contents_global.color);