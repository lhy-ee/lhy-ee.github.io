const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const cursor = document.querySelector(".cursor");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const cards = document.querySelectorAll(".project-card");

let width = 0;
let height = 0;
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function resize() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(width / 18)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.6,
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(244, 240, 232, 0.48)";
  ctx.strokeStyle = "rgba(158, 212, 106, 0.12)";

  for (const point of particles) {
    const dx = mouse.x - point.x;
    const dy = mouse.y - point.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 150) {
      point.x -= dx * 0.0018;
      point.y -= dy * 0.0018;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -10) point.x = width + 10;
    if (point.x > width + 10) point.x = -10;
    if (point.y < -10) point.y = height + 10;
    if (point.y > height + 10) point.y = -10;

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

function updatePointer(event) {
  mouse = { x: event.clientX, y: event.clientY };
  cursor.style.left = `${mouse.x}px`;
  cursor.style.top = `${mouse.y}px`;

  for (const item of parallaxItems) {
    const speed = Number(item.dataset.parallax);
    const x = (mouse.x - width / 2) * speed;
    const y = (mouse.y - height / 2) * speed;
    item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  });

  card.addEventListener("pointerenter", () => cursor.classList.add("active"));
  card.addEventListener("pointerleave", () => cursor.classList.remove("active"));
});

window.addEventListener("pointermove", updatePointer);
window.addEventListener("resize", resize);

resize();
draw();
