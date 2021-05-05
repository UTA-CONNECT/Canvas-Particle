window.onload = () => {
    const image = new Image()
    image.src = './peko-min.png';

    image.addEventListener('load', () => {
        let imgRatio = image.width / image.height;
        console.log(`img: ${image.width} X ${image.height}, ratio: ${imgRatio}`);


        const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.drawImage(image, (canvas.width - Math.min(canvas.width, canvas.height) * imgRatio) / 2, 0, Math.min(canvas.width, canvas.height) * imgRatio, Math.min(canvas.width, canvas.height));

        let particleArr = [];
        const numOfParticle = 5000;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.speed = 0;
                this.velocity = Math.random() * 0.5;
                this.size = Math.random() * 1.5 + 1;
            }

            update() {
                this.y += this.velocity;

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
            ctx.drawImage(image, (canvas.width - Math.min(canvas.width, canvas.height) * imgRatio) / 2, 0, Math.min(canvas.width, canvas.height) * imgRatio, Math.min(canvas.width, canvas.height));
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particleArr.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    })
}