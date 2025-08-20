import $ from 'jquery';
import { snackbar } from 'mdui';

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
const e_dia = $('.link-detail');
const e_dia_body = $('.link-detail > .v-box');

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
                            ${link_item.img.endsWith('.svg')? `
                                <svg draggable="false" width="40px" height="40px" class="svg-fill">
                                    <use href="../assets/intro/${link_item.img}" width="40px" height="40px"></use>
                                </svg>
                            ` : `
                                <img src="${link_item.img.startsWith('http://') || link_item.img.startsWith('https://')? link_item.img : `../assets/intro/${link_item.img}`}" draggable="false" />
                            `}
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
    e_dia_body.empty();
    e_dia_body.append(`
        <div class="h-box link-detail-title">
            ${link_item.img.endsWith('.svg')? `
                <svg draggable="false" width="40px" height="40px" class="svg-fill">
                    <use href="../assets/intro/${link_item.img}" width="40px" height="40px"></use>
                </svg>
            ` : `
                <img src="${link_item.img.startsWith('http://') || link_item.img.startsWith('https://')? link_item.img : `../assets/intro/${link_item.img}`}" draggable="false" />
            `}
            <h1>${link_item.name}</h1>
        </div>
    `);
    if(link_item.links){
        link_item.links.forEach((link_detail: links_linkdetail) => {
            let link_html = $(`<div class="h-box"><mdui-text-field variant="outlined" readonly label="${link_detail.name}" value="${link_detail.content}"></mdui-text-field></div>`);
            if(link_detail.type === 'url'){
                link_html.append(`<mdui-button-icon href="${link_detail.content}" target="_blank"><mdui-icon-open-in-new></mdui-icon-open-in-new></mdui-button-icon>`);
            };
            let copy_ibtn = $(`<mdui-button-icon><mdui-icon-content-copy></mdui-icon-content-copy></mdui-button-icon>`);
            copy_ibtn.on('click',()=>{
                navigator.clipboard.writeText(link_detail.content);
                snackbar({
                    message: config_static_links[lang]._other.copied_snackbar_msg,
                    autoCloseDelay: 500,
                });
            });
            link_html.append(copy_ibtn);
            e_dia_body.append(link_html);
        });
    };
    if(link_item.description){
        e_dia_body.append(`<p>${link_item.description}</p>`);
    };
    e_dia.attr('open', '');
};