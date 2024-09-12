import ADR_REST, { RESSOURCES_NAMES } from "../config/constante.js";
import Meme from "./Meme.js";
export default class Memes extends Array {
  promise = undefined;
  constructor() {
    super();
  }
  loadingAll() {
    this.splice(0);
    this.promise = fetch(`${ADR_REST}${RESSOURCES_NAMES.memes}`)
      .then((r) => r.json())
      .then((r) => {
        r.map((e) => {
          this.push(new Meme(e));
        });
      });
    return this.promise;
  }
  /**
   * find meme by id value alias of find
   * @param {number} id id of meme to find
   */
  findMemeById(id) {
    return super.find((e) => e.id === id);
  }
  find() {
    console.error("find interdit");
  }
}
export const memes = new Memes();
memes.loadingAll();
