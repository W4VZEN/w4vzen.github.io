document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const navWrapper = document.getElementById("navWrapper");

  /* ===========================
     MENU HAMBURGUESA
  =========================== */

  if (hamburger && navWrapper) {

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navWrapper.classList.toggle("active");

    });

    document.addEventListener("click", (e) => {
      if (!navWrapper.contains(e.target) && !hamburger.contains(e.target)) {
        navWrapper.classList.remove("active");
    
      }
    });
  }

});
