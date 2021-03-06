export class Song {
    // Internal IDs
    id: number = 0;
    ssId: number = 0;

    // About the song
    artist: string = "";
    featuring: string = "";
    composer : string = "";
    album: string = "";
    title: string = "";
    year: number = 0;

    // How to play
    capo: number = 0;
    tuning: string = "Standard";
    pick: boolean = true;
    lyrics: string = "";
    chords: string = "";
    tab: string = "";

    // Status
    active: boolean = false;
    suggestedBy: string = "drearyworlds";
}