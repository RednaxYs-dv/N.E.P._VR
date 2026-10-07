document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     1. TICKER DUPLICATION
     Makes the marquee loop smoothly
  =============================== */
  const tickerTrack = document.getElementById("ticker-track");

  if (tickerTrack) {
    const firstGroup = tickerTrack.querySelector(".ticker-group");

    if (firstGroup) {
      const clone = firstGroup.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      tickerTrack.appendChild(clone);
    }
  }

  /* ===============================
     2. ANIMATED COUNTERS
  =============================== */
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      counter.textContent = Math.floor(progress * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  /* ===============================
     3. DRILL CAM TIMER
  =============================== */
  const camTimer = document.getElementById("cam-timer");

  if (camTimer) {
    let seconds = 0;

    setInterval(() => {
      seconds += 1;

      const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");

      camTimer.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
  }

  /* ===============================
     4. DISPATCH FORM
  =============================== */
  const form = document.getElementById("dispatch-form");
  const reportField = document.getElementById("report");
  const charCount = document.getElementById("char-count");
  const identitySelect = document.getElementById("identity");
  const codenameBtn = document.getElementById("codename-btn");
  const formStatus = document.getElementById("form-status");

  if (reportField && charCount) {
    reportField.addEventListener("input", () => {
      charCount.textContent = reportField.value.length;
    });
  }

  const codenames = [
    "ASHFALL",
    "BACKDRAFT",
    "CINDER",
    "FIREWALL",
    "FLASHPOINT",
    "HALIGAN",
    "HYDRANT",
    "MARSHAL",
    "SCORCH",
    "SMOKEJACK",
    "SPARKPLUG",
    "THERMAL",
  ];

  if (codenameBtn && identitySelect && reportField) {
    codenameBtn.addEventListener("click", () => {
      const randomCodename =
        codenames[Math.floor(Math.random() * codenames.length)];

      identitySelect.value = "codename";
      reportField.value = `CALLSIGN: ${randomCodename}\n`;

      if (charCount) {
        charCount.textContent = reportField.value.length;
      }

      reportField.focus();
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const identity = identitySelect ? identitySelect.value : "anonymous";
      const report = reportField ? reportField.value.trim() : "";

      if (!report) {
        if (formStatus) {
          formStatus.textContent = "⚠ Report cannot be empty.";
          formStatus.style.color = "#ffb703";
        }
        return;
      }

      console.log("Dispatch report:", {
        identity,
        report,
        submittedAt: new Date().toISOString(),
      });

      if (formStatus) {
        formStatus.textContent = "✔ Signal transmitted. Stay low.";
        formStatus.style.color = "#39ff14";
      }

      form.reset();

      if (charCount) {
        charCount.textContent = "0";
      }
    });
  }

  /* ===============================
     5. ACTIVE NAV HIGHLIGHTING
  =============================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.remove("active");

          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      });
    },
    {
      rootMargin: "-40% 0px -50% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
});