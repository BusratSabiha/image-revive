// import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// function App() {
//   const [model, setModel] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const inputCanvasRef = useRef(null);
//   const outputCanvasRef = useRef(null);

//   // 1️⃣ Load TFJS model
//   useEffect(() => {
//     async function loadModel() {
//       const loadedModel = await tf.loadLayersModel(
//         process.env.PUBLIC_URL + "/tfjs_model/model.json"
//       );
//       setModel(loadedModel);
//       setLoading(false);
//       console.log("✅ NAF-GAN model loaded");
//     }
//     loadModel();
//   }, []);

//   // 2️⃣ Handle image upload
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !model) return;

//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = async () => {
//       const width = img.width;
//       const height = img.height;

//       // Draw blurred image
//       const inputCanvas = inputCanvasRef.current;
//       inputCanvas.width = width;
//       inputCanvas.height = height;
//       inputCanvas.getContext("2d").drawImage(img, 0, 0);

//       // Preprocess
//       const inputTensor = tf.browser
//         .fromPixels(img)
//         .toFloat()
//         .div(255.0)
//         .expandDims(0);

//       // 3️⃣ Run NAF-GAN
//       const outputTensor = await model.executeAsync(inputTensor);

//       const output = outputTensor.squeeze().mul(255).clipByValue(0, 255).toInt();

//       // Draw deblurred image
//       const outputCanvas = outputCanvasRef.current;
//       outputCanvas.width = width;
//       outputCanvas.height = height;

//       await tf.browser.toPixels(output, outputCanvas);

//       // Cleanup
//       tf.dispose([inputTensor, outputTensor, output]);
//     };
//   };

//   return (
//     <div style={{ textAlign: "center", padding: 20 }}>
//       <h1>🖼️ Image Deblurring (NAF-GAN)</h1>

//       {loading ? (
//         <p>Loading model...</p>
//       ) : (
//         <>
//           <input type="file" accept="image/*" onChange={handleImageUpload} />

//           <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
//             <div>
//               <h3>Blurred Image</h3>
//               <canvas ref={inputCanvasRef} style={{ border: "1px solid black" }} />
//             </div>

//             <div style={{ marginLeft: 20 }}>
//               <h3>Deblurred Image</h3>
//               <canvas ref={outputCanvasRef} style={{ border: "1px solid black" }} />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// function App() {
//   const [model, setModel] = useState(null);
//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);

//   // --------------------------------------------------
//   // 1️⃣ Load NAF-GAN model
//   // --------------------------------------------------
//   useEffect(() => {
//     async function loadModel() {
//       await tf.setBackend("webgl"); // faster in browser
//       const modelPath = process.env.PUBLIC_URL + "/tfjs_graph_model/model.json";
//       const loadedModel = await tf.loadGraphModel(modelPath);
//       setModel(loadedModel);
//       console.log("✅ NAF-GAN model loaded");
//     }
//     loadModel();
//   }, []);

//   // --------------------------------------------------
//   // 2️⃣ Handle image upload
//   // --------------------------------------------------
//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => setInputImage(reader.result);
//     reader.readAsDataURL(file);
//   };

//   // --------------------------------------------------
//   // 3️⃣ Preprocess image
//   // --------------------------------------------------
//   const preprocess = (img) => {
//     return tf.browser
//       .fromPixels(img)
//       .resizeBilinear([256, 256]) // MUST match training size
//       .toFloat()
//       .div(127.5)
//       .sub(1)
//       .expandDims(0); // [1, H, W, 3]
//   };

//   // --------------------------------------------------
//   // 4️⃣ Run inference
//   // --------------------------------------------------
//   const deblurImage = async () => {
//     if (!model || !inputImage) return;

//     const imgElement = document.getElementById("input-img");

//     const outputTensor = tf.tidy(() => {
//       const inputTensor = preprocess(imgElement);
//       const prediction = model.predict(inputTensor);
//       return prediction
//         .squeeze()
//         .add(1)
//         .div(2)
//         .mul(255)
//         .clipByValue(0, 255)
//         .cast("int32");
//     });


//     // const originalWidth = imgElement.naturalWidth;
//     // const originalHeight = imgElement.naturalHeight;
//     // const outputResized = tf.image.resizeBilinear(outputTensor, [originalHeight, originalWidth]);


//     // Convert tensor → image
//     const canvas = document.createElement("canvas");
//     await tf.browser.toPixels(outputTensor, canvas);
//     setOutputImage(canvas.toDataURL());

//     outputTensor.dispose();
//   };

//   // --------------------------------------------------
//   // UI
//   // --------------------------------------------------
//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h1>Image Deblurring Tool (NAF-GAN)</h1>

//       <input type="file" accept="image/*" onChange={handleUpload} />

//       {inputImage && (
//         <>
//           <h3>Blurred Image</h3>
//           <img
//             id="input-img"
//             src={inputImage}
//             alt="Input"
//             width={256}
//             height={256}
//             style={{ border: "1px solid black" }}
//           />
//         </>
//       )}

//       <br />
//       <button onClick={deblurImage} disabled={!model}>
//         Deblur Image
//       </button>

//       {outputImage && (
//         <>
//           <h3>Deblurred Output</h3>
//           <img
//             src={outputImage}
//             alt="Output"
//             width={256}
//             height={256}
//             style={{ border: "1px solid green" }}
//           />
//         </>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// export default function App() {

//   const [model, setModel] = useState(null);
//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Load model
//   useEffect(() => {

//     async function loadModel() {

//       await tf.setBackend("webgl");

//       const model = await tf.loadGraphModel(
//         process.env.PUBLIC_URL + "/tfjs_graph_model/model.json"
//       );

//       setModel(model);

//       console.log("Model Loaded");

//     }

//     loadModel();

//   }, []);

//   // Upload
//   const handleUpload = (e) => {

//     const file = e.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = () => {

//       setInputImage(reader.result);
//       setOutputImage(null);

//     };

//     reader.readAsDataURL(file);

//   };

//   // Preprocess
//   const preprocess = (img) => {

//     return tf.browser
//       .fromPixels(img)
//       .resizeBilinear([256,256])
//       .toFloat()
//       .div(127.5)
//       .sub(1)
//       .expandDims(0);

//   };

//   // Gaussian kernel generator
//   function gaussianKernel(size = 5, sigma = 1.0) {

//     const center = Math.floor(size / 2);
//     const values = [];
//     let sum = 0;

//     // generate flat kernel
//     for (let x = 0; x < size; x++) {
//       for (let y = 0; y < size; y++) {

//         const value =
//           Math.exp(
//             -(
//               (x - center) * (x - center) +
//               (y - center) * (y - center)
//             ) /
//             (2 * sigma * sigma)
//           );

//         values.push(value);
//         sum += value;
//       }
//     }

//     // normalize
//     for (let i = 0; i < values.length; i++) {
//       values[i] /= sum;
//     }

//     // reshape to [size, size, 1, 1]
//     return tf.tensor4d(values, [size, size, 1, 1]);

//   }

// // Apply gaussian blur to RGB tensor
// function applyGaussianBlur(imageTensor, size = 5, sigma = 1.0) {

//   const kernel = gaussianKernel(size, sigma);

//   const channels = tf.split(imageTensor, 3, 2);

//   const blurredChannels = channels.map(channel =>
//     tf.conv2d(
//       channel.expandDims(0),
//       kernel,
//       1,
//       "same"
//     ).squeeze()
//   );

//   return tf.stack(blurredChannels, 2);
// }

//   // Deblur
//   const deblurImage = async () => {

//     if (!model || !inputImage) return;

//     setLoading(true);

//     const img = document.getElementById("input-img");

//     const outputTensor = tf.tidy(() => {

//       const inputTensor = preprocess(img);

//       const prediction = model.predict(inputTensor);

//       // convert [-1,1] → [0,255]
//       let output = prediction
//         .squeeze()
//         .add(1)
//         .div(2)
//         .mul(255)
//         .clipByValue(0,255);

//       // ✅ Apply Gaussian denoising
//       output = applyGaussianBlur(output, 5, 1.2);

//       return output.cast("int32");

//     });

//     const canvas = document.createElement("canvas");

//     await tf.browser.toPixels(outputTensor, canvas);

//     setOutputImage(canvas.toDataURL());

//     outputTensor.dispose();

//     setLoading(false);

//   };

//   // Download
//   const downloadImage = () => {

//     const link = document.createElement("a");

//     link.href = outputImage;
//     link.download = "deblurred.png";
//     link.click();

//   };

//   return (

//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">

//       <div className="bg-white shadow-xl rounded-2xl p-8 w-[800px]">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           AI Image Deblur Tool
//         </h1>

//         {/* Upload */}
//         <div className="flex justify-center mb-6">

//           <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">

//             Upload Image

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleUpload}
//               className="hidden"
//             />

//           </label>

//         </div>

//         {/* Images */}
//         {inputImage && (

//           <div className="grid grid-cols-2 gap-6">

//             <div className="text-center">

//               <p className="font-semibold mb-2">Input</p>

//               <img
//                 id="input-img"
//                 src={inputImage}
//                 alt="input"
//                 className="border rounded-lg w-64 h-64 mx-auto object-cover"
//               />

//             </div>

//             <div className="text-center">

//               <p className="font-semibold mb-2">Output</p>

//               {loading ? (

//                 <div className="w-64 h-64 flex items-center justify-center border rounded-lg mx-auto">

//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>

//                 </div>

//               ) : outputImage && (

//                 <img
//                   src={outputImage}
//                   alt="output"
//                   className="border rounded-lg w-64 h-64 mx-auto object-cover"
//                 />

//               )}

//             </div>

//           </div>

//         )}

//         {/* Buttons */}
//         <div className="flex justify-center gap-4 mt-6">

//           <button
//             onClick={deblurImage}
//             disabled={!model || loading}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//           >
//             {loading ? "Processing..." : "Deblur Image"}
//           </button>

//           {outputImage && (

//             <button
//               onClick={downloadImage}
//               className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
//             >
//               Download
//             </button>

//           )}

//         </div>

//       </div>

//     </div>

//   );

// }


// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// export default function App() {

//   const [model, setModel] = useState(null);
//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // =========================
//   // Load Model
//   // =========================
//   useEffect(() => {

//     async function loadModel() {

//       await tf.setBackend("webgl");

//       const loadedModel = await tf.loadGraphModel(
//         process.env.PUBLIC_URL + "/tfjs_graph_model_22/model.json"
//       );

//       setModel(loadedModel);

//       console.log("✅ Model Loaded");

//     }

//     loadModel();

//   }, []);


//   // =========================
//   // Upload Image
//   // =========================
//   const handleUpload = (e) => {

//     const file = e.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = () => {

//       setInputImage(reader.result);
//       setOutputImage(null);

//     };

//     reader.readAsDataURL(file);

//   };


//   // =========================
//   // Preprocess Image
//   // =========================
//   const preprocess = (img) => {

//     const origWidth = img.naturalWidth;
//     const origHeight = img.naturalHeight;

//     const maxSize = 256;

//     const scale = Math.min(
//       maxSize / origWidth,
//       maxSize / origHeight
//     );

//     const newWidth = Math.round(origWidth * scale);
//     const newHeight = Math.round(origHeight * scale);

//     const padX = maxSize - newWidth;
//     const padY = maxSize - newHeight;

//     const padLeft = Math.floor(padX / 2);
//     const padRight = padX - padLeft;
//     const padTop = Math.floor(padY / 2);
//     const padBottom = padY - padTop;

//     let tensor = tf.browser.fromPixels(img);

//     tensor = tf.image.resizeBilinear(
//       tensor,
//       [newHeight, newWidth]
//     );

//     tensor = tf.pad(
//       tensor,
//       [
//         [padTop, padBottom],
//         [padLeft, padRight],
//         [0, 0]
//       ]
//     );

//     tensor = tensor
//       .toFloat()
//       .div(127.5)
//       .sub(1)
//       .expandDims(0);

//     return {
//       tensor,
//       origWidth,
//       origHeight,
//       newWidth,
//       newHeight,
//       padLeft,
//       padTop
//     };
//   };



//   // =========================
//   // Gaussian Kernel (FIXED)
//   // =========================
//   function gaussianKernel(size = 5, sigma = 1.0) {

//     const center = Math.floor(size / 2);

//     const values = [];

//     let sum = 0;

//     for (let x = 0; x < size; x++) {
//       for (let y = 0; y < size; y++) {

//         const value = Math.exp(
//           -(
//             (x - center) ** 2 +
//             (y - center) ** 2
//           ) / (2 * sigma * sigma)
//         );

//         values.push(value);
//         sum += value;

//       }
//     }

//     // normalize
//     for (let i = 0; i < values.length; i++) {

//       values[i] /= sum;

//     }

//     return tf.tensor4d(values, [size, size, 1, 1]);

//   }


//   // =========================
//   // Apply Gaussian Blur
//   // =========================
//   function applyGaussianBlur(imageTensor, size = 5, sigma = 1.0) {

//     const kernel = gaussianKernel(size, sigma);

//     const channels = tf.split(imageTensor, 3, 2);

//     const blurredChannels = channels.map(channel => {

//       const expanded = channel.expandDims(0);

//       const blurred = tf.conv2d(
//         expanded,
//         kernel,
//         1,
//         "same"
//       );

//       return blurred.squeeze();

//     });

//     console.log("gaussian")

//     return tf.stack(blurredChannels, 2);

//   }


//   // =========================
//   // Sharpen filter
//   // =========================
//   function sharpen(imageTensor) {

//     const sharpenKernel = tf.tensor4d(
//       [
//         0, -1, 0,
//         -1, 5, -1,
//         0, -1, 0
//       ],
//       [3, 3, 1, 1]
//     );

//     const channels = tf.split(imageTensor, 3, 2);

//     const sharpenedChannels = channels.map(channel => {

//       const expanded = channel.expandDims(0);

//       const sharpened = tf.conv2d(
//         expanded,
//         sharpenKernel,
//         1,
//         "same"
//       );

//       return sharpened.squeeze();

//     });

//     return tf.stack(sharpenedChannels, 2);

//   }


//   // =========================
//   // Deblur Function
//   // =========================
//   const deblurImage = async () => {

//     if (!model || !inputImage) return;

//     setLoading(true);

//     const img = document.getElementById("input-img");

//     const outputTensor = tf.tidy(() => {

//       // preprocess
//       const {
//         tensor,
//         origWidth,
//         origHeight,
//         newWidth,
//         newHeight,
//         padLeft,
//         padTop
//       } = preprocess(img);

//       let output = tf.tidy(() => {

//         let prediction = model.predict(tensor);

//         prediction = prediction
//           .squeeze()
//           .add(1)
//           .div(2)
//           .mul(255);

//         // denoise
//         prediction = applyGaussianBlur(prediction, 5, 1.0);

//         // sharpen
//         prediction = sharpen(prediction);

//         // remove padding
//         prediction = prediction.slice(
//           [padTop, padLeft, 0],
//           [newHeight, newWidth, 3]
//         );

//         // restore original size
//         prediction = tf.image.resizeBilinear(
//           prediction.expandDims(0),
//           [origHeight, origWidth]
//         ).squeeze();

//         return prediction
//           .round()
//           .clipByValue(0,255)
//           .cast("int32");

//       });


//       // model prediction
//       const prediction = model.predict(inputTensor);

//       // convert [-1,1] → [0,255]
//       output = prediction
//         .squeeze()
//         .add(1)
//         .div(2)
//         .mul(255)
//         .clipByValue(0, 255);

//       // denoise
//       output = applyGaussianBlur(output, 5, 1.0);

//       // sharpen
//       output = sharpen(output);

//       output = output.clipByValue(0, 255);


//       return output.cast("int32");

//     });

//     const canvas = document.createElement("canvas");

//     await tf.browser.toPixels(outputTensor, canvas);

//     setOutputImage(canvas.toDataURL());

//     outputTensor.dispose();

//     setLoading(false);

//   };


//   // =========================
//   // Download
//   // =========================
//   const downloadImage = () => {

//     const link = document.createElement("a");

//     link.href = outputImage;

//     link.download = "deblurred.png";

//     link.click();

//   };


//   // =========================
//   // UI
//   // =========================
//   return (

//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">

//       <div className="bg-white shadow-xl rounded-2xl p-8 w-[800px]">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           AI Image Deblur Tool
//         </h1>

//         <div className="flex justify-center mb-6">

//           <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">

//             Upload Image

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleUpload}
//               className="hidden"
//             />

//           </label>

//         </div>


//         {inputImage && (

//           <div className="grid grid-cols-2 gap-6">

//             <div className="text-center">

//               <p className="font-semibold mb-2">Input</p>

//               <img
//                 id="input-img"
//                 src={inputImage}
//                 alt="input"
//                 className="border rounded-lg w-64 h-64 mx-auto object-cover"
//               />

//             </div>

//             <div className="text-center">

//               <p className="font-semibold mb-2">Output</p>

//               {loading ? (

//                 <div className="w-64 h-64 flex items-center justify-center border rounded-lg mx-auto">

//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>

//                 </div>

//               ) : outputImage && (

//                 <img
//                   src={outputImage}
//                   alt="output"
//                   className="border rounded-lg w-64 h-64 mx-auto object-cover"
//                 />

//               )}

//             </div>

//           </div>

//         )}


//         <div className="flex justify-center gap-4 mt-6">

//           <button
//             onClick={deblurImage}
//             disabled={!model || loading}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//           >
//             {loading ? "Processing..." : "Deblur Image"}
//           </button>

//           {outputImage && (

//             <button
//               onClick={downloadImage}
//               className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
//             >
//               Download
//             </button>

//           )}

//         </div>

//       </div>

//     </div>

//   );

// }


//final 1
// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// export default function App() {

//   const [model, setModel] = useState(null);
//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);


//   // =========================
//   // Load Model
//   // =========================
//   useEffect(() => {

//     async function loadModel() {

//       await tf.setBackend("webgl");

//       const loadedModel = await tf.loadGraphModel(
//         process.env.PUBLIC_URL + "/tfjs_graph_model_ftcse/model.json"
//       );

//       setModel(loadedModel);

//       console.log("✅ Model Loaded");

//     }

//     loadModel();

//   }, []);


//   // =========================
//   // Upload Image
//   // =========================
//   const handleUpload = (e) => {

//     const file = e.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = () => {

//       setInputImage(reader.result);
//       setOutputImage(null);

//     };

//     reader.readAsDataURL(file);

//   };


//   // =========================
//   // Preprocess with padding
//   // =========================
//   const preprocess = (img) => {

//     const origWidth = img.naturalWidth;
//     const origHeight = img.naturalHeight;

//     const maxSize = 256;

//     const scale = Math.min(
//       maxSize / origWidth,
//       maxSize / origHeight
//     );

//     const newWidth = Math.round(origWidth * scale);
//     const newHeight = Math.round(origHeight * scale);

//     const padX = maxSize - newWidth;
//     const padY = maxSize - newHeight;

//     const padLeft = Math.floor(padX / 2);
//     const padRight = padX - padLeft;
//     const padTop = Math.floor(padY / 2);
//     const padBottom = padY - padTop;

//     let tensor = tf.browser.fromPixels(img);

//     tensor = tf.image.resizeBilinear(
//       tensor,
//       [newHeight, newWidth]
//     );

//     tensor = tf.pad(
//       tensor,
//       [
//         [padTop, padBottom],
//         [padLeft, padRight],
//         [0, 0]
//       ]
//     );

//     tensor = tensor
//       .toFloat()
//       .div(127.5)
//       .sub(1)
//       .expandDims(0);

//     return {
//       tensor,
//       origWidth,
//       origHeight,
//       newWidth,
//       newHeight,
//       padLeft,
//       padTop
//     };

//   };


//   // =========================
//   // Gaussian Kernel
//   // =========================
//   function gaussianKernel(size = 5, sigma = 1.0) {

//     const center = Math.floor(size / 2);

//     const values = [];

//     let sum = 0;

//     for (let x = 0; x < size; x++) {
//       for (let y = 0; y < size; y++) {

//         const value = Math.exp(
//           -((x - center) ** 2 + (y - center) ** 2) /
//           (2 * sigma * sigma)
//         );

//         values.push(value);
//         sum += value;

//       }
//     }

//     for (let i = 0; i < values.length; i++) {
//       values[i] /= sum;
//     }

//     return tf.tensor4d(values, [size, size, 1, 1]);

//   }


//   // =========================
//   // Gaussian Blur
//   // =========================
//   function applyGaussianBlur(imageTensor, size = 5, sigma = 1.0) {

//     const kernel = gaussianKernel(size, sigma);

//     const channels = tf.split(imageTensor, 3, 2);

//     const blurredChannels = channels.map(channel => {

//       const expanded = channel.expandDims(0);

//       const blurred = tf.conv2d(
//         expanded,
//         kernel,
//         1,
//         "same"
//       );

//       return blurred.squeeze();

//     });

//     return tf.stack(blurredChannels, 2);

//   }


//   // =========================
//   // Sharpen filter
//   // =========================
//   function sharpen(imageTensor) {

//     const kernel = tf.tensor4d(
//       [
//         0, -1, 0,
//         -1, 5, -1,
//         0, -1, 0
//       ],
//       [3, 3, 1, 1]
//     );

//     const channels = tf.split(imageTensor, 3, 2);

//     const sharpenedChannels = channels.map(channel => {

//       const expanded = channel.expandDims(0);

//       const sharpened = tf.conv2d(
//         expanded,
//         kernel,
//         1,
//         "same"
//       );

//       return sharpened.squeeze();

//     });

//     return tf.stack(sharpenedChannels, 2);

//   }


//   // =========================
//   // Deblur Function
//   // =========================
//   const deblurImage = async () => {

//     if (!model || !inputImage) return;

//     setLoading(true);

//     const img = document.getElementById("input-img");

//     const outputTensor = tf.tidy(() => {

//       const {
//         tensor,
//         origWidth,
//         origHeight,
//         newWidth,
//         newHeight,
//         padLeft,
//         padTop
//       } = preprocess(img);


//       let prediction = model.predict(tensor);

//       prediction = prediction
//         .squeeze()
//         .add(1)
//         .div(2)
//         .mul(255);

//       prediction = applyGaussianBlur(prediction);

//       prediction = sharpen(prediction);

//       prediction = prediction.slice(
//         [padTop, padLeft, 0],
//         [newHeight, newWidth, 3]
//       );

//       prediction = tf.image.resizeBilinear(
//         prediction.expandDims(0),
//         [origHeight, origWidth]
//       ).squeeze();

//       return prediction
//         .round()
//         .clipByValue(0,255)
//         .cast("int32");

//     });


//     const canvas = document.createElement("canvas");

//     await tf.browser.toPixels(outputTensor, canvas);

//     setOutputImage(canvas.toDataURL());

//     outputTensor.dispose();

//     setLoading(false);

//   };


//   // =========================
//   // Download
//   // =========================
//   const downloadImage = () => {

//     const link = document.createElement("a");

//     link.href = outputImage;
//     link.download = "deblurred.png";

//     link.click();

//   };


//   // =========================
//   // UI
//   // =========================
//   return (

//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">

//       <div className="bg-white shadow-xl rounded-2xl p-8 w-[800px]">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           AI Image Deblur Tool
//         </h1>


//         <div className="flex justify-center mb-6">

//           <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">

//             Upload Image

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleUpload}
//               className="hidden"
//             />

//           </label>

//         </div>


//         {inputImage && (

//           <div className="grid grid-cols-2 gap-6">

//             <div className="text-center">

//               <p className="font-semibold mb-2">Input</p>

//               <img
//                 id="input-img"
//                 src={inputImage}
//                 alt="input"
//                 className="border rounded-lg max-w-full max-h-64 mx-auto object-contain"
//               />

//             </div>


//             <div className="text-center">

//               <p className="font-semibold mb-2">Output</p>

//               {loading ? (

//                 <div className="w-64 h-64 flex items-center justify-center border rounded-lg mx-auto">

//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>

//                 </div>

//               ) : outputImage && (

//                 <img
//                   src={outputImage}
//                   alt="output"
//                   className="border rounded-lg max-w-full max-h-64 mx-auto object-contain"
//                 />

//               )}

//             </div>

//           </div>

//         )}


//         <div className="flex justify-center gap-4 mt-6">

//           <button
//             // onClick={() => setShowOptions(true)}
//             onClick={deblurImage}

//             disabled={!model || loading}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//           >
//             {loading ? "Processing..." : "Deblur Image"}
//           </button>


//           {outputImage && (

//             <button
//               onClick={downloadImage}
//               className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
//             >
//               Download
//             </button>

//           )}

//         </div>

//       </div>

//     </div>

//   );

// }




//final with denoise

// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// export default function App() {

//   const [model, setModel] = useState(null);
//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const MODEL_SIZE = 256;

//   // =========================
//   // Load Model
//   // =========================
//   useEffect(() => {

//     async function loadModel() {

//       await tf.setBackend("webgl");

//       const loadedModel = await tf.loadGraphModel(
//         process.env.PUBLIC_URL + "/tfjs_graph_model_ftcse/model.json"
//       );

//       setModel(loadedModel);

//       console.log("✅ Model Loaded");

//     }

//     loadModel();

//   }, []);

//   // =========================
//   // Upload Image
//   // =========================
//   const handleUpload = (e) => {

//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = () => {

//       setInputImage(reader.result);
//       setOutputImage(null);

//     };

//     reader.readAsDataURL(file);

//   };

//   // =========================
//   // Preprocess
//   // =========================
//   const preprocess = (img) => {

//     const origWidth = img.naturalWidth;
//     const origHeight = img.naturalHeight;

//     const scale = Math.min(
//       MODEL_SIZE / origWidth,
//       MODEL_SIZE / origHeight
//     );

//     const newWidth = Math.round(origWidth * scale);
//     const newHeight = Math.round(origHeight * scale);

//     const padX = MODEL_SIZE - newWidth;
//     const padY = MODEL_SIZE - newHeight;

//     const padLeft = Math.floor(padX / 2);
//     const padRight = padX - padLeft;

//     const padTop = Math.floor(padY / 2);
//     const padBottom = padY - padTop;

//     let tensor = tf.browser.fromPixels(img);

//     tensor = tf.image.resizeBilinear(
//       tensor,
//       [newHeight, newWidth]
//     );

//     tensor = tf.pad(
//       tensor,
//       [
//         [padTop, padBottom],
//         [padLeft, padRight],
//         [0, 0]
//       ]
//     );

//     // normalize to [-1,1]
//     tensor = tensor
//       .toFloat()
//       .div(127.5)
//       .sub(1)
//       .expandDims(0);

//     return {
//       tensor,
//       origWidth,
//       origHeight,
//       newWidth,
//       newHeight,
//       padLeft,
//       padTop
//     };

//   };

//   // =========================
//   // DENOISE
//   // =========================
//   function denoise(imageTensor) {

//     return tf.tidy(() => {

//       const kernel = tf.tensor4d([
//         1, 2, 1,
//         2, 4, 2,
//         1, 2, 1
//       ], [3,3,1,1]).div(16);

//       const img = imageTensor.div(255);

//       const channels = tf.split(img, 3, 2);

//       const filtered = channels.map(channel => {

//         const expanded = channel.expandDims(0);

//         return tf.conv2d(
//           expanded,
//           kernel,
//           1,
//           "same"
//         ).squeeze();

//       });

//       return tf.stack(filtered, 2).mul(255);

//     });

//   }

//   // =========================
//   // SHARPEN
//   // =========================
//   function sharpen(imageTensor) {

//     return tf.tidy(() => {

//       const kernel = tf.tensor4d([
//         0, -0.5, 0,
//         -0.5, 3, -0.5,
//         0, -0.5, 0
//       ], [3,3,1,1]);

//       const img = imageTensor.div(255);

//       const channels = tf.split(img, 3, 2);

//       const sharpened = channels.map(channel => {

//         const expanded = channel.expandDims(0);

//         return tf.conv2d(
//           expanded,
//           kernel,
//           1,
//           "same"
//         ).squeeze();

//       });

//       return tf.stack(sharpened, 2).mul(255);

//     });

//   }

//   // =========================
//   // Deblur Function
//   // =========================
//   const deblurImage = async () => {

//     if (!model || !inputImage) return;

//     setLoading(true);

//     await tf.nextFrame();

//     const img = document.getElementById("input-img");

//     const outputTensor = tf.tidy(() => {

//       const {
//         tensor,
//         origWidth,
//         origHeight,
//         newWidth,
//         newHeight,
//         padLeft,
//         padTop
//       } = preprocess(img);

//       let prediction = model.predict(tensor);

//       prediction = prediction.squeeze();

//       // convert [-1,1] → [0,255]
//       prediction = prediction
//         .add(1)
//         .div(2)
//         .mul(255);

//       // DENOISE FIRST
//       prediction = denoise(prediction);

//       // SHARPEN SECOND
//       prediction = sharpen(prediction);

//       // remove padding
//       prediction = prediction.slice(
//         [padTop, padLeft, 0],
//         [newHeight, newWidth, 3]
//       );

//       // resize to original size
//       prediction = tf.image.resizeBilinear(
//         prediction.expandDims(0),
//         [origHeight, origWidth]
//       ).squeeze();

//       return prediction
//         .clipByValue(0,255)
//         .cast("int32");

//     });

//     const canvas = document.createElement("canvas");

//     await tf.browser.toPixels(outputTensor, canvas);

//     setOutputImage(canvas.toDataURL());

//     outputTensor.dispose();

//     setLoading(false);

//   };

//   // =========================
//   // Download
//   // =========================
//   const downloadImage = () => {

//     const link = document.createElement("a");

//     link.href = outputImage;
//     link.download = "deblurred.png";

//     link.click();

//   };

//   // =========================
//   // UI
//   // =========================
//   return (

//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">

//       <div className="bg-white shadow-xl rounded-2xl p-8 w-[800px]">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           AI Image Deblur Tool (Noise-Free)
//         </h1>

//         <div className="flex justify-center mb-6">

//           <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">

//             Upload Image

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleUpload}
//               className="hidden"
//             />

//           </label>

//         </div>

//         {inputImage && (

//           <div className="grid grid-cols-2 gap-6">

//             <div className="text-center">

//               <p className="font-semibold mb-2">Input</p>

//               <img
//                 id="input-img"
//                 src={inputImage}
//                 alt="input"
//                 className="border rounded-lg max-w-full max-h-64 mx-auto"
//               />

//             </div>

//             <div className="text-center">

//               <p className="font-semibold mb-2">Output</p>

//               {loading ? (

//                 <div className="w-64 h-64 flex items-center justify-center border rounded-lg mx-auto">

//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>

//                 </div>

//               ) : outputImage && (

//                 <img
//                   src={outputImage}
//                   alt="output"
//                   className="border rounded-lg max-w-full max-h-64 mx-auto"
//                 />

//               )}

//             </div>

//           </div>

//         )}

//         <div className="flex justify-center gap-4 mt-6">

//           <button
//             onClick={deblurImage}
//             disabled={!model || loading}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//           >
//             {loading ? "Processing..." : "Deblur Image"}
//           </button>

//           {outputImage && (

//             <button
//               onClick={downloadImage}
//               className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
//             >
//               Download
//             </button>

//           )}

//         </div>

//       </div>

//     </div>

//   );

// }

// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";

// export default function App() {

//   const [model, setModel] = useState(null);
//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [inputShape, setInputShape] = useState(null);

//   const MODEL_SIZE = 256;

//   // =========================
//   // LOAD MODEL
//   // =========================
//   useEffect(() => {

//     const checkCV = setInterval(() => {
//       if (window.cv && window.cv.fastNlMeansDenoisingColored) {
//         console.log("✅ OpenCV loaded with denoising support");
//         clearInterval(checkCV);
//       }
//     }, 100);

//     async function loadModel() {

//       await tf.setBackend("webgl");
//       await tf.ready();

//       const loadedModel = await tf.loadGraphModel(
//         process.env.PUBLIC_URL + "/tfjs_graph_model_ftcse/model.json"
//       );

//       console.log("Model input:", loadedModel.inputs[0].shape);
//       console.log("Model output:", loadedModel.outputs[0].shape);

//       setInputShape(loadedModel.inputs[0].shape);
//       setModel(loadedModel);

//     }

//     loadModel();

//   }, []);

//   // =========================
//   // UPLOAD
//   // =========================
//   const handleUpload = (e) => {

//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = () => {
//       setInputImage(reader.result);
//       setOutputImage(null);
//     };

//     reader.readAsDataURL(file);

//   };

//   // =========================
//   // PREPROCESS
//   // =========================
//   const preprocess = (img) => {

//     const origWidth = img.naturalWidth;
//     const origHeight = img.naturalHeight;

//     let tensor = tf.browser.fromPixels(img).toFloat();

//     tensor = tf.image.resizeBilinear(
//       tensor,
//       [MODEL_SIZE, MODEL_SIZE],
//       true
//     );

//     tensor = tensor
//       .div(127.5)
//       .sub(1)
//       .expandDims(0);

//     return {
//       tensor,
//       origWidth,
//       origHeight
//     };

//   };

//   // =========================
//   // OPENCV DENOISE + SHARPEN
//   // =========================
//   // async function opencvProcess(canvas) {

//   //   return new Promise((resolve) => {

//   //     const waitForCV = () => {

//   //       if (!window.cv || !window.cv.imread) {
//   //         setTimeout(waitForCV, 100);
//   //         return;
//   //       }

//   //       const cv = window.cv;

//   //       let src = cv.imread(canvas);

//   //       // DENOISE
//   //       let denoised = new cv.Mat();

//   //       if (cv.fastNlMeansDenoisingColored) {

//   //         cv.fastNlMeansDenoisingColored(
//   //           src,
//   //           denoised,
//   //           10,
//   //           10,
//   //           7,
//   //           21
//   //         );

//   //       } else {

//   //         // fallback
//   //         cv.GaussianBlur(
//   //           src,
//   //           denoised,
//   //           new cv.Size(3, 3),
//   //           0
//   //         );

//   //       }

//   //       // SHARPEN
//   //       let blurred = new cv.Mat();
//   //       cv.GaussianBlur(
//   //         denoised,
//   //         blurred,
//   //         new cv.Size(0, 0),
//   //         1.0
//   //       );

//   //       let sharpened = new cv.Mat();

//   //       cv.addWeighted(
//   //         denoised,
//   //         1.5,
//   //         blurred,
//   //         -0.5,
//   //         0,
//   //         sharpened
//   //       );

//   //       cv.imshow(canvas, sharpened);

//   //       src.delete();
//   //       denoised.delete();
//   //       blurred.delete();
//   //       sharpened.delete();

//   //       resolve();

//   //     };

//   //     waitForCV();

//   //   });

//   // }

//   async function opencvProcess(canvas) {
//     return new Promise((resolve) => {
//       const waitForCV = () => {
//         if (!window.cv || !window.cv.imread) {
//           setTimeout(waitForCV, 100);
//           return;
//         }

//         const cv = window.cv;

//         let src = cv.imread(canvas);

//         // Step 1: Median blur to remove GAN tiny noise
//         cv.medianBlur(src, src, 3);

//         // Step 2: Small Gaussian blur
//         let blurred = new cv.Mat();
//         cv.GaussianBlur(src, blurred, new cv.Size(3, 3), 1.0);

//         // Step 3: Sharpen
//         let sharpened = new cv.Mat();
//         cv.addWeighted(src, 1.5, blurred, -0.5, 0, sharpened);

//         cv.imshow(canvas, sharpened);

//         src.delete();
//         blurred.delete();
//         sharpened.delete();

//         resolve();
//       };
//       waitForCV();
//     });
//   }
//   // =========================
//   // DEBLUR
//   // =========================
//   const deblurImage = async () => {

//     if (!model || !inputImage) return;

//     setLoading(true);

//     await tf.nextFrame();

//     const img = document.getElementById("input-img");

//     const outputTensor = tf.tidy(() => {

//       let { tensor, origWidth, origHeight } = preprocess(img);

//       // NCHW fix
//       if (inputShape[1] === 3)
//         tensor = tensor.transpose([0, 3, 1, 2]);

//       let prediction = model.execute(tensor);

//       if (Array.isArray(prediction))
//         prediction = prediction[0];

//       if (inputShape[1] === 3)
//         prediction = prediction.transpose([0, 2, 3, 1]);

//       prediction = prediction.squeeze();

//       prediction = prediction
//         .add(1)
//         .div(2)
//         .mul(255);

//       prediction = tf.image.resizeBilinear(
//         prediction.expandDims(0),
//         [origHeight, origWidth],
//         true
//       ).squeeze();

//       return prediction.clipByValue(0, 255);

//     });

//     const canvas = document.createElement("canvas");

//     await tf.browser.toPixels(
//       outputTensor.cast("int32"),
//       canvas
//     );

//     outputTensor.dispose();

//     // APPLY OPENCV PROCESSING
//     await opencvProcess(canvas);

//     setOutputImage(canvas.toDataURL());

//     setLoading(false);

//   };

//   // =========================
//   // DOWNLOAD
//   // =========================
//   const downloadImage = () => {

//     const link = document.createElement("a");

//     link.href = outputImage;
//     link.download = "deblurred.png";

//     link.click();

//   };

//   // =========================
//   // UI
//   // =========================
//   return (

//     <div className="min-h-screen flex items-center justify-center bg-gray-100">

//       <div className="bg-white p-8 rounded-xl shadow-xl w-[800px]">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           AI Deblur Tool (OpenCV Version)
//         </h1>

//         <div className="text-center mb-4">

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleUpload}
//           />

//         </div>

//         {inputImage && (

//           <div className="grid grid-cols-2 gap-4">

//             <div>
//               <p>Input</p>
//               <img
//                 id="input-img"
//                 src={inputImage}
//                 alt=""
//                 className="border"
//               />
//             </div>

//             <div>
//               <p>Output</p>
//               {loading
//                 ? "Processing..."
//                 : outputImage &&
//                 <img src={outputImage} alt="" className="border" />
//               }
//             </div>

//           </div>

//         )}

//         <div className="mt-4 flex gap-4 justify-center">

//           <button
//             onClick={deblurImage}
//             disabled={!model}
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Deblur
//           </button>

//           {outputImage && (

//             <button
//               onClick={downloadImage}
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Download
//             </button>

//           )}

//         </div>

//       </div>

//     </div>

//   );

// }



// import React, { useState } from "react";
// import { Client } from "@gradio/client";

// export default function App() {

//   const [inputImage, setInputImage] = useState(null);
//   const [outputUrl, setOutputUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [task, setTask] = useState("Deblurring");

//   // handle image upload
//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setInputImage(file);
//       setOutputUrl(null);
//     }
//   };

//   // send to NAFNet API
//   const handleProcess = async () => {

//     if (!inputImage) {
//       alert("Please upload an image first");
//       return;
//     }

//     try {

//       setLoading(true);

//       const client = await Client.connect("Prajwal-r-k/NAFNetmain");

//       const result = await client.predict("/predict", {
//         image: inputImage,
//         task: task
//       });

//       console.log("Result:", result);

//       const output = result.data[0];

//       // handle all formats safely
//       if (typeof output === "string") {
//         setOutputUrl(output);
//       }
//       else if (output?.url) {
//         setOutputUrl(output.url);
//       }
//       else if (output?.path) {
//         setOutputUrl(
//           `https://prajwal-r-k-nafnetmain.hf.space/file=${output.path}`
//         );
//       }
//       else if (output instanceof Blob) {
//         setOutputUrl(URL.createObjectURL(output));
//       }
//       else {
//         alert("Unknown output format");
//       }

//     } catch (error) {

//       console.error(error);
//       alert("Processing failed");

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (

//     <div style={{ padding: "20px", fontFamily: "Arial" }}>

//       <h2>NAFNet Image Deblur App</h2>

//       {/* Upload */}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleUpload}
//       />

//       <br /><br />

//       {/* Task selection */}
//       <select
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       >
//         <option value="Deblurring">Deblur</option>
//         <option value="Denoising">Denoise</option>
//       </select>

//       <br /><br />

//       {/* Process button */}
//       <button onClick={handleProcess}>
//         Process Image
//       </button>

//       <br /><br />

//       {/* Loading */}
//       {loading && <p>Processing... Please wait</p>}

//       {/* Input Preview */}
//       {inputImage && (
//         <div>
//           <h3>Input Image:</h3>
//           <img
//             src={URL.createObjectURL(inputImage)}
//             alt="input"
//             width="300"
//           />
//         </div>
//       )}

//       {/* Output Preview */}
//       {outputUrl && (
//         <div>
//           <h3>Output Image:</h3>
//           <img
//             src={outputUrl}
//             alt="output"
//             width="300"
//           />
//         </div>
//       )}

//     </div>

//   );
// }

/********************************************************** */
// import React, { useEffect, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import { Client } from "@gradio/client";
// import "./App.css";
// export default function App() {

//   // =============================
//   // STATE
//   // =============================

//   const [selectedModel, setSelectedModel] = useState("patchgan");

//   const [patchGANModel, setPatchGANModel] = useState(null);
//   const [patchGANInputShape, setPatchGANInputShape] = useState(null);

//   const [inputImage, setInputImage] = useState(null);
//   const [outputImage, setOutputImage] = useState(null);

//   const [loading, setLoading] = useState(false);

//   const MODEL_SIZE = 256;

//   // =============================
//   // LOAD PATCHGAN MODEL
//   // =============================

//   useEffect(() => {

//     async function loadPatchGAN() {

//       await tf.setBackend("webgl");
//       await tf.ready();

//       const model = await tf.loadGraphModel(
//         process.env.PUBLIC_URL + "/tfjs_graph_model_ftcse/model.json"
//       );

//       setPatchGANModel(model);
//       setPatchGANInputShape(model.inputs[0].shape);

//       console.log("PatchGAN loaded");

//     }

//     loadPatchGAN();

//   }, []);

//   // =============================
//   // IMAGE UPLOAD
//   // =============================

//   const handleUpload = (e) => {

//     const file = e.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = () => {

//       setInputImage(reader.result);
//       setOutputImage(null);

//     };

//     reader.readAsDataURL(file);

//   };

//   // =============================
//   // OPENCV POSTPROCESS
//   // =============================

//   async function opencvProcess(canvas) {

//     return new Promise(resolve => {

//       const wait = () => {

//         if (!window.cv) {
//           setTimeout(wait, 100);
//           return;
//         }

//         const cv = window.cv;

//         let src = cv.imread(canvas);

//         cv.medianBlur(src, src, 3);

//         let blurred = new cv.Mat();

//         cv.GaussianBlur(src, blurred, new cv.Size(3, 3), 1.0);

//         let sharpened = new cv.Mat();

//         cv.addWeighted(src, 1.5, blurred, -0.5, 0, sharpened);

//         cv.imshow(canvas, sharpened);

//         src.delete();
//         blurred.delete();
//         sharpened.delete();

//         resolve();

//       };

//       wait();

//     });

//   }

//   // =============================
//   // PATCHGAN SHOW
//   // =============================

//   const runPatchGAN_Show = async () => {

//     if (!patchGANModel || !inputImage) return;

//     setLoading(true);

//     const img = document.getElementById("input-img");

//     const tensor = tf.tidy(() => {

//       const originalHeight = img.naturalHeight;
//       const originalWidth = img.naturalWidth;

//       let t = tf.browser.fromPixels(img)
//         .resizeBilinear([MODEL_SIZE, MODEL_SIZE])
//         .toFloat()
//         .div(127.5)
//         .sub(1)
//         .expandDims(0);

//       if (patchGANInputShape[1] === 3)
//         t = t.transpose([0, 3, 1, 2]);

//       let pred = patchGANModel.execute(t);

//       if (Array.isArray(pred)) pred = pred[0];

//       if (patchGANInputShape[1] === 3)
//         pred = pred.transpose([0, 2, 3, 1]);

//       pred = pred.squeeze()
//         .add(1)
//         .div(2)
//         .mul(255);

//       // ✅ FIX: convert grayscale → RGB
//       if (pred.shape.length === 2)
//         pred = pred.expandDims(-1);

//       if (pred.shape[2] === 1)
//         pred = tf.tile(pred, [1, 1, 3]);

//       // ✅ safe resize
//       pred = tf.image.resizeBilinear(
//         pred,
//         [originalHeight, originalWidth]
//       );

//       return pred.clipByValue(0, 255);

//     });

//     const canvas = document.createElement("canvas");

//     canvas.width = img.naturalWidth;
//     canvas.height = img.naturalHeight;

//     await tf.browser.toPixels(
//       tensor.cast("int32"),
//       canvas
//     );

//     tensor.dispose();

//     await opencvProcess(canvas);

//     setOutputImage(canvas.toDataURL());

//     setLoading(false);

//   };
//   // =============================
//   // PATCHGAN HIDDEN (FOR NAFGAN)
//   // =============================

//   const runPatchGAN_Hidden = async () => {

//     const img = document.getElementById("input-img");

//     const origWidth = img.naturalWidth;
//     const origHeight = img.naturalHeight;

//     const outputTensor = tf.tidy(() => {

//       let t = tf.browser.fromPixels(img)
//         .resizeBilinear([MODEL_SIZE, MODEL_SIZE])
//         .toFloat()
//         .div(127.5)
//         .sub(1)
//         .expandDims(0);

//       if (patchGANInputShape[1] === 3)
//         t = t.transpose([0, 3, 1, 2]);

//       let pred = patchGANModel.execute(t);

//       if (Array.isArray(pred)) pred = pred[0];

//       if (patchGANInputShape[1] === 3)
//         pred = pred.transpose([0, 2, 3, 1]);

//       pred = pred.squeeze()
//         .add(1)
//         .div(2)
//         .mul(255);

//       // ✅ RESTORE ORIGINAL SIZE (CRITICAL FIX)
//       pred = tf.image.resizeBilinear(
//         pred.expandDims(0),
//         [origHeight, origWidth],
//         true
//       ).squeeze();

//       return pred.clipByValue(0, 255);

//     });

//     const canvas = document.createElement("canvas");

//     canvas.width = origWidth;
//     canvas.height = origHeight;

//     await tf.browser.toPixels(
//       outputTensor.cast("int32"),
//       canvas
//     );

//     outputTensor.dispose();

//     await opencvProcess(canvas);

//     const blob = await new Promise(resolve =>
//       canvas.toBlob(resolve, "image/png")
//     );

//     return blob;

//   };
//   // =============================
//   // NAFNET DEBLUR
//   // =============================

//   const runNAFNetDeblur = async () => {

//     setLoading(true);

//     const blob = await fetch(inputImage).then(r => r.blob());

//     const client = await Client.connect("Prajwal-r-k/NAFNetmain");

//     const result = await client.predict("/predict", {
//       image: blob,
//       task: "Deblurring"
//     });

//     const output = result.data[0];

//     setOutputImage(
//       output?.url ||
//       `https://prajwal-r-k-nafnetmain.hf.space/file=${output.path}`
//     );

//     setLoading(false);

//   };

//   // =============================
//   // NAFNET DENOISE (FOR NAFGAN)
//   // =============================

//   const runNAFNetDenoise = async (blob) => {
//     console.log("denoising nafnet")

//     const client = await Client.connect("Prajwal-r-k/NAFNetmain");

//     const result = await client.predict("/predict", {
//       image: blob,
//       task: "Denoising"
//     });

//     const output = result.data[0];

//     return (
//       output?.url ||
//       `https://prajwal-r-k-nafnetmain.hf.space/file=${output.path}`
//     );

//   };

//   // =============================
//   // MAIN CONTROLLER
//   // =============================

//   const restoreImage = async () => {

//     if (!inputImage) return;

//     if (selectedModel === "patchgan") {

//       await runPatchGAN_Show();

//     }

//     else if (selectedModel === "nafnet") {

//       await runNAFNetDeblur();

//     }

//     else if (selectedModel === "nafgan") {

//       setLoading(true);

//       const blob = await runPatchGAN_Hidden();

//       const result = await runNAFNetDenoise(blob);

//       setOutputImage(result);

//       setLoading(false);

//     }

//   };

//   const downloadImage = () => {

//     if (!outputImage) return;

//     const link = document.createElement("a");

//     link.href = outputImage;

//     link.download = "image-revive-output.png";

//     document.body.appendChild(link);

//     link.click();

//     document.body.removeChild(link);

//   };

//   // =============================
//   // UI
//   // =============================

//   return (

//     <div className="app-container">

//       <h1 className="app-title">Image Revive</h1>

//       <div className="card">

//         {/* Upload */}
//         <label className="upload-box">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleUpload}
//             hidden
//           />
//           <span className="upload-text">
//             Click to upload blurry image
//           </span>
//         </label>

//         {/* Model selector */}
//         <div className="model-selector">

//           <button
//             className={`model-button ${selectedModel === "patchgan" ? "active" : ""}`}
//             onClick={() => setSelectedModel("patchgan")}
//           >
//             Patch-GAN
//           </button>

//           <button
//             className={`model-button ${selectedModel === "nafnet" ? "active" : ""}`}
//             onClick={() => setSelectedModel("nafnet")}
//           >
//             NAFNet
//           </button>

//           <button
//             className={`model-button ${selectedModel === "nafgan" ? "active" : ""}`}
//             onClick={() => setSelectedModel("nafgan")}
//           >
//             NAF-GAN
//           </button>

//         </div>

//         {/* Restore */}
//         <button
//           className="restore-button"
//           onClick={restoreImage}
//         >
//           Restore Image
//         </button>

//         {loading && (
//           <p className="loading-text">
//             Processing...
//           </p>
//         )}

//       </div>

//       {/* Preview */}
//       <div className="preview-container">

//         {inputImage && (
//           <div className="preview-card">
//             <p>Input</p>
//             <img
//               id="input-img"
//               src={inputImage}
//               className="preview-image"
//               alt=""
//             />
//           </div>
//         )}

//         {outputImage && (
//           <div className="preview-card">
//             <p>Output</p>
//             <img
//               src={outputImage}
//               className="preview-image"
//               alt=""
//             />
//           </div>
//         )}

//       </div>

//     </div>

//   );

// }

import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Client } from "@gradio/client";
import { FiDownload } from "react-icons/fi";
import "./App.css";

const MODEL_SIZE = 256;

export default function App() {

  const [inputImage, setInputImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);

  const [patchGANModel, setPatchGANModel] = useState(null);
  const [patchGANInputShape, setPatchGANInputShape] = useState(null);

  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadStatus, setUploadStatus] = useState("");


  // =========================
  // Load PatchGAN
  // =========================

  useEffect(() => {

    async function loadModel() {

      await tf.setBackend("webgl");
      await tf.ready();

      const model = await tf.loadGraphModel(
        process.env.PUBLIC_URL + "/tfjs_graph_model_ftcse/model.json"
      );

      setPatchGANModel(model);
      setPatchGANInputShape(model.inputs[0].shape);

      console.log("PatchGAN loaded");

    }

    loadModel();

  }, []);


  // =========================
  // Upload
  // =========================

  const handleUpload = async (e) => {

    if (!e.target.files[0]) return;

    const file = e.target.files[0];

    // ✅ Validate file type
    if (!file.type.startsWith("image/")) {
      setError("You must upload an image file!");
      return;
    }

    setUploadStatus("Uploading...");

    const url = URL.createObjectURL(file);

    await new Promise(resolve => setTimeout(resolve, 500));

    setInputImage(url);
    setOutputImage(null);
    setSelectedModel(null);
    setShowModelSelector(false);
    setError("");

    setUploadStatus("Uploaded successfully ✓");
  };

  const handleDrop = async (e) => {

    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file) return;

    // ✅ Validate file type
    if (!file.type.startsWith("image/")) {
      setError("You must upload an image file!");
      return;
    }

    setUploadStatus("Uploading...");

    const url = URL.createObjectURL(file);

    await new Promise(resolve => setTimeout(resolve, 500));

    setInputImage(url);
    setOutputImage(null);

    setUploadStatus("Uploaded successfully ✓");
  };



  useEffect(() => {

    const handlePaste = (e) => {

      const items = e.clipboardData.items;

      for (let item of items) {

        if (item.type.indexOf("image") !== -1) {

          const file = item.getAsFile();

          if (!file.type.startsWith("image/")) {
            setError("You must upload an image file!");
            return;
          }

          const url = URL.createObjectURL(file);

          setInputImage(url);
          setOutputImage(null);
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () =>
      window.removeEventListener("paste", handlePaste);

  }, []);




  const handleURL = async (e) => {

    if (e.key !== "Enter") return;
  
    const url = e.target.value.trim();
    if (!url) return;
  
    setUploadStatus("Uploading...");
    setError("");
  
    // ✅ STEP 1: Check file extension FIRST
    // if (!url.match(/\.(jpeg|jpg|png|webp|gif)$/i)) {
    //   setUploadStatus("");
    //   setError("Only JPG, PNG, WEBP, GIF images allowed!");
    //   return;
    // }
  
    // ✅ STEP 2: Try loading as image (safer method)
    const img = new Image();
  
    img.onload = () => {
      setInputImage(url);
      setOutputImage(null);
      setUploadStatus("Uploaded successfully ✓");
    };
  
    img.onerror = () => {
      setUploadStatus("");
      setError("You must upload a valid image URL!");
    };

    if (!url.match(/\.(jpeg|jpg|png|webp|gif)$/i)) {
      setUploadStatus("");
      setError("Only JPG, PNG, WEBP, GIF images allowed!");
      return;
    }
  
    img.src = url;
  };

  // =========================
  // Download
  // =========================

  const downloadImage = async (url, filename) => {

    try {

      const response = await fetch(url);

      const blob = await response.blob();

      const blobURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobURL;

      link.download = filename || "download.png";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobURL);

    }
    catch (error) {

      console.error("Download failed:", error);
      setError("Dowlload failed");

    }

  };


  // =========================
  // OpenCV Processing
  // =========================

  const opencvProcess = async (canvas) => {

    return new Promise((resolve) => {

      const wait = () => {

        if (!window.cv) {

          setTimeout(wait, 100);
          return;

        }

        const cv = window.cv;

        let src = cv.imread(canvas);

        let blurred = new cv.Mat();

        cv.GaussianBlur(src, blurred, new cv.Size(3, 3), 1);

        cv.addWeighted(src, 1.5, blurred, -0.5, 0, src);

        cv.imshow(canvas, src);

        src.delete();
        blurred.delete();

        resolve();

      };

      wait();

    });

  };


  // =========================
  // PatchGAN SHOW
  // =========================

  const runPatchGAN_Show = async () => {

    const img = document.getElementById("input-img");

    const origWidth = img.naturalWidth;
    const origHeight = img.naturalHeight;

    const tensor = tf.tidy(() => {

      let t = tf.browser.fromPixels(img)
        .resizeBilinear([MODEL_SIZE, MODEL_SIZE])
        .toFloat()
        .div(127.5)
        .sub(1)
        .expandDims(0);

      if (patchGANInputShape[1] === 3)
        t = t.transpose([0, 3, 1, 2]);

      let pred = patchGANModel.execute(t);

      if (Array.isArray(pred)) pred = pred[0];

      if (patchGANInputShape[1] === 3)
        pred = pred.transpose([0, 2, 3, 1]);

      pred = pred.squeeze()
        .add(1)
        .div(2)
        .mul(255);

      pred = tf.image.resizeBilinear(
        pred.expandDims(0),
        [origHeight, origWidth]
      ).squeeze();

      return pred.clipByValue(0, 255);

    });

    const canvas = document.createElement("canvas");

    canvas.width = origWidth;
    canvas.height = origHeight;

    await tf.browser.toPixels(tensor.cast("int32"), canvas);

    tensor.dispose();

    await opencvProcess(canvas);

    setOutputImage(canvas.toDataURL());

  };


  // =========================
  // PatchGAN HIDDEN
  // =========================

  const runPatchGAN_Hidden = async () => {

    const img = document.getElementById("input-img");

    const origWidth = img.naturalWidth;
    const origHeight = img.naturalHeight;

    const tensor = tf.tidy(() => {

      let t = tf.browser.fromPixels(img)
        .resizeBilinear([MODEL_SIZE, MODEL_SIZE])
        .toFloat()
        .div(127.5)
        .sub(1)
        .expandDims(0);

      if (patchGANInputShape[1] === 3)
        t = t.transpose([0, 3, 1, 2]);

      let pred = patchGANModel.execute(t);

      if (Array.isArray(pred)) pred = pred[0];

      if (patchGANInputShape[1] === 3)
        pred = pred.transpose([0, 2, 3, 1]);

      pred = pred.squeeze()
        .add(1)
        .div(2)
        .mul(255);

      pred = tf.image.resizeBilinear(
        pred.expandDims(0),
        [origHeight, origWidth]
      ).squeeze();

      return pred.clipByValue(0, 255);

    });

    const canvas = document.createElement("canvas");

    canvas.width = origWidth;
    canvas.height = origHeight;

    await tf.browser.toPixels(tensor.cast("int32"), canvas);

    tensor.dispose();

    await opencvProcess(canvas);

    return new Promise(resolve =>
      canvas.toBlob(resolve, "image/png")
    );

  };


  // =========================
  // NAFNet
  // =========================

  const runNAFNet = async (imageBlob, task = "Deblurring") => {

    const client = await Client.connect("Prajwal-r-k/NAFNetmain");

    const result = await client.predict("/predict", {

      image: imageBlob,

      task: task

    });

    const output = result.data[0];

    if (output.url)
      return output.url;

    if (output.path)
      return `https://prajwal-r-k-nafnetmain.hf.space/file=${output.path}`;

  };


  // =========================
  // Restore Logic
  // =========================

  const restoreImage = async () => {

    if (!selectedModel) {

      setError("Please select a model first");
      return;

    }

    setError("");

    setLoading(true);

    try {

      if (selectedModel === "patchgan")
        await runPatchGAN_Show();

      else if (selectedModel === "nafnet") {

        const blob = await fetch(inputImage).then(r => r.blob());

        const url = await runNAFNet(blob, "Deblurring");

        setOutputImage(url);

      }

      else if (selectedModel === "nafgan") {

        const blob = await runPatchGAN_Hidden();

        const url = await runNAFNet(blob, "Denoising");

        setOutputImage(url);

      }

    }
    catch (e) {

      console.error(e);

      setError("Processing failed");

    }

    setLoading(false);

  };


  // =========================
  // UI
  // =========================

  return (

    <div className="page">

      {/* Top Navbar */}
      <div className="navbar">
        <h1 className="logo">Image Revive</h1>
      </div>

      {/* Split Layout */}
      <div className="hero">

        {/* LEFT SIDE */}
        <div className="hero-left">
          <h2>AI-Powered Image Deblurring</h2>
          <p>
            Restore blurry images using advanced deep learning models.
            Fast, accurate and easy to use.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">

          {/* Upload Card */}
          <div
            className="upload-card"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >

            <input
              type="file"
              accept="image/*"
              id="fileInput"
              hidden
              onChange={handleUpload}
            />

            <button
              className="browse-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Browse files
            </button>

            <p>Drop image, paste, or add URL</p>

            <input
              type="text"
              placeholder="Paste image URL here"
              className="url-input"
              onKeyDown={handleURL}
            />

          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <p className="upload-status">{uploadStatus}</p>
          )}

          {/* Hidden Image For Processing */}
          {inputImage && (
            <img
              id="input-img"
              src={inputImage}
              alt=""
              style={{ display: "none" }}
            />
          )}

          {/* Model Selector */}
          {inputImage && (
            <>
              <button
                className="select-button"
                onClick={() => setShowModelSelector(true)}
              >
                Select Model
              </button>

              {showModelSelector && (

                <div className="model-box">

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="model"
                      onChange={() => setSelectedModel("patchgan")}
                    />
                    <span>Patch-GAN</span>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="model"
                      onChange={() => setSelectedModel("nafnet")}
                    />
                    <span>NAFNet</span>
                  </label>

                  <label className="radio-item">
                    <input
                      type="radio"
                      name="model"
                      onChange={() => setSelectedModel("nafgan")}
                    />
                    <span>NAF-GAN</span>
                  </label>

                  <button
                    className="deblur-button"
                    onClick={restoreImage}
                  >
                    Deblur Image
                  </button>

                </div>

              )}
            </>
          )}

          {error && <p className="error">{error}</p>}
          {loading && <p className="processing">Processing...</p>}

        </div>

      </div>

      {/* Result Section */}
      {outputImage && (
        <div className="result">
          <div>
            <FiDownload
              className="download"
              onClick={() => downloadImage(inputImage, "input.png")}
            />
            <img src={inputImage} alt="" />
          </div>

          <div>
            <FiDownload
              className="download"
              onClick={() => downloadImage(outputImage, "output.png")}
            />
            <img src={outputImage} alt="" />
          </div>
        </div>
      )}

    </div>
  );

}