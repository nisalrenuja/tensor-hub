"use client";

import { useState, useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Zap } from "lucide-react";
import Image from "next/image";

export default function ObjectDetection() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [model, setModel] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [loadingState, setLoadingState] = useState({
    loading: true,
    progress: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoadingState({ loading: true, progress: 10 });
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoadingState({ loading: false, progress: 100 });
      } catch (err) {
        setError("Failed to load model.");
        setLoadingState({ loading: false, progress: 100 });
      }
    };
    loadModel();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const drawDetections = (ctx, detections) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    detections.forEach(({ bbox: [x, y, width, height], class: className }) => {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "green";
      ctx.font = "16px Arial";
      ctx.fillText(className, x, y > 10 ? y - 5 : 10);
    });
  };

  const startDetection = async () => {
    if (!model) return setError("Model not loaded yet.");
    if (!imageRef.current) return setError("No image selected.");

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    setLoadingState({ loading: true, progress: 0 });
    try {
      const detections = await model.detect(imageRef.current);
      setDetectedObjects(detections);
      drawDetections(ctx, detections);
    } catch (err) {
      setError("Failed to perform detection.");
    } finally {
      setLoadingState({ loading: false, progress: 100 });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Object Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingState.loading && loadingState.progress < 100 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Loading model...</p>
            <Progress value={loadingState.progress} className="w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <ImageUploader
            handleFileChange={handleFileChange}
            startDetection={startDetection}
            isDisabled={!uploadedImage || loadingState.loading}
          />

          <div className="relative aspect-square">
            {uploadedImage && (
              <>
                <Image
                  ref={imageRef}
                  src={uploadedImage}
                  alt="Uploaded"
                  className="object-cover rounded-lg"
                />
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </>
            )}
          </div>
        </div>

        {detectedObjects.length > 0 && (
          <DetectedObjectsList detectedObjects={detectedObjects} />
        )}
      </CardContent>
    </Card>
  );
}

const ImageUploader = ({ handleFileChange, startDetection, isDisabled }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
    </div>

    <Button onClick={startDetection} disabled={isDisabled} className="w-full">
      <Zap className="w-4 h-4 mr-2" />
      Start Detection
    </Button>
  </div>
);

const DetectedObjectsList = ({ detectedObjects }) => (
  <div className="mt-4">
    <h2 className="text-lg font-semibold mb-2">Detected Objects:</h2>
    <ul className="space-y-2">
      {detectedObjects.map((obj, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
        >
          <span className="font-medium">{obj.class}</span>
          <span className="text-sm text-muted-foreground">
            {(obj.score * 100).toFixed(2)}%
          </span>
        </li>
      ))}
    </ul>
  </div>
);
