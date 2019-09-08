import L from 'leaflet';
import geohash from 'ngeohash';
import { latLngBoundsToBbox } from './leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import bboxClip from '@turf/bbox-clip';
import area from '@turf/area';

export function latLngToGeohash(latLng) {
  const { lat, lng } = latLng;
  return geohash.encode(lat, lng, 12);
}

export default class Geohash {
  static get cellDimensions() {
    return [
      [5009400, 4992600],
      [1252300, 624100],
      [156500, 15600],
      [39100, 19500],
      [4900, 4900],
      [1200, 609.4],
      [152.9, 152.4],
      [38.2, 19],
      [4.8, 4.8],
      [1.2, 0.595],
      [0.149, 0.149],
      [0.37, 0.19]
    ];
  }

  static get bearings() {
    return {
      n:  [1, 0],
      ne: [1, 1],
      e:  [0, 1],
      se: [-1, 1],
      s:  [-1, 0],
      sw: [-1, -1],
      w:  [0, -1],
      nw: [1, -1],
    }
  }

  constructor(bounds) {
    this._viewportBounds = bounds;
    this._viewportCenter = bounds.getCenter();
    this._viewportWidth = 0;
    this._viewportHeight = 0;
    this._prefixLength = 0;
    this._currentBounds = null;
    this._centerGeohash = null;
    this._neighborGeohashes = [];
  }

  get viewportWidth() {
    if (this._viewportWidth) {
      return this._viewportWidth;
    }
    const w = this._viewportBounds.getWest();
    const cw = new L.LatLng(this._viewportCenter.lat, w);
    this._viewportWidth = this._viewportCenter.distanceTo(cw) * 2;
    return this._viewportWidth;
  }

  get viewportHeight() {
    if (this._viewportHeight) {
      return this._viewportHeight;
    }
    const n = this._viewportBounds.getNorth();
    const cn = new L.LatLng(n, this._viewportCenter.lng);
    this._viewportHeight = this._viewportCenter.distanceTo(cn) * 2;
    return this._viewportHeight;
  }

  get prefixLength() {
    if (this._prefixLength) {
      return this._prefixLength;
    }
    let cellWidth = 0, cellHeight = 0, prefixIndex = -1;
    Geohash.cellDimensions.forEach(([width, height], i) => {
      if (width <= this._viewportWidth
        && height <= this._viewportHeight
        && width > cellWidth
        && height > cellHeight
      ) {
        cellWidth = width;
        cellHeight = height;
        prefixIndex = i;
      }
    })
    this._prefixLength = prefixIndex + 1;
    return this._prefixLength;
  }

  get centerGeohash() {
    if (this._centerGeohash) {
      return this._centerGeohash;
    }
    const { lat, lng } = this._viewportCenter;
    const [maxWidth, maxHeight] = Geohash.cellDimensions[0];
    if (!(this.viewportWidth <= maxWidth && this.viewportHeight <= maxHeight)) {
      this._centerGeohash = geohash.encode(lat, lng, 1);
      return this._centerGeohash;
    }

    const hash = geohash.encode(lat, lng, Geohash.cellDimensions.length);
    this._centerGeohash = (this.prefixLength) 
      ? hash.slice(0, this.prefixLength)
      : hash;

    return this._centerGeohash;
  }

  get geohashes() {
    const hashes = [this.centerGeohash];
    return hashes.concat(this._neighborGeohashes);
  }

  toBounds() {
    this.extendBounds(this.centerGeohash);
    this._neighborGeohashes.forEach(this.extendBounds.bind(this));
    return this;
  }

  extendBounds(hash) {
    const [minLat, minLng, maxLat, maxLng] = geohash.decode_bbox(hash);
    const corner1 = L.latLng(minLat, minLng);
    const corner2 = L.latLng(maxLat, maxLng);
    const bounds = L.latLngBounds(corner1, corner2);
    
    if (this._currentBounds && this._currentBounds.contains(bounds)) {
      return;
    }
    
    this._currentBounds = (this._currentBounds) 
      ? this._currentBounds.extend(bounds) 
      : bounds;
  }

  getNeighbors() {
    if (!this._neighborGeohashes.length) {
      Object.keys(Geohash.bearings).forEach(direction => {
        const hash = geohash.neighbor(this.centerGeohash, Geohash.bearings[direction]);
        this.addNeighbor(hash);
      }); 
    }
    else {
      Object.keys(Geohash.bearings).forEach(direction => {
        this._neighborGeohashes.forEach(neighborGeohash => {
          const hash = geohash.neighbor(neighborGeohash, Geohash.bearings[direction]);
          this.addNeighbor(hash);
        })
      }); 
    }
    return this;
  }

  addNeighbor(hash) {
    if (this._neighborGeohashes.indexOf(hash) > -1) {
      return;
    }
    const [minLat, minLng, maxLat, maxLng] = geohash.decode_bbox(hash);
    const neighborBbox = [minLng, minLat, maxLng, maxLat];
    const neighborPolygon = bboxPolygon(neighborBbox);
    const neighborArea = area(neighborPolygon);

    const viewportPolygon = bboxPolygon(latLngBoundsToBbox(this._viewportBounds));
    const clippedViewport = bboxClip(viewportPolygon, neighborBbox);
    const clippedViewportArea = area(clippedViewport);
    const excludedArea = neighborArea - clippedViewportArea;
    
    if (neighborArea <= clippedViewportArea 
      || (neighborArea > clippedViewportArea && excludedArea < clippedViewportArea)
    ) {
      this._neighborGeohashes.push(hash);
    }
  }

  inViewport(maskDifference = null) {
    this.toBounds().getNeighbors().toBounds();
    const boundsPolygon = bboxPolygon(latLngBoundsToBbox(this._currentBounds));
    const boundsArea = area(boundsPolygon);
    
    const viewportPolygon = bboxPolygon(latLngBoundsToBbox(this._viewportBounds));
    const viewportArea = area(viewportPolygon);
    const difference = (boundsArea < viewportArea) ? viewportArea - boundsArea : boundsArea - viewportArea;

    return (difference > 0 && maskDifference !== difference) 
      ? this.inViewport(difference) 
      : this.geohashes;
  }
}