/**
 * AURA SPA - Premium Landing Page JS
 * Interactive features, gallery lightbox, reviews slider, map and modal forms.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. STICKY HEADER & MOBILE NAV
  // ==========================================================================
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('a');

  // Sticky header class trigger
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on click link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ==========================================================================
  // 2. ACTIVE NAV LINK ON SCROLL
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // Trigger near center screen
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // ==========================================================================
  // 3. BOOKING MODAL LOGIC
  // ==========================================================================
  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtns = document.querySelectorAll('.open-booking');
  const closeBookingBtn = bookingModal.querySelector('.modal-close');
  const bookingForm = document.getElementById('bookingForm');
  const successScreen = document.getElementById('successScreen');
  const closeSuccessBtn = document.querySelector('.close-success-btn');
  const bookingServiceSelect = document.getElementById('bookingService');
  const bookingDateInput = document.getElementById('bookingDate');

  // Set minimum date to today (YYYY-MM-DD format)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  bookingDateInput.min = `${yyyy}-${mm}-${dd}`;

  // Helper to open modal
  function openBookingModal(preSelectedService = '') {
    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    if (preSelectedService) {
      // Find matching option text or value
      const options = bookingServiceSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.includes(preSelectedService) || options[i].value === preSelectedService) {
          bookingServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Helper to close modal
  function closeBookingModal() {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
    
    // Reset form and screen
    setTimeout(() => {
      bookingForm.reset();
      successScreen.classList.remove('active');
      successScreen.setAttribute('aria-hidden', 'true');
    }, 400);
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service') || '';
      openBookingModal(service);
    });
  });

  closeBookingBtn.addEventListener('click', closeBookingModal);
  closeSuccessBtn.addEventListener('click', closeBookingModal);

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
  });

  // Form submission with mock validation
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Trigger CSS user-invalid styling
    const inputs = bookingForm.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        isValid = false;
        // Mock native interaction to trigger CSS :user-invalid
        input.dispatchEvent(new Event('blur'));
      }
    });

    if (isValid) {
      // Success state
      successScreen.classList.add('active');
      successScreen.setAttribute('aria-hidden', 'false');
    }
  });

  // ==========================================================================
  // 3a. GIFT CERTIFICATE MODAL LOGIC
  // ==========================================================================
  const certModal = document.getElementById('certificateModal');
  const openCertBtn = document.getElementById('openCertModalBtn');
  const closeCertBtn = certModal.querySelector('.modal-close');
  const closeCertSuccessBtn = certModal.querySelector('.close-cert-success-btn');
  const certForm = document.getElementById('certificateForm');
  const certSuccessScreen = document.getElementById('certSuccessScreen');
  const certSummaryTotal = document.getElementById('certSummaryTotal');
  const customAmountInput = document.getElementById('customAmount');
  
  const certTabs = document.querySelectorAll('.cert-tab');
  const certTabContents = document.querySelectorAll('.cert-tab-content');
  const certOptionCards = document.querySelectorAll('.cert-option-card');
  const formatOptions = document.querySelectorAll('.cert-format-option');
  const addressGroup = document.querySelector('.cert-address-group');
  const addressInput = document.getElementById('certAddress');

  let selectedType = 'amount'; // 'amount' or 'service'
  let selectedValue = '5000'; // defaults to 5000
  let selectedFormat = 'digital'; // 'digital' or 'physical'

  function openCertificateModal() {
    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateSummary();
  }

  function closeCertificateModal() {
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      certForm.reset();
      
      // Reset active selections to defaults
      certOptionCards.forEach(c => c.classList.remove('active'));
      const defaultAmountCard = document.querySelector('.cert-grid-amount .cert-option-card[data-value="5000"]');
      if (defaultAmountCard) defaultAmountCard.classList.add('active');
      selectedValue = '5000';
      selectedType = 'amount';
      selectedFormat = 'digital';
      
      certTabs.forEach(t => t.classList.remove('active'));
      const defaultTab = document.querySelector('.cert-tab[data-tab="amount"]');
      if (defaultTab) defaultTab.classList.add('active');
      
      certTabContents.forEach(c => c.classList.remove('active'));
      const defaultContent = document.getElementById('tab-amount');
      if (defaultContent) defaultContent.classList.add('active');

      formatOptions.forEach(o => o.classList.remove('active'));
      const defaultFormat = document.querySelector('.cert-format-option:first-child');
      if (defaultFormat) defaultFormat.classList.add('active');
      
      addressGroup.style.display = 'none';
      addressInput.required = false;

      certSuccessScreen.classList.remove('active');
      certSuccessScreen.setAttribute('aria-hidden', 'true');
    }, 400);
  }

  if (openCertBtn) {
    openCertBtn.addEventListener('click', openCertificateModal);
  }

  closeCertBtn.addEventListener('click', closeCertificateModal);
  closeCertSuccessBtn.addEventListener('click', closeCertificateModal);
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertificateModal();
  });

  // Tab switching
  certTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      certTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetTab = tab.getAttribute('data-tab');
      selectedType = targetTab;

      certTabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${targetTab}`) {
          content.classList.add('active');
        }
      });

      // Update selected value based on active tab default/active card
      const activeCard = document.querySelector(`#tab-${targetTab} .cert-option-card.active`);
      if (activeCard) {
        selectedValue = activeCard.getAttribute('data-value');
      } else {
        const firstCard = document.querySelector(`#tab-${targetTab} .cert-option-card`);
        if (firstCard) {
          firstCard.classList.add('active');
          selectedValue = firstCard.getAttribute('data-value');
        }
      }
      
      updateSummary();
    });
  });

  // Option cards click
  certOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      const grid = card.closest('.cert-grid');
      grid.querySelectorAll('.cert-option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      selectedValue = card.getAttribute('data-value');

      if (grid.classList.contains('cert-grid-service') || card.getAttribute('data-value') !== 'custom') {
        customAmountInput.value = '';
      }
      
      updateSummary();
    });
  });

  // Custom amount changes
  customAmountInput.addEventListener('input', () => {
    const val = parseInt(customAmountInput.value, 10);
    document.querySelectorAll('.cert-grid-amount .cert-option-card').forEach(c => c.classList.remove('active'));
    
    if (val >= 3000) {
      selectedValue = val.toString();
    } else {
      selectedValue = '0';
    }
    updateSummary();
  });

  // Format selection
  formatOptions.forEach(opt => {
    const radio = opt.querySelector('input[type="radio"]');
    opt.addEventListener('click', () => {
      formatOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      radio.checked = true;
      selectedFormat = radio.value;

      if (selectedFormat === 'physical') {
        addressGroup.style.display = 'flex';
        addressInput.required = true;
      } else {
        addressGroup.style.display = 'none';
        addressInput.required = false;
      }
      updateSummary();
    });
  });

  function updateSummary() {
    let priceText = '0 ₽';
    let formattedVal = 0;

    if (selectedType === 'amount') {
      const customVal = parseInt(customAmountInput.value, 10);
      if (!isNaN(customVal) && customVal > 0) {
        formattedVal = customVal;
      } else {
        formattedVal = parseInt(selectedValue, 10) || 0;
      }
      priceText = `${formattedVal.toLocaleString('ru-RU')} ₽`;
    } else {
      const card = document.querySelector(`.cert-grid-service .cert-option-card[data-value="${selectedValue}"]`);
      if (card) {
        formattedVal = parseInt(card.getAttribute('data-price'), 10) || 0;
        priceText = `${formattedVal.toLocaleString('ru-RU')} ₽`;
      }
    }

    certSummaryTotal.textContent = priceText;
  }

  // Handle certificate form submit
  certForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedType === 'amount') {
      const customVal = parseInt(customAmountInput.value, 10);
      if (customAmountInput.value && (isNaN(customVal) || customVal < 3000)) {
        customAmountInput.classList.add('user-invalid');
        customAmountInput.nextElementSibling.style.display = 'block';
        return;
      } else {
        customAmountInput.classList.remove('user-invalid');
        customAmountInput.nextElementSibling.style.display = 'none';
      }
    }

    const inputs = certForm.querySelectorAll('input:required');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim() || (input.type === 'email' && !input.value.includes('@'))) {
        input.classList.add('user-invalid');
        isValid = false;
      } else {
        input.classList.remove('user-invalid');
      }
    });

    if (!isValid) return;

    const senderEmail = document.getElementById('certSenderEmail').value;
    const senderName = document.getElementById('certSenderName').value;
    const certTypeDesc = selectedType === 'amount' ? 'номинальный сертификат' : 'сертификат на SPA-программу';
    const totalAmount = certSummaryTotal.textContent;

    let deliveryMessage = '';
    if (selectedFormat === 'digital') {
      deliveryMessage = `Электронный сертификат будет отправлен на адрес <strong>${senderEmail}</strong> сразу после подтверждения оплаты.`;
    } else {
      const deliveryAddress = addressInput.value || 'Самовывоз';
      deliveryMessage = `Физический сертификат в фирменном конверте будет доставлен по адресу: <strong>${deliveryAddress}</strong>.`;
    }

    const successMessageText = `Благодарим за заказ, ${senderName}! Вы выбрали ${certTypeDesc} на сумму <strong>${totalAmount}</strong>. ${deliveryMessage} Наш менеджер свяжется с вами в течение 10 минут по указанному телефону для завершения оформления и оплаты.`;

    document.getElementById('certSuccessMessage').innerHTML = successMessageText;
    certSuccessScreen.classList.add('active');
    certSuccessScreen.setAttribute('aria-hidden', 'false');
  });

  // Link regular booking select selection of certificate to certificate modal
  if (bookingServiceSelect) {
    bookingServiceSelect.addEventListener('change', () => {
      if (bookingServiceSelect.value === 'certificate') {
        closeBookingModal();
        setTimeout(() => {
          openCertificateModal();
        }, 300);
      }
    });
  }

  // ==========================================================================
  // 4. SERVICE DETAIL MODAL LOGIC
  // ==========================================================================
  const serviceDetailModal = document.getElementById('serviceDetailModal');
  const openDetailBtns = document.querySelectorAll('.open-service-detail');
  const closeDetailBtn = serviceDetailModal.querySelector('.modal-close');
  const bookingFromDetailBtn = serviceDetailModal.querySelector('.open-booking-from-detail');
  
  // Data for service details
  const serviceDetailsData = {
    relax: {
      title: "Расслабляющий массаж",
      price: "от 4 500 ₽",
      duration: "60 / 90 минут",
      image: "images/service_relax.png",
      description: "Глубокий релаксирующий массаж всего тела с использованием согревающих масел. Мягкие обволакивающие движения мастера снимают напряжение с ключевых групп мышц, стимулируют лимфодренаж и погружают вас в состояние глубокого покоя и внутренней тишины. Идеально подходит при синдроме хронической усталости и стрессе.",
      steps: [
        "Арома-ритуал для настройки дыхания и снятия мышечных зажимов",
        "Общий расслабляющий массаж спины, плечевого пояса и ног с кокосовым маслом",
        "Деликатный массаж стоп и кистей рук",
        "Травяной сбор с алтайским медом в чайной комнате салона"
      ]
    },
    body: {
      title: "SPA-программа для тела",
      price: "6 000 ₽",
      duration: "90 минут",
      image: "images/service_body.png",
      description: "Роскошный детокс и уход для обновления вашей кожи. Программа включает бережное отшелушивание омертвевших клеток, нанесение питательной маски-обертывания и релакс-массаж. Кожа приобретает бархатистость, повышается ее эластичность и упругость.",
      steps: [
        "Нежный пилинг тела скрабом на выбор (кокосовый, кофейный или соляной)",
        "Питательное обертывание с белой глиной или шоколадом под термоодеялом",
        "Массаж лица с органическим маслом семян винограда во время обертывания",
        "Завершающее нанесение шелковистого молочка для тела"
      ]
    },
    antistress: {
      title: "Антистресс массаж",
      price: "4 200 ₽",
      duration: "60 минут",
      image: "images/service_antistress.png",
      description: "Направленный массаж для жителей мегаполиса, испытывающих частые перегрузки. Особое внимание мастер уделяет воротниковой зоне, плечам, шее и коже головы. Улучшает кровоснабжение головного мозга, снимает спазм и избавляет от усталости.",
      steps: [
        "Разогрев мышц воротниковой зоны и плечевого пояса теплыми компрессами",
        "Акупрессурный массаж триггерных зон шеи и головы",
        "Аромамассаж с использованием натуральных эфирных масел перечной мяты и лаванды",
        "Свободный отдых в лаунж-зоне с прохладной водой с лимоном"
      ]
    },
    back: {
      title: "Массаж спины и шеи",
      price: "4 000 ₽",
      duration: "60 минут",
      image: "images/service_back.png",
      description: "Классический терапевтический массаж с акцентом на позвоночник. Мастер прорабатывает глубокие мышцы спины, снимая накопившееся мышечное утомление, восстанавливая подвижность суставов и улучшая осанку.",
      steps: [
        "Разогревающие растирания и поглаживания длинных мышц спины",
        "Интенсивная разминка триггерных точек лопаточной области и поясницы",
        "Мягкие тракционные приемы для растяжения шейного отдела позвоночника",
        "Рекомендации мастера по домашней самопомощи и осанке"
      ]
    },
    aroma: {
      title: "Ароматерапия",
      price: "5 000 ₽",
      duration: "75 минут",
      image: "images/service_aroma.png",
      description: "Индивидуальный сеанс аромамассажа, сочетающий физическое воздействие и силу натуральных эфирных масел. Перед процедурой вы пройдете экспресс-тест ароматов для выбора масла, которое больше всего откликается вашему телу в данный момент.",
      steps: [
        "Ольфакторный тест аромакомпозиций для индивидуального подбора масел",
        "Мягкий расслабляющий массаж всего тела с теплым аромамаслом",
        "Прогрев стоп теплыми мешочками с целебными травами",
        "Душистый чай из липы и мелиссы для закрепления эффекта"
      ]
    },
    pair: {
      title: "SPA для двоих",
      price: "12 000 ₽",
      duration: "120 минут",
      image: "images/service_pair.png",
      description: "Изысканный совместный ритуал для пары или близких подруг в просторном VIP-кабинете. Программа объединяет распаривание, уход за телом и расслабляющий массаж, проходящие одновременно для обоих гостей.",
      steps: [
        "Совместное распаривание в кедровой бочке или индивидуальном хаммаме",
        "Пилинг тела кокосовой стружкой и нежный массаж стоп",
        "Синхронный расслабляющий массаж тела от двух специалистов",
        "Чаепитие при свечах с экзотическими фруктами, орехами и медом"
      ]
    }
  };

  let activeServiceKey = '';

  function openDetailModal(key) {
    const data = serviceDetailsData[key];
    if (!data) return;

    activeServiceKey = key;
    
    // Populate modal values
    document.getElementById('detailImage').src = data.image;
    document.getElementById('detailImage').alt = data.title;
    document.getElementById('detailTitle').textContent = data.title;
    document.getElementById('detailDuration').textContent = data.duration;
    document.getElementById('detailPrice').textContent = data.price;
    document.getElementById('detailFullDesc').textContent = data.description;
    
    // Populate list bullets
    const stepsUl = document.getElementById('detailSteps');
    stepsUl.innerHTML = '';
    data.steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      stepsUl.appendChild(li);
    });

    serviceDetailModal.classList.add('active');
    serviceDetailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    serviceDetailModal.classList.remove('active');
    serviceDetailModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-service');
      openDetailModal(key);
    });
  });

  closeDetailBtn.addEventListener('click', closeDetailModal);
  serviceDetailModal.addEventListener('click', (e) => {
    if (e.target === serviceDetailModal) closeDetailModal();
  });

  // Action button inside detail card
  bookingFromDetailBtn.addEventListener('click', () => {
    closeDetailModal();
    const serviceName = serviceDetailsData[activeServiceKey]?.title || '';
    setTimeout(() => {
      openBookingModal(serviceName);
    }, 350);
  });


  // ==========================================================================
  // 5. LIGHTBOX GALLERY LOGIC
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  let currentPhotoIndex = 0;
  const galleryPhotos = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
      src: img.src,
      alt: img.alt
    };
  });

  function openLightbox(index) {
    currentPhotoIndex = index;
    const photo = galleryPhotos[index];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.alt;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    if (!bookingModal.classList.contains('active') && !serviceDetailModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
    openLightbox(currentPhotoIndex);
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    openLightbox(currentPhotoIndex);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextPhoto);
  lightboxPrev.addEventListener('click', showPrevPhoto);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard Navigation for Lightbox & Modals
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
    } else if (bookingModal.classList.contains('active')) {
      if (e.key === 'Escape') closeBookingModal();
    } else if (serviceDetailModal.classList.contains('active')) {
      if (e.key === 'Escape') closeDetailModal();
    } else if (certModal.classList.contains('active')) {
      if (e.key === 'Escape') closeCertificateModal();
    }
  });


  // ==========================================================================
  // 6. TESTIMONIALS CAROUSEL LOGIC
  // ==========================================================================
  const carousel = document.getElementById('reviewsCarousel');
  const slides = carousel.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlideIndex = 0;
  let carouselTimer = null;

  function setSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlideIndex = index;
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  function nextSlide() {
    const nextIdx = (currentSlideIndex + 1) % slides.length;
    setSlide(nextIdx);
  }

  function startCarouselTimer() {
    carouselTimer = setInterval(nextSlide, 6000); // Rotate every 6s
  }

  function stopCarouselTimer() {
    if (carouselTimer) clearInterval(carouselTimer);
  }

  // Bind dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopCarouselTimer();
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      setSlide(idx);
      startCarouselTimer();
    });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopCarouselTimer);
  carousel.addEventListener('mouseleave', startCarouselTimer);

  // Init carousel timer
  startCarouselTimer();


  // ==========================================================================
  // 7. SCROLL REVEAL ANIMATIONS FALLBACK
  // ==========================================================================
  // Check if browser lacks native scroll-driven animations support
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const revealOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger slightly before section appears
      threshold: 0.05
    };

    const sectionRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, revealOptions);

    const sectionsToAnimate = [
      '.advantages-section',
      '.services-section',
      '.atmosphere-section',
      '.programs-section',
      '.masters-section',
      '.reviews-section',
      '.certificates-section',
      '.faq-section',
      '.contacts-section'
    ];

    sectionsToAnimate.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) sectionRevealObserver.observe(el);
    });
  }


  // ==========================================================================
  // 8. INTERACTIVE LEAFLET MAP INITIALIZATION
  // ==========================================================================
  try {
    // Coordinate for Tverskaya 15, Moscow
    const salonCoords = [55.7601, 37.6085];
    
    // Create Leaflet Map instance
    const map = L.map('map', {
      center: salonCoords,
      zoom: 15,
      scrollWheelZoom: false, // Prevent zoom on page scroll to avoid hijacking scroll
      zoomControl: false // Disable default zoom controls to position them customly
    });

    // Add styled zoom control to the top-right corner, avoiding overlap with contacts-card
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Add CartoDB Positron tiles - they are natively clean, light-gray, and look extremely premium
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
      detectRetina: true // Load sharp high-resolution tiles on Retina displays
    }).addTo(map);

    // Create an elegant custom small dark-brown / champagne pin
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: #2B221E;
          border: 2px solid #FAF8F5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(44, 37, 32, 0.25);
        ">
          <div style="
            width: 6px;
            height: 6px;
            background-color: #FAF8F5;
            border-radius: 50%;
          "></div>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #2B221E;
          margin-left: 5px;
          margin-top: -1px;
        "></div>
      `,
      iconSize: [20, 25],
      iconAnchor: [10, 25]
    });

    // Add marker to map
    const marker = L.marker(salonCoords, { icon: customIcon }).addTo(map);
    
    // Bind popup
    marker.bindPopup(`
      <div style="
        font-family: 'Montserrat', sans-serif;
        font-size: 0.75rem;
        color: #2C2520;
        text-align: center;
        padding: 4px 6px;
        line-height: 1.4;
      ">
        <strong style="font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; letter-spacing: 0.04em; display: block; margin-bottom: 2px; color: #2B221E;">AURA SPA</strong>
        г. Москва, ул. Тверская, 15
      </div>
    `, {
      closeButton: false,
      offset: [0, -20]
    }).openPopup();

  } catch (err) {
    console.error("Leaflet map initialization failed: ", err);
  }

  // ==========================================================================
  // 10. FAQ ACCORDION LOGIC
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle the clicked item
        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

});
