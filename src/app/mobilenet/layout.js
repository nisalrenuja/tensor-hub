export const metadata = {
  title: "Tensor Hub",
  description:
    "A central hub for AI-powered analysis using TensorFlow.js models",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
