import Images from "../metier/Images.js";
import Memes from "../metier/Memes.js";
import Meme from "../metier/Meme.js";
import ADR_REST, { RESSOURCES_NAMES } from "../config/constante.js";

class Storage {
  private baseRestUrl;
  private onlineState = false;
  images = new Images();
  private promiseImages?: Promise<Images | null> = undefined;
  memes = new Memes();
  private promiseMeme?: Promise<Memes | null> = undefined;
  get promiseImage() {
    return this.promiseImages;
  }
  get promiseMemes() {
    return this.promiseMeme;
  }
  set promiseMemes(value) {
    this.promiseMeme = value;
  }
  // set baseRestUrl(value) {
  //   this.#baseRestUrl = value;
  // }

  constructor(baseRestUrl = ADR_REST) {
    this.baseRestUrl = baseRestUrl;
    this.initStorage();
  }
  ononlinechange() {}
  initStorage() {
    window.addEventListener("offline", (evt) => {
      this.onlineState = false;
    });
    window.addEventListener("online", (evt) => {
      this.onlineState = true;
      this.ononlinechange();
    });
  }
  lodMemes() {
    this.promiseMeme = Promise.race([
      this.getLocalMemes(),
      this.getfetchMemes(),
    ]).then((r) => {
      return this.memes;
    });
    return this.promiseMeme;
  }
  lodImages() {
    this.promiseImages = Promise.race([
      this.getLocalImages(),
      this.getfetchImages(),
    ]).then((r) => {
      return this.images;
    });
    return this.promiseImages;
  }
  private getLocalMemes() {
    return new Promise((resolve, rejected) => {
      if (!this.onlineState) {
        let ms = localStorage.getItem("memes");
        if (null === ms) {
        /*  modal.show(
            "erreur Localstorage",
            "impossible d'acceder aux données",
            () => {}
          );*/
          rejected(null);
           return ;
        }
        const memesListFromLS = JSON.parse(ms);
        if (!Array.isArray(memesListFromLS)) {
          //modal.show("erreur Localstorage", "data corrompus", () => {});
          rejected(null);
          return;
        }
        this.memes.splice(0);

        memesListFromLS.map((m) => {
          this.memes.push(new Meme(m));
        });
        resolve(this.memes);
      } else {
        rejected(null);
      }
    });
  }
  private getfetchMemes() {
    return fetch(`${this.baseRestUrl}/${RESSOURCES_NAMES.memes}`)
      .then((r) => r.json())
      .then((r) => {
        localStorage.setItem("memes", JSON.stringify(r));
        this.memes.splice(0);
        r.map((m: any) => {
          this.memes.push(new Meme(m));
        });
        return this.memes;
      });
  }
  private getLocalImages() {
    return new Promise((resolve, rejected) => {
      if (!this.onlineState) {
        let ms = localStorage.getItem("images");

        if (null === ms) {
         /* modal.show(
            "erreur Localstorage",
            "impossible d'acceder aux données",
            (x: string) => {
              return undefined;
            },
            undefined
          );*/
          rejected(null);
          return ;
        }
        const imagesListFromLS = JSON.parse(ms);
        if (!Array.isArray(imagesListFromLS)) {
         // modal.show("erreur Localstorage", "data corrompus", () => {});
          rejected(null);
          return;
        }
        if (imagesListFromLS.length == 0) {
          rejected(null);
        }
        this.images.splice(0);
        this.images.push(...imagesListFromLS);

        resolve(this.images);
      } else {
        rejected(null);
      }
    });
  }
  private getfetchImages() {
    return fetch(`${this.baseRestUrl}/${RESSOURCES_NAMES.images}`)
      .then((r) => r.json())
      .then((r) => {
        localStorage.setItem("images", JSON.stringify(r));
        this.images.splice(0);
        this.images.push(...r);
        return this.images;
      });
  }
}
