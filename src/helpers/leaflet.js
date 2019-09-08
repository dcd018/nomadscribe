function latLngBoundsToBbox(latLngBounds) {
  const ne = latLngBounds.getNorthEast();
  const se = latLngBounds.getSouthEast();
  const sw = latLngBounds.getSouthWest();
  const nw = latLngBounds.getNorthWest();

  const lats = [], lngs = [];
  const latLngs = [ne, se, sw, nw];
  
  latLngs.forEach(latLng => {
    const { lat, lng } = latLng;
    lats.push(lat);
    lngs.push(lng);
  })

  const minLat = Math.min(...lats);
  const minLng = Math.min(...lngs);
  const maxLat = Math.max(...lats);
  const maxLng = Math.max(...lngs);
  
  return [minLng, minLat, maxLng, maxLat];
}

export { latLngBoundsToBbox }