window.onload = () => {
    const image = new Image()
    image.src = './hestia-min.PNG';
    image.addEventListener('load', () => {
        let imgRatio = image.width / image.height;
        console.log(`img: ${image.width} X ${image.height}, ratio: ${imgRatio}`);


        const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.drawImage(image, (canvas.width - Math.min(canvas.width, canvas.height) * imgRatio) / 2, 0, Math.min(canvas.width, canvas.height) * imgRatio, Math.min(canvas.width, canvas.height));
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gap = 15;
        const block = 50;

        class Particle {
            constructor(x, y, w, h, pixelBlock) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.pixelBlock = pixelBlock;
            }

            draw() {
                // console.log(this.pixelBlock);
                for(let i = 0; i < this.h && i < this.pixelBlock.length; i ++) {
                    for(let t = 0; t < this.w && t < this.pixelBlock[i].length; t ++) {
                        ctx.fillStyle = `rgb(${this.pixelBlock[i][t][0]}, ${this.pixelBlock[i][t][1]}, ${this.pixelBlock[i][t][2]})`;
                        ctx.fillRect(this.x + t, this.y + i, 1, 1);
                    }
                }
            }
        }

        const particleArr = [];

        for(let i = gap; i < canvas.height; i += gap + block) { // y
            for(let t = gap; t < canvas.width; t += gap + block) { // x
                const pixelBlock = [];
                for(let q = i; q < i + block && q < canvas.height; q ++) { // y block
                    const row = [];
                    for(let itq = t; itq < t + block && itq < canvas.width; itq ++) { // x block
                        row.push([pixels.data[q * canvas.width * 4 + itq * 4], pixels.data[q * canvas.width * 4 + itq * 4 + 1], pixels.data[q * canvas.width * 4 + itq * 4 + 2]]);
                    }
                    pixelBlock.push(row);
                }
                particleArr.push(new Particle(t, i, block, block, pixelBlock));
                // if (i == gap + gap + block && t == gap) {
                //     console.log(pixelBlock);
                // }
            }
        }

        particleArr.forEach(particle => {
            particle.draw();
        })
    })
}