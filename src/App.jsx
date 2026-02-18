import { removeBackground } from "@imgly/background-removal";
import { useEffect, useState } from "react";

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (resultImage) URL.revokeObjectURL(resultImage);
    };
  }, []);

  const processImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 10 * 1024 * 1024) {
      // 10 MB limit
      alert("File is too large! Max 10 MB.");
      return;
    }

    if (originalImage) URL.revokeObjectURL(originalImage);
    if (resultImage) URL.revokeObjectURL(resultImage);

    setResultImage(null);
    setIsLoading(true);

    const originalUrl = URL.createObjectURL(file);
    setOriginalImage(originalUrl);

    try {
      const resultBlob = await removeBackground(file);
      const resultUrl = URL.createObjectURL(resultBlob);
      setResultImage(resultUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to remove background");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    processImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processImage(file);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-gray-200 px-4 py-1">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Background Remover
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Վերբեռնեք պատկեր և անմիջապես հեռացրեք ֆոնը — առանց սերվերի, առանց API բանալիի, ամբողջությամբ ձեր բրաուզերում։
          </p>
        </header>
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-2 text-center transition-all duration-200 ${
            isDragging ? "ring-2 ring-blue-500 bg-blue-500/10" : ""
          }`}
        >
          <p className="text-lg font-semibold mb-2">
            Drag & drop your image here
          </p>
          <p className="text-sm text-gray-400 mb-2">
            or select an image from your device
          </p>
          <label className="inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-xl font-semibold text-sm sm:text-base">
            Select Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </section>

        {isLoading && (
          <div className="text-center mt-4">
            <p className="text-lg font-medium animate-pulse">
              Removing background...
            </p>
          </div>
        )}

        {(originalImage || resultImage) && (
          <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {originalImage && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-2 text-center">
                <p className="mb-4 font-semibold">Original Image</p>
                <img
                  src={originalImage}
                  alt="Original"
                  className="mx-auto rounded-xl max-h-80 object-contain"
                />
              </div>
            )}
            {resultImage && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-2 text-center">
                <p className="mb-4 font-semibold">Result Image</p>
                <img
                  src={resultImage}
                  alt="Result"
                  className="mx-auto rounded-xl max-h-80 object-contain"
                />
                <a
                  className="inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-xl font-semibold text-sm sm:text-base mt-6"
                  href={resultImage}
                  download="background-removed.png"
                >
                  Download PNG
                </a>
              </div>
            )}
          </section>
        )}
        <footer className="mt-4 text-center text-gray-500 text-sm">
          Built with React & Tailwind CSS — runs 100% in the browser
        </footer>
      </div>
    </main>
  );
}

export default App;
