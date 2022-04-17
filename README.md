# scrmn_gspfscreen

## Starting it up

1. Start Mongo
    - `sudo systemctl start mongod`

2. Run Manualtest 
    - `npm run manualtest`

## Static Runner (saved for posterity - not configured at this time)
- Static data for screens are at: gui/lib/static/staticData.js

- For the GSPF, you can run this via
`npm run build-static`

- To deploy to balena using their CLI
`balena login`
`balena push g_jeff_claybaugh1/gspf-staticscreen`

- To load logo into image:
`balena preload image_name.zip -s gspflogo.png`