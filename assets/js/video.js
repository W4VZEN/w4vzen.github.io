
document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     1. MENÚ HAMBURGUESA
  ===================================== */

  const hamburger = document.getElementById("hamburger");
  const navWrapper = document.getElementById("navWrapper");

  if (hamburger && navWrapper) {

    const openMenu = () => {
      navWrapper.classList.add("active");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Cerrar menú");
      hamburger.innerHTML = '<i class="fas fa-times"></i>';
    };

    const closeMenu = () => {
      navWrapper.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Abrir menú");
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    };

    hamburger.addEventListener("click", event => {
      event.stopPropagation();

      if (navWrapper.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", event => {
      if (
        navWrapper.classList.contains("active") &&
        !navWrapper.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeMenu();
      }
    });

    navWrapper.querySelectorAll(".menu a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) closeMenu();
    });
  }


  /* =====================================
     2. ACCESIBILIDAD
  ===================================== */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =====================================
     3. PREPARAR TÍTULOS
     REVELADO LETRA POR LETRA
  ===================================== */

  const sectionTitles = document.querySelectorAll(
    ".section-title"
  );

  function prepareTitle(title) {

    if (title.dataset.animated === "true") return;

    const originalText = title.textContent.trim();

    if (!originalText) return;

    title.setAttribute("aria-label", originalText);

    const visualContent = document.createElement("span");

    visualContent.setAttribute("aria-hidden", "true");

    let characterIndex = 0;

    [...originalText].forEach(character => {

      if (character === " ") {
        visualContent.appendChild(
          document.createTextNode(" ")
        );
        return;
      }

      const mask = document.createElement("span");
      const inner = document.createElement("span");

      mask.className = "char-mask";
      inner.className = "char-inner";

      inner.textContent = character;

      inner.style.setProperty(
        "--char-index",
        characterIndex
      );

      mask.appendChild(inner);
      visualContent.appendChild(mask);

      characterIndex++;

    });

    title.textContent = "";
    title.appendChild(visualContent);

    title.dataset.animated = "true";
  }

  sectionTitles.forEach(prepareTitle);


  /* =====================================
     4. SISTEMA DE OBSERVACIÓN
     INTERSECTION OBSERVER
  ===================================== */

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );


  function observeElement(element) {

    if (!element) return;

    if (reducedMotion) {
      element.classList.add("is-visible");
      return;
    }

    observer.observe(element);
  }


  /* =====================================
     5. TÍTULOS DE SECCIÓN
  ===================================== */

  sectionTitles.forEach(observeElement);


  /* =====================================
     6. BIO
  ===================================== */

  document.querySelectorAll(".bio-section").forEach(
    observeElement
  );

  document.querySelectorAll(".bio-content").forEach(element => {

    element.classList.add("motion-item");

    observeElement(element);

  });

  document.querySelectorAll(".linkedin-profile-link").forEach(element => {

    element.classList.add("motion-item");

    element.style.setProperty(
      "--motion-delay",
      "180ms"
    );

    observeElement(element);

  });


  /* =====================================
     7. VIDEO
  ===================================== */

  document.querySelectorAll(".video-container").forEach(
    observeElement
  );


  /* =====================================
     8. MÚSICA
  ===================================== */

  document.querySelectorAll(".music-image").forEach(
    observeElement
  );

  document.querySelectorAll(".music-content").forEach(element => {

    element.classList.add("motion-item");

    element.style.setProperty(
      "--motion-delay",
      "150ms"
    );

    observeElement(element);

  });


  /* =====================================
     9. SHOPS
     TARJETAS ESCALONADAS
  ===================================== */

  document.querySelectorAll(
    ".shop-grid .release-card"
  ).forEach((element, index) => {

    element.style.setProperty(
      "--motion-delay",
      `${index * 150}ms`
    );

    observeElement(element);

  });


  /* =====================================
     10. FANS / NEWSLETTER
  ===================================== */

  document.querySelectorAll(".section-sub").forEach(element => {

    element.classList.add("motion-item");

    observeElement(element);

  });

  document.querySelectorAll(".newsletter-wrapper").forEach(element => {

    element.classList.add("motion-item");

    element.style.setProperty(
      "--motion-delay",
      "150ms"
    );

    observeElement(element);

  });


  /* =====================================
     11. ACTIVAR ANIMACIONES
  ===================================== */

  if (!reducedMotion) {

    document.body.classList.add("animations-ready");

  } else {

    document.querySelectorAll(
      ".section-title, .bio-section, .video-container, " +
      ".music-image, .release-card, .motion-item"
    ).forEach(element => {

      element.classList.add("is-visible");

    });

  }


  /* =====================================
     12. PARALLAX BACKGROUND
     SISTEMA ORIGINAL CONSERVADO
  ===================================== */

  const background = document.querySelector(
    ".parallax-background"
  );

  if (background) {

    const imageURL = "/assets/img/fondo-escritorio.webp";
    const image = new Image();

    image.decoding = "async";
    image.fetchPriority = "high";

    let imageReady = false;
    let animationFrame = null;

    let maxTravel = 0;
    let currentPosition = 0;
    let targetPosition = 0;

    let lastViewportWidth = 0;
    let lastViewportHeight = 0;

    const parallaxLayer = document.createElement("div");

    Object.assign(parallaxLayer.style, {
      position: "absolute",
      top: "0",
      left: "50%",
      backgroundImage: `url("${imageURL}")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      willChange: "transform"
    });

    background.appendChild(parallaxLayer);


    /* ---------------------------------
       CALCULAR DIMENSIONES
    --------------------------------- */

    function calculateParallax() {

      if (!imageReady) return;

      const viewportWidth =
        document.documentElement.clientWidth;

      const viewportHeight =
        background.clientHeight;

      const isMobile = viewportWidth <= 1100;

      const extraHeight = isMobile ? 1.20 : 1.25;

      const requiredHeight =
        viewportHeight * extraHeight;

      const scale = Math.max(
        viewportWidth / image.naturalWidth,
        requiredHeight / image.naturalHeight
      );

      const renderedWidth =
        image.naturalWidth * scale;

      const renderedHeight =
        image.naturalHeight * scale;

      parallaxLayer.style.width =
        `${renderedWidth}px`;

      parallaxLayer.style.height =
        `${renderedHeight}px`;

      parallaxLayer.style.backgroundSize =
        `${renderedWidth}px ${renderedHeight}px`;

      maxTravel = reducedMotion ? 0 : Math.max(
        0,
        renderedHeight - viewportHeight
      ) * 0.65;

      currentPosition = Math.min(
        Math.max(currentPosition, 0),
        maxTravel
      );

      parallaxLayer.style.transform =
        `translate3d(-50%, ${-currentPosition}px, 0)`;

      lastViewportWidth = viewportWidth;
      lastViewportHeight = viewportHeight;

      updateTarget();

    }


    /* ---------------------------------
       POSICIÓN OBJETIVO
    --------------------------------- */

    function updateTarget() {

      if (!imageReady) return;

      if (reducedMotion) {
        targetPosition = 0;
        return;
      }

      const scrollPosition = window.scrollY;

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight -
        window.innerHeight
      );

      const progress = Math.min(
        1,
        Math.max(0, scrollPosition / maxScroll)
      );

      targetPosition = progress * maxTravel;

      startAnimation();

    }


    /* ---------------------------------
       MOVIMIENTO SUAVE
    --------------------------------- */

    function animateParallax() {

      const difference =
        targetPosition - currentPosition;

      currentPosition += difference * 0.16;

      if (
        Math.abs(difference) < 0.3 ||
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {

        currentPosition = targetPosition;

      }

      parallaxLayer.style.transform =
        `translate3d(-50%, ${-currentPosition}px, 0)`;

      if (currentPosition !== targetPosition) {

        animationFrame =
          requestAnimationFrame(animateParallax);

      } else {

        animationFrame = null;

      }

    }


    function startAnimation() {

      if (animationFrame === null) {

        animationFrame =
          requestAnimationFrame(animateParallax);

      }

    }


    /* ---------------------------------
       CARGAR IMAGEN
    --------------------------------- */

    image.onload = () => {

      imageReady = true;

      calculateParallax();

    };

    image.onerror = () => {

      console.warn(
        "Error al cargar el fondo Parallax."
      );

    };

    image.src = imageURL;


    /* ---------------------------------
       EVENTOS
    --------------------------------- */

    window.addEventListener(
      "scroll",
      updateTarget,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => {

        const width =
          document.documentElement.clientWidth;

        const height =
          background.clientHeight;

        if (
          width !== lastViewportWidth ||
          Math.abs(height - lastViewportHeight) > 80
        ) {

          requestAnimationFrame(calculateParallax);

        }

      },
      { passive: true }
    );

    window.addEventListener(
      "orientationchange",
      () => {

        requestAnimationFrame(calculateParallax);

      }
    );

  }

});
