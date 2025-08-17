import $ from 'jquery';
import '../../public_assets/global.ts';
import './template.css';

// components
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/navigation-drawer.js';
import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
import 'mdui/components/divider.js';
// icons
import '@mdui/icons/arrow-back.js';
import '@mdui/icons/menu-open.js';
import '@mdui/icons/expand-more.js';

//
const e_drawer = $('mdui-navigation-drawer');
const e_drawer_btn = $('.open-content-drawer');
e_drawer_btn.on('click', ()=>{
    e_drawer.attr('open','');
});

//
const e_toc = $('mdui-list.toc-list');
const e_toc_data = $('script[type="application/json"]#toc-json');
e_toc.html('');
if(e_toc_data.length){
    const toc_data = JSON.parse(e_toc_data.html()) as toc_item[];
    for(let i=0; i<toc_data.length; i++){
        let item = toc_data[i];
        function get_list_item(item: toc_item): string{
            if(item.children){;
                return `
                    <mdui-collapse>
                        <mdui-collapse-item>
                            <mdui-list-item rounded slot="header" href="#${item.slug}">
                                <mdui-icon-expand-more slot="end-icon"></mdui-icon-expand-more>
                                ${item.text}
                            </mdui-list-item>
                            <div style="margin-left: 1.5rem">
                                ${item.children.map(get_list_item).join('')}
                            </div>
                        </mdui-collapse-item>
                    </mdui-collapse>
                `;
            } else {
                return `<mdui-list-item rounded href="#${item.slug}">${item.text}</mdui-list-item>`;
            };
        };
        e_toc.append(get_list_item(item));
    };
} else {
    e_drawer_btn.hide();
};