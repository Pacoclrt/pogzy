/* ==========================================
   POGZY — Premium Website Scripts
   Particles, 3D, Scroll Animations, Interactivity
   ========================================== */

// ===========================
// 1. PARTICLE SYSTEM
// ===========================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 80;
        this.connectDistance = 120;
        this.colors = [
            'rgba(42, 125, 212, ',
            'rgba(0, 212, 255, ',
            'rgba(74, 158, 255, ',
            'rgba(96, 180, 255, ',
        ];

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Adjust particle count based on screen size
        this.particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();

            // Connect particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectDistance) {
                    const opacity = (1 - distance / this.connectDistance) * 0.15;
                    this.ctx.strokeStyle = `rgba(42, 125, 212, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(system) {
        this.system = system;
        this.x = Math.random() * system.canvas.width;
        this.y = Math.random() * system.canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.colorIndex = Math.floor(Math.random() * system.colors.length);
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
        // Mouse interaction
        if (this.system.mouse.x !== null) {
            const dx = this.system.mouse.x - this.x;
            const dy = this.system.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.system.mouse.radius) {
                const force = (this.system.mouse.radius - distance) / this.system.mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }
        }

        // Movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse effect
        this.pulse += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulse) * 0.5;

        // Boundaries
        if (this.x < 0 || this.x > this.system.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.system.canvas.height) this.speedY *= -1;
    }

    draw() {
        const ctx = this.system.ctx;
        const color = this.system.colors[this.colorIndex];

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color + this.opacity + ')';
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = color + (this.opacity * 0.1) + ')';
        ctx.fill();
    }
}

// ===========================
// 2. NAVBAR
// ===========================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.burger = document.getElementById('nav-burger');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.links = document.querySelectorAll('.nav-link, .mobile-link');
        this.sections = document.querySelectorAll('section[id]');

        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.onScroll());

        // Burger menu
        this.burger.addEventListener('click', () => this.toggleMenu());

        // Link clicks
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMenu();
            });
        });

        // Close on outside click
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) this.closeMenu();
        });
    }

    onScroll() {
        // Navbar background
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Active section
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    toggleMenu() {
        this.burger.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.burger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===========================
// 3. SCROLL REVEAL ANIMATIONS
// ===========================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
        this.init();
    }

    init() {
        // IntersectionObserver for smooth reveals
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }
}

// ===========================
// 4. SECTION HEADERS ANIMATION
// ===========================
class SectionAnimations {
    constructor() {
        this.init();
    }

    init() {
        const headers = document.querySelectorAll('.section-header');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        headers.forEach(header => {
            header.style.opacity = '0';
            header.style.transform = 'translateY(40px)';
            header.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(header);
        });

        // Add CSS for animate-in
        const style = document.createElement('style');
        style.textContent = `
            .section-header.animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===========================
// 5. PARALLAX TILT ON CARDS
// ===========================
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.about-card, .neosky-glass');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.tilt(e, card));
            card.addEventListener('mouseleave', (e) => this.reset(card));
        });
    }

    tilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    }

    reset(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===========================
// 6. SMOOTH SCROLL
// ===========================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===========================
// 7. SCROLL INDICATOR FADE
// ===========================
class ScrollIndicator {
    constructor() {
        this.indicator = document.getElementById('scroll-indicator');
        if (this.indicator) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 200) {
                    this.indicator.style.opacity = '0';
                    this.indicator.style.pointerEvents = 'none';
                } else {
                    this.indicator.style.opacity = '1';
                    this.indicator.style.pointerEvents = 'auto';
                }
            });
        }
    }
}

// ===========================
// 8. TYPING EFFECT (optional subtitle)
// ===========================
class GlowCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.classList.add('glow-cursor');
        document.body.appendChild(this.cursor);

        const style = document.createElement('style');
        style.textContent = `
            .glow-cursor {
                position: fixed;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(42, 125, 212, 0.08), transparent 70%);
                pointer-events: none;
                z-index: 0;
                transition: transform 0.15s ease-out;
                transform: translate(-50%, -50%);
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });
    }
}

// ===========================
// 9. COUNTER ANIMATION (for future stats)
// ===========================
class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        if (this.counters.length > 0) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * easeOut).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ===========================
// 10. MAGNETIC BUTTONS
// ===========================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// ===========================
// INIT ALL MODULES
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Core Systems
    new ParticleSystem('particles-canvas');
    new Navbar();
    new SmoothScroll();
    new ScrollIndicator();

    // Animations
    new ScrollReveal();
    new SectionAnimations();
    new CardTilt();
    new GlowCursor();
    new MagneticButtons();
    new NumberCounter();

    // Preloader fade
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
