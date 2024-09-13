import ADR_REST, { RESSOURCES_NAMES } from "../config/constante.js";

export default class Images extends Array {
  promise = undefined;
  constructor(arrayData) {
    super();
    if (arrayData!==undefined && arrayData.length > 0) {
      this.push(...arrayData);
    }
  }
  loadingAll() {
    this.splice(0);
    this.promise = fetch(`${ADR_REST}${RESSOURCES_NAMES.images}`).then((r) =>
      r.json()
    );
    this.promise.then((r) => {
      this.push(...r);
    });
  }
  /**
   * find meme by id value alias of find
   * @param {number} id id of meme to find
   */
  findImageById(id) {
    return super.find((e) => e.id === id);
  }
}
export const images = new Images();
images.loadingAll();
