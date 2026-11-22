
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

    // Cerrar al hacer clic fuera del menú
    document.addEventListener("click", (event) => {

      if (
        navWrapper.classList.contains("active") &&
        !navWrapper.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeMenu();
      }

    });

    // Cerrar al seleccionar una sección
    navWrapper.querySelectorAll(".menu a").forEach(link => {

      link.addEventListener("click", closeMenu);

    });

    // Cerrar con Escape
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Restablecer al pasar a escritorio
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

  const parallaxLayer = document.createElement("div");

  Object.assign(parallaxLayer.style, {
    position: "absolute",
    top: "0",
    left: "50%",
    backgroundImage: `url("${imageURL}")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center top",
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

    // Margen adicional arriba y abajo
    const requiredHeight = viewportHeight * 1.7;

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

    // Espacio de seguridad para el movimiento
    maxTravel = Math.max(
      0,
      (renderedHeight - viewportHeight) / 2
    );

    currentPosition = Math.min(currentPosition, maxTravel);

    // Comenzar con imagen sobrante arriba y abajo
    parallaxLayer.style.transform =
      `translate3d(-50%, ${-maxTravel - currentPosition}px, 0)`;

    updateTarget();
  }


  /* =====================================
     POSICIÓN OBJETIVO
  ===================================== */

  function updateTarget() {

    const scrollPosition = window.scrollY;

    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    );

    const progress = Math.min(
      1,
      Math.max(0, scrollPosition / maxScroll)
    );

    targetPosition = progress * maxTravel;

    startAnimation();
  }


  /* =====================================
     MOVIMIENTO CON INERCIA
  ===================================== */

  function animateParallax() {

    const difference = targetPosition - currentPosition;

    currentPosition += difference * 0.16;

    if (Math.abs(difference) < 0.3) {
      currentPosition = targetPosition;
    }

    parallaxLayer.style.transform =
      `translate3d(-50%, ${-maxTravel - currentPosition}px, 0)`;

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

  // Recalcular solamente al cambiar orientación
  window.addEventListener(
    "orientationchange",
    () => {
      requestAnimationFrame(calculateParallax);
    }
  );

}



});


