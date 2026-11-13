export class NeilDialogueController {
  constructor(lines) {
    this.lines = lines;
    this.activeId = null;
    this.seen = new Set();
  }

  get currentLine() {
    return this.activeId ? (this.lines[this.activeId] ?? null) : null;
  }

  show(id, { once = false } = {}) {
    if (!this.lines[id] || (once && this.seen.has(id))) return false;
    this.activeId = id;
    this.seen.add(id);
    return true;
  }

  hide() {
    const previous = this.activeId;
    this.activeId = null;
    return previous;
  }
}
