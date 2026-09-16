(function () {
  "use strict";

  // Beehiiv inserts its form asynchronously; give the frame an accessible name.
  const embed = document.querySelector(".beehiiv-embed");
  if (!embed) return;

  function nameForm() {
    const frame = embed.querySelector("iframe");
    if (!frame) return false;
    if (!frame.getAttribute("title")) {
      frame.setAttribute("title", "Driveway Avenue email subscription form");
    }
    return true;
  }

  if (nameForm()) return;
  const observer = new MutationObserver(() => {
    if (nameForm()) observer.disconnect();
  });
  observer.observe(embed, { childList: true, subtree: true });
})();
