document.addEventListener("DOMContentLoaded", () => {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    parallax(mouseX, mouseY);
  });

  function parallax(x, y) {
    const layers = document.querySelectorAll(".layer1, .layer2");

    layers.forEach((layer) => {
      const speed = layer.getAttribute("data-speed") || 1;
      const deltaX = (window.innerWidth - x * speed) / 100;
      const deltaY = (window.innerHeight - y * speed) / 100;

      layer.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  }
  parallax(mouseX, mouseY);
});

(() => {
  const canvas = document.querySelector(".lightCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  let horizon = innerHeight / 2;

  window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    horizon = innerHeight / 2;
  });

  class Firefly {
    constructor() {
      this.x = Math.random() * innerWidth;
      this.y = horizon + Math.random() * (innerHeight / 2);
      this.xSpeed = 0.66 + Math.random() * -1.33;
      this.ySpeed = 0.66 + Math.random() * -1.33;
      this.lightTimer = 0;
    }

    move() {
      if (this.lightTimer < 0) {
        if (this.x + this.xSpeed < 0 || this.x + this.xSpeed > innerWidth) {
          this.xSpeed *= -1;
        }
        if (
          this.y + this.ySpeed < horizon ||
          this.y + this.ySpeed > innerHeight
        ) {
          this.ySpeed *= -1;
        }
        if (Math.random() < 0.01) {
          this.x = Math.random() * innerWidth;
          this.y = horizon + Math.random() * (innerHeight / 2);
          this.xSpeed = 1 + Math.random() * -2;
          this.ySpeed = 1 + Math.random() * -2;
          this.lightTimer = 50 + Math.random() * 100;
        }
      }
      this.x += this.xSpeed;
      this.y += this.ySpeed;

      this.lightTimer--;
    }

    draw() {
      let myAlpha;
      const myRadius = 1 + Math.random() * 1;
      if (this.lightTimer >= 0) {
        myAlpha = Math.sin(Math.PI * (this.lightTimer / 60));
        const light = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          myRadius
        );
        light.addColorStop(0.5, `rgba(255, 255, 0, ${myAlpha})`);
        light.addColorStop(1, "rgba(255, 255, 0, 0)");

        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.arc(this.x, this.y, myRadius, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }
  }

  const fireflies = [];
  for (let i = 0; i < 15; i++) {
    fireflies.push(new Firefly());
  }

  function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    fireflies.forEach((firefly) => {
      firefly.move();
      firefly.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
})();
