import { setTheme } from 'mdui';
import type { Theme } from 'mdui/internal/theme';

var mode = 'auto' as Theme;

export function init_dnmode(){
    setTheme('auto');
    let inls = localStorage.getItem('dn_mode');
    if(inls && ['light', 'dark', 'auto'].includes(inls)){
        mode = inls as Theme;
        setTheme(mode);
    };
};
export function get_dnmode(){
    return mode;
};
export function switch_dnmode(to: any){
    mode = to;
    setTheme(mode);
    localStorage.setItem('dn_mode', mode);
};