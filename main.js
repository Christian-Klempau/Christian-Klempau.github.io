/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const projects = [
  { name: "PyroShot",          url: "https://github.com/Christian-Klempau/PyroShot",                  description: "Native Linux (X11, Wayland) screenshot annotation tool built in Flutter", tech: ["Flutter","Dart","Linux"],                   image: "./images/PyroShot.png" },
  { name: "TechGraphVis",      url: "https://github.com/Christian-Klempau/d3-project-example",         description: "World's most-used tech ecosystem — d3.js force-graph visualization",    tech: ["d3js","JS","HTML","CSS"],                   image: "./images/TechGraphVis.png" },
  { name: "OpenVerbum",        url: "https://github.com/Christian-Klempau/OpenVerbum",                 description: "Free multiplatform transcription GUI powered by OpenAI Whisper",         tech: ["Python","AI","Qt"],                         image: "./images/OpenVerbum.png" },
  { name: "ExcalidrawPro",     url: "https://github.com/Christian-Klempau/excalidraw-extension",       description: "Free Chrome extension alternative to Excalidraw+",                      tech: ["Chrome","JS","HTML","CSS"],                 image: "./images/ExcalidrawPro.png" },
  { name: "Game of Life",      url: "https://github.com/Christian-Klempau/RustGameOfLife",             description: "Conway's Game of Life in Rust, compiled to WebAssembly",                tech: ["Rust","WASM"],                              image: "./images/RustGameOfLife.png" },
  { name: "MaxSAT Fuzz Debug", url: "https://github.com/Christian-Klempau/fuzzer-delta-debugger.git", description: "WCNF MaxSAT automatic fuzzer and delta debugger for any solver",         tech: ["C","SAT","Linux"],                          image: "./images/DeltaDebugger.png" },
  { name: "Prime Generator",   url: "https://github.com/Christian-Klempau/prime-generator",            description: "Solovay-Strassen primality test implementation in pure C",               tech: ["C","Math"],                                image: "./images/PrimeGenerator.png" },
  // { name: "Kanban Fullstack",  url: "https://github.com/Christian-Klempau/forms-back",                 description: "Django + React TypeScript fullstack Kanban board",                       tech: ["Python","Django","Ionic","React","TS"],     image: "./images/Kanban.png" },
  // { name: "Repos Downloader",  url: "https://github.com/Christian-Klempau/repos_downloader",           description: "Utility to batch-download GitHub repo subfolders from a CSV list",      tech: ["Git","Python"] },
  // { name: "Rust TodoList API", url: "https://github.com/Christian-Klempau/rust_actix_psql_api",        description: "Actix + Serde + Postgres REST API for a TodoList",                      tech: ["Rust","Postgres","API"] },
  // { name: "Flask Mongo API",   url: "https://github.com/Christian-Klempau/FlaskMongoAPI",              description: "Simple Python Flask API backed by a MongoDB database",                  tech: ["Flask","Python","MongoDB","API"] },
];

const TECH_COLORS = {
  Flutter:"#02569B", Dart:"#00B4AB", Linux:"#3B6AA0", "d3js":"#F9A03F",
  JS:"#F7DF1E", HTML:"#F16529", CSS:"#264DE4", Python:"#3776AB",
  Django:"#2BA977", AI:"#a855f7", Qt:"#41CD52", Chrome:"#4285F4",
  Rust:"#f66b00", WASM:"#624de8", C:"#A8B9CC", SAT:"#64748b",
  Ionic:"#3880FF", React:"#61DBFB", TS:"#007ACC", Git:"#F05032",
  MongoDB:"#47A248", Flask:"#60a5fa", API:"#94a3b8", Math:"#f472b6",
  Postgres:"#336791",
};

/* Luminance helper — pick black or white text on colored bg */
function textColor(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const lum = 0.2126*r + 0.7152*g + 0.0722*b;
  return lum > 0.45 ? '#050B18' : '#E8EDF5';
}

/* Initial abbreviation for placeholder cards */
function abbr(name) { return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

/* ═══════════════════════════════════════════════
   THREE.JS — HERO PARTICLE GRAPH
═══════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 5;

  // Responsive
  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Nodes ──────────────────────────────────
  const NODE_COUNT = 90;
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(new THREE.Vector3(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 4
    ));
  }

  // Point cloud
  const ptGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  const ptMat = new THREE.PointsMaterial({ color: 0x0A84FF, size: 0.04, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(ptGeo, ptMat));

  // Edges (connect close nodes)
  const CONNECT_DIST = 2.2;
  const edgePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i+1; j < NODE_COUNT; j++) {
      if (nodes[i].distanceTo(nodes[j]) < CONNECT_DIST) {
        edgePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
        edgePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x0A84FF, transparent: true, opacity: 0.12 });
  scene.add(new THREE.LineSegments(edgeGeo, edgeMat));

  // Green accent nodes (larger, bright)
  const accentPositions = [];
  for (let i = 0; i < 12; i++) {
    const n = nodes[Math.floor(Math.random() * NODE_COUNT)];
    accentPositions.push(n.x, n.y, n.z);
  }
  const accentGeo = new THREE.BufferGeometry();
  accentGeo.setAttribute('position', new THREE.Float32BufferAttribute(accentPositions, 3));
  const accentMat = new THREE.PointsMaterial({ color: 0x00FF94, size: 0.09, transparent: true, opacity: 0.9 });
  scene.add(new THREE.Points(accentGeo, accentMat));

  // Mouse parallax
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Touch support
  window.addEventListener('touchmove', e => {
    if (e.touches.length) {
      mouse.x = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }, { passive: true });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.0025;
    scene.rotation.y = mouse.x * 0.12 + Math.sin(t) * 0.04;
    scene.rotation.x = -mouse.y * 0.08 + Math.cos(t * 0.7) * 0.03;
    renderer.render(scene, camera);
  }
  animate();
}

/* ═══════════════════════════════════════════════
   THREE.JS — MINI ORBIT GRAPH (ABOUT SECTION)
═══════════════════════════════════════════════ */
function initMiniCanvas() {
  const canvas = document.getElementById('mini-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 4.5;

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Central hub
  const hubGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const hubMat = new THREE.MeshBasicMaterial({ color: 0x00FF94 });
  scene.add(new THREE.Mesh(hubGeo, hubMat));

  // Orbiting nodes
  const orbits = [
    { tech: 'Rust',    r: 0.8,  speed: 0.9,  phase: 0.0,   size: 0.07, color: 0xf66b00 },
    { tech: 'Python',  r: 1.1,  speed: 0.7,  phase: 1.1,   size: 0.07, color: 0x3776AB },
    { tech: 'Flutter', r: 1.4,  speed: 0.5,  phase: 2.5,   size: 0.07, color: 0x02569B },
    { tech: 'React',   r: 1.7,  speed: 0.4,  phase: 0.8,   size: 0.06, color: 0x61DBFB },
    { tech: 'C',       r: 0.95, speed: 1.1,  phase: 4.0,   size: 0.06, color: 0xA8B9CC },
    { tech: 'WASM',    r: 1.5,  speed: 0.6,  phase: 3.3,   size: 0.06, color: 0x624de8 },
    { tech: 'JS',      r: 2.0,  speed: 0.35, phase: 1.9,   size: 0.06, color: 0xF7DF1E },
    { tech: 'TS',      r: 2.0,  speed: 0.35, phase: 4.5,   size: 0.06, color: 0x007ACC },
  ];

  const meshes = orbits.map(o => {
    const geo = new THREE.SphereGeometry(o.size, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: o.color });
    const m = new THREE.Mesh(geo, mat);
    scene.add(m);
    return { mesh: m, ...o };
  });

  // Ring geometries
  orbits.forEach(o => {
    const r = new THREE.RingGeometry(o.r - 0.005, o.r + 0.005, 64);
    const rm = new THREE.MeshBasicMaterial({ color: 0x1E2D4A, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(r, rm));
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    meshes.forEach(o => {
      const angle = t * o.speed + o.phase;
      o.mesh.position.set(Math.cos(angle) * o.r, Math.sin(angle) * o.r, 0);
    });
    scene.rotation.x = 0.35;
    scene.rotation.z = t * 0.04;
    renderer.render(scene, camera);
  }
  animate();
}

/* ═══════════════════════════════════════════════
   BUILD PROJECT CARDS
═══════════════════════════════════════════════ */
function buildCards() {
  const grid = document.getElementById('projects-grid');
  projects.forEach(p => {
    const a = document.createElement('a');
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'card';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'card-img';
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      img.loading = 'lazy';
      img.onerror = () => { imgDiv.innerHTML = `<div class="card-img-placeholder">${abbr(p.name)}</div>`; };
      imgDiv.appendChild(img);
    } else {
      imgDiv.innerHTML = `<div class="card-img-placeholder">${abbr(p.name)}</div>`;
    }

    const body = document.createElement('div');
    body.className = 'card-body';

    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = p.name;

    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = p.description;

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    (p.tech || []).forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      const bg = TECH_COLORS[t] || '#334155';
      tag.style.background = bg + '22';
      tag.style.borderColor = bg + '66';
      tag.style.color = bg;
      footer.appendChild(tag);
    });

    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(footer);
    a.appendChild(imgDiv);
    a.appendChild(body);
    grid.appendChild(a);
  });
}

/* ═══════════════════════════════════════════════
   GSAP ANIMATIONS
═══════════════════════════════════════════════ */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero sequence
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-eyebrow', { opacity: 1, duration: 0.8, delay: 0.3 })
    .to('.hero-title .line', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.3')
    .to('.hero-sub',         { opacity: 1, duration: 0.7 }, '-=0.3')
    .to('.hero-stack',       { opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.scroll-hint',      { opacity: 1, duration: 0.6 }, '-=0.2');

  // Nav on scroll
  ScrollTrigger.create({
    start: 'top -80',
    onEnter:  () => document.getElementById('nav').classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('nav').classList.remove('scrolled'),
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
  });

  // Cards stagger
  gsap.utils.toArray('.card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 92%' },
      opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
      delay: (i % 3) * 0.08,
    });
  });

  // About section
  gsap.from('.about-text', {
    scrollTrigger: { trigger: '#about', start: 'top 80%' },
    x: -40, opacity: 0, duration: 0.9, ease: 'power3.out'
  });
  gsap.from('.about-vis', {
    scrollTrigger: { trigger: '#about', start: 'top 80%' },
    x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15
  });
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildCards();
  initHeroCanvas();
  initMiniCanvas();
  initAnimations();
});