import { images } from "../metier/Images.js";
import { memes } from "../metier/Memes.js";
export default class MemeThumbnail {
  #promise = undefined;
  #domNode = undefined;
  constructor() {}
  loadTemplate(params, eventBinder) {
    if (this.#promise === undefined) {
      this.#promise = fetch("templates/MemeThumbnail/MemeThumbnail.html")
        .then((r) => r.text())
        .then((r) => {
          const d = document.createElement("div");
          d.innerHTML = r;
          this.#domNode = d.firstChild;
          return r;
        })
        // .then(() => {
        //   const main = document.querySelector("#main");
        //   main.innerHTML = "";
        //   main.appendChild(this.#domNode);
        //   return this.#domNode;
        // });
    }
    this.#promise = this.#promise.then(() => {
      const main = document.querySelector("#main");
      main.innerHTML = "";
      main.appendChild(this.#domNode);
    });

    const promisesToWait = [this.#promise, images.promise, memes.promise];
    Promise.all(promisesToWait).then((r) => {
      this.constructThumbnail();
      eventBinder(this.#domNode);
    });
  }
  constructThumbnail = () => { 
    this.#domNode.querySelectorAll(".meme-thumbnail-meme:not(#meme-)").forEach(e=>e.remove())
    const model = this.#domNode.querySelector("#meme-");
   
    memes.map((m) => {
      const clonedmodel = model.cloneNode(true);
      clonedmodel.id+=m.id;
      clonedmodel.querySelector("a").href = "/meme/" + m.id;
      clonedmodel.querySelector(".title-link").innerHTML = m.titre;
      const svg = clonedmodel.querySelector("svg");
      const t = svg.querySelector("text");
      /*t.x = m.x;
        t.y = m.y;*/
      t.attributes["x"].value = m.x;
      t.attributes["y"].value = m.y;
      t.attributes["font-size"].value = m.fontSize;
      t.attributes["font-weight"].value = m.fontWeight;
      t.attributes["fill"].value = m.color;
      t.attributes["text-decoration"].value = m.underline
        ? "underline"
        : "normal";

      t.innerHTML = m.text;
      const img = m.getImageInMeme();
      svg.attributes["viewBox"].value = `0 0 ${
        undefined !== img ? img.w : 1000
      } ${undefined !== img ? img.h : 1000}`;
      const svgImage = svg.querySelector("image");
      if (img) {
        svgImage.style.display = "block";
        svgImage.attributes["xlink:href"].value = img.url;
      } else svgImage.style.display = "none";

      clonedmodel.style.display = "block";
      this.#domNode.appendChild(clonedmodel);
    });
  };
}
