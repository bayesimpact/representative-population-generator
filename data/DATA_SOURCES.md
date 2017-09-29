# Data Sources

We use US Postal Service [Every Door Direct Mail](https://www.usps.com/business/every-door-direct-mail.htm) (EDDM) data as our source for identifying residential and commercial addresses as a basis for our calculation of representative population points.

## Access

The EDDM data can be accessed via ArcGIS REST API. For an example, see this webpage: [https://gis.usps.com/arcgis/rest/services/EDDM/selectZIP/GPServer/routes/execute?f=json&env%3AoutSR=102100&ZIP=94601&Rte_Box=R&UserName=EDDM](https://gis.usps.com/arcgis/rest/services/EDDM/selectZIP/GPServer/routes/execute?f=json&env%3AoutSR=102100&ZIP=94601&Rte_Box=R&UserName=EDDM)

The data can be retrieved one ZIP code at a time. Since the ArcGIS script is called "selectZIP," it seems unlikely that bulk access is possible through online means. We have initiated a FOIA request for the data; we expect response of USPS to provide valuable information (how they generate the data, what the terms of use are, &c).

## Advantages

In addition to the requirements above, this data source has the following advantages:

### 1. Explicitly accessible by ZIP

Unlike census data, the EDDM data comes with points assigned to ZIP codes. Because ZIPs are explicitly not defined as polygons, we believe it is easier to move in this direction (ZIP → census) than vice versa. Because the source is USPS, we expect this information to be accurate and up-to-date.

### 2. Reliability

Unlike other open source address data (e.g., Openaddresses, OpenStreetMap, DoT National Address Database), the EDDM data appears to closely correspond to the truth "on the ground." When the EDDM tool has a point, there typically is a building there (as validated by satellite imagery).

### 3. Has population estimates

The USPS has implemented a crosswalk with census data to obtain these estimates. Using this data source obviates the need to reinvent the wheel and perform the crosswalk manually.

## Limitations

No data source is perfect. The following are some potential concerns with the using data scraped from the EDDM tool.

### 1. Missing ZIP codes

Not every ZIP code is present in the EDDM tool. For example, zip code 92055 corresponds to Camp Pendleton, a Marine Corps base. It makes sense that the USPS would not allow for commercial mailers to target this ZIP for advertising campaigns.

There are also 236 ZIP codes that contain only one point in Quest but are missing from the EDDM tool entirely. Examples include 94615, 94617, 94622, 94649, 94659. These could be deprecated ZIPs no longer in use or PO boxes for which EDDM is unavailable for whatever reason (similar to Camp Pendleton).

Overall, EDDM contains X of the Y zips contained in Quest.

### 2. ZIP codes with one point

In certain rural ZIPs, every resident gets their mail at the nearest post office: There are no mailing routes. This means that the EDDM tool will have only a single point (corresponding to the PO Box) for the entire ZIP. Examples include 95915, 93627, 95426, 96006, 95701.

These ZIPs can cover large areas, so representing them with a single point is problematic when performing adequacy calculations.

Quest typically has ~70 points for each of these ZIPs. Quest uses a commercial data set from Pitney Bowes; it is unclear how they generate these points.

Using county polygons from the census and ZIP code polygons from EDDM yields the following: (a) 1292 ZIP / county pairs with the full 200 points; (b) 744 ZIP / county pairs with a single point; (c) 403 ZIP / county pairs with somewhere between 2 and 199 points. Using a more definitive source of what ZIP codes belong to what counties should cut down on this third group, of which ~30% consist of fewer than 20 points (and 50% consist of fewer than 50 points).

### 3. Lack of census information

Because the points come from USPS, they do not come tagged with relevant census-type information (e.g., county, census block, etc.). Such information has to be determined by intersecting geometries.
