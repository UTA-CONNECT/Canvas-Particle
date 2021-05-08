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

        const gap = 5;
        const block = 70;
        let pw = 0; // particle width
        let ph = 0; // particle height;

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
                const arrHeight = this.h;
                const arrWidth = this.w;
                const halfHeight = arrHeight / 2;
                const halfWidth = arrWidth / 2;
                for(let i = 0; i < this.h && i < this.pixelBlock.length; i ++) {
                    for(let t = 0; t < this.w && t < this.pixelBlock[i].length; t ++) {
                        // const alpha =  1 - ((Math.abs(t - halfWidth)) / arrWidth + (Math.abs(i - halfHeight)) / arrHeight) ;
                        const alpha = 1 - Math.sqrt((i - halfHeight) * (i - halfHeight) + (t - halfWidth) * (t - halfWidth)) / Math.max(this.w, this.h);
                        ctx.fillStyle = `rgba(${this.pixelBlock[i][t][0]}, ${this.pixelBlock[i][t][1]}, ${this.pixelBlock[i][t][2]}, ${alpha})`;
                        ctx.fillRect(this.x + t, this.y + i, 1, 1);
                    }
                }
            }
        }

        const particleArr = [];

        for(let i = gap; i < canvas.height; i += gap + block) { // y
            const particleRow = [];
            for(let t = gap; t < canvas.width; t += gap + block) { // x
                const pixelBlock = [];
                for(let q = i; q < i + block && q < canvas.height; q ++) { // y block
                    const row = [];
                    for(let itq = t; itq < t + block && itq < canvas.width; itq ++) { // x block
                        row.push([pixels.data[q * canvas.width * 4 + itq * 4], pixels.data[q * canvas.width * 4 + itq * 4 + 1], pixels.data[q * canvas.width * 4 + itq * 4 + 2]]);
                    }
                    pixelBlock.push(row);
                }
                particleRow.push(new Particle(t, i, block, block, pixelBlock));
                // if (i == gap + gap + block && t == gap) {
                //     console.log(pixelBlock);
                // }
            }
            particleArr.push(particleRow);
            pw = particleRow.length;
        }

        ph = particleArr.length;

        console.log(`pw: ${pw}, ph: ${ph}`)

        particleArr.forEach(particleRow => {
            particleRow.forEach(particle => {
                particle.draw();
            })
        })
    })
}