
document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     MENÚ HAMBURGUESA
  =========================== */

  const hamburger = document.getElementById("hamburger");
  const navWrapper = document.getElementById("navWrapper");

  if (hamburger && navWrapper) {

    hamburger.addEventListener("click", (e) => {

      e.stopPropagation();

      const isActive = navWrapper.classList.toggle("active");

      hamburger.setAttribute("aria-expanded", isActive);

      hamburger.innerHTML = isActive
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';

    });

    document.addEventListener("click", (e) => {

      if (!navWrapper.contains(e.target) && !hamburger.contains(e.target)) {

        navWrapper.classList.remove("active");

        hamburger.setAttribute("aria-expanded", "false");

        hamburger.innerHTML = '<i class="fas fa-bars"></i>';

      }

    });

    // Cerrar al seleccionar una sección

    navWrapper.querySelectorAll(".menu a").forEach(link => {

      link.addEventListener("click", () => {

        navWrapper.classList.remove("active");

        hamburger.setAttribute("aria-expanded", "false");

        hamburger.innerHTML = '<i class="fas fa-bars"></i>';

      });

    });

  }


  

/* ===========================
   PARALLAX BACKGROUND
   DESKTOP + TABLET + MOBILE
=========================== */

const background = document.querySelector(".parallax-background");

if (background) {

  let ticking = false;

  function updateParallax() {

    const scrollPosition = window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = maxScroll > 0
      ? Math.min(Math.max(scrollPosition / maxScroll, 0), 1)
      : 0;

    const position = progress * 100;

    background.style.backgroundPosition =
      `center ${position}%`;

    ticking = false;
  }

  function requestParallaxUpdate() {

    if (!ticking) {

      window.requestAnimationFrame(updateParallax);
      ticking = true;

    }

  }

  window.addEventListener("scroll", requestParallaxUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestParallaxUpdate);

  window.addEventListener("orientationchange", requestParallaxUpdate);

  updateParallax();

}
