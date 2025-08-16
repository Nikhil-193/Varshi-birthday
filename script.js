// Global variables
let currentSection = 'gift';
let messageIndex = 0;
let iconsClicked = 0;
let userName = '';

// Audio setup
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.3;

// DOM elements
const giftSection = document.getElementById('giftSection');
const messageSection = document.getElementById('messageSection');
const gallerySection = document.getElementById('gallerySection');
const giftBox = document.getElementById('giftBox');
const greeting = document.getElementById('greeting');
const messages = document.querySelectorAll('.message');
const birthdayIcons = document.getElementById('birthdayIcons');
const nextBtn = document.getElementById('nextBtn');
const carousel = document.querySelector('.carousel-container');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    setupCarousel();
    setupFireworks();
    
    // Start background music with user interaction
    document.addEventListener('click', startMusic, { once: true });
    
    // Gift box click handler
    giftBox.addEventListener('click', openGift);
    
    // Birthday icons click handlers
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', function() {
            this.classList.add('clicked');
            iconsClicked++;
            
            if (iconsClicked === 4) {
                setTimeout(() => {
                    showNextButton();
                }, 500);
            }
        });
    });
    
    // Next button click handler
    nextBtn.addEventListener('click', showGallery);
});

// Start background music
function startMusic() {
    backgroundMusic.play().catch(e => {
        console.log('Music play failed:', e);
    });
}

// Open gift animation
async function openGift() {
    // Get user name
    const { value: name } = await Swal.fire({
        title: 'What should I call you?',
        input: 'text',
        inputPlaceholder: 'Enter your name...',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value || value.length > 15) {
                return 'Please enter a name (max 15 characters)';
            }
        }
    });
    
    userName = name;
    
    // Animate gift opening
    const lid = document.querySelector('.gift-lid');
    lid.style.transform = 'translateY(-100px) rotateX(-45deg)';
    lid.style.opacity = '0';
    
    // Show success message
    await Swal.fire({
        title: 'Happy Birthday! 🎉',
        text: `Get ready for your special surprise, ${userName}!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
    
    // Transition to message section
    setTimeout(() => {
        showMessageSection();
    }, 500);
}

// Show message section
function showMessageSection() {
    giftSection.style.opacity = '0';
    giftSection.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        giftSection.style.display = 'none';
        messageSection.classList.add('active');
        
        // Start typing greeting
        greeting.innerHTML = '';
        new TypeIt('#greeting', {
            strings: [`Happy Birthday, ${userName}! 🎂`],
            speed: 50,
            afterComplete: function() {
                showMessages();
            }
        }).go();
        
    }, 500);
}

// Show messages one by one
function showMessages() {
    if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
        currentMessage.classList.remove('hidden');
        
        setTimeout(() => {
            currentMessage.classList.add('visible');
            messageIndex++;
            
            setTimeout(() => {
                if (messageIndex < messages.length) {
                    showMessages();
                } else {
                    showBirthdayIcons();
                }
            }, 2000);
        }, 100);
    }
}

// Show birthday icons
function showBirthdayIcons() {
    birthdayIcons.classList.remove('hidden');
    setTimeout(() => {
        birthdayIcons.classList.add('visible');
    }, 100);
}

// Show next button
function showNextButton() {
    nextBtn.classList.remove('hidden');
    setTimeout(() => {
        nextBtn.classList.add('visible');
    }, 100);
}

// Show gallery section
function showGallery() {
    messageSection.style.opacity = '0';
    messageSection.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        messageSection.style.display = 'none';
        gallerySection.classList.add('active');
        startFireworks();
    }, 500);
}

// Setup 3D carousel
function setupCarousel() {
    const images = carousel.querySelectorAll('img');
    const totalImages = images.length;
    const angleStep = 360 / totalImages;
    const radius = 200;
    
    images.forEach((img, index) => {
        const angle = angleStep * index;
        const x = Math.sin(angle * Math.PI / 180) * radius;
        const z = Math.cos(angle * Math.PI / 180) * radius;
        
        img.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`;
    });
}

// Fireworks setup
function setupFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Start fireworks animation
function startFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    
    const fireworks = [];
    const particles = [];
    
    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = Math.random() * 3 + 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.life = 60;
            this.maxLife = 60;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1; // gravity
            this.life--;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life / this.maxLife;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        
        for (let i = 0; i < 15; i++) {
            fireworks.push(new Firework(x, y));
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.1) {
            createFirework();
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const firework = fireworks[i];
            firework.update();
            firework.draw();
            
            if (firework.life <= 0) {
                fireworks.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Handle page visibility for music
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play().catch(e => console.log('Music resume failed:', e));
    }
});