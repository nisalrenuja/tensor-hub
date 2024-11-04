"use client";

export default function DetectedObjectsList({ detectedObjects }) {
  return (
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
}
