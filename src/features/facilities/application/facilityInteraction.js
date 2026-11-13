import {
  createFacilityTransition,
  findNearestFacilityEntrance,
} from "../domain/facilityRegistry.js";

export function getFacilityPrompt(entrances, position) {
  return findNearestFacilityEntrance(entrances, position);
}

export function beginFacilityTransition(facilityId, returnContext) {
  return createFacilityTransition(facilityId, returnContext);
}
