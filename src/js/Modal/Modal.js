function Modal() {
  var domModal = null;
  var onokclick = undefined;
  var oncancelclick = undefined;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/templates/Modal/Modal.html");

  /**
   * show callback
   * @param {string} title title of message
   * @param {string} okCallback text content
   * @param {any} okCallback callback on ok click
   * @param {Function|undefined} cancelCallbak callback on cancel click, define cancel button presence
   */
  this.show = function (title, message, okCallback, cancelCallbak=undefined) {
    // if(cancelCallbak===undefined)cancelCallbak=null;
    if (xhr.readyState !== XMLHttpRequest.DONE) {
      var modalthis = this;

      xhr.onreadystatechange = function (evt) {
        if (evt.target.readyState < XMLHttpRequest.DONE) {
          return;
        }
        if (evt.target.status >= 400) {
          console.log("error loading modal template");
          return;
        }

        var baseElement = document.createElement("div");
        baseElement.innerHTML = evt.target.responseText;
        domModal = baseElement.firstChild;
        console.log("declenchement du show apres recup par xhr fini");
        modalthis.show(title, message, okCallback, cancelCallbak);
      };
      xhr.send();
      console.log("envoie du xhr");
      return;
    }
    console.log("chargement contenu dom et evt pour montage fenetre", domModal);
    domModal.querySelector("#modal-header").innerHTML = title;
    domModal.querySelector("#modal-content").innerHTML = message;
    var buttons = domModal.querySelector("#modal-buttons");
    buttons.innerHTML += "";
    buttons
      .querySelector(".btn-info")
      .addEventListener("click", function (evt) {
        domModal.remove();
        okCallback();
      });
    var cancelButton = domModal.querySelector("#modal-buttons .btn-danger");

    if (undefined !== cancelCallbak) {
      cancelButton.style.display = "inline";
      cancelButton.addEventListener("click", function (evt) {
        domModal.remove();
        cancelCallbak();
      });
    } else {
      cancelButton.style.display = "none";
    }

    document.body.appendChild(domModal);
  };
  /**
   * close modal with no event treatments
   */
  this.close = function () {
    domModal.remove();
  };
}
var modal = new Modal();
