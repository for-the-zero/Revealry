import { init_card_effect, init_cursor } from './components';
init_card_effect();
init_cursor();

import { get_lang, init_i18n } from './i18n';
import config_static_global from '../_configs/static_info/global.yaml';
let lang = get_lang();
init_i18n(config_static_global);
window.document.title = config_static_global[lang]._other.title_name;