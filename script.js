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
// FAQ PAGINATION — shows a maximum of 5 questions per page
// ---------------------------------------------------------------------------
// All FAQ items remain in the HTML source (so crawlers/AI bots that don't run JS still
// see every question), but visually we only show 5 at a time with page controls for a
// cleaner reading experience.
document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;

    const items = Array.from(faqList.querySelectorAll('.faq-item'));
    const perPage = 5;
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    let currentPage = 1;

    const prevBtn = document.getElementById('faqPrevBtn');
    const nextBtn = document.getElementById('faqNextBtn');
    const pageNumbersEl = document.getElementById('faqPageNumbers');

    function renderPage(page) {
        currentPage = Math.min(Math.max(page, 1), totalPages);

        items.forEach((item, index) => {
            const itemPage = Math.floor(index / perPage) + 1;
            item.classList.toggle('faq-hidden', itemPage !== currentPage);
        });

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;

        if (pageNumbersEl) {
            pageNumbersEl.innerHTML = '';
            for (let p = 1; p <= totalPages; p++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'faq-page-number' + (p === currentPage ? ' active' : '');
                btn.textContent = String(p);
                btn.setAttribute('aria-label', `Go to FAQ page ${p}`);
                btn.addEventListener('click', () => renderPage(p));
                pageNumbersEl.appendChild(btn);
            }
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => renderPage(currentPage + 1));

    renderPage(1);
});

// ---------------------------------------------------------------------------
// GOOGLE PLACES SETUP — live Google Reviews, no backend required
// ---------------------------------------------------------------------------
// This section fetches your REAL, LIVE rating + reviews directly from Google
// using the Google Maps JavaScript API (Places library) in the browser. No
// server/backend is needed — Google's Places library is designed to be used
// client-side, as long as your API key is restricted to your website's domain
// (see step 3 below), which prevents anyone else from misusing your key.
//
// SETUP (one-time, ~10 minutes):
// 1. Go to https://console.cloud.google.com/ and create a project (or use an
//    existing one). Enable the "Places API" and "Maps JavaScript API".
// 2. Create an API key under "APIs & Services" → "Credentials".
// 3. IMPORTANT — restrict the key: edit the key → "Application restrictions"
//    → "Websites" → add your domain(s), e.g. https://www.estiq.sg/* and
//    http://localhost:8080/* (for local testing). This stops the key from
//    being usable on any other site, even though it's visible in your HTML.
// 4. Find your Google Place ID for "estiq@Joo Chiat" using this tool:
//    https://developers.google.com/maps/documentation/places/web-service/place-id
// 5. In index.html, replace YOUR_GOOGLE_MAPS_API_KEY in the <script src=
//    "https://maps.googleapis.com/maps/api/js?key=..."> tag with your real key.
// 6. Replace PLACE_ID below with your real Place ID.
//
// Once set up, the rating, review count, and 4-5 star reviews will load live
// from Google on every page visit — no hardcoding, no manual updates, and no
// backend/server needed. Google's free tier includes $200/month credit,
// which comfortably covers a typical small-business website's traffic.
const PLACE_ID = 'ChIJ-XJOzq4Z2jERhIg461zkErM';

// Called automatically by the Google Maps script tag in index.html once loaded.
function initGoogleReviews() {
    const trackEl = document.getElementById('reviewsTrack');
    const fallbackMsg = document.getElementById('reviewsFallbackMsg');

    if (!trackEl) return; // reviews section not present on this page

    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        if (fallbackMsg) fallbackMsg.textContent = 'Live reviews are temporarily unavailable.';
        return;
    }

    if (!PLACE_ID || PLACE_ID === 'YOUR_GOOGLE_PLACE_ID') {
        if (fallbackMsg) {
            fallbackMsg.innerHTML = 'Live Google reviews will appear here once configured. <a href="https://www.google.com/search?q=estiq@Joo+Chiat+Reviews" target="_blank" rel="noopener">See our reviews on Google →</a>';
        }
        return;
    }

    // PlacesService requires a map or HTML element as context (never rendered visibly).
    const dummyDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(dummyDiv);

    service.getDetails(
        {
            placeId: PLACE_ID,
            fields: ['rating', 'user_ratings_total', 'reviews']
        },
        (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
                if (fallbackMsg) fallbackMsg.textContent = 'Could not load live reviews right now — please check back later.';
                return;
            }
            renderGoogleReviews(place);
        }
    );
}

function renderGoogleReviews(place) {
    const ratingEl = document.getElementById('reviewsRatingNumber');
    const countEl = document.getElementById('reviewsCount');
    const trackEl = document.getElementById('reviewsTrack');

    if (ratingEl && typeof place.rating === 'number') {
        ratingEl.textContent = place.rating.toFixed(1);
    }
    if (countEl && typeof place.user_ratings_total === 'number') {
        countEl.textContent = `${place.user_ratings_total} reviews`;
    }

    // Keep the JSON-LD structured data (read by Google/Bing/AI crawlers) in sync with the
    // real, live rating/review data — no more manually-updated/outdated numbers.
    updateBusinessStructuredData(place);

    if (!trackEl) return;
    trackEl.innerHTML = '';

    // Only show 4 and 5 star reviews, matching the site's "best reviews" design intent.
    const goodReviews = (place.reviews || []).filter(r => r.rating >= 4);

    if (goodReviews.length === 0) {
        trackEl.innerHTML = '<p class="reviews-note">No reviews to display yet.</p>';
        return;
    }

    const buildCard = (review) => {
        const card = document.createElement('div');
        card.className = 'review-card';

        const initials = (review.author_name || '?')
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        card.innerHTML = `
            <div class="review-card-header">
                <div class="review-avatar">${initials}</div>
                <div>
                    <div class="review-author">${review.author_name || 'Google User'}</div>
                    <div class="review-date">${review.relative_time_description || ''}</div>
                </div>
                <svg class="review-google-icon" width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>
            </div>
            <div class="review-stars">${stars}</div>
            <p class="review-text">${(review.text || '').slice(0, 220)}${(review.text || '').length > 220 ? '…' : ''}</p>
        `;
        return card;
    };

    // Render the reviews, then duplicate the set once so the CSS marquee scroll loops seamlessly.
    goodReviews.forEach(r => trackEl.appendChild(buildCard(r)));
    goodReviews.forEach(r => {
        const dup = buildCard(r);
        dup.setAttribute('aria-hidden', 'true');
        trackEl.appendChild(dup);
    });
}

// Make it accessible as a global for the Google Maps script's `callback` param.
window.initGoogleReviews = initGoogleReviews;

// ---------------------------------------------------------------------------
// Keep JSON-LD structured data in sync with LIVE Google Places data
// ---------------------------------------------------------------------------
// Search engines and AI crawlers that render JavaScript (Googlebot, Bingbot, and most
// AI assistant crawlers) will see this updated rating/review count. This removes the need
// to manually edit the hardcoded numbers in index.html every time a new review comes in.
function updateBusinessStructuredData(place) {
    const schemaScript = document.getElementById('businessSchema');
    if (!schemaScript) return;

    let data;
    try {
        data = JSON.parse(schemaScript.textContent);
    } catch (e) {
        return; // malformed JSON — don't risk breaking the page
    }

    if (typeof place.rating === 'number') {
        data.aggregateRating = data.aggregateRating || { '@type': 'AggregateRating', bestRating: '5', worstRating: '1' };
        data.aggregateRating.ratingValue = place.rating.toFixed(1);
    }
    if (typeof place.user_ratings_total === 'number') {
        data.aggregateRating = data.aggregateRating || { '@type': 'AggregateRating', bestRating: '5', worstRating: '1' };
        data.aggregateRating.reviewCount = String(place.user_ratings_total);
    }

    if (Array.isArray(place.reviews) && place.reviews.length > 0) {
        data.review = place.reviews
            .filter(r => r.rating >= 4)
            .map(r => ({
                '@type': 'Review',
                author: { '@type': 'Person', name: r.author_name || 'Google User' },
                reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
                reviewBody: r.text || '',
                datePublished: r.time
                    ? new Date(r.time * 1000).toISOString().slice(0, 10)
                    : undefined
            }));
    }

    schemaScript.textContent = JSON.stringify(data, null, 2);
}