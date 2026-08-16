// show hidden menu
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");
const header = document.getElementById("header");
const scrollUpButton = document.getElementById("scroll-up");
const themeButton = document.getElementById("theme-button");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// toggling menu
const openMenu = () => {
  if (!navMenu) return;
  navMenu.classList.add("show-menu");
  document.body.classList.add("menu-open");
};

const closeMenu = () => {
  if (!navMenu) return;
  navMenu.classList.remove("show-menu");
  document.body.classList.remove("menu-open");
};

if (navToggle) {
  navToggle.addEventListener("click", openMenu);
}

if (navClose) {
  navClose.addEventListener("click", closeMenu);
}

// hide menu after click on link
navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// skills-js
const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// qualification-js
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollY = window.scrollY + 140;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop;
    const sectionId = section.getAttribute("id");
    const activeLink = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);

    if (!activeLink) return;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      activeLink.classList.add("active-link");
      activeLink.setAttribute("aria-current", "page");
    } else {
      activeLink.classList.remove("active-link");
      activeLink.removeAttribute("aria-current");
    }
  });
};

// services modal
const updateThemeButton = (isDark) => {
  if (!themeButton) return;

  const icon = themeButton.querySelector(".theme-toggle__icon");
  const label = themeButton.querySelector(".theme-toggle__label");

  if (icon) {
    icon.innerHTML = isDark
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
  }

  if (label) {
    label.textContent = isDark ? "Light" : "Dark";
  }

  themeButton.setAttribute("aria-pressed", String(isDark));
};

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  updateThemeButton(isDark);
};

// slider
const selectedTheme = localStorage.getItem("selected-theme");
const fallbackTheme = "dark";
applyTheme(selectedTheme || fallbackTheme);

//   scroll section
window.addEventListener("scroll", scrollActive);
scrollActive();

// change background header
function scrollHeader() {
  if (!header) return;
  if (window.scrollY >= 24) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);
scrollHeader();

// show scroll top
function scrollUp() {
  if (!scrollUpButton) return;
  if (window.scrollY >= 560) scrollUpButton.classList.add("show-scroll");
  else scrollUpButton.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);
scrollUp();

// dark theme switch js
if (themeButton) {
  themeButton.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("selected-theme", nextTheme);
  });
}

// We obtain the current theme that the interface has by validating the dark-theme class
const ambientOne = document.querySelector(".ambient--one");
const ambientTwo = document.querySelector(".ambient--two");
const homeSection = document.getElementById("home");
const homeSpotlight = document.querySelector(".home__spotlight");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

const setStaticAmbient = () => {
  if (ambientOne) {
    ambientOne.style.transform = "translate3d(16vw, 14vh, 0) translate(-50%, -50%)";
  }

  if (ambientTwo) {
    ambientTwo.style.transform = "translate3d(84vw, 20vh, 0) translate(-50%, -50%)";
  }

  if (homeSpotlight) {
    homeSpotlight.style.transform = "translate3d(12%, 2rem, 0)";
  }
};

// We validate if the user previously chose a topic
if (!prefersReducedMotion.matches && hasFinePointer && ambientOne && ambientTwo) {
  const ambientState = {
    primary: {
      el: ambientOne,
      current: { x: window.innerWidth * 0.16, y: window.innerHeight * 0.18, vx: 0, vy: 0 },
      target: { x: window.innerWidth * 0.16, y: window.innerHeight * 0.18 },
      stiffness: 0.12,
      damping: 0.82,
    },
    secondary: {
      el: ambientTwo,
      current: { x: window.innerWidth * 0.84, y: window.innerHeight * 0.2, vx: 0, vy: 0 },
      target: { x: window.innerWidth * 0.84, y: window.innerHeight * 0.2 },
      stiffness: 0.09,
      damping: 0.84,
    },
  };

  const spotlightState = {
    current: { x: 60, y: 24, vx: 0, vy: 0 },
    target: { x: 60, y: 24 },
    stiffness: 0.11,
    damping: 0.8,
  };

  const springStep = (state) => {
    state.current.vx += (state.target.x - state.current.x) * state.stiffness;
    state.current.vy += (state.target.y - state.current.y) * state.stiffness;
    state.current.vx *= state.damping;
    state.current.vy *= state.damping;
    state.current.x += state.current.vx;
    state.current.y += state.current.vy;
  };

  const animateAmbient = () => {
    springStep(ambientState.primary);
    springStep(ambientState.secondary);
    ambientState.primary.el.style.transform = `translate3d(${ambientState.primary.current.x}px, ${ambientState.primary.current.y}px, 0) translate(-50%, -50%)`;
    ambientState.secondary.el.style.transform = `translate3d(${ambientState.secondary.current.x}px, ${ambientState.secondary.current.y}px, 0) translate(-50%, -50%)`;

    if (homeSpotlight && homeSection) {
      springStep(spotlightState);
      homeSpotlight.style.transform = `translate3d(${spotlightState.current.x}px, ${spotlightState.current.y}px, 0)`;
    }

    requestAnimationFrame(animateAmbient);
  };

  window.addEventListener("pointermove", (event) => {
    ambientState.primary.target.x = event.clientX;
    ambientState.primary.target.y = event.clientY;
    ambientState.secondary.target.x = window.innerWidth - event.clientX * 0.28;
    ambientState.secondary.target.y = 140 + event.clientY * 0.22;

    if (!homeSection || !homeSpotlight) return;

    const homeRect = homeSection.getBoundingClientRect();
    const nextX = clamp(event.clientX - homeRect.left - 180, -40, homeRect.width - 140);
    const nextY = clamp(event.clientY - homeRect.top - 180, -40, homeRect.height - 120);
    spotlightState.target.x = nextX;
    spotlightState.target.y = nextY;
  });

  window.addEventListener("resize", () => {
    ambientState.primary.target.x = window.innerWidth * 0.16;
    ambientState.primary.target.y = window.innerHeight * 0.18;
    ambientState.secondary.target.x = window.innerWidth * 0.84;
    ambientState.secondary.target.y = window.innerHeight * 0.2;
  });

  animateAmbient();
} else {
  setStaticAmbient();
}

// Activate / deactivate the theme manually with the button
const projectsRail = document.getElementById("projects-rail");
const projectsPrev = document.getElementById("projects-prev");
const projectsNext = document.getElementById("projects-next");
const projectsIndex = document.getElementById("projects-index");

if (projectsRail) {
  const projectItems = Array.from(projectsRail.querySelectorAll(".projects__item"));
  const spring = {
    raf: 0,
    velocity: 0,
    target: 0,
    lastTime: 0,
  };
  const drag = {
    active: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    samples: [],
  };

  let snapPoints = [];
  let activeProjectIndex = 0;

  const maxScroll = () => Math.max(0, projectsRail.scrollWidth - projectsRail.clientWidth);

  const formatIndex = (value) => String(value).padStart(2, "0");

  const project = (initialVelocity, decelerationRate = 0.998) => {
    return (initialVelocity / 1000) * (decelerationRate / (1 - decelerationRate));
  };

  const cancelSpring = () => {
    if (!spring.raf) return;
    cancelAnimationFrame(spring.raf);
    spring.raf = 0;
  };

  const getClosestIndex = (value = projectsRail.scrollLeft) => {
    if (!snapPoints.length) return 0;

    const max = maxScroll();
    if (value <= 4) return 0;
    if (value >= max - 4) return snapPoints.length - 1;

    return snapPoints.reduce(
      (closest, point, index) =>
        Math.abs(point - value) < Math.abs(snapPoints[closest] - value) ? index : closest,
      0
    );
  };

  const updateProjectState = () => {
    activeProjectIndex = getClosestIndex();

    projectItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === activeProjectIndex);
    });

    if (projectsIndex) {
      projectsIndex.textContent = `${formatIndex(activeProjectIndex + 1)} / ${formatIndex(projectItems.length)}`;
    }
  };

  const measureProjectRail = () => {
    if (!projectItems.length) return;
    const railRect = projectsRail.getBoundingClientRect();
    const viewportCenter = projectsRail.clientWidth / 2;

    snapPoints = projectItems.map((item) => {
      const itemLeft = item.getBoundingClientRect().left - railRect.left + projectsRail.scrollLeft;
      const itemCenter = itemLeft + item.clientWidth / 2;
      return clamp(itemCenter - viewportCenter, 0, maxScroll());
    });

    updateProjectState();
  };

  const nearestSnapPoint = (value) => {
    if (!snapPoints.length) return 0;

    return snapPoints.reduce((closest, point) =>
      Math.abs(point - value) < Math.abs(closest - value) ? point : closest
    );
  };

  const startSpring = (target, initialVelocity = 0) => {
    const nextTarget = clamp(target, 0, maxScroll());

    if (prefersReducedMotion.matches) {
      projectsRail.scrollLeft = nextTarget;
      updateProjectState();
      return;
    }

    cancelSpring();
    spring.target = nextTarget;
    spring.velocity = initialVelocity;
    spring.lastTime = performance.now();

    const frame = (now) => {
      const dt = Math.min((now - spring.lastTime) / 1000, 0.032);
      spring.lastTime = now;

      const displacement = spring.target - projectsRail.scrollLeft;
      const acceleration = displacement * 220 - spring.velocity * 30;
      spring.velocity += acceleration * dt;
      const nextValue = clamp(projectsRail.scrollLeft + spring.velocity * dt, 0, maxScroll());
      projectsRail.scrollLeft = nextValue;
      updateProjectState();

      if (Math.abs(displacement) < 0.5 && Math.abs(spring.velocity) < 6) {
        projectsRail.scrollLeft = spring.target;
        spring.raf = 0;
        updateProjectState();
        return;
      }

      spring.raf = requestAnimationFrame(frame);
    };

    spring.raf = requestAnimationFrame(frame);
  };

  const goToIndex = (index, velocity = 0) => {
    if (!snapPoints.length) return;
    const nextIndex = clamp(index, 0, snapPoints.length - 1);
    const target = snapPoints[nextIndex];

    if (velocity) {
      startSpring(target, velocity);
      return;
    }

    cancelSpring();
    projectsRail.scrollTo({
      left: target,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    updateProjectState();
  };

  const getVelocity = () => {
    const samples = drag.samples;
    if (samples.length < 2) return 0;

    const end = samples[samples.length - 1];
    let start = samples[0];

    for (let index = samples.length - 1; index >= 0; index -= 1) {
      if (end.time - samples[index].time > 120) {
        start = samples[Math.min(index + 1, samples.length - 1)];
        break;
      }
    }

    const deltaTime = (end.time - start.time) / 1000;
    if (!deltaTime) return 0;
    return (end.value - start.value) / deltaTime;
  };

  const endDrag = () => {
    if (!drag.active) return;

    drag.active = false;
    drag.pointerId = null;
    projectsRail.classList.remove("is-dragging");

    const releaseVelocity = getVelocity();
    const projectedEndpoint = projectsRail.scrollLeft + project(releaseVelocity);
    const target = nearestSnapPoint(projectedEndpoint);
    startSpring(target, releaseVelocity);
  };

  projectsRail.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;

    cancelSpring();
    drag.active = true;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startScroll = projectsRail.scrollLeft;
    drag.samples = [{ time: performance.now(), value: projectsRail.scrollLeft }];
    projectsRail.classList.add("is-dragging");
    projectsRail.setPointerCapture(event.pointerId);
  });

  projectsRail.addEventListener("pointermove", (event) => {
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const nextScroll = clamp(drag.startScroll - deltaX, 0, maxScroll());
    projectsRail.scrollLeft = nextScroll;
    drag.samples.push({ time: performance.now(), value: nextScroll });
    if (drag.samples.length > 12) drag.samples.shift();
    updateProjectState();
    event.preventDefault();
  });

  projectsRail.addEventListener("pointerup", endDrag);
  projectsRail.addEventListener("pointercancel", endDrag);
  projectsRail.addEventListener("lostpointercapture", endDrag);

  projectsRail.addEventListener("scroll", () => {
    if (drag.active) return;
    updateProjectState();
  });

  if (projectsPrev) {
    projectsPrev.addEventListener("click", () => {
      goToIndex(activeProjectIndex - 1);
    });
  }

  if (projectsNext) {
    projectsNext.addEventListener("click", () => {
      goToIndex(activeProjectIndex + 1);
    });
  }

  window.addEventListener("resize", measureProjectRail);
  measureProjectRail();
}
