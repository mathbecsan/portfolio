/* ── Filmmaking: film data ──────────────────────────────────────────────
 * One entry per film. The index page (/experience/filmmaking) lists them;
 * each gets a detail page at /experience/filmmaking/<slug>.
 * Media lives in /public/films/<slug>/:
 *   loop.mp4 + poster.jpg   silent preview loop shown on the index card
 *   still-N.jpg             frames from the final cut
 *   outtake-N.mp4/.jpg      discarded takes / bloopers (with sound)
 *   bts-N.jpg               behind-the-scenes photos
 *   scene-N.mp4/.jpg        short silent scene clips for the index mosaic
 * To add a film: drop its media in /public/films/<slug>/ and add an entry. */

export type Credit = { role: string; names: string[] };
export type Media = { src: string; caption: string };

export type Film = {
  slug: string;
  title: string;
  year: number;
  runtime: string;
  youtubeId: string;
  logline: string;        // one line for the index card
  synopsis: string;
  accent: string;
  loop: string;
  poster: string;
  details: { label: string; value: string }[];
  credits: Credit[];
  process: string[];      // short paragraphs about how it was made
  dedication?: string;    // optional line shown under the credits
  stills: Media[];
  outtakes: (Media & { poster: string })[];
  bts: Media[];
  scenes: (Media & { poster: string })[]; // short silent clips for the index mosaic
};

const base = (slug: string) => `/films/${slug}`;

export const FILMS: Film[] = [
  {
    slug: "overthinking",
    title: "Overthinking",
    year: 2026,
    runtime: "3 min 41 s",
    youtubeId: "BbxQi8cBGIA",
    logline: "A rehearsed moment, an elevator, and a script that slips away.",
    synopsis:
      "Dressed in his best suit and clutching a crumpled yellow note, a young man steps into an elevator, ready for a moment he has rehearsed a hundred times. But between the lobby and the third floor, confidence gives way to doubt. He practices every word, every glance, every smile, and none of them ever feels quite right. As the doors open and close on the moment he came for, he rides up and down, caught in a loop of his own making, never noticing that the script he has clung to all along has slipped from his hands and lies forgotten on the floor.",
    accent: "var(--bauhaus-blue)",
    loop: `${base("overthinking")}/loop.mp4`,
    poster: `${base("overthinking")}/poster.jpg`,
    details: [
      { label: "Title", value: "Overthinking" },
      { label: "Year", value: "2026" },
      { label: "Runtime", value: "3 min 41 s" },
      { label: "Country", value: "United States" },
      { label: "Produced by", value: "Arts Intensive Program, Stanford University" },
      { label: "Shooting format", value: "Digital, Full HD 1080p, 23.98 fps / color" },
      { label: "Camera", value: "Sony A7 III on tripod" },
      { label: "Post-production", value: "DaVinci Resolve (edit, color, sound, effects)" },
    ],
    credits: [
      { role: "A film by", names: ["Mathias Becerra", "Colin Paul Weis"] },
      { role: "Cast", names: ["Tania Claudia Castillo"] },
      { role: "Cinematography", names: ["Colin Paul Weis"] },
      { role: "Sound, video editing & effects", names: ["Mathias Becerra"] },
      { role: "Faculty advisors", names: ["Adam Tobin", "Claire Haughey"] },
      { role: "Music", names: ["“Slow Life” by Benjamin Lazzarus", "“Dawn of Change” by Roman Senyk (Bensound)"] },
      { role: "Special thanks", names: ["Kae Heller", "Haoyan Jiang", "Rishi Ravi", "Lionel Nielsen Humphreys", "Andrew Gio Kang", "Jorge Ramos", "Lilli Sperry Whelan"] },
    ],
    process: [
      "The whole film happens in two places: one elevator and the hallway outside it. Keeping the space that small kept the attention on the character's head, where the real story is.",
      "We shot on a tripod with a Sony A7 III, squeezed into the elevator car with the cast. Most of the coverage is close: the button panel, the floor display, the hands, the note, the back of a neck.",
      "In DaVinci Resolve the cut is built on repetition. The same floors, the same rehearsed smile, the same doors, until the payoff: the note on the floor. The cool steel-blue grade and the sound design carry the anxiety the character never says out loud.",
    ],
    stills: [
      { src: `${base("overthinking")}/still-1.jpg`, caption: "Stepping into the elevator" },
      { src: `${base("overthinking")}/still-2.jpg`, caption: "Rehearsing, again" },
      { src: `${base("overthinking")}/still-3.jpg`, caption: "The crumpled yellow note" },
      { src: `${base("overthinking")}/still-4.jpg`, caption: "Second thoughts" },
      { src: `${base("overthinking")}/still-5.jpg`, caption: "Waiting in the hallway" },
      { src: `${base("overthinking")}/still-6.jpg`, caption: "The script, forgotten" },
    ],
    outtakes: [
      { src: `${base("overthinking")}/outtake-1.mp4`, poster: `${base("overthinking")}/outtake-1.jpg`, caption: "Breaking character in the hallway" },
      { src: `${base("overthinking")}/outtake-2.mp4`, poster: `${base("overthinking")}/outtake-2.jpg`, caption: "Alternate take: rehearsing in the elevator" },
      { src: `${base("overthinking")}/outtake-3.mp4`, poster: `${base("overthinking")}/outtake-3.jpg`, caption: "Fixing the tie, one more time" },
      { src: `${base("overthinking")}/outtake-4.mp4`, poster: `${base("overthinking")}/outtake-4.jpg`, caption: "Hallway profile that didn't make the cut" },
      { src: `${base("overthinking")}/outtake-5.mp4`, poster: `${base("overthinking")}/outtake-5.jpg`, caption: "Silhouette exit, discarded" },
      { src: `${base("overthinking")}/outtake-6.mp4`, poster: `${base("overthinking")}/outtake-6.jpg`, caption: "Another angle on the note" },
    ],
    scenes: [
      { src: `${base("overthinking")}/scene-2.mp4`, poster: `${base("overthinking")}/scene-2.jpg`, caption: "Third floor" },
      { src: `${base("overthinking")}/scene-3.mp4`, poster: `${base("overthinking")}/scene-3.jpg`, caption: "The yellow note" },
      { src: `${base("overthinking")}/scene-4.mp4`, poster: `${base("overthinking")}/scene-4.jpg`, caption: "Rehearsing the smile" },
      { src: `${base("overthinking")}/scene-6.mp4`, poster: `${base("overthinking")}/scene-6.jpg`, caption: "Left behind" },
    ],
    bts: [
      { src: `${base("overthinking")}/bts-1.jpg`, caption: "Colin behind the camera, all of us inside one elevator" },
    ],
  },
  {
    slug: "playback",
    title: "Playback",
    year: 2026,
    runtime: "4 min 2 s",
    youtubeId: "cFgMZGAuIRU",
    logline: "In a world of AI-made media, one disc might hold the last human story.",
    synopsis:
      "In a dystopian world where the media landscape has been overrun by soulless AI-generated content and what we used to know as “authentic” is now illegal, Carlos seeks solace in what may be the last surviving piece of authentic human-made media. He acquires a mysterious disc from an enigmatic seller operating out of one of the last movie theaters on Earth, where Metropolis (a film almost 187 years old) still flickers across the screen. After narrowly escaping the authorities of this world and watching the content of the mysterious disc, Carlos experiences a profound revelation that forces him to question his humanity and the world he thought he understood.",
    accent: "var(--bauhaus-red)",
    loop: `${base("playback")}/loop.mp4`,
    poster: `${base("playback")}/poster.jpg`,
    details: [
      { label: "Title", value: "Playback" },
      { label: "Year", value: "2026" },
      { label: "Runtime", value: "4 min 2 s" },
      { label: "Country", value: "United States" },
      { label: "Produced by", value: "Arts Intensive Program, Stanford University" },
      { label: "Shooting format", value: "Digital, 4K UHD, 23.98 fps / color" },
      { label: "Camera", value: "Sony A7 III" },
      { label: "Post-production", value: "DaVinci Resolve (edit, color, sound, title design)" },
    ],
    credits: [
      { role: "A film by", names: ["Mathias Becerra", "Haoyan Jiang"] },
      { role: "Screenplay", names: ["Haoyan Jiang"] },
      { role: "Cinematography", names: ["Haoyan Jiang", "Mathias Becerra"] },
      { role: "Sound", names: ["Kai Wang", "Mathias Becerra"] },
      { role: "Featuring", names: ["Colin Paul Weis", "Dmytro Hryshchuk"] },
      { role: "Technical support", names: ["Jake Chamberlain", "David Bowsky", "Tania Claudia Castillo", "Sarah Evelyn Genge", "Jeanne Zhang"] },
      { role: "Faculty advisors", names: ["Adam Tobin", "Claire Haughey"] },
      { role: "Special thanks", names: ["Kae Heller", "Rishi Ravi", "Lionel Nielsen Humphreys", "Andrew Gio Kang", "Jorge Ramos", "Lilli Sperry Whelan"] },
    ],
    dedication: "In memory of Nena Becerra (2011–2026)",
    process: [
      "Playback is a film about the value of media made by people, so it leans on things you can hold: a disc, a laptop tray, a cinema seat, a projector beam. The theater scenes stay dark and low, with faces half in shadow.",
      "We shot in 4K on a Sony A7 III to keep room to reframe and stabilize in post. The world of synthetic media is introduced through a glossy fake ad, “TrueFrameAI”, built to feel too clean next to the grain of the theater.",
      "What Carlos finds on the disc is intimate, everyday footage: the most human thing we could put on screen. The edit, grade, sound mix and the glowing title card were finished in DaVinci Resolve.",
    ],
    stills: [
      { src: `${base("playback")}/still-1.jpg`, caption: "TrueFrameAI: the synthetic feed" },
      { src: `${base("playback")}/still-2.jpg`, caption: "Carlos watches" },
      { src: `${base("playback")}/still-3.jpg`, caption: "The enigmatic seller" },
      { src: `${base("playback")}/still-4.jpg`, caption: "One of the last movie theaters on Earth" },
      { src: `${base("playback")}/still-5.jpg`, caption: "Through the back door" },
      { src: `${base("playback")}/still-6.jpg`, caption: "What's on the disc" },
    ],
    outtakes: [
      { src: `${base("playback")}/outtake-1.mp4`, poster: `${base("playback")}/outtake-1.jpg`, caption: "A toast that went sideways" },
    ],
    scenes: [
      { src: `${base("playback")}/scene-1.mp4`, poster: `${base("playback")}/scene-1.jpg`, caption: "TrueFrameAI" },
      { src: `${base("playback")}/scene-2.mp4`, poster: `${base("playback")}/scene-2.jpg`, caption: "Metropolis, still flickering" },
      { src: `${base("playback")}/scene-3.mp4`, poster: `${base("playback")}/scene-3.jpg`, caption: "The seller" },
      { src: `${base("playback")}/scene-4.mp4`, poster: `${base("playback")}/scene-4.jpg`, caption: "The disc" },
    ],
    bts: [
      { src: `${base("playback")}/bts-1.jpg`, caption: "Between setups" },
      { src: `${base("playback")}/bts-2.jpg`, caption: "Setting up a shot in the dark" },
      { src: `${base("playback")}/bts-3.jpg`, caption: "Blocking the living-room scene" },
      { src: `${base("playback")}/bts-4.jpg`, caption: "Lit set with boom mic" },
    ],
  },
];

export const getFilm = (slug: string) => FILMS.find((f) => f.slug === slug);
