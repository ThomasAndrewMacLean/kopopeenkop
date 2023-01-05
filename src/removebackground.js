const virtualCanvas = document.createElement("canvas");
/**
 * Loads an image into canvas.
 *
 */
function loadImage(src) {
  const img = new Image();
  img.crossOrigin = "";
  const ctx = virtualCanvas.getContext("2d");

  // Load the image on canvas
  img.addEventListener("load", () => {
    // Set canvas width, height same as image
    virtualCanvas.width = img.width;
    virtualCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    removebackground();
  });

  img.src = src;
}

/**
 * Remove background an image
 */
async function removebackground() {
  tf.setBackend("webgl");
  const ctx = virtualCanvas.getContext("2d");
  const segmentation = 0.2;
  // Loading the model
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  });

  // Segmentation
  const { data: map } = await net.segmentPerson(virtualCanvas, {
    segmentationThreshold: segmentation,
    internalResolution: "medium",
  });

  // Extracting image data
  const { data: imgData } = ctx.getImageData(
    0,
    0,
    virtualCanvas.width,
    virtualCanvas.height
  );

  // Creating new image data
  const newImg = ctx.createImageData(virtualCanvas.width, virtualCanvas.height);
  const newImgData = newImg.data;

  for (let i = 0; i < map.length; i++) {
    //The data array stores four values for each pixel
    const [r, g, b, a] = [
      imgData[i * 4],
      imgData[i * 4 + 1],
      imgData[i * 4 + 2],
      imgData[i * 4 + 3],
    ];
    [
      newImgData[i * 4],
      newImgData[i * 4 + 1],
      newImgData[i * 4 + 2],
      newImgData[i * 4 + 3],
    ] = !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
  }

  // Draw the new image back to canvas
  ctx.putImageData(newImg, 0, 0);

  const previewImage = document.getElementById("previewImage");
  previewImage.style.width = "auto";
  previewImage.src = virtualCanvas.toDataURL();
  loadImagePreview(previewImage.src);
}

//   loadImage('family.jpg');
