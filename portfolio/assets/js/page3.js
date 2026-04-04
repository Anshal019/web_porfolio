// assets/js/page3.js

document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    let isSubmitting = false;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (isSubmitting) return;

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showStatus('Error: Missing parameters in payload.', 'status-error');
                return;
            }

            // Simple email Regex validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showStatus('Error: Malformed email address.', 'status-error');
                return;
            }

            // Simulate sending interaction
            isSubmitting = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.querySelector('.btn-text').textContent = 'Encrypting...';

            // Simulate network delay
            setTimeout(() => {
                showStatus('✓ Message Encrypted & Sent', 'status-success');
                contactForm.reset();
                submitBtn.style.opacity = '1';
                submitBtn.querySelector('.btn-text').textContent = 'Transmit Data';
                
                // Explode particles on button (if not reduced motion)
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    createParticles(submitBtn);
                }

                // Debounce / Cooldown
                setTimeout(() => {
                    isSubmitting = false;
                    formStatus.style.opacity = '0';
                    formStatus.classList.remove('status-success');
                }, 5000);

            }, 1500);

        });
    }

    function showStatus(text, className) {
        formStatus.textContent = text;
        formStatus.className = `form-status ${className}`;
    }

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#00FF88';
            particle.style.borderRadius = '50%';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';

            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 5;
            const tx = Math.cos(angle) * velocity * 20;
            const ty = Math.sin(angle) * velocity * 20;

            const animation = particle.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });

            animation.onfinish = () => particle.remove();
        }
    }
});
