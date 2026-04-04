// assets/js/page1.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Typing effect
    const taglineElement = document.querySelector('.hero-tagline');
    if (taglineElement && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const text = "> Securing the future, one node at a time_";
        taglineElement.textContent = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                taglineElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        setTimeout(type, 1000); 
    }

    // 2. Stat Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; 
                    const increment = target / (duration / 16); 
                    let current = 0;

                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = target + (stat.hasAttribute('data-plus') ? '+' : '');
                        }
                    };
                    updateCount();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if(statsContainer) statObserver.observe(statsContainer);

    // 3. Skills Progress Bar Animation
    const skillsSection = document.querySelector('.skills-section');
    let skillsAnimated = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                const fills = document.querySelectorAll('.skill-bar-fill');
                fills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    setTimeout(() => {
                        fill.style.width = width + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.3 });

    if(skillsSection) skillsObserver.observe(skillsSection);

    // 4. Matrix Rain (Canvas)
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = matrixCanvas.offsetWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
        const fontSize = 14;
        const columns = matrixCanvas.width / fontSize;
        const drops = [];
        for (let x = 0; x < columns; x++) drops[x] = 1;

        function drawMatrix() {
            ctx.fillStyle = 'rgba(2, 12, 24, 0.1)'; 
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            ctx.fillStyle = '#00FF88';
            ctx.font = fontSize + 'px "Share Tech Mono"';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 50);
    }

    // 5. Hero 3D Elements (Three.js)
    if (typeof THREE !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const globeCanvas = document.getElementById('globe-canvas');
        if (globeCanvas) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: globeCanvas, alpha: true, antialias: true });
            renderer.setSize(600, 600);

            const geometry = new THREE.SphereGeometry(2.5, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x00FF88, wireframe: true, transparent: true, opacity: 0.2 });
            const globe = new THREE.Mesh(geometry, material);
            scene.add(globe);
            camera.position.z = 6;

            function animateGlobe() {
                requestAnimationFrame(animateGlobe);
                globe.rotation.y += 0.005;
                globe.rotation.x += 0.002;
                renderer.render(scene, camera);
            }
            animateGlobe();
        }

        const dnaCanvas = document.getElementById('dna-canvas');
        if (dnaCanvas) {
            const dScene = new THREE.Scene();
            const dCamera = new THREE.PerspectiveCamera(50, 200/400, 0.1, 1000);
            const dRenderer = new THREE.WebGLRenderer({ canvas: dnaCanvas, alpha: true, antialias: true });
            dRenderer.setSize(200, 400);

            const dGroup = new THREE.Group();
            const numNodes = 15;
            const radius = 1.2;
            const dMaterial = new THREE.MeshBasicMaterial({ color: 0x00D4FF });
            const cylinderMat = new THREE.LineBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.4 });

            for (let i = 0; i < numNodes; i++) {
                const angle = i * 0.4;
                const y = (i - numNodes/2) * 0.4;

                const mesh1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), dMaterial);
                mesh1.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
                dGroup.add(mesh1);

                const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), dMaterial);
                mesh2.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
                dGroup.add(mesh2);

                const geo = new THREE.BufferGeometry().setFromPoints([mesh1.position, mesh2.position]);
                const line = new THREE.Line(geo, cylinderMat);
                dGroup.add(line);
            }

            dScene.add(dGroup);
            dCamera.position.z = 8;

            function animateDNA() {
                requestAnimationFrame(animateDNA);
                dGroup.rotation.y -= 0.015;
                dRenderer.render(dScene, dCamera);
            }
            animateDNA();
        }
    }
});
