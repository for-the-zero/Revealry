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
import config_links_all from '../_configs/links.yaml';
const config_links = config_links_all[lang] as links;

//
const e_container = $('.container');

//
render_links();
function render_links(){
    if(config_links === null){return;};
    config_links.forEach((link_group: links_group) => {
        e_container.append(`<h1>${link_group.title}</h1>`);
        let group_html = $('<div></div>');
        if(link_group.items){
            link_group.items.forEach((link_item: links_item) => {
                let item = $(`
                    <mdui-tooltip content="${link_item.name}">
                        <mdui-card variant="filled" clickable>
                            <img src="../assets/intro/${link_item.img}" draggable="false" />
                        </mdui-card>
                    </mdui-tooltip>`
                );
                item.on('click', ()=>{
                    detail_of_links(link_item);
                });
                group_html.append(item);
            });
        };
        e_container.append(group_html);
    });
};

function detail_of_links(link_item: links_item){
    console.log(link_item);
};