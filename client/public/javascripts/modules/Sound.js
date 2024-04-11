export default class Sound {
    static activated = false;
    static taps = [];
    static playClick() {
        const randIdx = Math.floor(Math.random() * 7);
        Sound.taps[randIdx].play();
    }

    static mute() {
        this.bgm.volume = 0;
    }

    static unMute() {
        this.bgm.volume = 0.5;
    }
}

for (let i = 0; i < 7; i++) {
    Sound.taps.push(new Audio(`/audio/tap/tap${i}.wav`));
    Sound.taps[i].volume = 0.4;
}
