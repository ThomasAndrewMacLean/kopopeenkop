console.log("😃");
const fileInput = document.getElementById("kop");
const preview = document.getElementById("preview");
const form = document.getElementById("form");
fileInput.addEventListener("change", (e) => {
  const image = fileInput.files[0];
  console.log(image);
  var reader = new FileReader();

  reader.onload = function (e) {
    preview.setAttribute("src", e.target.result);
  };
  reader.readAsDataURL(image);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
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
  console.log(y);
});
