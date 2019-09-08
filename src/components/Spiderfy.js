import L from "leaflet";
import { withLeaflet, MapLayer } from "react-leaflet";
import "overlapping-marker-spiderfier-leaflet/dist/oms";

class Spiderfy extends MapLayer {
  
  createLeafletElement(props) {
    const { map } = props.leaflet;
    this.oms = this.createOverlappingMarkerSpiderfier(map, { keepSpiderfied: true });
    const el = L.layerGroup();
    this.contextValue = { ...props.leaflet, layerContainer: el };
    return el;
  }

  addMarker() {
    this.leafletElement.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.oms.addMarker(layer);
      }
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.addMarker();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    this.addMarker();
  }

  createOverlappingMarkerSpiderfier(map) {
    const oms = new window.OverlappingMarkerSpiderfier(map);
    oms.addListener("spiderfy", markers => {
      this.oms.keepSpiderfied = true;
      markers.forEach(m => m.closePopup());
      if (this.props.onSpiderfy) this.props.onSpiderfy(markers);
    });
    oms.addListener("unspiderfy", markers => {
      this.oms.keepSpiderfied = false;
      if (this.props.onUnspiderfy) this.props.onUnspiderfy(markers);
    });
    oms.addListener("click", marker => {
      if (this.props.onClick) this.props.onClick(marker);
    });
    return oms;
  }
}

export default withLeaflet(Spiderfy);