// assets/js/global.js

// Page Load & Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  let progress = 0;
  const bar = document.querySelector('.loader-bar-fill');
  
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress > 100) progress = 100;
    if (bar) bar.style.width = `${progress}%`;
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
      }, 300);
    }
  }, 100);
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
if (cursor && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// Scroll Progress
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  if(scrollProgress) {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      scrollProgress.style.width = scrolled;
  }
});

// Intersection Observer for section fades
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Optional: stop observing once visible
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(section => {
  sectionObserver.observe(section);
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });
}

// Security: No innerHTML helper (ensure usage of textContent)
function sanitizeText(str) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match)=>(map[match]));
}

// Page Visibility API
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // Pause animations
        if (window.pauseBackgroundParticles) window.pauseBackgroundParticles();
    } else {
        // Resume animations
        if (window.resumeBackgroundParticles) window.resumeBackgroundParticles();
    }
});

// Global 3D Background Particles using Three.js
// Only run if not reduced motion and canvas exists
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.getElementById('bg-canvas') && typeof THREE !== 'undefined') {
    initGlobalThreeJS();
}

let animFrameGlobal;
let isPaused = false;

function initGlobalThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    const colorGreen = new THREE.Color('#00FF88');
    const colorCyan = new THREE.Color('#00D4FF');

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Spread particles around
        posArray[i] = (Math.random() - 0.5) * 15; // x
        posArray[i+1] = (Math.random() - 0.5) * 15; // y
        posArray[i+2] = (Math.random() - 0.5) * 10; // z

        // Mix colors
        const mixedColor = Math.random() > 0.5 ? colorGreen : colorCyan;
        colorsArray[i] = mixedColor.r;
        colorsArray[i+1] = mixedColor.g;
        colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse interactive movement
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    const clock = new THREE.Clock();

    function animate() {
        if (!isPaused) {
            animFrameGlobal = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;

            particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
            particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

            renderer.render(scene, camera);
        }
    }

    animate();

    window.pauseBackgroundParticles = () => {
        isPaused = true;
        cancelAnimationFrame(animFrameGlobal);
    };
    window.resumeBackgroundParticles = () => {
        isPaused = false;
        clock.getDelta(); // reset delta
        animate();
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
