// ===== Mobile menu toggle =====
(function(){
  var toggle = document.getElementById('mobile-toggle');
  var menu = document.getElementById('mobile-menu');
  if(toggle && menu){
    toggle.addEventListener('click', function(){
      menu.classList.toggle('open');
      var opening = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
      toggle.innerHTML = opening
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    });
  }

  // Mobile "Services" accordion
  var mmServices = document.querySelector('.mm-services > span');
  var mmPanel = document.querySelector('.mm-services-panel');
  if(mmServices && mmPanel){
    mmServices.addEventListener('click', function(){
      var isOpen = mmPanel.style.display === 'block';
      mmPanel.style.display = isOpen ? 'none' : 'block';
      mmServices.textContent = (isOpen ? 'Services ↓' : 'Services ↑');
    });
  }

  // Close mobile menu when a real link is tapped
  if(menu){
    menu.querySelectorAll('a[href]').forEach(function(a){
      a.addEventListener('click', function(){ menu.classList.remove('open'); });
    });
  }
})();

// ===== Scroll reveal =====
(function(){
  var els = document.querySelectorAll('.rv');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('on'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('on');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

// ===== FAQ accordion (used on any page with .faq-item) =====
(function(){
  document.querySelectorAll('.faq-item').forEach(function(item){
    var top = item.querySelector('.faq-top');
    if(!top) return;
    top.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
      if(!wasOpen) item.classList.add('open');
    });
  });
})();

// ===== Floating WhatsApp + Call buttons =====
(function(){
  if(document.querySelector('.float-actions')) return; // already present
  var phone = '919886633336';
  var waMsg = encodeURIComponent("Hi EMS WebTech, I'd like to know more about your services.");
  var wrap = document.createElement('div');
  wrap.className = 'float-actions';
  wrap.innerHTML =
    '<a class="float-btn call" href="tel:+91' + '98866' + '33336" aria-label="Call EMS WebTech" title="Call us">' +
      '<span class="fb-label">Call us</span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.5-1.3a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.7 2.1z"/></svg>' +
    '</a>' +
    '<a class="float-btn wa" href="https://wa.me/' + phone + '?text=' + waMsg + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">' +
      '<span class="fb-pulse"></span>' +
      '<span class="fb-label">Chat on WhatsApp</span>' +
      '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.387.665 4.62 1.822 6.524L3 29l7.16-2.278A12.44 12.44 0 0016 28c6.905 0 12.5-5.596 12.5-12.5S22.906 3 16.001 3zm0 22.7a10.16 10.16 0 01-5.176-1.417l-.371-.22-4.248 1.351 1.379-4.142-.242-.386A10.14 10.14 0 015.8 15.5c0-5.63 4.572-10.2 10.201-10.2S26.2 9.87 26.2 15.5 21.63 25.7 16.001 25.7zm5.593-7.646c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.688.153-.204.306-.79.995-.969 1.199-.178.204-.357.23-.663.077-.306-.153-1.292-.476-2.462-1.518-.91-.812-1.524-1.815-1.703-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.051-.383-.026-.535-.077-.153-.688-1.658-.943-2.271-.248-.596-.5-.516-.688-.525-.178-.009-.382-.011-.586-.011s-.535.077-.816.383c-.28.306-1.07 1.046-1.07 2.55 0 1.505 1.096 2.958 1.249 3.163.153.204 2.157 3.294 5.226 4.618.73.315 1.299.503 1.743.644.732.233 1.398.2 1.925.121.587-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.076-.128-.28-.204-.586-.357z"/></svg>' +
    '</a>';
  document.body.appendChild(wrap);
})();
