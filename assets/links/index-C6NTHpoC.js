import"../modulepreload-polyfill-B5Qt9EMX.js";import{s as o,_ as l,t as c,i as d,a as r,b as x,g as $,$ as i}from"../global-BR59xZ5H.js";import{s as C}from"../snackbar-DQecJ0uT.js";import"../arrow-back-BwK_J4uP.js";let p=class extends d{render(){return r('<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>')}};p.styles=o;p=l([c("mdui-icon-content-copy")],p);let h=class extends d{render(){return r('<path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>')}};h.styles=o;h=l([c("mdui-icon-open-in-new")],h);let m=class extends d{render(){return r('<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>')}};m.styles=o;m=l([c("mdui-icon-label")],m);let g=class extends d{render(){return r('<path d="m16 7 3.55 5-1.63 2.29 1.43 1.43L22 12l-4.37-6.16C17.27 5.33 16.67 5 16 5l-7.37.01 2 1.99H16zM2 4.03l1.58 1.58C3.22 5.96 3 6.46 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.28 0 .55-.07.79-.18L18.97 21l1.41-1.41L3.41 2.62 2 4.03zM14.97 17H5V7.03L14.97 17z"/>')}};g.styles=o;g=l([c("mdui-icon-label-off--outlined")],g);const f={"zh-CN":{translations:[{selector:"mdui-top-app-bar-title",target:"inner-html",text:"链接"},{selector:"mdui-top-app-bar > mdui-tooltip",target:"content",text:"展开标签"}],_other:{title:"链接 | Revealry 示例",copied_snackbar_msg:"复制成功"}},en:{translations:[{selector:"mdui-top-app-bar-title",target:"inner-html",text:"Links"},{selector:"mdui-top-app-bar > mdui-tooltip",target:"content",text:"Unfold Labels"}],_other:{title:"links | Revealry Demo",copied_snackbar_msg:"Copied!"}}},L={"zh-CN":[{title:"测试1",items:[{name:"Github",img:"mdi--github.svg",description:"这是这个项目的Github地址",links:[{name:"链接",content:"https://github.com/for-the-zero/Revealry",type:"url"},{name:"名字",content:"Revealry",type:"text"}]},{name:"测试114514",img:"https://placehold.net/shape-400x400.png",description:`测试
line1
line2
line3
`,links:[{name:"114514",content:"/sitemap.xml",type:"url"}]}]},{title:"测试2",items:[{name:"测试1919810",img:"f7--number.png",description:"测试",links:null}]}],en:[{title:"Test1",items:[{name:"Github",img:"mdi--github.svg",description:"This is the Github address of this project",links:[{name:"Link",content:"https://github.com/for-the-zero/Revealry",type:"url"},{name:"Name",content:"Revealry",type:"text"}]},{name:"Test114514",img:"https://placehold.net/shape-400x400.png",description:`Test
line1
line2
line3
`,links:[{name:"114514",content:"1919810",type:"text"}]}]},{title:"Test2",items:[{name:"Test1919810",img:"f7--number.png",description:"Test",links:null}]}]};x(f);const y=$(),u=L[y],b=i(".container"),w=i(".link-detail"),a=i(".link-detail > .v-box"),v=i("mdui-top-app-bar > mdui-tooltip > mdui-button-icon");z();function z(){u!==null&&u.forEach(e=>{b.append(`<h1>${e.title}</h1>`);let n=i("<div></div>");e.items&&e.items.forEach(t=>{let s=i(`
                    <mdui-tooltip content="${t.name}">
                        <mdui-card variant="filled" clickable>
                            <div class="icon-cont">
                                ${t.img.endsWith(".svg")?`
                                    <svg draggable="false" width="40px" height="40px" class="svg-fill">
                                        <use href="../assets/intro/${t.img}" width="40px" height="40px"></use>
                                    </svg>
                                `:`
                                    <img src="${t.img.startsWith("http://")||t.img.startsWith("https://")?t.img:`../assets/intro/${t.img}`}" draggable="false" />
                                `}
                            </div>
                            <div class="link-label label-hidden">
                                <div class="link-name">${t.name}</div>
                                ${t.description?`<div class="link-desc">${t.description}</div>`:""}
                            </div>
                        </mdui-card>
                    </mdui-tooltip>`);s.on("click",()=>{I(t)}),n.append(s)}),b.append(n)})}function I(e){a.empty(),a.append(`
        <div class="h-box link-detail-title">
            ${e.img.endsWith(".svg")?`
                <svg draggable="false" width="40px" height="40px" class="svg-fill">
                    <use href="../assets/intro/${e.img}" width="40px" height="40px"></use>
                </svg>
            `:`
                <img src="${e.img.startsWith("http://")||e.img.startsWith("https://")?e.img:`../assets/intro/${e.img}`}" draggable="false" />
            `}
            <h1>${e.name}</h1>
        </div>
    `),e.description&&a.append(`<p>${e.description}</p>`),e.links&&e.links.forEach(n=>{let t=i(`<div class="h-box"><mdui-text-field variant="outlined" readonly label="${n.name}" value="${n.type==="url"?n.content.replace(/^(https?:\/\/)/,""):n.content}"></mdui-text-field></div>`);if(n.type==="url")t.append(`<mdui-button-icon href="${n.content}" target="_blank"><mdui-icon-open-in-new></mdui-icon-open-in-new></mdui-button-icon>`);else{let s=i("<mdui-button-icon><mdui-icon-content-copy></mdui-icon-content-copy></mdui-button-icon>");s.on("click",()=>{navigator.clipboard.writeText(n.content),C({message:f[y]._other.copied_snackbar_msg,autoCloseDelay:500})}),t.append(s)}a.append(t)}),w.attr("open","")}v.on("change",()=>{v.attr("selected")?i(".link-label").removeClass("label-show").addClass("label-hidden"):i(".link-label").removeClass("label-hidden").addClass("label-show")});
