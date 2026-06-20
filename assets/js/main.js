// Root & Rise — site interactions
(function(){

  // Sticky nav gains a solid backdrop once the page scrolls
  var nav = document.querySelector('nav');
  if(nav){
    var setScrolled = function(){
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, {passive:true});
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal-on-scroll for any element marked .reveal, plus the roots graphic
  var targets = document.querySelectorAll('.reveal, .roots-graphic');
  if('IntersectionObserver' in window && targets.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.18});
    targets.forEach(function(t){ io.observe(t); });
  } else {
    // No IntersectionObserver support: just show everything
    targets.forEach(function(t){ t.classList.add('is-visible'); });
  }

  // Moments gallery lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var galleryTiles = document.querySelectorAll('.moments-grid .m');
  if(lightbox && lightboxImg && galleryTiles.length){
    var openLightbox = function(src, alt){
      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', alt || '');
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeLightbox = function(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    galleryTiles.forEach(function(tile){
      tile.addEventListener('click', function(){
        var img = tile.querySelector('img');
        if(img) openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
      });
    });
    if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeLightbox();
    });
  }

  // Contact form — submits to Formspree via fetch so the page never
  // reloads, and shows an inline status message instead.
  var contactForm = document.getElementById('contact-form');
  if(contactForm){
    var statusEl = document.getElementById('form-status');
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(contactForm);
      submitBtn.disabled = true;
      statusEl.className = 'form-status';
      statusEl.textContent = 'Sending…';
      fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: {'Accept': 'application/json'}
      }).then(function(response){
        if(response.ok){
          statusEl.className = 'form-status success';
          statusEl.textContent = "Thank you — your message is on its way. I'll be in touch soon.";
          contactForm.reset();
        } else {
          return response.json().catch(function(){ return null; }).then(function(json){
            var msg = (json && json.errors && json.errors.length)
              ? json.errors.map(function(er){ return er.message; }).join(', ')
              : 'Something went wrong sending that. Please try again in a moment.';
            statusEl.className = 'form-status error';
            statusEl.textContent = msg;
          });
        }
      }).catch(function(){
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Something went wrong sending that. Please try again in a moment.';
      }).finally(function(){
        submitBtn.disabled = false;
      });
    });
  }

})();
