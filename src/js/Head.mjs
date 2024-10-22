export default class Header {
  constructor() {
    this.elementId = "#menu"
  }

  BuilderHeaderHtml() {
    const HTML = `
        <nav class="menu">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/compare/">Compare Playlist</a></li>
                <li><a href="/favorite/">Favorite Songs</a></li>
            </ul>
        </nav>
        `;

    const headerElement = document.querySelector(this.elementId);
    headerElement.innerHTML = HTML
  }
}
