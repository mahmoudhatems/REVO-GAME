export function validateInteriorLayout(layout, catalog) {
  const errors = [];
  if (layout?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (!layout?.id || !layout?.facilityId)
    errors.push("id and facilityId are required");
  if (
    ![layout?.dimensions?.widthPx, layout?.dimensions?.heightPx].every(
      Number.isFinite,
    )
  ) {
    errors.push("interior dimensions must be finite pixel values");
  }
  if (
    layout?.entry &&
    layout?.exit &&
    Math.hypot(
      layout.entry.x - layout.exit.x,
      layout.entry.y - layout.exit.y,
    ) <= layout.exit.interactionRadiusPx
  ) {
    errors.push(
      "entry spawn must not start inside the exit interaction radius",
    );
  }
  const assetById = new Map(catalog.map((asset) => [asset.assetId, asset]));
  for (const asset of layout?.assets ?? []) {
    const catalogAsset = assetById.get(asset.assetId);
    if (!catalogAsset) errors.push(`unknown catalog asset: ${asset.assetId}`);
    if (catalogAsset && asset.licenseStatus !== catalogAsset.licenseStatus) {
      errors.push(`license status mismatch: ${asset.assetId}`);
    }
    if (
      catalogAsset &&
      asset.classification !== catalogAsset.visualClassification
    ) {
      errors.push(`visual classification mismatch: ${asset.assetId}`);
    }
  }
  const interactables = layout?.interactables ?? [];
  const ids = interactables.map(({ id }) => id);
  if (new Set(ids).size !== ids.length)
    errors.push("interactable IDs must be unique");
  if (
    ![
      "mission-briefing-terminal",
      "communications-console",
      "mission-status-display",
    ].every((id) => ids.includes(id))
  ) {
    errors.push("communication room requires the three approved interactables");
  }
  return { valid: errors.length === 0, errors };
}
