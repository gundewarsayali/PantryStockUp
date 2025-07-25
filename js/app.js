import router from "./routes.js";
import themeSwitcher from "./lib/theme-switcher.js";
import pantryAPI from "./api/pantry.mock.server.js";

router.start();

pantryAPI();

function initializeApp() {
  themeSwitcher();
}

document.addEventListener("DOMContentLoaded", initializeApp);
