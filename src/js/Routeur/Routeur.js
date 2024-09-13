import MemeEditor from "../MemeEditor/MemeEditor.js";
import MemeThumbnail from "../MemeThumbnail/MemeThumbnail.js";
import TemplateLoader from "../TemplateLoader/TemplateLoader.js";

export const routerConfig = [
  {
    name: "meme",
    path: /meme(\/(?<id>\d+))?$/,
    title: "Edition de meme",
    manager: new MemeEditor(),
  },
  {
    name: "memes",
    path: /memes\/?$/,
    title: "liste des memes dans le serveur",
    manager: new MemeThumbnail(),
  },
  {
    name: "credits",
    path: /credits\/?$/,
    templateUrl: "templates/credits/credits.html",
    title: "remerciements",
  },
  {
    name: "default",
    template:
      "<h1>Bonjour &amp; bienvenue</h1><p>l'editeur de meme nouvelle generation en SVG</p>",
    title: "home",
  },
];

class Routeur {
  #mainWrapperDOM;
  constructor(mainWrapperDOM) {
    this.#mainWrapperDOM = mainWrapperDOM;
  }
  constructPage = (nodeToFill) => {
    this.#mainWrapperDOM = nodeToFill;
    let m;
    const selectedRoute = routerConfig.find((config) => {
      if (config.name === "default") return true;
      const regex = config.path;
      m = regex.exec(location.pathname);
      return m !== null;
    });
    console.log(selectedRoute);
    if (undefined !== selectedRoute.manager) {
      selectedRoute.manager.loadTemplate(m.groups, router.routerLinkEventBinding);
    } else if (undefined !== selectedRoute.templateUrl) {
      selectedRoute.manager = new TemplateLoader(
        selectedRoute.templateUrl,
        nodeToFill
      );
      selectedRoute.manager.loadTemplate(undefined, () => {});
    } else if (undefined !== selectedRoute.template) {
      this.#mainWrapperDOM.innerHTML = selectedRoute.template;
    }
  };
  /**
   * navigate to a pathName
   * @param {string} toPathurl pathName of url to load in page
   */
  navigate = (toPathurl) => {
    history.pushState(null, null, toPathurl);
    this.constructPage(this.#mainWrapperDOM);
  };
  /**
   * binding of link routable events
   * @param {HTMLElement} domNodeToBind
   */
  routerLinkEventBinding = (domNodeToBind) => {
    domNodeToBind.querySelectorAll("a").forEach((elem) => {
      elem.addEventListener("click", (evt) => {  
        evt.preventDefault();
        domNodeToBind
          .querySelectorAll("a.active")
          .forEach((e) => e.classList.remove("active"));
        evt.target.classList.add('active');
        this.navigate(evt.target.href);
      });
    });
  };
}
const router = new Routeur();
export default router;
