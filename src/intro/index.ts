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
import '@mdui/icons/memory.js';
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
        let probablity = 0;
        if(config_intro.hitokoto){
            probablity = config_intro.hitokoto;
        };
        if(Math.random() < probablity){
            fetch('https://v1.hitokoto.cn/').then((response: Response) => {
                response.json().then((data: any)=>{
                    let hitokoto = data.hitokoto;
                    let id = data.id;
                    let from = data.from + (data.from_who ? ', ' + data.from_who: '');
                    e_sens_p.text(hitokoto);
                    e_sens_h6.text(`From ${from} via Hitokoto (ID: ${id})`);
                }).catch((error: any)=>{
                    console.error(error);
                    show_sens();
                    return;
                });
            });
        } else {
            let sens = config_intro.sentences;
            let random_sens = sens[Math.floor(Math.random() * sens.length)];
            if(random_sens.text === e_sens_p.text()){
                show_sens();
                return;
            };
            e_sens_p.text(random_sens.text);
            if(random_sens.note){
                e_sens_h6.text(random_sens.note);
            } else {
                e_sens_h6.text('');
            };
        };
    } else {
        e_sens.hide();
    };
};
e_intros_fab.on('click', show_intros);
e_sens_fab.on('click', show_sens);
show_intros();
show_sens();

//
const e_ll_subt = $('.lifelog-subtitle');
const e_ll_cards = $('.lifelog-cards');
const e_ll_l = $('.lifelog-card-laptop');
const e_ll_p = $('.lifelog-card-phone');
const e_ll_lt = $('.lifelog-card-laptop-table');
const e_ll_pt = $('.lifelog-card-phone-table');
interface lifelog_item_laptop {
    device: 'laptop';
    time: number;
    app_title: string;
    app_exe: string;
    mem: string;
};
interface lifelog_item_phone {
    device: 'phone';
    time: number;
    app_name: string;
    app_pn: string;
    battery: number;
    is_charging: boolean;
};
type lifelog_item = lifelog_item_laptop | lifelog_item_phone;
function sort_lifelog(data: lifelog_item[]): { phone_data: lifelog_item_phone[], laptop_data: lifelog_item_laptop[] }{
    let phone_data: lifelog_item_phone[] = [];
    let laptop_data: lifelog_item_laptop[] = [];
    for(let i = 0; i < data.length; i++){
        if(data[i].device === 'phone'){
            phone_data.push(data[i] as lifelog_item_phone);
        } else if(data[i].device === 'laptop'){
            laptop_data.push(data[i] as lifelog_item_laptop);
        };
    };
    return { phone_data, laptop_data };
};
e_ll_cards.hide();
if(config_intro.lifelog){
    fetch(config_intro.lifelog.url).then((response: Response) => {
        response.json().then((data: lifelog_item[]) => {
            let { phone_data, laptop_data } = sort_lifelog(data);
            show_lifelog(phone_data, laptop_data);
            e_ll_cards.show();
            e_ll_subt.hide();
        });
    }).catch((error: any) => {
        console.error(error);
        e_ll_subt.text(error.message);
    });
} else {
    $('.lifelog-title').hide();
};
function show_lifelog(phone: lifelog_item_phone[], laptop: lifelog_item_laptop[]){
    function ts2str(ts: number): string {
        if(ts < 1e10){ts *= 1000};
        const date = new Date(ts);
        const M = String(date.getMonth() + 1).padStart(2, '0');
        const D = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${M}-${D} ${h}:${m}`;
    };

    //
    if (laptop.length === 0) {
        if (config_intro.lifelog?.laptop.when_no_records) {
            e_ll_l.find('p').text(config_intro.lifelog.laptop.when_no_records);
            e_ll_l.find('.h-box').hide();
            e_ll_l.find('mdui-collapse').hide();
        };
    } else {
        function get_app_title(app_exe: string, app_title: string): string {
            const aliases = config_intro.lifelog?.laptop.alias ?? {};
            if (Object.keys(aliases).includes(app_exe)){
                return aliases[app_exe];
            } else {
                return app_title;
            };
        };
        e_ll_l.find('p').text(get_app_title(laptop[0].app_exe, laptop[0].app_title));
        e_ll_l.find('mdui-chip:first-child span').text(laptop[0].mem);
        e_ll_l.find('mdui-chip:last-child span').text(ts2str(laptop[0].time));
        laptop.forEach((item: lifelog_item_laptop) => {
            let tbody_html = `
                <tr>
                    <td>${ts2str(item.time)}</td>
                    <td>${get_app_title(item.app_exe, item.app_title)}</td>
                    <td>${item.mem}</td>
                </tr>
            `;
            e_ll_lt.find('tbody').append(tbody_html);
        });
    };

    //
    if(phone.length === 0){
        if(config_intro.lifelog?.phone.when_no_records){
            e_ll_p.find('p').text(config_intro.lifelog.phone.when_no_records);
            e_ll_p.find('.h-box').hide();
            e_ll_p.find('mdui-collapse').hide();
        };
    } else {
        function get_app_name(app_pn: string, app_name: string): string {
            const aliases = config_intro.lifelog?.phone.alias ?? {};
            if (Object.keys(aliases).includes(app_pn)){
                return aliases[app_pn];
            } else {
                return app_name;
            };
        };
        e_ll_p.find('p').text(get_app_name(phone[0].app_pn, phone[0].app_name));
        e_ll_p.find('mdui-chip:first-child span').text(phone[0].battery + '%');
        e_ll_p.find('mdui-chip:last-child span').text(ts2str(phone[0].time));
        e_ll_p.find('mdui-chip:first-child :first-child').replaceWith(
            phone[0].is_charging ? '<mdui-icon-battery-charging-full slot="icon"></mdui-icon-battery-charging-full>' : '<mdui-icon-battery-0-bar slot="icon"></mdui-icon-battery-0-bar>'
        );
        phone.forEach((item: lifelog_item_phone) => {
            let tbody_html = `
                <tr>
                    <td>${ts2str(item.time)}</td>
                    <td>${get_app_name(item.app_pn, item.app_name)}</td>
                    <td>${item.battery}%</td>
                </tr>
            `;
            e_ll_pt.find('tbody').append(tbody_html);
        });
    };
};