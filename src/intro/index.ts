import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/divider.js';
import 'mdui/components/fab.js';
import 'mdui/components/chip.js';
import 'mdui/components/list-item.js';
import 'mdui/components/collapse.js'
import 'mdui/components/collapse-item.js';
// icons
import '@mdui/icons/arrow-back.js';
import '@mdui/icons/shuffle.js';
import '@mdui/icons/history.js';
import '@mdui/icons/battery-0-bar.js';
import '@mdui/icons/battery-charging-full.js';
import '@mdui/icons/timelapse.js';
import '@mdui/icons/update.js';

//
import { init_i18n, get_lang } from '../public_assets/i18n';
import config_static_intro from '../_configs/intro.static.yaml';
init_i18n(config_static_intro);
const lang = get_lang();

//
import config_intro_all from '../_configs/intro.yaml';
const config_intro = config_intro_all[lang] as intro;

//
const e_cards_name = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > mdui-card > p');
const e_cards_age = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > div > div > mdui-card:nth-child(1) > p');
const e_cards_sex = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > div > div > mdui-card:nth-child(2) > p');
const e_cards_locate = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > div > mdui-card > p');
const e_cards_hobby = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(1) > mdui-card:nth-child(2) > p');
const e_cards_profile = $('body > div.container > div > div > div:nth-child(2) > mdui-card:nth-child(1) > p');
const e_cards_identity = $('body > div.container > div > div > div:nth-child(2) > mdui-card:nth-child(2) > p');

e_cards_name.text(config_intro.name);
e_cards_age.text(config_intro.age);
e_cards_sex.text(config_intro.sex);
e_cards_locate.text(config_intro.locate);
e_cards_hobby.text(config_intro.hobby);
e_cards_profile.text(config_intro.profile);
e_cards_identity.text(config_intro.identity);

//
const e_intros_p = $('.intros p');
const e_intros_fab = $('.intros mdui-fab');
const e_sens = $('.sens');
const e_sens_p = $('.sens p');
const e_sens_fab = $('.sens mdui-fab');
const e_sens_h6 = $('.sens h6');

function show_intros(){
    let intros = config_intro.detail_intros;
    let random_intros = intros[Math.floor(Math.random() * intros.length)];
    if(random_intros === e_intros_p.text()){
        show_intros();
        return;
    };
    e_intros_p.text(random_intros);
};
function show_sens(){
    if(config_intro.sentences){
        let sens = config_intro.sentences;
        let random_sens = sens[Math.floor(Math.random() * sens.length)];
        if(random_sens.text === e_sens_p.text()){
            show_sens();
            return;
        };
        e_sens_p.text(random_sens.text);
        if(random_sens.note){
            e_sens_h6.text(random_sens.note);
        };
    } else {
        e_sens.hide();
    };
};
e_intros_fab.on('click', show_intros);
e_sens_fab.on('click', show_sens);
show_intros();
show_sens();