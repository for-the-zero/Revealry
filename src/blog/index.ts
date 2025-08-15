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
import { init_i18n, get_lang } from '../public_assets/i18n';
import config_static_blog from '../_configs/blog.static.yaml';
init_i18n(config_static_blog);
const lang = get_lang();
//
import config_blog from '../_configs/blog.yaml';
const blog_posts = config_blog.filter((post: blog_post)=>{
    return post.allow_lang.includes(lang);
}) as blog_post[];

//
const e_search_method = $('.searching > mdui-segmented-button-group');
const e_search_input = $('.searching > mdui-text-field');
const e_search_select = $('.searching > mdui-select');

let select_ele_main = document.querySelector('.searching > mdui-select') // fuck
    ?.shadowRoot?.querySelector('mdui-dropdown')
    ?.querySelector('mdui-text-field');
if(select_ele_main){
    select_ele_main.style.cursor = 'none';
};
e_search_method.find('mdui-segmented-button:nth-child(3)').trigger('click'); // fix bug (or cannot display text)
e_search_method.find('mdui-segmented-button:nth-child(2)').trigger('click');
e_search_method.find('mdui-segmented-button:nth-child(1)').trigger('click');
e_search_select.hide();

var search_method = 'name';
var filtered_posts = [...blog_posts] as blog_post[];
e_search_method.on('click', ()=>{
    let val = e_search_method.val() as string;
    if(val){
        search_method = val;
        if(val === 'name'){
            e_search_input.show();
            e_search_select.hide();
            show_posts();
        } else {
            e_search_input.hide();
            e_search_select.show();
            e_search_select.val('');
            load_filter();
            show_posts();
        };
    } else {
        search_method = 'name';
        e_search_method.val('name');
        e_search_input.show();
        e_search_select.hide();
        show_posts();
    };
});
function load_filter(){
    switch(search_method){
        case 'cate':
            e_search_select.empty();
            let added = [] as string[];
            for(let i = 0; i < blog_posts.length; i++){
                if(blog_posts[i].category && !added.includes(blog_posts[i].category)){
                    added.push(blog_posts[i].category);
                    e_search_select.append(`<mdui-menu-item value="${blog_posts[i].category}">${blog_posts[i].category}</mdui-menu-item>`);
                };
            };
            break;
        case 'tag':
            e_search_select.empty();
            const added_tags = new Set();
            for (const post of blog_posts) {
                const tags = post?.tags;
                if (!Array.isArray(tags) || tags.length === 0) {continue;};
                for (const tag of tags) {
                    if (!added_tags.has(tag)) {
                        added_tags.add(tag);
                        e_search_select.append(
                            `<mdui-menu-item value="${tag}">${tag}</mdui-menu-item>`
                        );
                    };
                };
            };
            break;
    };
};
e_search_select.on('change', ()=>{
    filter_posts();
    show_posts();
});
e_search_input.on('input', ()=>{
    filter_posts();
    show_posts();
});
function filter_posts(){
    switch(search_method){
        case 'name':
            let keyword = e_search_input.val();
            if(!keyword){
                filtered_posts = blog_posts;
                return;
            };
            filtered_posts = blog_posts.filter((post: blog_post)=>{
                return post.title.toLowerCase().indexOf(keyword.toString().toLowerCase()) !== -1;
            });
            break;
        case 'cate':
            let val = e_search_select.val();
            if(!val){
                filtered_posts = blog_posts;
                return;
            };
            filtered_posts = blog_posts.filter((post: blog_post)=>{
                return post.category === val;
            });
            break;
        case 'tag':
            let val_tags = e_search_select.val();
            if(!val_tags){
                filtered_posts = blog_posts;
                return;
            };
            filtered_posts = blog_posts.filter((post: blog_post)=>{
                return post.tags && post.tags.includes(val_tags.toString());
            });
            break;
    };
};

//
const e_blog_posts = $('.posts');
function show_posts(){
    e_blog_posts.empty();
    filtered_posts.forEach((post: blog_post)=>{
        e_blog_posts.append(`
            <mdui-card variant="filled" class="post" href="${post.href}">
                <div class="v-box post-content">
                    <h2>${post.title}</h2>
                    <p>${post.desc ? post.desc : ''}</p>
                    <div class="h-box post-tags">
                        <mdui-chip selected>
                            <mdui-icon-category--outlined slot="selected-icon"></mdui-icon-category--outlined>
                            ${post.category}
                        </mdui-chip>
                        ${post.tags ? post.tags.map((tag: string)=>{
                            return `
                                <mdui-chip>
                                    <mdui-icon-tag slot="icon"></mdui-icon-tag>
                                    ${tag}
                                </mdui-chip>
                            `;
                        }).join('') : ''}
                    </div>
                </div>
            </mdui-card>
        `); // 我操，这是React吗！爽！
    });
};
show_posts();