/**
 * SEHRISH GUEST HOUSE — SKARDU
 * Interactive Engine: Canvas Particles, Booking Math, WhatsApp Generator, Lightbox & Mobile Menu
 */

const CONFIG = {
  phone: "+923715493334",
  whatsappNumber: "923715493334",
  plusCode: "7JQR+28 Skardu"
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. PRELOADER
     ========================================================================== */
  const loader = $("#loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("done"), 600);
  });
  setTimeout(() => loader?.classList.add("done"), 1800);

  /* ==========================================================================
     2. CANVAS 3D PARTICLES IN HERO
     ========================================================================== */
  const canvas = $("#heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = Math.random() * 0.25 + 0.05;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.4 ? "212, 175, 55" : "255, 255, 255";
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < 0) this.y = height;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    const count = Math.min(width > 768 ? 45 : 20, 50);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ==========================================================================
     3. HEADER SCROLL & MOBILE DRAWER
     ========================================================================== */
  const header = $("#header");
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    header?.classList.toggle("scrolled", currentScrollY > 40);

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header?.classList.add("hidden");
    } else {
      header?.classList.remove("hidden");
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const toggleMobileMenu = (open) => {
    mobileMenu?.classList.toggle("open", open);
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    menuToggle?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  };
  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.contains("open");
    toggleMobileMenu(!isOpen);
  });
  $$("#mobileMenu a, #mobileMenu button").forEach(item => {
    item.addEventListener("click", () => toggleMobileMenu(false));
  });

  /* ==========================================================================
     4. BOOKING CALCULATOR & DATES
     ========================================================================== */
  const checkinInput = $("#checkin");
  const checkoutInput = $("#checkout");
  const roomSelect = $("#roomSelect");
  const guestCountEl = $("#guestCount");
  const minusGuestBtn = $("#minusGuest");
  const plusGuestBtn = $("#plusGuest");
  const estPriceDisplay = $("#estPriceDisplay");

  let guestCount = 2;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDateIso = (d) => d.toISOString().split("T")[0];
  if (checkinInput && checkoutInput) {
    checkinInput.min = formatDateIso(today);
    checkoutInput.min = formatDateIso(tomorrow);
    checkinInput.value = formatDateIso(today);
    checkoutInput.value = formatDateIso(tomorrow);
  }

  const updatePriceEstimate = () => {
    const selectedOption = roomSelect?.selectedOptions[0];
    const pricePerNight = selectedOption ? parseInt(selectedOption.dataset.price || "8500", 10) : 8500;
    
    let nights = 1;
    if (checkinInput?.value && checkoutInput?.value) {
      const d1 = new Date(checkinInput.value);
      const d2 = new Date(checkoutInput.value);
      const diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) nights = diffDays;
    }

    const totalEst = pricePerNight * nights;
    if (estPriceDisplay) {
      estPriceDisplay.textContent = `${nights} Night${nights > 1 ? 's' : ''}: Rs. ${totalEst.toLocaleString()}`;
    }
  };

  checkinInput?.addEventListener("change", () => {
    if (checkinInput.value) {
      const nextDate = new Date(checkinInput.value);
      nextDate.setDate(nextDate.getDate() + 1);
      checkoutInput.min = formatDateIso(nextDate);
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = formatDateIso(nextDate);
      }
      updatePriceEstimate();
    }
  });
  checkoutInput?.addEventListener("change", updatePriceEstimate);
  roomSelect?.addEventListener("change", updatePriceEstimate);

  plusGuestBtn?.addEventListener("click", () => {
    guestCount = Math.min(10, guestCount + 1);
    if (guestCountEl) guestCountEl.textContent = guestCount;
  });
  minusGuestBtn?.addEventListener("click", () => {
    guestCount = Math.max(1, guestCount - 1);
    if (guestCountEl) guestCountEl.textContent = guestCount;
  });

  updatePriceEstimate();

  /* ==========================================================================
     5. RESERVATION MODAL & WHATSAPP
     ========================================================================== */
  const modal = $("#enquiryModal");
  const modalClose = $("#modalClose");
  const modalCheckin = $("#modalCheckin");
  const modalCheckout = $("#modalCheckout");
  const modalRoomSelect = $("#modalRoomSelect");
  const modalGuests = $("#modalGuests");
  const modalAirportPickup = $("#modalAirportPickup");
  const summaryIn = $("#summaryIn");
  const summaryOut = $("#summaryOut");
  const summaryDetails = $("#summaryDetails");
  const waDirectBtn = $("#waDirectBtn");
  const copyEnquiryBtn = $("#copyEnquiry");
  const copyStatus = $("#copyStatus");

  const formatReadableDate = (dateStr) => {
    if (!dateStr) return "Not selected";
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const syncModalDetails = () => {
    const inDate = modalCheckin?.value || checkinInput?.value;
    const outDate = modalCheckout?.value || checkoutInput?.value;
    const selectedRoom = modalRoomSelect?.value || roomSelect?.value;
    const guests = modalGuests?.value || `${guestCount} Guests`;
    const includePickup = modalAirportPickup?.checked ? "Yes (Include Skardu Airport Pickup)" : "No";

    if (summaryIn) summaryIn.textContent = formatReadableDate(inDate);
    if (summaryOut) summaryOut.textContent = formatReadableDate(outDate);
    if (summaryDetails) summaryDetails.textContent = `${selectedRoom.split('(')[0].trim()} · ${guests}`;

    // Format WhatsApp message
    const msg = `*Reservation Inquiry - Sehrish Guest House Skardu*
📅 *Check-in:* ${formatReadableDate(inDate)}
📅 *Check-out:* ${formatReadableDate(outDate)}
🛏️ *Room:* ${selectedRoom}
👥 *Guests:* ${guests}
✈️ *Airport Transfer:* ${includePickup}

Please confirm availability and booking details. Thank you!`;

    if (waDirectBtn) {
      waDirectBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    }
  };

  const openModal = (preselectedRoom) => {
    if (modalCheckin && checkinInput) modalCheckin.value = checkinInput.value;
    if (modalCheckout && checkoutInput) modalCheckout.value = checkoutInput.value;
    
    if (preselectedRoom && modalRoomSelect) {
      for (let opt of modalRoomSelect.options) {
        if (opt.value.includes(preselectedRoom)) {
          opt.selected = true;
          break;
        }
      }
    }

    syncModalDetails();
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  $$("[data-open-enquiry]").forEach(btn => {
    btn.addEventListener("click", () => {
      const room = btn.dataset.roomBook || "";
      openModal(room);
    });
  });

  $("#bookingSubmit")?.addEventListener("click", () => openModal(roomSelect?.value));
  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal?.classList.contains("open")) closeModal(); });

  [modalCheckin, modalCheckout, modalRoomSelect, modalGuests, modalAirportPickup].forEach(el => {
    el?.addEventListener("change", syncModalDetails);
  });

  copyEnquiryBtn?.addEventListener("click", async () => {
    const inDate = modalCheckin?.value || checkinInput?.value;
    const outDate = modalCheckout?.value || checkoutInput?.value;
    const selectedRoom = modalRoomSelect?.value || roomSelect?.value;
    const guests = modalGuests?.value || `${guestCount} Guests`;
    const includePickup = modalAirportPickup?.checked ? "Yes" : "No";

    const textToCopy = `Sehrish Guest House Reservation:
Check-in: ${formatReadableDate(inDate)}
Check-out: ${formatReadableDate(outDate)}
Room: ${selectedRoom}
Guests: ${guests}
Airport Pickup: ${includePickup}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      if (copyStatus) copyStatus.textContent = "✓ Details copied to clipboard!";
      setTimeout(() => { if (copyStatus) copyStatus.textContent = ""; }, 3000);
    } catch {
      if (copyStatus) copyStatus.textContent = "Please copy manually.";
    }
  });

  /* ==========================================================================
     6. GALLERY FILTERING & LIGHTBOX
     ========================================================================== */
  const filterBtns = $$(".gallery-tab-btn");
  const galleryItems = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxClose = $("#lightboxClose");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (category === "all" || item.dataset.cat === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const src = item.dataset.src;
      const caption = item.dataset.caption;
      if (lightboxImg) lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox?.classList.add("open");
      lightbox?.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    });
  });

  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  /* ==========================================================================
     7. PLUS CODE COPY
     ========================================================================== */
  const copyCodeBtn = $("#copyCode");
  copyCodeBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.plusCode);
      copyCodeBtn.textContent = "COPIED!";
      setTimeout(() => { copyCodeBtn.textContent = "Copy Code"; }, 2000);
    } catch {
      copyCodeBtn.textContent = "7JQR+28";
    }
  });

  /* ==========================================================================
     8. BACK TO TOP
     ========================================================================== */
  $("#backTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
