# Parser de tuile vecteur pbf

## Contenu d'une tuile pbf

> curl http://localhost:9999/maps/bonn/18/136245/88063.pbf > tile.pbf
> node parse-tile-pbf.js

Ceci permet de lire le nom des *layers* et les attributs...

## option

si tuile compressée :
> node parse-tile-pbf.js --gzip

sinon,
> node parse-tile-pbf.js

On peut parser une tuile avec un autre nom (tile.pbf par defaut),
> node parse-tile-pbf.js tileXXX.pbf
> node parse-tile-pbf.js --gzip -- tileXXX.pbf

Exemple :
> node parse-tile-pbf.js | more
```
brute: <Buffer  ... >
sans compression !
layers:
{ n0_routier_route:
   VectorTileLayer {
     version: 1,
     name: 'n0_routier_route',
     extent: 256,
     length: 6,
     _pbf:
      { buf: <Buffer  ... >,
        pos: 2309,
        type: 0,
        length: 2309 },
     _keys: [ 'symbo' ],
     _values: [ 'REGIONALE_3', 'NON_CLASSEE' ],
     _features: [ 22, 41, 62, 82, 102, 123 ] },
  n0_bati_surf:
   VectorTileLayer {
     version: 1,
     name: 'n0_bati_surf',
     extent: 256,
     length: 56,
     _pbf:
      { buf: <Buffer  ... >,
        pos: 2309,
        type: 0,
        length: 2309 },
     _keys: [ 'symbo' ],
     _values: [ 'BATI' ],
     _features:
      [ ... ] },
  n0_bati_lin:
   VectorTileLayer {
     version: 1,
     name: 'n0_bati_lin',
     extent: 256,
     length: 2,
     _pbf:
      { buf: <Buffer  ... >,
        pos: 2309,
        type: 0,
        length: 2309 },
     _keys: [ 'symbo' ],
     _values: [ 'QUAI', 'MUR_SOUTENEMENT' ],
     _features: [ 2227, 2248 ] } }
```
