const axios = require("axios").default;
const jsonfile = require("jsonfile");
const file = "cnft-assets.json";
const baseURL = "https://api.cnft.io";
const colors = require("colors");

const args = require("yargs").argv;
const { mode, floorprice, maxprice } = args;

const api = axios.create({
  baseURL: baseURL,
});

let pageNum = 1;
let rawAssets = [];

const apiCall = () => {
  if (100 >= pageNum) {
    const payload = {
      search: "",
      nsfw: false,
      sold: false,
      page: pageNum,
      verified: true,
      project: "Boss Cat Rocket Club",
      types: ["listing", "offer"],
      sort: { price: 1 },
      verified: true,
    };

    console.log("Getting assets for page: ".green, pageNum);

    api
      .post("/market/listings", payload)
      .then((res) => {
        rawAssets.push(...res.data.results);
      })
      .catch((err) => {
        console.log("Error Sending the Request For Page: ", pageNum, " Error: ", err);
      });

    pageNum++;
  } else {
    clearIntervalAndWriteFile();
  }
};

const printFloorbuster = () => {
  const assets = jsonfile.readFileSync(file);
  let totalADACost = 0;
  let totalAssets = 0;
  let processedAssets = [];

  assets.forEach((item) => {
    const price = item.price / 1000000;
    if (price <= floorprice) {
      processedAssets.push(item);
    }
  });
  processedAssets.forEach((item) => {
    totalADACost += item.price / 1000000;
    totalAssets++;
  });
  const totalADA = totalADACost.toLocaleString();

  console.log(
    "\n========================================================================================================="
      .cyan
  );
  console.log(
    `\n              To bust the current floor and raise it to ${floorprice} ADA, it would cost`
      .red,
    `ONLY ${totalADA} ADA!`.green.red
  );
  console.log(
    `\n\n                                         ONLY ${totalAssets} units left to go!`.green
  );
  console.log(`\n\n                                     BUST THAT FLOOR LET'S GOOOOOOOO`.red);
  console.log(`\n\n                                  FIRST WE TAKE OVER CNFT, THEN THE WORLD.`.red);
  console.log(`\n\n                                             CITIZEN'S STRONK!`.magenta);
  console.log(
    "\n========================================================================================================="
      .cyan
  );
};

if (mode === "get-units") {
  console.log("\nRetreiving BossCats from cnft...\n");
  const interval = setInterval(apiCall, 1000 * Math.random());

  function clearIntervalAndWriteFile() {
    console.log(
      "\n========================================================================================================="
        .cyan
    );
    console.log(`\nSuccessfully retreived ${rawAssets.length} BossCats from cnft...`.magenta);
    clearInterval(interval);
    jsonfile.writeFileSync(file, rawAssets);
    console.log(
      "Stored BossCats locally, so you can perform floorbuster mode or search for rare items!"
        .magenta
    );
    console.log(
      "\n========================================================================================================="
        .cyan
    );
  }
} else if (mode === "floorbuster") {
  printFloorbuster();
}
