import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/dialog.js';
import 'mdui/components/text-field.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/button-icon.js';
// icons
import '@mdui/icons/arrow-back.js';
import '@mdui/icons/content-copy.js';
import '@mdui/icons/open-in-new.js';

//
import { init_i18n, get_lang } from '../public_assets/i18n';
import config_static_links from '../_configs/links.static.yaml';
init_i18n(config_static_links);
const lang = get_lang();

//
import config_links from '../_configs/links.yaml';