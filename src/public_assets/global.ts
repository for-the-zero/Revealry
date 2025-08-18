import { init_cursor } from './components';
init_cursor();

import { init_i18n } from './i18n';
import config_static_global from '../_configs/global.static.yaml';
init_i18n(config_static_global);

import { setColorScheme } from 'mdui';
import config_contents_global from '../_configs/global.yaml';
setColorScheme(config_contents_global.color);

import { init_dnmode } from './dn_mode';
init_dnmode();