window.onload = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const viewPort = {
        left: -window.innerWidth,
        top: -window.innerHeight,
        right: window.innerWidth * 2,
        bottom: window.innerHeight * 2,
        x: 0,
        xTmp: 0,
        y: 0,
        yTmp: 0,
        isMove: false
    }

    const cardConfig = {
        width: 200 * window.devicePixelRatio,
        height: 400 * window.devicePixelRatio,
        padding: 5
    }

    const cards = [];

    window.addEventListener('resize', (e) => {
        initCanvasSize(canvas);
    })

    window.addEventListener('mousedown', (e) => {
        viewPort.isMove = true;
        viewPort.xTmp = e.clientX;
        viewPort.yTmp = e.clientY;
    })

    window.addEventListener('mousemove', (e) => {
        if (viewPort.isMove) {
            viewPort.x += e.clientX - viewPort.xTmp;
            viewPort.y += e.clientY - viewPort.yTmp;
            // console.log(viewPort);
            viewPort.xTmp = e.clientX;
            viewPort.yTmp = e.clientY;
        }
    })

    window.addEventListener('mouseup', (e) => {
        viewPort.isMove = false;
    })

    window.addEventListener('touchstart', (e) => {
        viewPort.isMove = true;
        viewPort.xTmp = e.touches[0].clientX;
        viewPort.yTmp = e.touches[0].clientY;
    })

    window.addEventListener('touchmove', (e) => {
        if (viewPort.isMove) {
            viewPort.x += e.touches[0].clientX - viewPort.xTmp;
            viewPort.y += e.touches[0].clientY - viewPort.yTmp;
            // console.log(viewPort);
            viewPort.xTmp = e.touches[0].clientX;
            viewPort.yTmp = e.touches[0].clientY;
        }
    })

    window.addEventListener('touchend', (e) => {
        viewPort.isMove = false;
    })

    function initCanvasSize(canvas) {
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
    }

    initCanvasSize(canvas);

    class Card {
        constructor(x, y, w, h, padding) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.padding = padding;
            
            this.distance = 0;
            this.scale = 1;
        }

        update() {
            let centerX = this.x + this.w / 2;
            let centerY = this.y + this.h / 2;

            this.distance = Math.sqrt(Math.pow((window.innerWidth * window.devicePixelRatio) / 2 - centerX, 2) + Math.pow((window.innerHeight * window.devicePixelRatio) / 2 - centerY, 2));

            this.scale = (this.w * this.h / 100 - this.distance) / (this.w * this.h / 100);
        }

        draw() {
            if (this.distance > this.w * this.h / 100) {
                return;
            }
            // ctx.strokeStyle('red');
            ctx.strokeStyle = `rgba(0, 0, 0, ${(this.w * this.h / 100 - this.distance) / (this.w * this.h / 100)})`;
            
            ctx.strokeRect(this.x + this.padding + ((this.w - this.w * this.scale) / 2), 
                            this.y + this.padding + ((this.h - this.h * this.scale) / 2), this.w * this.scale - this.padding * 2, this.h * this.scale - this.padding * 2);
            // ctx.strokeStyle('black');
        }
    }

    let toggle = 0;
    let xStartPoint = Math.abs((viewPort.right - viewPort.left) - Math.ceil((viewPort.right - viewPort.left) / cardConfig.width) * cardConfig.width) / 2;
    // console.log(viewPort.right - viewPort.left, cardConfig.width, (viewPort.right - viewPort.left) % cardConfig.width, xStartPoint)
    for(let i = viewPort.top - cardConfig.height / 2; i < viewPort.bottom - viewPort.top; i += cardConfig.height / 2) {
        for(let t = Number(toggle) * cardConfig.width + viewPort.left - xStartPoint; t < viewPort.right - viewPort.left; t += cardConfig.width * 2) {
            cards.push(new Card(viewPort.x + t, viewPort.y + i, cardConfig.width, cardConfig.height, cardConfig.padding))
        }
        toggle = toggle ? 0 : 1;
    }

    console.log(cards);

    function animate() {
        requestAnimationFrame(animate);

        ctx.clearRect(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

        // ctx.strokeRect(viewPort.x + viewPort.left, viewPort.y + viewPort.top, viewPort.right - viewPort.left, viewPort.bottom - viewPort.top);

        let cnt = 0;
        toggle = 0;
        for(let i = viewPort.top - cardConfig.height / 2; i < viewPort.bottom - viewPort.top; i += cardConfig.height / 2) {
            for(let t = Number(toggle) * cardConfig.width + viewPort.left - xStartPoint; t < viewPort.right - viewPort.left; t += cardConfig.width * 2) {
                // cards.push(new Card(viewPort.x + t, viewPort.y + i, cardConfig.width, cardConfig.height, cardConfig.padding))
                cards[cnt].x = viewPort.x + t;
                cards[cnt].y = viewPort.y + i;
                cnt ++;
            }
            toggle = toggle ? 0 : 1;
        }
        cards.forEach(card => {
            card.update();
            card.draw();
        })

    }

    animate();
}