// Full-screen UI overlays (Station, MissionFlow, Logbook, Controls, Objectives) pause the world scene and
// publish which overlay is open so global ESC/P handling cannot resume the game underneath it.
export const OVERLAYS = ['Station', 'MissionFlow', 'Logbook', 'Controls', 'Objectives'];

export function openOverlay(scene, key, data = {}) {
  const mgr = scene.scene.manager;
  OVERLAYS.forEach((k) => { if (k !== key && mgr.isActive(k)) mgr.stop(k); });
  if (mgr.isActive('Pause')) mgr.stop('Pause');
  if (mgr.isActive('Game')) mgr.pause('Game');
  scene.registry.set('overlay', key);
  if (mgr.isActive(key)) mgr.stop(key);
  scene.scene.launch(key, data);
  scene.scene.bringToTop(key);
  if (mgr.isActive('Hud')) scene.scene.bringToTop('Hud');
}

export function closeOverlay(scene, { returnToPause = false } = {}) {
  const key = scene.scene.key;
  scene.registry.set('overlay', null);
  scene.scene.stop(key);
  const mgr = scene.scene.manager;
  if (returnToPause) { mgr.getScene('Game') && mgr.pause('Game'); scene.scene.launch('Pause'); scene.scene.bringToTop('Pause'); return; }
  if (mgr.isPaused('Game')) mgr.resume('Game');
}

export const overlayOpen = (scene) => !!scene.registry.get('overlay');
