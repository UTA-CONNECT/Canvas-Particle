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

        let particleArr = [];
        const numOfParticle = 10000;

        let mappedImage = [];
        for(let y = 0; y < canvas.height; y ++) {
            let row = [];
            for(let x = 0; x < canvas.width; x ++) {
                const red = pixels.data[y * 4 * pixels.width + x * 4];
                const green = pixels.data[y * 4 * pixels.width + x * 4 + 1];
                const blue = pixels.data[y * 4 * pixels.width + x * 4 + 2];
                const brightness = calcRelativeBrightness(red, green, blue);
                const cell = [
                    cellBrightness = brightness,
                ]
                row.push(cell);
            }
            mappedImage.push(row);
            // console.log(`${y}: `, mappedImage.length, mappedImage[y], mappedImage[y].length);
        }
        // console.log(mappedImage, mappedImage.length, mappedImage[0], mappedImage[0].length);

        function calcRelativeBrightness(r, g, b) {
            return Math.sqrt(r * r * .299 + g * g * .587 + b * b * .114) / 100
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.speed = 0;
                this.velocity = Math.random() * 6.5;
                this.size = Math.random() * 1.5 + 1;
                this.pos1 = Math.floor(this.y);
                this.pos2 = Math.floor(this.x);
            }

            update() {
                this.pos1 = Math.floor(this.y);
                this.pos2 = Math.floor(this.x);
                this.speed = mappedImage[this.pos1][this.pos2][0];
                let movement = (2.5 - this.speed) + this.velocity;

                this.y += movement;

                if (this.y >= canvas.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas.width;

                }
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = 'white';
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            for(let i = 0; i < numOfParticle; i ++) {
                particleArr.push(new Particle);
            }
        }
        init();

        function animate() {
            // ctx.drawImage(image, (canvas.width - Math.min(canvas.width, canvas.height) * imgRatio) / 2, 0, Math.min(canvas.width, canvas.height) * imgRatio, Math.min(canvas.width, canvas.height));
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.25;
            particleArr.forEach(particle => {
                particle.update();
                ctx.globalAlpha = particle.speed * 0.25;
                particle.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    })
}