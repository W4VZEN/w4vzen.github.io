
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
  ===================================== */

  const background = document.querySelector(".parallax-background");

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


    /* =====================================
       CALCULAR DIMENSIONES
    ===================================== */

    function calculateParallax() {

      if (!imageReady) return;

      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = background.clientHeight;

      const isMobile = viewportWidth <= 1100;

      // Menos altura adicional para reducir el zoom.
      const extraHeight = isMobile ? 1.20 : 1.25;

      const requiredHeight = viewportHeight * extraHeight;

      const scale = Math.max(
        viewportWidth / image.naturalWidth,
        requiredHeight / image.naturalHeight
      );

      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;

      parallaxLayer.style.width = `${renderedWidth}px`;
      parallaxLayer.style.height = `${renderedHeight}px`;

      parallaxLayer.style.backgroundSize =
        `${renderedWidth}px ${renderedHeight}px`;

      // Limitar el recorrido vertical.
      maxTravel = Math.max(
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


    /* =====================================
       POSICIÓN OBJETIVO
    ===================================== */

    function updateTarget() {

      if (!imageReady) return;

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


    /* =====================================
       MOVIMIENTO SUAVE
    ===================================== */

   
function animateParallax() {

  const difference = targetPosition - currentPosition;

  currentPosition += difference * 0.16;

  // Evitar que quede una diferencia residual al llegar al final.
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

    animationFrame = requestAnimationFrame(animateParallax);

  } else {

    animationFrame = null;

  }

}



    function startAnimation() {

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(animateParallax);
      }

    }


    /* =====================================
       CARGAR IMAGEN
    ===================================== */

    image.onload = () => {

      imageReady = true;

      calculateParallax();

    };

    image.onerror = () => {

      console.warn("Error al cargar el fondo Parallax.");

    };

    image.src = imageURL;


    /* =====================================
       EVENTOS
    ===================================== */

    window.addEventListener(
      "scroll",
      updateTarget,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => {

        const width = document.documentElement.clientWidth;
        const height = background.clientHeight;

        // Evitar recalcular por cambios irrelevantes.
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
