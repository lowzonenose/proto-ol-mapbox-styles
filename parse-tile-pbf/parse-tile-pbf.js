const VectorTile = require('@mapbox/vector-tile').VectorTile;
const Protobuf = require('pbf');
const fs = require('fs');
const zlib = require('zlib');

var opts = require("minimist")(process.argv.slice(2));

var file = opts._[0] || 'tile.pbf';

const data = fs.readFileSync(file);
// console.log("brute: ", data);

var tile;
if (opts.gzip) {
    console.log("avec compression !");
    zlib.gunzip(data, function(err, buffer) {
        tile = new VectorTile(new Protobuf(buffer));
    });
} else {
    console.log("sans compression !");
    tile = new VectorTile(new Protobuf(data));
}

console.log("layers: ", tile.layers);
console.log("decode: ", JSON.stringify(tile));
