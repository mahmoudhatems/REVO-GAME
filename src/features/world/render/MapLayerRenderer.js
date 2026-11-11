const tileCenter = (coordinate, tileSize) =>
  coordinate * tileSize + tileSize / 2;
const pointFor = (position, tileSize) => ({
  x: tileCenter(position.x, tileSize),
  y: tileCenter(position.y, tileSize),
});

export class MapLayerRenderer {
  constructor(scene, map) {
    this.scene = scene;
    this.map = map;
    this.tileSize = map.coordinateSystem.tileSizePx;
    this.textureByKey = new Map(
      map.assets.map((asset) => [asset.assetKey, asset.assetId]),
    );
  }

  render() {
    this.renderGround();
    this.renderGroundDetails();
    this.renderPaths();
    this.renderBuildings();
    this.renderWalls();
    this.renderProps();
    this.renderSolarArrays();
    this.renderForeground();
  }

  renderGround() {
    const { widthPx, heightPx, widthTiles, heightTiles } = this.map.dimensions;
    const { color, accent } = this.map.layers.Ground;
    const ground = this.scene.add.graphics().setDepth(-1000);
    ground.fillStyle(Number.parseInt(color.slice(1), 16), 1);
    ground.fillRect(0, 0, widthPx, heightPx);
    ground.fillStyle(Number.parseInt(accent.slice(1), 16), 0.12);
    for (let y = 0; y < heightTiles; y += 1) {
      for (let x = 0; x < widthTiles; x += 1) {
        const hash = (x * 17 + y * 31 + x * y * 7) % 13;
        if (hash < 3)
          ground.fillRect(
            x * this.tileSize + 4,
            y * this.tileSize + 5,
            8 + hash * 3,
            5 + hash,
          );
      }
    }
  }

  renderGroundDetails() {
    for (const item of this.map.layers.GroundDetails) this.addSprite(item, 10);
  }

  renderPaths() {
    const graphic = this.scene.add.graphics().setDepth(20);
    for (const route of this.map.layers.Paths) {
      const points = route.waypointsTiles.map((waypoint) =>
        pointFor({ x: waypoint[0], y: waypoint[1] }, this.tileSize),
      );
      for (const [color, width] of [
        [0x71321f, route.widthPx + 8],
        [0xcf7750, route.widthPx],
        [0xd7915b, 3],
      ]) {
        graphic.lineStyle(width, color, 1);
        graphic.beginPath();
        graphic.moveTo(points[0].x, points[0].y);
        for (const point of points.slice(1)) graphic.lineTo(point.x, point.y);
        graphic.strokePath();
        for (const point of points)
          graphic.fillCircle(point.x, point.y, width / 2);
      }
    }
  }

  renderBuildings() {
    for (const building of this.map.layers.Buildings)
      this.addSprite(building, 100);
    const outline = this.scene.add.graphics().setDepth(80);
    for (const facility of this.map.facilities) {
      if (facility.id === "solar-arrays") continue;
      const { x, y, w, h } = facility.boundsTiles;
      outline.lineStyle(
        2,
        facility.placeholder ? 0xe3a441 : 0xe19a5a,
        facility.placeholder ? 0.72 : 0.4,
      );
      outline.strokeRect(
        x * this.tileSize,
        y * this.tileSize,
        w * this.tileSize,
        h * this.tileSize,
      );
      if (facility.placeholder) {
        outline.fillStyle(0x1d1110, 0.52);
        outline.fillRect(
          x * this.tileSize + 10,
          y * this.tileSize + h * this.tileSize - 42,
          w * this.tileSize - 20,
          30,
        );
      }
    }
  }

  renderWalls() {
    for (const segment of this.map.layers.Walls.segments) {
      const position = pointFor(segment, this.tileSize);
      const image = this.scene.add.image(
        position.x,
        position.y,
        segment.assetId,
      );
      image.setOrigin(0.5, segment.isDoor ? 0.78 : 0.5);
      image.setDepth(100 + position.y);
      if (segment.rotation) image.setAngle(segment.rotation);
    }
  }

  renderProps() {
    for (const prop of this.map.layers.Props) this.addSprite(prop, 120);
  }

  renderSolarArrays() {
    for (const array of this.map.layers.SolarArrays) this.addSprite(array, 120);
  }

  renderForeground() {
    for (const facility of this.map.facilities) {
      const { x, y, w } = facility.boundsTiles;
      const shortNames = {
        "solar-arrays": "SOLAR ARRAY",
        shelter: "RADIATION SHELTER",
        oxygen: "OXYGEN / LIFE SUPPORT",
        communication: "COMMUNICATIONS HUB",
        "power-control": "POWER CONTROL",
        battery: "BATTERY STORAGE",
        research: "RESEARCH LAB",
        greenhouse: "GREENHOUSE",
        airlock: "ENTRANCE / AIRLOCK",
      };
      const status = facility.placeholder
        ? "PLACEHOLDER ART"
        : facility.artStatus === "candidate-art"
          ? "CANDIDATE ART"
          : "";
      const lines = [shortNames[facility.id] ?? facility.name, status].filter(
        Boolean,
      );
      const label = this.scene.add
        .text(
          (x + w / 2) * this.tileSize,
          (y + 0.15) * this.tileSize,
          lines.join("\n"),
          {
            fontFamily: "Arial, sans-serif",
            fontSize: "8px",
            fontStyle: "bold",
            color: "#fff0dc",
            backgroundColor: "#3b1d19",
            padding: { left: 6, right: 6, top: 5, bottom: 5 },
            align: "center",
            wordWrap: {
              width: Math.min(210, Math.max(112, w * this.tileSize - 16)),
            },
          },
        )
        .setOrigin(0.5, 0)
        .setDepth(10000);
      label.setResolution(2);
    }
  }

  addSprite(item, depthOffset) {
    const position = item.positionTiles ?? { x: item.x, y: item.y };
    const point = pointFor(position, this.tileSize);
    const assetId = item.assetId ?? this.textureByKey.get(item.assetKey);
    if (!assetId || !this.scene.textures.exists(assetId)) return null;
    const image = this.scene.add
      .image(point.x, point.y, assetId)
      .setOrigin(0.5, 1);
    image.setDepth(depthOffset + point.y);
    if (item.rotation) image.setAngle(item.rotation);
    return image;
  }
}
