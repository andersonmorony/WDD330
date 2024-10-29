export default class Footer {
    constructor() {
      this.elementId = "#footer"
    }
  
    BuilderFooterHtml() {
      const HTML = `<p>© Anderson Moroni Ramos. For "WWD 330 - Web Frontend Development II" purposes.</p> `;
  
      const footerElement = document.querySelector(this.elementId);
      footerElement.innerHTML = HTML
    }
  }
  