export class DoorAnimator {
  constructor(scene, { closed, open }) {
    this.scene = scene;
    this.closed = closed;
    this.open = open;
    this.isAnimating = false;
  }

  play(opening, onComplete) {
    if (this.isAnimating) return false;
    this.isAnimating = true;
    const first = opening ? this.closed : this.open;
    const second = opening ? this.open : this.closed;
    first.setVisible(true);
    second
      .setAlpha(0)
      .setVisible(true)
      .setDepth(first.depth + 1);
    this.scene.tweens.add({
      targets: first,
      alpha: 0,
      duration: 140,
      onComplete: () => {
        first.setVisible(false).setAlpha(1);
        second.setAlpha(0);
        this.scene.tweens.add({
          targets: second,
          alpha: 1,
          duration: 160,
          onComplete: () => {
            second.setAlpha(1).setVisible(true);
            this.isAnimating = false;
            onComplete?.();
          },
        });
      },
    });
    return true;
  }
}
