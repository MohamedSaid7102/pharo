// script.js

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ==================== HORIZONTAL IMAGE SLIDER (FIXED FOR MOBILE) ====================
  const sliderTrack = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const dotsContainer = document.getElementById("sliderDots");

  if (sliderTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    let slidesToShow = 3;
    let totalSlides = document.querySelectorAll(".slide-item").length;
    let slideElements = document.querySelectorAll(".slide-item");
    let gap = 24;

    function getSlidesToShow() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function setSlideWidths() {
      const trackWrapper = document.querySelector(".slider-track-wrapper");
      if (!trackWrapper) return 0;

      const containerWidth = trackWrapper.offsetWidth;
      slidesToShow = getSlidesToShow();

      const slideWidth =
        (containerWidth - gap * (slidesToShow - 1)) / slidesToShow;

      slideElements.forEach((item) => {
        item.style.flex = `0 0 ${slideWidth}px`;
        item.style.minWidth = `${slideWidth}px`;
        item.style.maxWidth = `${slideWidth}px`;
      });

      return slideWidth;
    }

    function updateSliderPosition() {
      const maxIndex = Math.max(0, totalSlides - slidesToShow);
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      const slideWidth =
        parseFloat(slideElements[0]?.style.flex.split(" ")[1]) || 280;
      const shiftAmount = currentIndex * (slideWidth + gap);
      sliderTrack.style.transform = `translateX(-${shiftAmount}px)`;
      sliderTrack.style.transition = "transform 0.4s ease-out";
    }

    function updateDots() {
      if (!dotsContainer) return;
      const totalDots = Math.ceil(totalSlides / slidesToShow);
      dotsContainer.innerHTML = "";

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.setAttribute("data-index", i);
        dot.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          currentIndex = i * slidesToShow;
          setSlideWidths();
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

    function nextSlide(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const maxIndex = Math.max(0, totalSlides - slidesToShow);
      if (currentIndex < maxIndex) {
        currentIndex++;
        setSlideWidths();
        updateSliderPosition();
        updateDots();
      }
    }

    function prevSlide(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (currentIndex > 0) {
        currentIndex--;
        setSlideWidths();
        updateSliderPosition();
        updateDots();
      }
    }

    function initSlider() {
      setSlideWidths();
      updateSliderPosition();
      updateDots();
    }

    // Remove old listeners and add new ones properly
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    const finalPrevBtn = document.getElementById("prevSlide");
    const finalNextBtn = document.getElementById("nextSlide");

    finalPrevBtn.addEventListener("click", prevSlide);
    finalNextBtn.addEventListener("click", nextSlide);
    finalPrevBtn.addEventListener("touchstart", prevSlide, { passive: false });
    finalNextBtn.addEventListener("touchstart", nextSlide, { passive: false });

    window.addEventListener("resize", function () {
      setTimeout(initSlider, 150);
    });

    // Wait for images to load
    const allImages = document.querySelectorAll(".slide-item img");
    let loadedCount = 0;

    function imageLoaded() {
      loadedCount++;
      if (loadedCount === allImages.length) {
        initSlider();
      }
    }

    if (allImages.length === 0) {
      initSlider();
    } else {
      allImages.forEach((img) => {
        if (img.complete) {
          imageLoaded();
        } else {
          img.addEventListener("load", imageLoaded);
          img.addEventListener("error", imageLoaded);
        }
      });
      setTimeout(initSlider, 500);
    }
  }

  // ==================== BEFORE & AFTER DRAG SLIDER (FIXED FOR MOBILE) ====================
  const comparisonImage = document.getElementById("comparisonImage");
  const afterWrapper = document.getElementById("afterWrapper");
  const dragHandler = document.getElementById("dragHandler");

  if (comparisonImage && afterWrapper && dragHandler) {
    let isDragging = false;
    let startX = 0;
    let startWidth = 50;

    function setPosition(clientX) {
      const rect = comparisonImage.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percentage = (x / rect.width) * 100;
      afterWrapper.style.width = `${percentage}%`;
      dragHandler.style.left = `${percentage}%`;
    }

    function onStart(e) {
      isDragging = true;
      e.preventDefault();

      let clientX;
      if (e.type === "touchstart") {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const rect = comparisonImage.getBoundingClientRect();
      startX = clientX - rect.left;
      const currentPercent = parseFloat(afterWrapper.style.width) || 50;
      startWidth = currentPercent;

      setPosition(clientX);
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();

      let clientX;
      if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      setPosition(clientX);
    }

    function onEnd() {
      isDragging = false;
    }

    dragHandler.addEventListener("mousedown", onStart);
    dragHandler.addEventListener("touchstart", onStart, { passive: false });

    comparisonImage.addEventListener("mousedown", onStart);
    comparisonImage.addEventListener("touchstart", onStart, { passive: false });

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    // Initialize at 50%
    function initBeforeAfter() {
      const rect = comparisonImage.getBoundingClientRect();
      if (rect.width > 0) {
        afterWrapper.style.width = "50%";
        dragHandler.style.left = "50%";
      }
    }

    const beforeImg = document.querySelector(".comparison-before");
    const afterImg = document.querySelector(".comparison-after");

    if (beforeImg && afterImg) {
      let loadedImages = 0;
      function checkLoaded() {
        loadedImages++;
        if (loadedImages === 2) {
          setTimeout(initBeforeAfter, 100);
        }
      }

      if (beforeImg.complete) checkLoaded();
      else beforeImg.addEventListener("load", checkLoaded);

      if (afterImg.complete) checkLoaded();
      else afterImg.addEventListener("load", checkLoaded);
    }

    setTimeout(initBeforeAfter, 200);
  }

  // ==================== SCROLL TRIGGER ANIMATIONS ====================
  const fadeElements = document.querySelectorAll(".feature-card");

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
  checkVisibility();

  // ==================== PARALLAX EFFECT ====================
  const parallaxBg = document.getElementById("parallaxBg");
  window.addEventListener("scroll", function () {
    if (parallaxBg) {
      let scrollY = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
  });

  // ==================== MOBILE HAMBURGER MENU (FIXED) ====================
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    // Remove existing listeners by cloning
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    const finalHamburger = document.getElementById("hamburger");

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle("active");
    }

    finalHamburger.addEventListener("click", toggleMenu);
    finalHamburger.addEventListener("touchstart", toggleMenu, {
      passive: false,
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        navLinks.classList.remove("active");
      });
      link.addEventListener("touchstart", function () {
        navLinks.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !finalHamburger.contains(e.target)
      ) {
        navLinks.classList.remove("active");
      }
    });
  }

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS (FIXED FOR MOBILE) ====================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (navLinks) {
          navLinks.classList.remove("active");
        }
      }
    });

    anchor.addEventListener("touchstart", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (navLinks) {
          navLinks.classList.remove("active");
        }
      }
    });
  });

  // ==================== SHOP BUTTON ALERT ====================
  const shopButtons = document.querySelectorAll(".btn-gold, .btn-outline");
  shopButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (btn.getAttribute("href") === "#" || btn.getAttribute("href") === "") {
        e.preventDefault();
        alert(
          "👑 PHARO SHAVE ritual unlocked — Your kingly tube awaits. (Demo version)",
        );
      }
    });
    btn.addEventListener("touchstart", function (e) {
      if (btn.getAttribute("href") === "#" || btn.getAttribute("href") === "") {
        e.preventDefault();
        alert(
          "👑 PHARO SHAVE ritual unlocked — Your kingly tube awaits. (Demo version)",
        );
      }
    });
  });

  // ==================== FIX FOR IOS 100vh ISSUE ====================
  function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  setVH();
  window.addEventListener("resize", setVH);
});
