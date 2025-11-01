import $ from 'jquery';
import Viewer from 'viewerjs';

import '../../public_assets/global.ts';
import './template.css'; // 能跑就行

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
import 'mdui/components/button-icon.js';
// icons
import '@mdui/icons/arrow-back.js';
import '@mdui/icons/menu-open.js';
import '@mdui/icons/unfold-more.js';

//
const e_drawer = $('mdui-navigation-drawer');
const e_drawer_btn = $('.open-content-drawer');
e_drawer_btn.on('click', ()=>{
    e_drawer.attr('open','');
    highlightCurrentTocItem();
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
                        <mdui-collapse-item value="${item.slug}" trigger=".collapse-trigger">
                            <mdui-list-item rounded slot="header" href="#${item.slug}">
                                ${item.text}
                                <mdui-button-icon slot="end-icon" class="collapse-trigger" onclick="event.preventDefault()">
                                    <mdui-icon-unfold-more></mdui-icon-unfold-more>
                                </mdui-button-icon>
                            </mdui-list-item>
                            <div style="margin: 0.25rem 0 0.25rem 1.5rem;">
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

//
new Viewer(document.body);
$('.article img').each(function() {
    const img_ele = this as HTMLImageElement;
    const $img = $(img_ele);
    if (img_ele.complete) {
        $img.addClass('loaded');
    } else {
        $img.on('load', function() {
            $img.addClass('loaded');
        });
    }
});

//
// 主要由AI完成
function highlightCurrentTocItem() {
    const headings = $('.article h1, .article h2, .article h3, .article h4, .article h5, .article h6');
    const tocItems = $('mdui-list.toc-list mdui-list-item');
    if (headings.length === 0 || tocItems.length === 0){return;};
    tocItems.removeAttr('active');
    
    const scrollTop = $(window).scrollTop() || 0;
    const windowHeight = $(window).height() || 0;
    const scrollBottom = scrollTop + windowHeight;
    
    let currentHeading: JQuery<HTMLElement> | null = null;
    
    // 查找当前在视口中的标题
    headings.each(function() {
        const $heading = $(this);
        const offsetTop = $heading.offset()!.top;
        const offsetBottom = offsetTop + $heading.outerHeight()!;
        
        // 判断标题是否在视口中（标题的任意部分在视口中）
        if (offsetTop < scrollBottom && offsetBottom > scrollTop) {
            currentHeading = $heading;
            return false;
        }
        
        // 如果没有找到视口中的标题，则选择最近的上方标题
        if (offsetTop <= scrollTop) {
            currentHeading = $heading;
        } else {
            return false;
        };
    });
    
    if (!currentHeading) {
        currentHeading = headings.first();
    };
    
    const currentId = currentHeading.attr('id');
    if (!currentId){return;};
    
    const targetTocItem = tocItems.filter(`[href="#${currentId}"]`);
    if (targetTocItem.length > 0) {
        targetTocItem.attr('active', '');
        let parentItem = targetTocItem.closest('mdui-collapse-item').find('> mdui-list-item[slot="header"]');
        while (parentItem.length > 0) {
            parentItem.attr('active', '');
            parentItem = parentItem.closest('mdui-collapse-item').parent().closest('mdui-collapse-item').find('> mdui-list-item[slot="header"]');
        };
    };
};
let scrollTimer: number | null = null;
$(window).on('scroll', function() {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    };
    scrollTimer = window.setTimeout(function() {
        highlightCurrentTocItem();
    }, 100);
});
highlightCurrentTocItem();