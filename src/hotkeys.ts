import { createTable } from "./table.js";

export enum HotkeyColumns {
  id,
  App,
  Hotkey,
  Description,
}

export const hotkeys = [
  ["cidhwo93hnk391hknal28fjankp82habmnb", "cow", "pear", "apple"],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🔥 Test",
    "AAaaAAAAAAAAAAAAAAAAAAAAaaAAAAAAAAAAAAAAAAAAAAaaAAAAAAAAAAAAAAAAAA",
    "A dark green leafy vegetable A dark green leafy vegetabl",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🍎Mac",
    "⌘ + ⌥ + /",
    "Toggle Autocorrect",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🍎Mac",
    "⌥ + space",
    "Display iterm",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🍎Mac",
    "⌘ + ⌥ + s",
    "(Notes) hide/show sidebar",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "💻iTerm",
    "⌘ + D",
    "Split pane vertically",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "💻iTerm",
    "⌘ + ⇧ + D",
    "Split pane horizontally",
  ],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "👾Git", "😎🔥", "Emoji-town"],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🌞Chrome",
    "⌘ + L",
    "Select Address Bar",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🌞Chrome",
    "⌥ + ENTER",
    "Opens a new tab with this url",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🌞Chrome",
    "Super + 1",
    "Grepper Answers",
  ],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "🌞Chrome", "⌘ + w", "Close Tab"],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🌞Chrome",
    "⌘ + Left/Right Arrows",
    "Back / Forward",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🦕VSCode",
    "⌘+⌥",
    "display inlay-hints",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🦕VSCode",
    "⌥ + U",
    "Deselect occurrence",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "🦕VSCode",
    "⌘+u",
    "deselect from multiple cursors",
  ],
  ["theOneIWant", "🦕VSCode", "⇧ + ⌥ + A", "block comment"],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "👨‍💻Code",
    "Test Name  😎",
    "Test Command 🔥",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "",
    "Test Name  😎",
    "Test Command 🔥",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "",
    "Test Name  😎",
    "Test Command 🔥",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "",
    "Test Name  😎",
    "Test Command 🔥",
  ],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "super ;", "Swap quotes"],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "super [", "Swap brackets"],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "Cool Command 24", "space bar"],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "",
    "⇧ + ⌘ + L",
    "Select quotes content",
  ],
  [
    "cidhwo93hnk391hknal28fjankp82habmnb",
    "",
    "⇧ + ⌘ + K",
    "Select bracket content",
  ],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "Is Cool", "Rio"],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "super + ‘", "Remove quotes"],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "Hogwart", "cow"],
  ["cidhwo93hnk391hknal28fjankp82habmnb", "", "shift", "cool command 28"],
];

export function listHotkeys() {
  const table = createTable(hotkeys, "full");
  console.log(table.join("\n"));
}
