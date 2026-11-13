export class NeilTutorialController {
  constructor(dialogue) {
    this.dialogue = dialogue;
    this.started = false;
    this.skipped = false;
    this.activeStep = null;
    this.awaitingMovement = false;
    this.moved = false;
  }

  start() {
    if (this.started || this.skipped) return false;
    this.started = true;
    this.activeStep = "welcome";
    return this.dialogue.show("welcome", { once: true });
  }

  advance() {
    if (!this.activeStep) return false;
    if (this.activeStep === "welcome") {
      this.activeStep = "movement";
      return this.dialogue.show("movement", { once: true });
    }
    if (this.activeStep === "movement") {
      this.activeStep = null;
      this.awaitingMovement = true;
      this.dialogue.hide();
      return true;
    }
    this.activeStep = null;
    this.dialogue.hide();
    return true;
  }

  onPlayerMoved() {
    if (this.skipped || !this.awaitingMovement || this.dialogue.activeId)
      return false;
    this.awaitingMovement = false;
    this.moved = true;
    this.activeStep = "exploration";
    return this.dialogue.show("exploration", { once: true });
  }

  onCommunicationEntranceNearby() {
    if (
      this.skipped ||
      !this.moved ||
      this.dialogue.activeId ||
      this.dialogue.seen.has("communicationEntrance")
    ) {
      return false;
    }
    this.activeStep = "communicationEntrance";
    return this.dialogue.show("communicationEntrance", { once: true });
  }

  skip() {
    this.skipped = true;
    this.awaitingMovement = false;
    this.activeStep = null;
    this.dialogue.hide();
  }

  dismissForAction() {
    if (!this.activeStep) return false;
    if (this.activeStep === "movement") this.awaitingMovement = true;
    this.activeStep = null;
    this.dialogue.hide();
    return true;
  }
}
