// assets/js/page4.js

document.addEventListener('DOMContentLoaded', () => {
    
    let allPortfolio = [];

    // Fetch Data
    fetch('assets/data/services.json')
        .then(response => response.json())
        .then(data => {
            renderServices(data.services);
            allPortfolio = data.portfolio;
            renderPortfolio(allPortfolio);
            renderCerts(data.certifications);
            initTiltHover();
            setupFilters();
        })
        .catch(err => {
            console.error('Failed to load data', err);
            document.getElementById('services-container').innerHTML = '<p class="text-danger">Error loading data.</p>';
        });

    function renderServices(items) {
        const container = document.getElementById('services-container');
        if(!container) return;
        
        container.innerHTML = '';
        items.forEach(item => {
            container.innerHTML += `
                <div class="service-card tilt-element">
                    <div class="service-icon">
                        ${item.icon} <!-- Expecting raw SVG or emoji -->
                    </div>
                    <h3 class="service-title">${sanitizeText(item.title)}</h3>
                    <p>${sanitizeText(item.shortDesc)}</p>
                    <a href="contact.html?subject=consultation" class="btn btn-cyan">Request Detail</a>
                </div>
            `;
        });
    }

    function renderPortfolio(items) {
        const container = document.getElementById('portfolio-container');
        if(!container) return;

        container.innerHTML = '';
        items.forEach(item => {
            container.innerHTML += `
                <div class="portfolio-item" data-category="${sanitizeText(item.category)}">
                    <!-- Thumbnail placeholder -->
                    <div style="width:100%; height:100%; background: var(--bg-card); display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:2rem;">[ ${sanitizeText(item.category)} ]</div>
                    
                    <div class="portfolio-content">
                        <h3>${sanitizeText(item.title)}</h3>
                        <p>${sanitizeText(item.description)}</p>
                        <div class="tech">${item.tech.join(' / ')}</div>
                    </div>
                </div>
            `;
        });
    }

    function renderCerts(items) {
        const container = document.getElementById('certs-container');
        if(!container || !items) return;

        container.innerHTML = '';
        items.forEach(item => {
            container.innerHTML += `
                <div class="cert-card">
                    <div>
                        <div class="cert-name">${sanitizeText(item.name)}</div>
                        <div class="cert-meta">${sanitizeText(item.issuer)} | ${sanitizeText(item.date)}</div>
                    </div>
                </div>
            `;
        });
    }

    function setupFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active class
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter logic
                const cat = btn.getAttribute('data-filter');
                if (cat === 'all') {
                    renderPortfolio(allPortfolio);
                } else {
                    const filtered = allPortfolio.filter(item => item.category === cat);
                    renderPortfolio(filtered);
                }
            });
        });
    }

    function initTiltHover() {
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

    // 3D Network Vis (Three.js)
    if (typeof THREE !== 'undefined' && document.getElementById('network-canvas') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const canvas = document.getElementById('network-canvas');
        const parent = canvas.parentElement;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(parent.clientWidth, parent.clientHeight);

        const nodesCount = 30;
        const group = new THREE.Group();
        const material = new THREE.MeshBasicMaterial({ color: 0x00FF88 });
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.2 });

        const nodes = [];

        for(let i=0; i<nodesCount; i++) {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), material);
            mesh.position.x = (Math.random() - 0.5) * 10;
            mesh.position.y = (Math.random() - 0.5) * 10;
            mesh.position.z = (Math.random() - 0.5) * 10;
            group.add(mesh);
            nodes.push(mesh.position);
        }

        // Connect some nodes randomly
        for(let i=0; i<nodesCount; i++) {
            for(let j=i+1; j<nodesCount; j++) {
                if(Math.random() > 0.85) {
                    const geo = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
                    const line = new THREE.Line(geo, lineMat);
                    group.add(line);
                }
            }
        }

        scene.add(group);
        camera.position.z = 8;

        function animateNet() {
            requestAnimationFrame(animateNet);
            group.rotation.y += 0.005;
            group.rotation.x += 0.002;
            renderer.render(scene, camera);
        }
        animateNet();

        window.addEventListener('resize', () => {
            if(canvas.parentElement) {
                camera.aspect = canvas.parentElement.clientWidth / canvas.parentElement.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
            }
        });
    }
});
