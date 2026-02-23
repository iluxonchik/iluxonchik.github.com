(() => {
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sectionCards = Array.from(document.querySelectorAll(".section-card"));

  const setupCollapsibleSections = () => {
    sectionCards.forEach((card) => {
      const button = card.querySelector(".fold-btn");
      const body = card.querySelector(".section-body");
      if (!button || !body) return;

      const setExpandedState = (expanded) => {
        button.setAttribute("aria-expanded", String(expanded));
        button.textContent = expanded ? ">" : "v";
        card.classList.toggle("is-collapsed", !expanded);
        card.classList.toggle("is-expanded", expanded);

        if (reduceMotion) {
          body.style.maxHeight = expanded ? "none" : "0px";
          return;
        }

        if (expanded) {
          body.style.maxHeight = `${body.scrollHeight}px`;
        } else {
          body.style.maxHeight = `${body.scrollHeight}px`;
          requestAnimationFrame(() => {
            body.style.maxHeight = "0px";
          });
        }
      };

      body.addEventListener("transitionend", () => {
        if (!card.classList.contains("is-collapsed")) {
          body.style.maxHeight = "none";
        }
      });

      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        setExpandedState(!expanded);
      });

      setExpandedState(true);
    });
  };

  const setupQrModal = () => {
    const modal = document.querySelector("[data-qr-modal]");
    const openBtn = document.querySelector("[data-open-qr]");
    if (!modal || !openBtn) return;

    const closeTargets = Array.from(modal.querySelectorAll("[data-close-qr]"));
    const panel = modal.querySelector(".qr-panel");
    let lastActive = null;

    const openModal = () => {
      lastActive = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const closeBtn = modal.querySelector(".qr-close");
      if (closeBtn instanceof HTMLElement) {
        closeBtn.focus();
      }
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lastActive instanceof HTMLElement) {
        lastActive.focus();
      } else if (openBtn instanceof HTMLElement) {
        openBtn.focus();
      }
    };

    openBtn.addEventListener("click", openModal);
    closeTargets.forEach((target) => {
      target.addEventListener("click", closeModal);
    });

    if (panel) {
      panel.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  };

  setupCollapsibleSections();
  setupQrModal();
})();
