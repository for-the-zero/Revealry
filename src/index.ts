import $ from 'jquery';

// components
import 'mdui/components/card.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/avatar.js';
import 'mdui/components/divider.js';
// icons
import '@mdui/icons/translate.js';
import '@mdui/icons/badge--outlined.js';
import '@mdui/icons/connect-without-contact.js';
import '@mdui/icons/feed--outlined.js';

import { init_i18n, change_lang } from './public_assets/i18n';
import config_static_home from './_configs/home.static.yaml';
init_i18n(config_static_home);

const e_switchlang = $('.switch-lang > mdui-button-icon');
const e_linkcard = $('.link-card');

e_switchlang.on('click', change_lang);
e_linkcard.eq(0).on('click', () => {window.location.href = './intro/'});
e_linkcard.eq(1).on('click', () => {window.location.href = './links/'});
e_linkcard.eq(2).on('click', () => {window.location.href = './blog/'});