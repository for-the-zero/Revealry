import $ from 'jquery';

import 'mdui/components/card.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/avatar.js';
import 'mdui/components/divider.js';

import '@mdui/icons/translate.js';
import '@mdui/icons/badge--outlined.js';
import '@mdui/icons/connect-without-contact.js';
import '@mdui/icons/feed--outlined.js';

import { init_i18n, change_lang } from './public_assets/i18n';
import config_static_home from './_configs/static_info/home.yaml';
init_i18n(config_static_home);

const e_switchlang = $('.switch-lang > mdui-button-icon');

e_switchlang.on('click', change_lang);