//imports
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const uuidv4 = require('uuid/v4');

//cli arguments
const optionDefinitions = [{name: 'in', type: String}, {name: 'out', type: String}];
const options = commandLineArgs(optionDefinitions);

//get path to input file
const inputPath = options.in;

if (!inputPath) {
  console.log("Specify path to source geojson with --in");
  process.exit(1);
}

//prep the age attribute names
const ageAttributes = ["AGE_20_24", "AGE_25_34", "AGE_35_44", "AGE_45_54", "AGE_55_64", "AGE_65_74", "AGE_75_84", "AGE_GT_85", "AGE_LT_19"];

//zipcode county composition
const counties = {
  sanFrancisco: [
    94102, 94104, 94103, 94105, 94108, 94107, 94110, 94109, 94112, 94111, 94115, 94114, 94117, 94116, 94118, 94121, 94123, 94122, 94124, 94127, 94126, 94129, 94131, 94133, 94132, 94134, 94139, 94143, 94151, 94159, 94158, 94188, 94177,
  ],
  alameda: [
    94588, 94587, 94601, 94603, 94602, 94605, 94604, 94607, 94606, 94609, 94608, 94611, 94610, 94613, 94612, 94618, 94619, 94621, 94661, 94701, 94703, 94702, 94501, 94705, 94704, 94707, 94502, 94706, 94709, 94708, 94710, 94720, 94514, 94536, 94538, 94537, 94540, 94539, 94542, 94541, 94544, 94546, 94545, 94552, 94551, 94555, 94557, 94560, 94566, 94568, 94577, 95391, 94579, 94578, 94580, 94586,
  ],
  marin: [
    94903, 94901, 94904, 94913, 94920, 94925, 94924, 94929, 94930, 94937, 94933, 94939, 94938, 94941, 94940, 94942, 94947, 94946, 94949, 94948, 94950, 94957, 94956, 94963, 94960, 94965, 94964, 94970, 94966, 94971, 94973, 94979,
  ],
  sanMateo: [
    94063, 94062, 94065, 94066, 94070, 94080, 94074, 94002, 94010, 94005, 94014, 94015, 94018, 94401, 94017, 94020, 94403, 94019, 94402, 94021, 94404, 94025, 94027, 94030, 94038, 94037, 94044, 94061, 94060,
  ]
};

//read in the file and parse it
const stringyData = fs.readFileSync(inputPath);
let data = JSON.parse(stringyData);

//output
let points = {};

//for each point in the input, get what we need and repackage it
/**
 * Reports for each geocoded point must include the following data:
 *  1 Latitude and longitude;
 *  2 The county in which the point is located;
 *  3 The census block, block group and tract in which the point is located;
 *  4 The approximate number of residents represented by the point;
 *  5 The ZIP code or ZIP+4 code for mail delivery to the point; and if possible,
 *  6 A nearest/nearby street address for the point.

 */
console.log("there are " + data.features.length + " features in the input");
for (let feature of data.features) {
  //we want this to be geojson now!
  let point = {
    type: "Feature",
    geometry: {
      type: "Point"
    },
    properties: {}
  };
  let props = feature.properties;
  let geom = feature.geometry;

  //we need lat and long
  point.geometry.coordinates = geom.coordinates;

  //todo census block?

  //approx # residents
  let totalPop = 0;
  for (attribute of ageAttributes) {
    totalPop += Number(props[attribute]);
  }
  point.properties.residents = totalPop;

  //zip
  point.properties.zip = props.ZIP_CODE;

  //county
  for(let countyName of Object.keys(counties)){
    let county = counties[countyName];
    if (county.includes(Number(point.properties.zip))) {
      point.properties.county = countyName;
    }
  }

  //todo address?

  //let's generate a UUID to use as the key
  //actually, let's not do this unless we are using DynamoDB
  // point.id = uuidv4();

  //that's everything!
  if (points[point.properties.zip] && Array.isArray(points[point.properties.zip])) {
    points[point.properties.zip].push(point);
  } else {
    points[point.properties.zip] = [];
    points[point.properties.zip].push(point);
  }
}

//let's just rearrange things here so that {zip,county -> points}
let output = [];
for(let countyName of Object.keys(counties)){
  let county = counties[countyName];
  for(let zip of county){
    let outputRecord = {
      county: countyName,
      zip: String(zip),
      points: points[zip]
    };
    output.push(outputRecord);
  }
}

//output the newly rearranged map of points!
//if file, write to file
const outputPath = options.out;
if (outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(output, null, ' '), 'utf8');
}
