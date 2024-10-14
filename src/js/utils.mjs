export default class utils {
    constructor(key) {
        this.key = key
    }

    setStorage(data) {
        localStorage.setItem(this.key, data);
    }

    getStorage() {
        const data = localStorage.getItem(this.key);
        return JSON.parse(data)
    }
}