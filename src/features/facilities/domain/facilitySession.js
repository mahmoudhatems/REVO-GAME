// Phaser-independent session snapshot. The exterior Scene remains paused while
// an interior is active, so its full mission state and physics world stay alive.
let transition = null;

export const facilitySession = {
  saveTransition(value) {
    transition = value;
  },
  getTransition() {
    return transition;
  },
  clearTransition() {
    transition = null;
  },
};
