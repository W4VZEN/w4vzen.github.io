
document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     MENÚ HAMBURGUESA
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

    hamburger.addEventListener("click", (event) => {
      event.stopPropagation();

      if (navWrapper.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) {
        closeMenu();
      }
    });
  }


  /* =====================================
     PARALLAX BACKGROUND
     IMÁGENES RESPONSIVE
     MOVIMIENTO SUAVE CON INERCIA
  ===================================== */

  const background = document.querySelector(".parallax-background");

  if (background) {

    const mobileQuery = window.matchMedia("(max-width: 1100px)");

    const heroVideo = document.querySelector(".hero-video video");

    let image = new Image();
    let imageReady = false;
    let currentImageURL = "";

    let maxTravel = 0;

    let currentPosition = 0;
    let targetPosition = 0;

    let animationFrame = null;
    let lastFrameTime = 0;

    let baseWidth = window.innerWidth;
    let baseHeight = window.innerHeight;

    const smoothing = 0.045;


    /* =====================================
       ACTUALIZAR POSTER DEL HERO
    ===================================== */

    function updateHeroPoster() {

      if (!heroVideo) return;

      heroVideo.poster = mobileQuery.matches
        ? "/assets/img/fondo-movil.webp"
        : "/assets/img/fondo-escritorio.webp";

    }


    /* =====================================
       CALCULAR TAMAÑO DEL FONDO
    ===================================== */

    function calculateParallax() {

      if (!imageReady) return;

      baseWidth = window.innerWidth;
      baseHeight = window.innerHeight;

      const extraTravel = baseHeight * 0.35;

      const scale = Math.max(
        baseWidth / image.naturalWidth,
        (baseHeight + extraTravel) / image.naturalHeight
      );

      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;

      maxTravel = Math.max(
        0,
        renderedHeight - baseHeight
      );

      background.style.backgroundSize =
        `${renderedWidth}px ${renderedHeight}px`;

      updateTargetPosition();

    }


    /* =====================================
       POSICIÓN OBJETIVO
    ===================================== */

    function updateTargetPosition() {

      if (!imageReady) return;

      const scrollPosition = window.scrollY;

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - baseHeight
      );

      const progress = Math.min(
        Math.max(scrollPosition / maxScroll, 0),
        1
      );

      targetPosition = progress * maxTravel;

      if (animationFrame === null) {

        lastFrameTime = 0;

        animationFrame = requestAnimationFrame(animateParallax);

      }

    }


    /* =====================================
       MOVIMIENTO SUAVE
    ===================================== */

    function animateParallax(timestamp) {

      if (!lastFrameTime) {
        lastFrameTime = timestamp;
      }

      const deltaTime = Math.min(
        timestamp - lastFrameTime,
        32
      );

      lastFrameTime = timestamp;

      const factor = 1 - Math.pow(
        1 - smoothing,
        deltaTime / 16.67
      );

      currentPosition +=
        (targetPosition - currentPosition) * factor;

      if (Math.abs(targetPosition - currentPosition) < 0.15) {

        currentPosition = targetPosition;

        background.style.backgroundPosition =
          `center -${currentPosition.toFixed(2)}px`;

        animationFrame = null;

        return;
      }

      background.style.backgroundPosition =
        `center -${currentPosition.toFixed(2)}px`;

      animationFrame = requestAnimationFrame(animateParallax);

    }


    /* =====================================
       CARGAR IMAGEN SEGÚN CSS RESPONSIVE
    ===================================== */

    function loadBackgroundImage() {

      const backgroundImage =
        getComputedStyle(background).backgroundImage;

      const imageMatch = backgroundImage.match(
        /^url\(["']?(.*?)["']?\)$/
      );

      const imageURL = imageMatch
        ? imageMatch[1]
        : "";

      if (!imageURL) {
        console.warn("No se encontró la imagen del Parallax.");
        return;
      }

      if (imageURL === currentImageURL && imageReady) {
        calculateParallax();
        return;
      }

      currentImageURL = imageURL;

      imageReady = false;

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      currentPosition = 0;
      targetPosition = 0;
      lastFrameTime = 0;

      background.style.backgroundPosition = "center top";

      const newImage = new Image();

      image = newImage;

      image.decoding = "async";
      image.fetchPriority = "high";

      image.onload = () => {

        if (image !== newImage) return;

        imageReady = true;

        calculateParallax();

      };

      image.onerror = () => {

        console.warn(
          "No se pudo cargar la imagen de fondo Parallax:",
          imageURL
        );

      };

      image.src = imageURL;

    }


    /* =====================================
       INICIALIZACIÓN
    ===================================== */

    function initializeBackground() {

      updateHeroPoster();

      loadBackgroundImage();

    }

    initializeBackground();


    /* =====================================
       EVENTOS
    ===================================== */

    window.addEventListener(
      "scroll",
      updateTargetPosition,
      { passive: true }
    );

    window.addEventListener("resize", () => {

      if (window.innerWidth !== baseWidth ||
          window.innerHeight !== baseHeight) {

        calculateParallax();

      }

    });

    // Detectar cambio entre escritorio y móvil.
    mobileQuery.addEventListener("change", () => {

      initializeBackground();

    });

  }

});
