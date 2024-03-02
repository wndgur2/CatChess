export default class Sound {
    static beep = new Audio("/audio/clog.mp3");
    static playBeep() {
        Sound.beep.currentTime = 0;
        Sound.beep.play();
    }
}
