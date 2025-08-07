import $ from 'jquery';

import '@mdui/icons/translate.js';
import '@mdui/icons/badge--outlined.js';
import '@mdui/icons/connect-without-contact.js';
import '@mdui/icons/feed--outlined.js';

import { init_i18n, change_lang } from './public_assets/i18n';
import config_static_home from './_configs/static_info/home.yaml';
init_i18n(config_static_home);

const e_slang_fab = $('.swtich-lang');

e_slang_fab.on('mouseenter',()=>{
    e_slang_fab.addClass('active')
});
e_slang_fab.on('mouseleave',()=>{
    e_slang_fab.removeClass('active')
});
e_slang_fab.on('click',()=>{
    change_lang();
});