import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
// icons
import '@mdui/icons/arrow-back.js';

//
import { init_i18n, get_lang } from '../public_assets/i18n';
import config_static_links from '../_configs/links.static.yaml';
init_i18n(config_static_links);
const lang = get_lang();

//
import config_links from '../_configs/links.yaml';