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
import '@mdui/icons/light.js';

import { get_lang, init_i18n, change_lang } from './public_assets/i18n';
import config_static_home from './_configs/home.static.yaml';
init_i18n(config_static_home);
const lang = get_lang();

const e_switchlang = $('.switch-lang > mdui-button-icon');
e_switchlang.on('click', change_lang);

let ele_a = document.querySelectorAll('.index > mdui-card');
if(ele_a.length > 0){
    ele_a.forEach((e)=>{
        let target_ele = e.shadowRoot?.querySelector('a');
        if(target_ele){
            target_ele.style.cursor = 'none';
        };
    });
};

import { get_dnmode, switch_dnmode } from './public_assets/dn_mode';
import { snackbar } from 'mdui/functions/snackbar.js';
const e_switchdn_tt = $('.switch-daynight');
const e_switchdn_btn = $('.switch-daynight > mdui-button-icon');
const dn_order = {'auto': 'light', 'light': 'dark', 'dark': 'auto'};
var dn_mode = get_dnmode();
e_switchdn_tt.attr('content', config_static_home[lang]._other.daynight[dn_order[dn_mode]].tooltip);
e_switchdn_btn.on('click', ()=>{
    switch_dnmode(dn_order[dn_mode]);
    dn_mode = get_dnmode();
    e_switchdn_tt.attr('content', config_static_home[lang]._other.daynight[dn_order[dn_mode]].tooltip);
    snackbar({
        message: config_static_home[lang]._other.daynight[dn_mode].notice,
        autoCloseDelay: 500,
    });
});