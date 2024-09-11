import ADR_REST, { RESSOURCES_NAMES } from "../config/constante.js";
import Meme from "./Meme.js";
export default class Memes extends Array {
  constructor() {
    super();
  }
  loadingAll() {
    this.splice(0);
    fetch(`${ADR_REST}${RESSOURCES_NAMES.memes}`)
      .then((r) => r.json())
      .then((r) => {
        r.map((e) => {
          this.push(new Meme(e));
        });
      });
  }
  /**
   * find meme by id value alias of find
   * @param {number} id id of meme to find
   */
  findMemeById(id) {
    return super.find((e) => e.id === id);
  }
  find() {
    console.error('find interdit')
  }
}
window.memes = new Memes();
memes.loadingAll();
