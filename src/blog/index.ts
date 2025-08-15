import $ from 'jquery';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/divider.js';
import 'mdui/components/chip.js';
import 'mdui/components/text-field.js';
import 'mdui/components/select.js';
import 'mdui/components/menu-item.js';
// icons
import '@mdui/icons/arrow-back.js';
import '@mdui/icons/tag.js';
import '@mdui/icons/category--outlined.js';
import '@mdui/icons/search.js';

//
import { init_i18n } from '../public_assets/i18n';
import config_static_blog from '../_configs/blog.static.yaml';
init_i18n(config_static_blog);

//
const e_search_method = $('.searching > mdui-segmented-button-group');
const e_search_input = $('.searching > mdui-text-field');
const e_search_select = $('.searching > mdui-select');
let select_ele_main = document.querySelector('.searching > mdui-select')
    ?.shadowRoot?.querySelector('mdui-dropdown')
    ?.querySelector('mdui-text-field');
if(select_ele_main){
    select_ele_main.style.cursor = 'none';
};
e_search_select.hide();
var search_method = 'name';
e_search_method.on('click', ()=>{
    let val = e_search_method.val() as string;
    if(val){
        search_method = val;
        if(val === 'name'){
            e_search_input.show();
            e_search_select.hide();
        } else {
            e_search_input.hide();
            e_search_select.show();
        };
    } else {
        search_method = 'name';
        e_search_method.val('name');
    };
    load_filter();
});
function load_filter(){}; //TODO: