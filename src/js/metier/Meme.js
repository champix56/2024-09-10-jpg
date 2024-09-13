import REST_ADR, { RESSOURCES_NAMES } from "../config/constante.js";
import { images } from "./Images.js";
export default class Meme {
  id;
  titre = "";
  text = "";
  x = 0;
  y = 0;
  fontWeight = 500;
  fontSize = 12;
  underline = false;
  italic = true;
  imageId = -1;
  color = "#0";
  frameSizeX = 0;
  frameSizeY = 0;
  constructor(memeFromJSON) {
    if (memeFromJSON !== undefined) {
      Object.assign(this, memeFromJSON);
    }
  }
  save() {
    const promise = fetch(
      `${REST_ADR}${RESSOURCES_NAMES.memes}${
        undefined !== this.id ? `/${this.id}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: undefined !== this.id ? "PUT" : "POST",
        body: JSON.stringify(this),
      }
    ).then((r) => r.json()).then((r) =>{ Object.assign(this, r); return this;});
    return promise;
  }
  static load(id) {
    return fetch(`${REST_ADR}${RESSOURCES_NAMES.memes}/${id}`)
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          console.log("REST404 : meme not found at adr:"+ r.url);
          return undefined;
        }
      })
      .then((r) => {
        if (r !== undefined) {
          const responseObject = r;
          return new Meme(responseObject);
        }
        return undefined;
      });
  }
  getImageInMeme() {
    return images.findImageById(this.imageId);
  }
}
