import Meme from "../metier/Meme.js";

export default class MemeEditor {
  currentMeme = new Meme();
  #domNode = undefined;
  #promise = undefined;
  #meme = undefined;
  //   #onformsubmit = (evt) => {
  //     evt.preventDefault();
  //   };
  #addFormEvents = () => {
    this.#domNode.querySelector("form").addEventListener("submit", (evt) => {
      evt.preventDefault();
      console.log("%c%s", "color:red;font-size:32pt", "Formulaire valider");
    });
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
    this.#domNode.querySelector("input[name=italic]").value = meme.italic.toString();
    this.#domNode.querySelector("input[name=underline]").checked =
      meme.underline;
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
          this.#domNode = d;
          this.#addFormEvents();
          return r;
        });
    }
    this.#promise.then(() => {
      this.loadMeme(meme);
      const main = document.querySelector("#main");
      main.innerHTML = "";
      main.append(...this.#domNode.children);
    });
  }
}
