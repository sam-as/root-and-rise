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

})();
