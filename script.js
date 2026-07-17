// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Mobile dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile dropdown clicks
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        
        dropbtn.addEventListener('click', function(e) {
            // Only prevent default on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });
});

// Close mobile menu when clicking a link (except dropdown button)
document.querySelectorAll('.nav-menu a:not(.dropbtn)').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#ffffff';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .service-card, .location-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Gallery lightbox effect (simple version) — also applies to price list images
document.querySelectorAll('.gallery-item img, .price-list-item img').forEach(img => {
    img.addEventListener('click', function() {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;
        
        const imgClone = this.cloneNode();
        imgClone.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
        `;
        
        lightbox.appendChild(imgClone);
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', () => {
            lightbox.remove();
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Form validation (if you add a contact form)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Add animation to numbers/stats if you add them
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Booking form -> WhatsApp prefilled message
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const PHONE = '6588408188';
    const WHATSAPP_BASE = `https://api.whatsapp.com/send?phone=${PHONE}`;

    const nameInput = document.getElementById('bookingName');
    const phoneInput = document.getElementById('bookingPhone');
    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');
    const chipsContainer = document.getElementById('serviceChips');
    const chips = chipsContainer ? chipsContainer.querySelectorAll('.chip') : [];

    const headerLink = document.getElementById('whatsappLink');
    const submitLink = document.getElementById('bookingWhatsapp');
    const floatLink = document.querySelector('.whatsapp-float a');

    // Toggle chip selection
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
            refreshLinks();
        });
    });

    // Date min = today
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // Populate time dropdown with 30-min slots within salon hours (10:00 - 21:00)
    if (timeInput && timeInput.tagName === 'SELECT') {
        const startHour = 10; // 10 AM
        const endHour = 21;   // 9 PM (last slot 21:00)
        for (let h = startHour; h <= endHour; h++) {
            for (const m of [0, 30]) {
                if (h === endHour && m > 0) break; // stop at 21:00
                const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                const suffix = h >= 12 ? 'PM' : 'AM';
                const hr12 = h % 12 || 12;
                const label = `${hr12}:${String(m).padStart(2, '0')} ${suffix}`;
                const opt = document.createElement('option');
                opt.value = value;
                opt.textContent = label;
                timeInput.appendChild(opt);
            }
        }
    }

    const formatDate = (iso) => {
        if (!iso) return '';
        const [y, m, d] = iso.split('-');
        const date = new Date(Number(y), Number(m) - 1, Number(d));
        return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (t) => {
        if (!t) return '';
        const [hStr, mStr] = t.split(':');
        let h = Number(hStr);
        const suffix = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${mStr} ${suffix}`;
    };

    const getSelectedServices = () =>
        Array.from(chips).filter(c => c.classList.contains('selected')).map(c => c.dataset.service);

    const buildMessage = () => {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const services = getSelectedServices();
        const date = formatDate(dateInput.value);
        const time = formatTime(timeInput.value);

        if (!name && !phone && services.length === 0 && !date && !time) return '';

        const lines = ['Hi estiq, I would like to make a booking.', ''];
        if (name) lines.push(`Name: ${name}`);
        if (phone) lines.push(`Phone: ${phone}`);
        if (services.length) lines.push(`Services: ${services.join(', ')}`);
        if (date || time) {
            lines.push(`Preferred Date/Time: ${[date, time].filter(Boolean).join(' at ')}`);
        }
        lines.push('', 'Thank you!');
        return lines.join('\n');
    };

    const buildUrl = () => {
        const message = buildMessage();
        return message ? `${WHATSAPP_BASE}&text=${encodeURIComponent(message)}` : WHATSAPP_BASE;
    };

    const refreshLinks = () => {
        const url = buildUrl();
        if (headerLink) headerLink.href = url;
        if (submitLink) submitLink.href = url;
        if (floatLink) floatLink.href = url;
    };

    // Refresh on any form change/input
    form.addEventListener('input', refreshLinks);
    form.addEventListener('change', refreshLinks);

    // Guarantee freshest URL on click (in case of race conditions)
    [headerLink, submitLink, floatLink].forEach(link => {
        if (!link) return;
        link.addEventListener('click', (e) => {
            const url = buildUrl();
            link.href = url;
            // Let the browser handle target="_blank" naturally
        });
    });

    // Prevent accidental form submission (Enter key) — open WhatsApp instead
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.open(buildUrl(), '_blank', 'noopener');
    });

    // Initial state
    refreshLinks();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('The Nail Artistry website loaded successfully!');
});

// ---------------------------------------------------------------------------
// GOOGLE_PLACES_CONFIG — optional real-time Google rating integration
// ---------------------------------------------------------------------------
// NOTE: The recommended way to show live Google reviews WITHOUT any backend
// is the Trustindex widget embed added directly in index.html (see the
// "LIVE GOOGLE REVIEWS" comment block above the <section class="reviews">).
// Trustindex handles the Google connection entirely on their end — you just
// paste a <script> + <div> snippet, no code here required.
//
// The config below is an ALTERNATIVE approach only if you later set up your
// own backend (e.g. a Cloudflare Worker or Vercel function) to call the
// Google Places API directly. It does nothing unless `enabled` is set to
// true and a real `endpoint` is provided — safe to leave as is.
const GOOGLE_PLACES_CONFIG = {
    enabled: false, // set to true once your backend endpoint is ready
    endpoint: '' // e.g. 'https://your-backend.example.com/api/estiq-reviews'
};

async function loadLiveGoogleRating() {
    if (!GOOGLE_PLACES_CONFIG.enabled || !GOOGLE_PLACES_CONFIG.endpoint) return;

    try {
        const res = await fetch(GOOGLE_PLACES_CONFIG.endpoint);
        if (!res.ok) throw new Error('Failed to fetch live rating');
        const data = await res.json();

        const ratingEl = document.getElementById('reviewsRatingNumber');
        const countEl = document.getElementById('reviewsCount');

        if (ratingEl && typeof data.rating === 'number') {
            ratingEl.textContent = data.rating.toFixed(1);
        }
        if (countEl && typeof data.user_ratings_total === 'number') {
            countEl.textContent = `${data.user_ratings_total} reviews`;
        }
        // data.reviews (if provided by your backend, filtered to 4-5 stars)
        // could be used here to rebuild the .reviews-track cards dynamically.
    } catch (err) {
        console.warn('Could not load live Google rating, showing static values instead.', err);
    }
}

document.addEventListener('DOMContentLoaded', loadLiveGoogleRating);