### Nomadscribe

A decentralized location service that utilizes the Arweave Network to permanently store GeoJSON associated with wallet addresses. You can check it out at it’s latest [transaction URL](https://arweave.net/P7l6If9EQFe26Awgo1heCAPN-MRvDt3OKGmLNajNbLg).

#### How it was built

Integrates [ArweaveID](https://github.com/shenwilly/arweaveID)! Nomadscribe is a React App that uses the HTML5 Location API. It utilizes OSM Nominatim to reverse geocode your location and tags a transaction with geohash prefixes at all possible precisions that eventually gets mined to an Arweave block. In first determining the precision of a current viewport by comparing it’s bounds to metric dimensions for cells covered by various string lengths in a worst case scenario at the equator, any transaction submitted at the same precision or zoom level can be queried with ArQL and displayed on a map.

#### How it works

##### Sharing your location
Your location is shared at your own discretion. Geohash prefixes are generated up to a precision of 12 (3.7cm x 1.9cm) with coordinates provided by the HTML5 Location API after permissions are granted.

Your location gets reverse geocoded by OSM Nominatim. The transaction used to query your location is tagged with a human readable string of the place’s display name and all possible geohash prefix lengths.

Zooming and panning will cause a re-render in which the current viewport center’s geohash prefix at a precision correlating with the current zoom level is used to recursively find all neighboring geohashes in every direction at the same precision until the viewport’s bounds are reached. Transactions with equal geohash prefixes are then queried at each precision with ArQL.

Try it out! The following cities already have mined transactions associated with them
- London, England
- Denver Colorado
- Mountain View, California

Or try searching by a specific Arweave wallet addresses!
3qCOxxpPCI8WnsEPoWbeQKs6gxvqaQ3z8HJvvY-P1kM
