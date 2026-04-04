// assets/js/page2.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch Data
    fetch('assets/data/achievements.json')
        .then(response => response.json())
        .then(data => {
            renderAchievements(data.achievements);
            renderResearch(data.research);
            renderProjects(data.projects);
            initTiltEffect(); // Must run after elements are rendered
        })
        .catch(err => {
            console.error('Failed to load data', err);
            document.getElementById('achievements-container').innerHTML = '<p class="text-danger">Error loading data.</p>';
        });

    function renderAchievements(items) {
        const container = document.getElementById('achievements-container');
        if(!container) return;
        
        container.innerHTML = '';
        items.forEach(item => {
            container.innerHTML += `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <h3>${sanitizeText(item.title)}</h3>
                            <span class="badge-year">${sanitizeText(item.year)}</span>
                        </div>
                        <div class="flip-card-back">
                            <p>${sanitizeText(item.description)}</p>
                            ${item.link && item.link !== '#' ? `<a href="${sanitizeText(item.link)}" target="_blank" rel="noopener">View Details ↗</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    function renderResearch(items) {
        const container = document.getElementById('research-container');
        if(!container || !items) return;

        container.innerHTML = '';
        items.forEach(item => {
            container.innerHTML += `
                <div class="research-card tilt-element">
                    <h3 class="research-title">${sanitizeText(item.title)}</h3>
                    <div class="research-meta">${sanitizeText(item.authors)} | ${sanitizeText(item.date)} | ${sanitizeText(item.platform)}</div>
                    <p class="research-abstract">${sanitizeText(item.abstract)}</p>
                    ${item.link && item.link !== '#' ? `<br><a href="${sanitizeText(item.link)}" target="_blank" rel="noopener" class="text-green">> Read Paper</a>` : ''}
                </div>
            `;
        });
    }

    function renderProjects(items) {
        const container = document.getElementById('projects-container');
        if(!container || !items) return;

        container.innerHTML = '';
        items.forEach(item => {
            const statusClass = item.status.toLowerCase() === 'completed' ? 'status-completed' : 'status-active';
            const techTags = item.stack.map(tech => `<span class="tech-tag">${sanitizeText(tech)}</span>`).join('');
            
            container.innerHTML += `
                <div class="project-card">
                    <div class="project-node"></div>
                    <div class="project-header">
                        <h3 class="project-title">${sanitizeText(item.name)}</h3>
                        <span class="project-status ${statusClass}">${sanitizeText(item.status)}</span>
                    </div>
                    <p>${sanitizeText(item.description)}</p>
                    <div class="project-tech">${techTags}</div>
                    <div class="project-links">
                        ${item.github && item.github !== '#' ? `<a href="${sanitizeText(item.github)}" target="_blank" rel="noopener">[ GitHub ]</a>` : ''}
                        ${item.demo && item.demo !== '#' ? `<a href="${sanitizeText(item.demo)}" target="_blank" rel="noopener">[ Live Demo ]</a>` : ''}
                    </div>
                </div>
            `;
        });
    }

    // Tilt Effect for Research cards
    function initTiltEffect() {
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const cards = document.querySelectorAll('.tilt-element');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            });
        });
    }

    // 3D Cubes Background (Three.js)
    if (typeof THREE !== 'undefined' && document.getElementById('cubes-canvas') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const canvas = document.getElementById('cubes-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const cubes = [];
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.3 });

        for(let i=0; i<15; i++) {
            const cube = new THREE.LineSegments(edges, material);
            cube.position.x = (Math.random() - 0.5) * 20;
            cube.position.y = (Math.random() - 0.5) * 20;
            cube.position.z = (Math.random() - 0.5) * 10 - 5;
            
            // Random rotation speeds
            cube.userData.rx = (Math.random() - 0.5) * 0.02;
            cube.userData.ry = (Math.random() - 0.5) * 0.02;
            
            scene.add(cube);
            cubes.push(cube);
        }

        camera.position.z = 10;
        
        // binary text texture mapping isn't pure basic line material, so we keep to wireframes for simplicity & performance

        function animateCubes() {
            requestAnimationFrame(animateCubes);
            
            cubes.forEach(cube => {
                cube.rotation.x += cube.userData.rx;
                cube.rotation.y += cube.userData.ry;
                
                // slow float up
                cube.position.y += 0.01;
                if(cube.position.y > 15) cube.position.y = -15;
            });
            
            // Parallax based on scroll
            const scrollY = window.scrollY;
            camera.position.y = -(scrollY * 0.005);
            
            renderer.render(scene, camera);
        }
        
        animateCubes();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});
