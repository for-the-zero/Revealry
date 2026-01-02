import $ from 'jquery';

var lang: string = 'en';

export function get_lang(){
    let lang_in_ls = localStorage.getItem('lang');
    if(lang_in_ls){
        lang = lang_in_ls;
    }else{
        if(navigator.language === 'zh-CN'){
            lang = 'zh-CN';
        }else{
            lang = 'en';
        };
        localStorage.setItem('lang', lang);
    };
    return lang;
};

function apply_title(i18n_File: staticinfo){
    if(i18n_File[lang]._other?.title){
        document.title = i18n_File[lang]._other.title;
    };
};

function handle_query(){
    let params = new URLSearchParams(window.location.search);
    if(params.has('lang')){
        lang = params.get('lang') as string;
        localStorage.setItem('lang', lang);
    };
};

export function init_i18n(i18n_File: staticinfo){
    handle_query();
    get_lang();
    apply_title(i18n_File);
    if(i18n_File[lang].translations !== null){
        for(let index: number = 0; index < i18n_File[lang].translations.length; index++){
            let tl = i18n_File[lang].translations[index];
            let ele2Btl = $(tl.selector);
            if(tl.target === 'inner-html'){
                ele2Btl.html(tl.text);
            } else {
                ele2Btl.attr(tl.target, tl.text);
            };
        };
    };
};

export function change_lang(){
    localStorage.setItem('lang', lang === 'zh-CN' ? 'en' : 'zh-CN');
    location.reload();
};