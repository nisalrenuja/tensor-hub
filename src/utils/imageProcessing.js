import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export async function loadModel() {
  try {
    const model = await mobilenet.load();
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
}

export function preprocessImage(image, targetHeight = 224, targetWidth = 224) {
  const tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([targetHeight, targetWidth])
    .toFloat()
    .expandDims();
  return tensor.div(127.5).sub(1);
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
      img.onload = () => resolve(img);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}
