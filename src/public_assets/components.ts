const is_touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export function init_card_effect(selector: string = '.card', max: number = 5) {
    if(is_touch){
        /*
        if(window.DeviceOrientationEvent){
            window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
                document.querySelectorAll<HTMLElement>(selector).forEach(ele => {
                    const { width, height } = ele.getBoundingClientRect();
                    const x = e.gamma ? e.gamma * 2 : 0;
                    const y = e.beta ? e.beta * 2 : 0;
                    let moveX = ((x / width) - 0.5) * 0.4;
                    let moveY = ((y / height) - 0.5) * 0.4;
                    moveX = moveX > max? max : moveX;
                    moveX = moveX < -max? -max : moveX;
                    moveY = moveY > max? max : moveY;
                    moveY = moveY < -max? -max : moveY;
                    ele.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        };
        */
        return;
    } else {
        document.addEventListener('mousemove', (e: MouseEvent) => {
            document.querySelectorAll<HTMLElement>(selector).forEach(ele => {
                const { left, top, width, height } = ele.getBoundingClientRect();
                const x = e.clientX - (left + width / 2);
                const y = e.clientY - (top + height / 2);
                let moveX = ((x / width) - 0.5) * 0.4;
                let moveY = ((y / height) - 0.5) * 0.4;
                moveX = moveX > max? max : moveX;
                moveX = moveX < -max? -max : moveX;
                moveY = moveY > max? max : moveY;
                moveY = moveY < -max? -max : moveY;
                ele.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    };
};

export function init_cursor(){
    if(is_touch){return;};
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    cursor.style.display = 'none';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e: MouseEvent) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        if(e.clientX + 15 > window.innerWidth){
            cursor.style.left = window.innerWidth - 15 + 'px';
        };
        if(e.clientY + 15 > window.innerHeight){
            cursor.style.top = window.innerHeight - 15 + 'px';
        };
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