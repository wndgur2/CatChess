export default class Sound {
    static click = new Audio("/audio/click.mp3");
    static playClick() {
        Sound.click.currentTime = 0;
        this.click.volume = 0.5;
        Sound.click.play();
    }
}
