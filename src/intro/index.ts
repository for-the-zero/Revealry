import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
// icons
import '@mdui/icons/arrow-back.js';

import { init_i18n, get_lang } from '../public_assets/i18n';
import config_static_intro from '../_configs/intro.static.yaml';
init_i18n(config_static_intro);
const lang = get_lang();

const e_cards_name = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > mdui-card');
const e_cards_age = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > div > div > mdui-card:nth-child(1)');
const e_cards_sex = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > div > div > mdui-card:nth-child(2)');
const e_cards_locate = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(2) > div > mdui-card');
const e_cards_hobby = $('body > div.container > div > div > div:nth-child(1) > div:nth-child(1) > mdui-card:nth-child(2)');
const e_cards_profile = $('body > div.container > div > div > div:nth-child(2) > mdui-card:nth-child(1)');
const e_cards_identity = $('body > div.container > div > div > div:nth-child(2) > mdui-card:nth-child(2)');

import config_intro_all from '../_configs/intro.yaml';
const config_intro = config_intro_all[lang];
e_cards_name.text(config_intro.name);
e_cards_age.text(config_intro.age);
e_cards_sex.text(config_intro.sex);
e_cards_locate.text(config_intro.locate);
e_cards_hobby.text(config_intro.hobby);
e_cards_profile.text(config_intro.profile);
e_cards_identity.text(config_intro.identity);