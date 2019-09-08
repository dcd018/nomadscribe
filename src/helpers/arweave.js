import _ from 'lodash';
import { api } from '../config';
import Arweave from 'arweave/web';
import { feature } from '@turf/helpers'
import { latLngToGeohash } from './geohash';

const { arweave: { host, port, protocol } } = api;
const arweave = Arweave.init({ host, port, protocol });

export default arweave;

export async function getAddress(jwk) {
  const address = await arweave.wallets.jwkToAddress(jwk);
  return address;
}

export function txnsByWallet(walletAddress) {
  return arweave.arql({
    op: 'and',
    expr1: {
      op: 'equals',
      expr1: 'App-Name',
      expr2: 'nomadscribe'
    },
    expr2: {
      op: 'equals',
      expr1: 'from',
      expr2: walletAddress
    }
  });
}

export function txnsByGeohash(geohash) {
  return arweave.arql({
    op: 'and',
    expr1: {
      op: 'equals',
      expr1: 'App-Name',
      expr2: 'nomadscribe',
    },
    expr2: {
      op: 'equals',
      expr1: `Geohash-Precision-${geohash.length}`,
      expr2: geohash,
    }
  });
}

export function txnsByWalletAndGeohash(walletAddress, geohash) {
  return arweave.arql({
    op: 'and',
    expr1: {
      op: 'equals',
      expr1: 'from',
      expr2: walletAddress,
    },
    expr2: {
      op: 'equals',
      expr1: `Geohash-Precision-${geohash.length}`,
      expr2: geohash,
    }
  });
}

export function txnsForArweaveId(walletAddress) {
  return arweave.arql({
    op: 'and',
    expr1: {
      op: 'equals',
      expr1: 'App-Name',
      expr2: 'arweave-id'
    },
    expr2: {
      op: 'equals',
      expr1: 'from',
      expr2: walletAddress,
    },
  });
}

export function toTxn(latLng, location) {
  const { lat, lng } = latLng;
  const geohash = latLngToGeohash(latLng);
  const prefixes = {};
  for (let i = 0; i < geohash.length; i++) {
    const precision = i + 1;
    prefixes[`Geohash-Precision-${precision}`] = geohash.slice(0, precision);
  }
  return {
    tags: {
      'Content-Type': 'application/json',
      'App-Name': 'nomadscribe',
      ...prefixes,
    },
    data: feature({
      type: 'Point',
      coordinates: [lng, lat]
    }, {
      timestamp: Date.now(),
      address: location.address,
      displayName: location.display_name,
    }),
    toJSON: function() {
      return {
        ...this,
        data: JSON.stringify(this.data)
      }
    }
  };
}

export async function fromTxn(txnid) {
  const txn = await arweave.transactions.get(txnid);
  const walletAddress = await arweave.wallets.ownerToAddress(txn.get('owner'));
  const opts = { decode: true, string: true };
  const tags = _.assign({}, ...(txn.get('tags').map(tag => ({
    [tag.get('name', opts)]: tag.get('value', opts)
  }))))
  let data = txn.get('data', opts);
  if (tags['Content-Type'] && tags['Content-Type'] === 'application/json') {
    data = JSON.parse(data);
  }
  return { walletAddress, tags, data };
}

export async function submitTxn(jwk, wallet = null, latLng = null, location = null) {
  const { tags, data } = wallet || toTxn(latLng, location);
  const txn = await arweave.createTransaction({ data }, jwk);
  Object.keys(tags).forEach(key => txn.addTag(key, tags[key]));
  await arweave.transactions.sign(txn, jwk);
  return arweave.transactions.post(txn);
}

export async function txnsToLocations(walletAddress = null, geohash = null) {
  const txnids = (walletAddress) ? await txnsByWallet(walletAddress) : await txnsByGeohash(geohash);
  return Promise.all(txnids.map(txnid => fromTxn(txnid).then(mergeWithArweaveId)));
}

export async function mergeWithArweaveId(wallet) {
  const txnids = await txnsForArweaveId(wallet.walletAddress);
  const txns = await Promise.all(txnids.map(fromTxn));
  const keys = [];
  const vals = [];
  txns.forEach(txn => {
    keys.push(txn.tags.Type);
    vals.push(txn.data);
  })
  wallet.arweaveId = _.zipObject(keys, vals);
  return wallet;
}