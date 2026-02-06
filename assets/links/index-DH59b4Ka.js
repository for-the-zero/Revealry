import"../modulepreload-polyfill-B5Qt9EMX.js";import{s as l,_ as d,t as h,i as m,a as g,b,g as f,$ as i}from"../global-DPwehmI3.js";import{s as y}from"../snackbar-CWn-wW2y.js";import"../arrow-back-DB9ULxFf.js";let o=class extends m{render(){return g('<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>')}};o.styles=l;o=d([h("mdui-icon-content-copy")],o);let r=class extends m{render(){return g('<path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>')}};r.styles=l;r=d([h("mdui-icon-open-in-new")],r);const u={"zh-CN":{translations:[{selector:"mdui-top-app-bar-title",target:"inner-html",text:"链接"}],_other:{title:"链接 | Revealry 示例",copied_snackbar_msg:"复制成功"}},en:{translations:[{selector:"mdui-top-app-bar-title",target:"inner-html",text:"Links"}],_other:{title:"links | Revealry Demo",copied_snackbar_msg:"Copied!"}}},x={"zh-CN":[{title:"测试1",items:[{name:"Github",img:"mdi--github.svg",description:"这是这个项目的Github地址",links:[{name:"链接",content:"https://github.com/for-the-zero/Revealry",type:"url"},{name:"名字",content:"Revealry",type:"text"}]},{name:"测试114514",img:"https://placehold.net/shape-400x400.png",description:`测试
line1
line2
line3
`,links:[{name:"114514",content:"/sitemap.xml",type:"url"}]}]},{title:"测试2",items:[{name:"测试1919810",img:"f7--number.png",description:"测试",links:null}]}],en:[{title:"Test1",items:[{name:"Github",img:"mdi--github.svg",description:"This is the Github address of this project",links:[{name:"Link",content:"https://github.com/for-the-zero/Revealry",type:"url"},{name:"Name",content:"Revealry",type:"text"}]},{name:"Test114514",img:"https://placehold.net/shape-400x400.png",description:`Test
line1
line2
line3
`,links:[{name:"114514",content:"1919810",type:"text"}]}]},{title:"Test2",items:[{name:"Test1919810",img:"f7--number.png",description:"Test",links:null}]}]};b(u);const v=f(),c=x[v],p=i(".container"),$=i(".link-detail"),a=i(".link-detail > .v-box");w();function w(){c!==null&&c.forEach(t=>{p.append(`<h1>${t.title}</h1>`);let n=i("<div></div>");t.items&&t.items.forEach(e=>{let s=i(`
                    <mdui-tooltip content="${e.name}">
                        <mdui-card variant="filled" clickable>
                            ${e.img.endsWith(".svg")?`
                                <svg draggable="false" width="40px" height="40px" class="svg-fill">
                                    <use href="../assets/intro/${e.img}" width="40px" height="40px"></use>
                                </svg>
                            `:`
                                <img src="${e.img.startsWith("http://")||e.img.startsWith("https://")?e.img:`../assets/intro/${e.img}`}" draggable="false" />
                            `}
                        </mdui-card>
                    </mdui-tooltip>`);s.on("click",()=>{z(e)}),n.append(s)}),p.append(n)})}function z(t){a.empty(),a.append(`
        <div class="h-box link-detail-title">
            ${t.img.endsWith(".svg")?`
                <svg draggable="false" width="40px" height="40px" class="svg-fill">
                    <use href="../assets/intro/${t.img}" width="40px" height="40px"></use>
                </svg>
            `:`
                <img src="${t.img.startsWith("http://")||t.img.startsWith("https://")?t.img:`../assets/intro/${t.img}`}" draggable="false" />
            `}
            <h1>${t.name}</h1>
        </div>
    `),t.description&&a.append(`<p>${t.description}</p>`),t.links&&t.links.forEach(n=>{let e=i(`<div class="h-box"><mdui-text-field variant="outlined" readonly label="${n.name}" value="${n.type==="url"?n.content.replace(/^(https?:\/\/)/,""):n.content}"></mdui-text-field></div>`);if(n.type==="url")e.append(`<mdui-button-icon href="${n.content}" target="_blank"><mdui-icon-open-in-new></mdui-icon-open-in-new></mdui-button-icon>`);else{let s=i("<mdui-button-icon><mdui-icon-content-copy></mdui-icon-content-copy></mdui-button-icon>");s.on("click",()=>{navigator.clipboard.writeText(n.content),y({message:u[v]._other.copied_snackbar_msg,autoCloseDelay:500})}),e.append(s)}a.append(e)}),$.attr("open","")}
