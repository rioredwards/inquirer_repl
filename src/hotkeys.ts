import { createTable } from "./table.js";

export enum HotkeyColumns {
  App,
  Hotkey,
  Description,
}

export const hotkeys = [
  ["cowwabungawungazungatunga", "pear", "apple"],
  [
    "🔥 Test",
    "AAaaAAAAAAAAAAAAAAAAAAAAaaAAAAAAAAAAAAAAAAAAAAaaAAAAAAAAAAAAAAAAAA",
    "A dark green leafy vegetable A dark green leafy vegetabl",
  ],
  ["🍎Mac", "⌘ + ⌥ + /", "Toggle Autocorrect"],
  ["🍎Mac", "⌥ + space", "Display iterm"],
  ["🍎Mac", "⌘ + ⌥ + s", "(Notes) hide/show sidebar"],
  ["💻iTerm", "⌘ + D", "Split pane vertically"],
  ["💻iTerm", "⌘ + ⇧ + D", "Split pane horizontally"],
  ["👾Git", "😎🔥", "Emoji-town"],
  ["🌞Chrome", "⌘ + L", "Select Address Bar"],
  ["🌞Chrome", "⌥ + ENTER", "Opens a new tab with this url"],
  ["🌞Chrome", "Super + 1", "Grepper Answers"],
  ["🌞Chrome", "⌘ + w", "Close Tab"],
  ["🌞Chrome", "⌘ + Left/Right Arrows", "Back / Forward"],
  ["🦕VSCode", "⌘+z", "toggle word wrap"],
  ["🦕VSCode", "⌥ + K", "Skip occurrence"],
  ["🦕VSCode", "⌥ + D", "Select another occurrence"],
  ["🦕VSCode", "⌥ + ⌘ + ←", "previous tab"],
  ["🦕VSCode", "⌘+⌥", "display inlay-hints"],
  ["🦕VSCode", "⌥ + U", "Deselect occurrence"],
  ["🦕VSCode", "⌘+u", "deselect from multiple cursors"],
  ["🦕VSCode", "⇧ + ⌥ + A", "block comment"],
  ["👨‍💻Code", "Test Name  😎", "Test Command 🔥"],
  ["", "Test Name  😎", "Test Command 🔥"],
  ["", "Test Name  😎", "Test Command 🔥"],
  ["", "Test Name  😎", "Test Command 🔥"],
  ["", "super ;", "Swap quotes"],
  ["", "super [", "Swap brackets"],
  ["", "Cool Command 24", "space bar"],
  ["", "⇧ + ⌘ + L", "Select quotes content"],
  ["", "⇧ + ⌘ + K", "Select bracket content"],
  ["", "Is Cool", "Rio"],
  ["", "super + ‘", "Remove quotes"],
  ["", "super + ]", "Remove brackets"],
  ["", "horsey", "horse raddish"],
  ["", "Is Good", "Food"],
  ["", "Go to the Mall", "Eat Lettuce"],
  ["", "cow", "cow"],
  ["", "Hogwart", "cow"],
  ["", "shift", "cool command 28"],
  ["", "Yurts in Big Sur, California", "A dark green leafy vegetable"],
  ["", "Yurts in Big Sur, California", ""],
  ["", "Yurts in Big Sur, California", ""],
  ["", "", ""],
];

export function listHotkeys() {
  const table = createTable(hotkeys, "full");
  console.log(table.join("\n"));
}
