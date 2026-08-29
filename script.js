(function () {
  "use strict";

  const newsletter = document.querySelector("[data-newsletter-form]");
  if (newsletter) {
    newsletter.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = newsletter.querySelector("[data-form-message]");
      if (message) message.textContent = "Thanks — subscriptions will open soon.";
    });
  }
})();
