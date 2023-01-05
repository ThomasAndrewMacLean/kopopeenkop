console.log("😃", "☕️");

const fileInput = document.getElementById("kop");
const preview = document.getElementById("preview");
const form = document.getElementById("form");

const removeBackgroud = () => {
  const previewImage = document.getElementById("previewImage");

  loadImage(previewImage.src);
};
fileInput.addEventListener("change", async (e) => {
  e.preventDefault();
  console.log(fileInput.files);
  if (fileInput && fileInput.files && fileInput.files[0]) {
    setLoader(true);
    var fr = new FileReader();
    fr.onload = function () {
      const previewImage = document.getElementById("previewImage");
      previewImage.style.width = "auto";
      previewImage.src = fr.result;

      loadImagePreview(fr.result);

      // clear input
      fileInput.value = "";
    };
    fr.readAsDataURL(fileInput.files[0]);
    document.getElementById("waitUpload").disabled = false;

    setLoader(false);
  }
});
const linkie =
  "https://kopopeenkop.myshopify.com/cart/42401773191393:1?attributes[image_id]=";

const scrollToStep = (id) => {
  const steps = document.querySelector(".steps");
  const step = document.getElementById(id);

  steps.scrollTo({
    left: step.offsetLeft,
    behavior: "smooth",
  });
};

const uploadFile = async () => {
  scrollToStep("step2");
  const formData = new FormData();
  // get file from image
  const previewImage = document.getElementById("previewImage");
  const file = await fetch(previewImage.src).then((r) => r.blob());
  formData.append("myFile", file);

  const x = await fetch(
    "https://europe-west1-kopopeenkop.cloudfunctions.net/upload_image",
    {
      method: "POST",
      body: formData,
    }
  );

  const y = await x.json();
  console.log(y);
  const orderBtn = document.getElementById("orderBtn");
  orderBtn.setAttribute("data-picture", y.id);
  orderBtn.disabled = false;
};

const loadImagePreview = (url) => {
  const img = new Image();
  img.src = url;
  img.onload = function () {
    var iw = img.width;
    var ih = img.height;

    //alert(iw)

    var xOffset = 65, //left padding
      yOffset = 100; //top padding

    var a = 83.0; //image width
    var b = 24; //round ness

    var scaleFactor = iw / (3 * a);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // clear ctx
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw vertical slices
    for (var X = 0; X < iw; X += 1) {
      var y = (b / a) * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
      ctx.drawImage(
        img,
        X * scaleFactor,
        0,
        iw / 1.5,
        ih,
        X + xOffset,
        y + yOffset,
        1,
        174
      );
    }
  };
};

const setPreviewColor = (color) => {
  const previewImage = document.getElementById("colorPreviewImage");
  previewImage.src = "images/" + color + ".jpg";
  //   const orderPreviewImage = document.getElementById("orderPreviewImage");
  //     orderPreviewImage.src = "images/" + color + ".jpg";
  const orderBtn = document.getElementById("orderBtn");
  orderBtn.setAttribute("data-color", color);

  // change css variabel --primary-color
  document.documentElement.style.setProperty("--primary-color", color);
  let textColor = "white";
  if (
    color === "yellow" ||
    color === "orange" ||
    color === "pink" ||
    color === "red" ||
    color === "white"
  ) {
    textColor = "black";
  }
  document.documentElement.style.setProperty("--primary-color-text", textColor);
};

document.getElementById("orderBtn").addEventListener("click", (e) => {
  // set loader
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  setLoader(true);
  const orderBtn = document.getElementById("orderBtn");
  orderBtn.disabled = true;

  const pictureId = e.target.getAttribute("data-picture");
  const color = e.target.getAttribute("data-color");
  window.location.href = linkie + pictureId + "&attributes[color]=" + color;
});

const setLoader = (show) => {
  const loader = document.getElementById("loader");
  if (show) {
    loader.style.display = "flex";
  } else {
    loader.style.display = "none";
  }
};
