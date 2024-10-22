import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Header from "./Head.mjs";


const init = async () => {
    const header = new Header();
    const utilits = new utils();
    const sportfy = new Spotify();
    header.BuilderHeaderHtml();
    await sportfy.getAccessToken();
    await sportfy.GetPlayLists();


     // Add search event list
     const searchElement = document.querySelector("#btn-search")
     searchElement.addEventListener('click', async (e) => {
       const inputValue = document.querySelector("#search-input");
        const elementValue = inputValue.value;
         window.location.href = `/search/?q=${elementValue}`
     })

}

init()