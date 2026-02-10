const is_mobile = /Mobi|Android|webOS|iPhone|iPad/i.test(navigator.userAgent);

export function init_cursor(){
    if(is_mobile){return;};
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    cursor.style.display = 'none';
    cursor.style.pointerEvents = 'none';
    cursor.style.touchAction = 'none';
    document.body.appendChild(cursor);
    let clientX = 0;
    let clientY = 0;
    const syncCursor = () => {
        cursor.style.left = clientX + 'px';
        cursor.style.top  = clientY + 'px';
        cursor.style.pointerEvents = 'none'; // 不知道什么bug
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