window.onload = () => {
    const loadingDiv = document.getElementById('loadingDiv');

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
                        const alpha = 1 - Math.sqrt((i - halfHeight) * (i - halfHeight) + (t - halfWidth) * (t - halfWidth)) / Math.max(this.w, this.h) ;
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
        const blockedPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log(blockedPixels)

        class PixelParticle {
            constructor(x, y, rgba) {
                this.x = x;
                this.y = y;
                this.rgba = rgba;
                this.angle = 0;
                this.beta = 0;
                
                this.goalX = x;
                this.goalY = y;
                this.speed = 0;
            }

            calcGoal(goalX, goalY) {
                this.goalX = goalX;
                this.goalY = goalY;

                this.angle = (this.y - goalY) / (this.x - goalX);
                this.beta = goalY - this.angle * goalX;
                const distance = Math.sqrt((this.x - goalX) * (this.x - goalX) + (this.y - goalY) * (this.y - goalY));
                if (distance < 200) {
                    this.speed = (200 - distance) / (5 + Math.random() * 95);
                }//(Math.max(canvas.width, canvas.height) - Math.sqrt((this.x - goalX) * (this.x - goalX) + (this.y - goalY) * (this.y - goalY))) / 10000;
            }

            update() {
                if (Math.abs(this.angle) <= 1) {
                    if (this.goalX > this.x) {
                        this.x -= this.speed;
                    } else if (this.goalX < this.x) {
                        this.x += this.speed;
                    }
                    this.y = this.angle * this.x + this.beta;
                } else {
                    if (this.goalY > this.y) {
                        this.y -= this.speed;
                    } else if (this.goalY < this.y) {
                        this.y += this.speed;
                    }
                    this.x = (this.y - this.beta) / this.angle;
                }

                if (this.speed > 0) {
                    this.speed += (0 - this.speed) / 20;
                } 
            }

            draw() {
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)
                    return;
                ctx.beginPath();
                ctx.fillStyle = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, ${this.rgba[3]})`;
                ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
                // ctx.fillRect(this.x, this.y, 1, 1);
                ctx.fill();
            }
        }

        const pixelParticleArr = [];

        for(let i = gap; i < canvas.height; i += gap) {
            for(let t = gap; t < canvas.width; t += gap) {
                const r = blockedPixels.data[i * canvas.width * 4 + t * 4];
                const g = blockedPixels.data[i * canvas.width * 4 + t * 4 + 1];
                const b = blockedPixels.data[i * canvas.width * 4 + t * 4 + 2];
                const a = blockedPixels.data[i * canvas.width * 4 + t * 4 + 3];
                if (r * g * b * a > 0) {
                        pixelParticleArr.push(new PixelParticle(t, i, 
                            [
                                r, g, b, a
                            ]))
                    }
            }
        }
        console.log(`pixelParticleArr len: ${pixelParticleArr.length}`, pixelParticleArr[0])
        
        // pixelParticleArr.forEach(pixelParticle => {
        //     pixelParticle.draw();
        // });

        function onMouseClick(x, y) {
            pixelParticleArr.forEach(pixelParticle => {
                pixelParticle.calcGoal(x, y);
            })
        }
        onMouseClick(canvas.width / 2, 0);

        window.addEventListener('click', (e) => {
            console.log('e', e);
            onMouseClick(e.clientX, e.clientY);
        })

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.putImageData(blockedPixels, 0, 0);
            pixelParticleArr.forEach(pixelParticle => {
                pixelParticle.update();
                pixelParticle.draw();
            });
            requestAnimationFrame(animate);
        }

        loadingDiv.remove();
        animate();
    })
}