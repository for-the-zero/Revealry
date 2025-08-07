const is_touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export function init_cursor(){
    if(is_touch){return;};
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    cursor.style.display = 'none';
    document.body.appendChild(cursor);
    let clientX = 0;
    let clientY = 0;
    const syncCursor = () => {
        let x = clientX + window.scrollX;
        let y = clientY + window.scrollY;
        if(x + 15 > document.documentElement.scrollWidth){
            x = document.documentElement.scrollWidth - 15;
        };
        if(y + 15 > document.documentElement.scrollHeight){
            y = document.documentElement.scrollHeight - 15;
        };
        cursor.style.left = x + 'px';
        cursor.style.top  = y + 'px';
    };
    document.addEventListener('mousemove', (e: MouseEvent) => {
        clientX = e.clientX;
        clientY = e.clientY;
        cursor.style.display = 'block';
        syncCursor();
    });
    document.addEventListener('scroll', () => {
        syncCursor();
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-active');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-active');
    });
};