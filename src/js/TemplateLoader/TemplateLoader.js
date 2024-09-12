export default class TemplateLoader {
  templateuri = "";
  domNodeWhereMount = "";
  domNodeLoaded = undefined;
  promise = undefined;
  constructor(templateuri, domNodeWhereMount) {
    this.templateuri = templateuri;
    this.domNodeWhereMount = domNodeWhereMount;
  }
  loadTemplate = (params,eventBinder) => {
    if (undefined === this.promise) {
      this.promise = fetch(this.templateuri)
        .then((r) => r.text())
        .then((r) => {
          this.domNodeLoaded = document.createElement("div");
          this.domNodeLoaded.innerHTML = r;
          this.domNodeLoaded=this.domNodeLoaded.firstChild
          eventBinder(this.domNodeLoaded);
          return r;
        });
    }
   return this.promise.then((r) => {
      this.domNodeWhereMount.innerHTML = "";
      this.domNodeWhereMount.appendChild(this.domNodeLoaded);
      return this.domNodeWhereMount;
    });
  };
}
export class MemeSVGViewer extends TemplateLoader {
  constructor(
    templateUri = "templates/MemeViever/MemeViever.html",
    domNodeWhereMount = document.querySelector("#main")
  ) {
    super(templateUri, domNodeWhereMount);
  }
  eventBinder() {}
  loadTemplate(params) {
    super.loadTemplate(params,this.eventBinder);
    // this.promise.then()
  }
}
