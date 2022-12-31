console.log("😃");
const fileInput = document.getElementById("kop");
const preview = document.getElementById("preview");
const form = document.getElementById("form");
// fileInput.addEventListener("change", (e) => {
//   const image = fileInput.files[0];
//   console.log(image);
//   var reader = new FileReader();

//   reader.onload = function (e) {
//     preview.setAttribute("src", e.target.result);
//   };
//   reader.readAsDataURL(image);
// });

fileInput.addEventListener("change", async (e) => {
  e.preventDefault();
  if (fileInput && fileInput.files && fileInput.files[0]) {
    // turn on loader
    setLoader(true);
    const formData = new FormData();
    formData.append("myFile", fileInput.files[0]);

    const x = await fetch(
      "https://europe-west1-kopopeenkop.cloudfunctions.net/upload_image",
      {
        method: "POST",
        body: formData,
      }
    );

    const y = await x.json();

    // set preview image
    document.getElementById("waitUpload").disabled = false;
    const previewImage = document.getElementById("previewImage");
    previewImage.style.width = "auto";
    previewImage.src = y.url;
    const orderBtn = document.getElementById("orderBtn");
    orderBtn.setAttribute("data-picture", y.id);
    orderBtn.disabled = false;
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

const setPreviewColor = (color) => {
  const previewImage = document.getElementById("colorPreviewImage");
  previewImage.src = "images/" + color + ".jpg";
  const orderPreviewImage = document.getElementById("orderPreviewImage");
    orderPreviewImage.src = "images/" + color + ".jpg";
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
