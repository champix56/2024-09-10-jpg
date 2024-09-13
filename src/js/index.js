import router from "./Routeur/Routeur.js";
import TemplateLoader from "./TemplateLoader/TemplateLoader.js";
import  '../styles/meme-editor.css'

document.addEventListener("DOMContentLoaded", () => {
  const navbarNode = document.querySelector("#navbar");
  new TemplateLoader("/templates/navbar/navbar.html", navbarNode).loadTemplate(
    undefined,
    router.routerLinkEventBinding
  );

  router.constructPage(document.querySelector("#main"));
});
window.router = router;
