// script.js

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ==================== HORIZONTAL IMAGE SLIDER ====================
  // ==================== HORIZONTAL IMAGE SLIDER (FIXED) ====================
  const sliderTrack = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const dotsContainer = document.getElementById("sliderDots");

  if (sliderTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    let slidesToShow = 3;
    let totalSlides = document.querySelectorAll(".slide-item").length;
    let slideElements = document.querySelectorAll(".slide-item");
    let slideWidth = 0;
    let gap = 24; // match gap from CSS

    function updateSlidesToShow() {
      if (window.innerWidth <= 768) {
        slidesToShow = 1;
      } else if (window.innerWidth <= 1024) {
        slidesToShow = 2;
      } else {
        slidesToShow = 3;
      }
      calculateWidthAndUpdate();
    }

    function calculateWidthAndUpdate() {
      const trackWrapper = document.querySelector(".slider-track-wrapper");
      if (!trackWrapper) return;

      const containerWidth = trackWrapper.offsetWidth;
      slideWidth = (containerWidth - gap * (slidesToShow - 1)) / slidesToShow;

      slideElements.forEach((item) => {
        item.style.flex = `0 0 ${slideWidth}px`;
        item.style.minWidth = `${slideWidth}px`;
      });

      updateSliderPosition();
      updateDots();
    }

    function updateSliderPosition() {
      const maxIndex = Math.max(0, totalSlides - slidesToShow);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      const shiftAmount = currentIndex * (slideWidth + gap);
      sliderTrack.style.transform = `translateX(-${shiftAmount}px)`;
    }

    function updateDots() {
      if (!dotsContainer) return;
      const totalDots = Math.ceil(totalSlides / slidesToShow);
      dotsContainer.innerHTML = "";

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        const dotIndex = i;
        dot.addEventListener("click", function () {
          currentIndex = dotIndex * slidesToShow;
          updateSliderPosition();
          updateDots();
        });
        dotsContainer.appendChild(dot);
      }

      const activeDotIndex = Math.floor(currentIndex / slidesToShow);
      const dots = document.querySelectorAll(".dot");
      dots.forEach((dot, idx) => {
        if (idx === activeDotIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    function nextSlide() {
      const maxIndex = Math.max(0, totalSlides - slidesToShow);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSliderPosition();
        updateDots();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSliderPosition();
        updateDots();
      }
    }

    // Attach event listeners
    prevBtn.removeEventListener("click", prevSlide);
    nextBtn.removeEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    window.removeEventListener("resize", updateSlidesToShow);
    window.addEventListener("resize", function () {
      setTimeout(updateSlidesToShow, 100);
    });

    // Force a reflow to ensure everything calculates correctly
    setTimeout(function () {
      updateSlidesToShow();
    }, 50);

    // Also run on load
    window.addEventListener("load", function () {
      setTimeout(updateSlidesToShow, 50);
    });
  }
  // ==================== BEFORE & AFTER DRAG SLIDER ====================
  const comparisonImage = document.getElementById("comparisonImage");
  const afterWrapper = document.getElementById("afterWrapper");
  const dragHandler = document.getElementById("dragHandler");

  if (comparisonImage && afterWrapper && `dragHandler) {
    let isDragging = false;

    function setPosition(clientX) {
      const rect = comparisonImage.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percentage = (x / rect.width) * 100;
      afterWrapper.style.width = `${percentage}%`;
      dragHandler.style.left = `${percentage}%`;
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(e.clientX);
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      setPosition(touch.clientX);
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onMouseUp);
    }

    dragHandler.addEventListener("mousedown", function (e) {
      isDragging = true;
      e.preventDefault();
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    dragHandler.addEventListener("touchstart", function (e) {
      isDragging = true;
      e.preventDefault();
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onMouseUp);
    });

    comparisonImage.addEventListener("mousedown", function (e) {
      if (e.target === dragHandler || dragHandler.contains(e.target)) return;
      isDragging = true;
      setPosition(e.clientX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    comparisonImage.addEventListener("touchstart", function (e) {
      if (e.target === dragHandler || dragHandler.contains(e.target)) return;
      isDragging = true;
      const touch = e.touches[0];
      setPosition(touch.clientX);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onMouseUp);
    });

    // Initialize at 50%
    setTimeout(function () {
      const rect = comparisonImage.getBoundingClientRect();
      if (rect.width > 0) {
        afterWrapper.style.width = "50%";
        dragHandler.style.left = "50%";
      }
    }, 100);
  }

  // ==================== SCROLL TRIGGER ANIMATIONS ====================
  const fadeElements = document.querySelectorAll(".feature-card[data-scroll]");

  function checkVisibility() {
    fadeElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 80) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkVisibility);
  window.addEventListener("load", checkVisibility);

  // ==================== PARALLAX EFFECT ====================
  const parallaxBg = document.getElementById("parallaxBg");
  window.addEventListener("scroll", function () {
    if (parallaxBg) {
      let scrollY = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
    const heroImg = document.querySelector(".hero-image img");
    if (heroImg) {
      heroImg.style.transform = `translateY(${window.scrollY * 0.05}px)`;
    }
  });

  // ==================== MOBILE HAMBURGER MENU ====================
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });
  }

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
        }
      }
    });
  });

  // ==================== SHOP BUTTON ALERT (DEMO) ====================
  const shopButtons = document.querySelectorAll(".btn-gold, .btn-outline");
  shopButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (btn.getAttribute("href") === "#") {
        e.preventDefault();
        alert(
          "👑 PHARO SHAVE ritual unlocked — Your kingly tube awaits. (Demo version)",
        );
      }
    });
  });
});
