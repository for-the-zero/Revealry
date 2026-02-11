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
import 'mdui/components/chip.js';
import 'mdui/components/tooltip.js';
// icons
import '@mdui/icons/arrow-back.js';
import '@mdui/icons/menu-open.js';
import '@mdui/icons/unfold-more.js';
import '@mdui/icons/access-time.js';
import '@mdui/icons/tag.js';
import '@mdui/icons/category--outlined.js';
import '@mdui/icons/description--outlined.js';
import '@mdui/icons/home.js';

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
                            <a href="#${item.slug}" slot="header" style="text-decoration: none; display: block;">
                                <mdui-list-item rounded data-slug="${item.slug}">
                                    ${item.text}
                                    <mdui-button-icon slot="end-icon" class="collapse-trigger" onclick="event.preventDefault()">
                                        <mdui-icon-unfold-more></mdui-icon-unfold-more>
                                    </mdui-button-icon>
                                </mdui-list-item>
                            </a>
                            <div style="margin: 0.25rem 0 0.25rem 1.5rem;">
                                ${item.children.map(get_list_item).join('')}
                            </div>
                        </mdui-collapse-item>
                    </mdui-collapse>
                `;
            } else {
                return `<a href="#${item.slug}" style="text-decoration: none; display: block;"><mdui-list-item rounded data-slug="${item.slug}">${item.text}</mdui-list-item></a>`;
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
    const scrollTop = ($(window).scrollTop() || 0) + 64;
    const windowHeight = $(window).height() || 0;
    const scrollBottom = scrollTop + windowHeight;
    let currentHeading: JQuery<HTMLElement> | null = null;
    headings.each(function() {
        const $heading = $(this);
        const offsetTop = $heading.offset()!.top;
        const offsetBottom = offsetTop + $heading.outerHeight()!;
        if (offsetTop < scrollBottom && offsetBottom > scrollTop) {
            currentHeading = $heading;
            return false;
        };
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
    const targetTocItem = tocItems.filter(`[data-slug="${currentId}"]`);
    if (targetTocItem.length > 0) {
        targetTocItem.attr('active', '');
        let parentItem = targetTocItem.closest('mdui-collapse-item').find('> a[slot="header"] > mdui-list-item');
        while (parentItem.length > 0) {
            parentItem.attr('active', '');
            parentItem = parentItem.closest('mdui-collapse-item').parent().closest('mdui-collapse-item').find('> a[slot="header"] > mdui-list-item');
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

//
$('span.hidden-text').each(function () {
    var content = $(this).data('content');
    if (content !== undefined) {
        $(this).html(content);
    }
});
var konami = [38,38,40,40,37,39,37,39,66,65];
var konami_pos = 0;
$(document).on('keydown', function (e) {
    if(e.which === konami[konami_pos]){
        konami_pos++;
        if(konami_pos === konami.length){
            $('span.hidden-text').each(function () {
                $(this).replaceWith($('<u class="unhidden">').html($(this).html()));
            });
            konami_pos = 0;
        };
    } else {
        konami_pos = 0;
    };
});

//
if(window.Intl && Intl.Segmenter){
    let text = $('article').text();
    let chars = Array.from(new Intl.Segmenter('zh-CN', {granularity: 'grapheme'}).segment(text)).length;
    let words = Array.from(new Intl.Segmenter('zh-CN', {granularity: 'word'}).segment(text)).filter(s => s.isWordLike).length;
    let time = (chars / 275).toFixed(1);
    $('.cate-tag > mdui-tooltip > div[slot="content"] > span:nth-of-type(1)').text(chars);
    $('.cate-tag > mdui-tooltip > div[slot="content"] > span:nth-of-type(2)').text(words);
    $('.cate-tag > mdui-tooltip > div[slot="content"] > span:nth-of-type(3)').text(time + 'min' + (time == '1' ? 's' : ''));
};

//
const e_ctd_data = $('script[type="application/json"]#cate-tag-json');
const e_ctd = $('.cate-tag');
const ctd_data = JSON.parse(e_ctd_data.html());
if((!(ctd_data.tags === null) && ctd_data.tags.length > 0) || ctd_data.category || ctd_data.date){
    e_ctd.append('<mdui-divider vertical style="height: 32px;"></mdui-divider>');
};
e_ctd.append(`
    ${ctd_data.date ? `
        <mdui-tooltip content="${ctd_data.date}" placement="top">
            <mdui-chip variant="input">
                <mdui-icon-access-time slot="icon"></mdui-icon-access-time>
                <span></span>
            </mdui-chip>
        </mdui-tooltip>
        ` : ''}
    ${ctd_data.category ? `
        <mdui-chip selected target="_blank" href='../${
            window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.') ? '': '../'
        }?cate=${ctd_data.category}'>
            <mdui-icon-category--outlined slot="selected-icon"></mdui-icon-category--outlined>
            ${ctd_data.category}
        </mdui-chip>` : ''}
    ${!(ctd_data.tags === null) && ctd_data.tags.length > 0 ? ctd_data.tags.map((tag: string)=>`
        <mdui-chip target="_blank" href='../${
            window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.') ? '': '../'
        }?tag=${tag}'>
            <mdui-icon-tag slot="icon"></mdui-icon-tag>
            ${tag}
        </mdui-chip>`).join('') : ''}`
);

//
if(window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.')){
    $('mdui-button-icon[href="../../"]').attr('href', '../');
};