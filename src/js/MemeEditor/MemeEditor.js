import { images } from "../metier/Images.js";
import Meme from "../metier/Meme.js";

export default class MemeEditor {
  #domNode = undefined;
  #promise = undefined;
  #meme = undefined;
  #svgTmpimage = undefined;
  #handleNumberChange = (evt) => {
    this.#meme[evt.target.name] = Number(evt.target.value);
    this.#reloadView();
  };
  #handleStringChange = (evt) => {
    this.#meme[evt.target.name] = evt.target.value;
    this.#reloadView();
  };
  #handleCheckedChange = (evt) => {
    this.#meme[evt.target.name] = evt.target.checked;
    this.#reloadView();
  };
  #addFormEvents = () => {
    this.#domNode.querySelector("form").addEventListener("submit", (evt) => {
      evt.preventDefault();
      console.log("%c%s", "color:red;font-size:32pt", "Formulaire valider");
    });
    const inputs = this.#domNode.querySelectorAll("input, select");
    inputs.forEach((input) => {
      switch (input.name) {
        case "font-size":
        case "x":
        case "y":
        case "imageId":
          input.addEventListener("change", this.#handleNumberChange);
          break;
        case "underline":
          input.addEventListener("change", this.#handleCheckedChange);
          break;
        default:
          input.addEventListener("change", this.#handleStringChange);
          break;
      }
    });
  };
  #reloadView = () => {
    const svg = this.#domNode.querySelector("svg");
    const t = svg.querySelector("text");
    /*t.x = this.#meme.x;
    t.y = this.#meme.y;*/
    t.attributes["x"].value = this.#meme.x;
    t.attributes["y"].value = this.#meme.y;
    t.attributes["font-size"].value = this.#meme.fontSize;
    t.attributes["font-weight"].value = this.#meme.fontWeight;
    t.attributes["fill"].value = this.#meme.color;
    t.attributes["text-decoration"].value = this.#meme.underline
      ? "underline"
      : "normal";

    t.innerHTML = this.#meme.text;
    const img = this.#meme.getImageInMeme();
    svg.attributes["viewBox"].value = `0 0 ${
      undefined !== img ? img.w : 1000
    } ${undefined !== img ? img.h : 1000}`;
    const svgImage = svg.querySelector("image");
    if (img) {
      svgImage.style.display = "block";
      svgImage.attributes["xlink:href"].value = img.url;
    } else svgImage.style.display = "none";
  };
  loadMeme = (meme) => {
    this.#meme = meme;
    this.#domNode.querySelector("input[name=text]").value = meme.text;
    this.#domNode.querySelector("input[name=x]").value = meme.x;
    this.#domNode.querySelector("input[name=y]").value = meme.y;
    this.#domNode.querySelector("select[name=imageId]").value = meme.imageId;
    this.#domNode.querySelector("input[name=fontWeight]").value =
      meme.fontWeight;
    this.#domNode.querySelector("input[name=fontSize]").value = meme.fontSize;
    this.#domNode.querySelector("input[name=color]").value = meme.color;
    this.#domNode.querySelector("input[name=titre]").value = meme.titre;
    this.#domNode.querySelector("input[name=italic]").value =
      meme.italic.toString();
    this.#domNode.querySelector("input[name=underline]").checked =
      meme.underline;
      this.#reloadView();
  };
  #loadSelectImages = () => {
    const select = this.#domNode.querySelector("select");
    const optionModel = select.querySelector("option");
    select.innerHTML = "";
    select.appendChild(optionModel);
    images.map((img) => {
      const optClone = optionModel.cloneNode(true);
      optClone.value = img.id;
      optClone.innerHTML = img.name;
      select.appendChild(optClone);
    });
  };
  /**
   * chargement de la section de page pour editeur de meme
   * @param {Meme?} meme meme en cours, si undefined, meme = new Meme()
   */
  loadEditor(meme = new Meme()) {
    if (this.#promise === undefined) {
      this.#promise = fetch("/templates/MemeEditor/MemeEditor.html")
        .then((r) => r.text())
        .then((r) => {
          const d = document.createElement("div");
          d.innerHTML = r;
          this.#domNode = d.firstChild;
          this.#svgTmpimage = d.querySelector("svg image");
          this.#addFormEvents();
          return r;
        });
    }
    this.#promise = this.#promise.then(() => {
      const main = document.querySelector("#main");
      main.innerHTML = "";
      main.appendChild(this.#domNode);
    });
    Promise.all([images.promise, this.#promise]).then((r) => {
      this.#loadSelectImages();
      this.loadMeme(meme);
    });
  }
}
