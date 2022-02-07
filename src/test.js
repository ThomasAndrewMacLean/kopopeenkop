const path = require("path");
const os = require("os");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require("busboy");
const { Storage } = require("@google-cloud/storage");

exports.uploadFile = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  }
  if (req.method !== "POST") {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = new Busboy({ headers: req.headers });

  busboy.on("field", async (fieldname, val) => {
    const tmpdir = os.tmpdir();
    const filepath = path.join(tmpdir, fieldname + ".svg");

    if (fieldname === "url") {
      const storage = new Storage({ keyFilename: "keyfile.json" });
      const bucket = storage.bucket("koppen");
      const cleanFile = decodeURIComponent(val).replace(
        'data:image/svg+xml;charset=utf-8,<?xml version="1.0" standalone="no"?>\r\n',
        ""
      );
      await fs.writeFileSync(filepath, cleanFile);

      const uniqueId = uuidv4();
      // const uploaded = await bucket.upload(filepath.replace(".svg", ".png"), {
      //    public: true,
      //    destination: uniqueId + '.png',
      //   });

      const uploaded = await bucket.upload(filepath, {
        public: true,
        destination: uniqueId + ".svg",
      });
      return res.json({ id: uploaded[0].id }).send();
      // sharp(filepath, { density: 300 })
      //   // .resize(3600, 5400)
      //   .png()
      //   .toFile(filepath.replace(".svg", ".png"))
      //   .then(async function (info) {
      //     console.log(info);
      //     const uniqueId = uuidv4();
      //     // const uploaded = await bucket.upload(filepath.replace(".svg", ".png"), {
      //     //    public: true,
      //     //    destination: uniqueId + '.png',
      //     //   });

      //     const uploaded = await bucket.upload(filepath, {
      //       public: true,
      //       destination: uniqueId + ".svg",
      //     });

      //     return res.json({ id: uploaded[0].id }).send();
      //   })
      //   .catch(function (err) {
      //     console.log(err);
      //   });
    }
  });

  busboy.end(req.rawBody);
};
