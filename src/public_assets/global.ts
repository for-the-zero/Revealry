import { init_cursor } from './components';
init_cursor();

import { init_i18n } from './i18n';
import config_static_global from '../_configs/global.static.yaml';
init_i18n(config_static_global);

import { setTheme, setColorScheme } from 'mdui';
import config_contents_global from '../_configs/global.yaml';
setTheme('dark');
setColorScheme(config_contents_global.color);