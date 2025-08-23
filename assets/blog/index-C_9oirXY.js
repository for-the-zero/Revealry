import"../modulepreload-polyfill-B5Qt9EMX.js";import{s as m,_ as u,t as h,i as g,a as p,b as S,g as C,$ as v}from"../global-DCeofmpY.js";import"../arrow-back-Dvur6pHk.js";import{d as I}from"../blog-AyxJCtum.js";let y=class extends g{render(){return p('<path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"/>')}};y.styles=m;y=u([h("mdui-icon-tag")],y);let b=class extends g{render(){return p('<path d="m12 2-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>')}};b.styles=m;b=u([h("mdui-icon-category--outlined")],b);let _=class extends g{render(){return p('<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>')}};_.styles=m;_=u([h("mdui-icon-search")],_);let x=class extends g{render(){return p('<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>')}};x.styles=m;x=u([h("mdui-icon-access-time")],x);const k={"zh-CN":{translations:[{selector:"mdui-top-app-bar-title",target:"inner-html",text:"博客"},{selector:".container > h1",target:"inner-html",text:"欢迎来到博客页面"},{selector:".footer",target:"inner-html",text:"注脚文本"},{selector:"mdui-segmented-button-group > mdui-segmented-button:nth-child(1)",target:"inner-html",text:"标题"},{selector:"mdui-segmented-button-group > mdui-segmented-button:nth-child(2)",target:"inner-html",text:"分类"},{selector:"mdui-segmented-button-group > mdui-segmented-button:nth-child(3)",target:"inner-html",text:"标签"},{selector:"mdui-text-field",target:"label",text:"搜索"}],_others:{title:"博客 | Revealry 示例"}},en:{translations:[{selector:"mdui-top-app-bar-title",target:"inner-html",text:"Blog"},{selector:".container > h1",target:"inner-html",text:"Welcome to the blog page"},{selector:".footer",target:"inner-html",text:"Footer text"},{selector:"mdui-segmented-button-group > mdui-segmented-button:nth-child(1)",target:"inner-html",text:"Title"},{selector:"mdui-segmented-button-group > mdui-segmented-button:nth-child(2)",target:"inner-html",text:"Category"},{selector:"mdui-segmented-button-group > mdui-segmented-button:nth-child(3)",target:"inner-html",text:"Tag"},{selector:"mdui-text-field",target:"label",text:"Search Here"}],_others:{title:"Blog | Revealry Demo"}}};S(k);const H=C(),t=I.filter(e=>e.allow_lang.includes(H)),f=v(".searching > mdui-segmented-button-group"),c=v(".searching > mdui-text-field"),i=v(".searching > mdui-select");let $=document.querySelector(".searching > mdui-select")?.shadowRoot?.querySelector("mdui-dropdown")?.querySelector("mdui-text-field");$&&($.style.cursor="none");i.hide();var d="name",o=[...t];f.on("click",()=>{let e=f.val();e?(d=e,e==="name"?(c.show(),i.hide(),s()):(c.hide(),i.show(),i.val(""),M(),s())):(d="name",f.val("name"),c.show(),i.hide(),s())});function M(){switch(d){case"cate":i.empty();let e=[];for(let n=0;n<t.length;n++)t[n].category&&!e.includes(t[n].category)&&(e.push(t[n].category),i.append(`<mdui-menu-item value="${t[n].category}">${t[n].category}</mdui-menu-item>`));break;case"tag":i.empty();const a=new Set;for(const n of t){const r=n?.tags;if(!(!Array.isArray(r)||r.length===0||!r))for(const l of r)!a.has(l)&&l.trim()&&(a.add(l),i.append(`<mdui-menu-item value="${l}">${l}</mdui-menu-item>`))}break}}i.on("change",()=>{w(),s()});c.on("input",()=>{w(),s()});function w(){switch(d){case"name":let e=c.val();if(!e){o=t;return}o=t.filter(r=>r.title.toLowerCase().indexOf(e.toString().toLowerCase())!==-1);break;case"cate":let a=i.val();if(!a){o=t;return}o=t.filter(r=>r.category===a);break;case"tag":let n=i.val();if(!n){o=t;return}o=t.filter(r=>r.tags&&r.tags.includes(n.toString()));break}}const z=v(".posts");function s(){z.empty(),o.forEach(e=>{z.append(`
            <mdui-card variant="filled" class="post" href="${e.filename?`./posts/${e.filename}`:e.href}">
                <div class="v-box post-content">
                    <h2>${e.title}</h2>
                    <p>${e.desc?e.desc:""}</p>
                    <div class="h-box post-tags">
                        ${e.date?`
                            <mdui-tooltip content="${e.date}" placement="right">
                                <mdui-chip variant="input">
                                    <mdui-icon-access-time slot="icon"></mdui-icon-access-time>
                                    <span></span>
                                </mdui-chip>
                            </mdui-tooltip>
                        `:""}
                        <mdui-chip selected>
                            <mdui-icon-category--outlined slot="selected-icon"></mdui-icon-category--outlined>
                            ${e.category}
                        </mdui-chip>
                        ${e.tags?e.tags.map(a=>`
                            <mdui-chip>
                                <mdui-icon-tag slot="icon"></mdui-icon-tag>
                                ${a}
                            </mdui-chip>
                        `).join(""):""}
                    </div>
                </div>
            </mdui-card>
        `)})}s();
