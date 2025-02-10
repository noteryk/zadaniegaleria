import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [images, setImages] = useState<ApiResponse[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "car",
    "flower",
    "animals",
  ]);

  interface ApiResponse {
    url: string;
    alt: string;
    likes: number;
  }

  const API_KEY = "48510679-99fbe73876d4e4375bbca531e";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const promises = selectedTypes.map((type) =>
          fetch(
            `https://pixabay.com/api/?key=${API_KEY}&q=${type}&image_type=photo`
          )
            .then((response) => response.json())
            .then((res) =>
              res.hits.map(
                (item: { webformatURL: string; tags: string; likes: number }) => ({
                  url: item.webformatURL,
                  alt: item.tags,
                  likes: item.likes,
                })
              )
            )
        );

        const results = await Promise.all(promises);
        setImages(results.flat());
      } catch (error) {
        console.error("Błąd podczas pobierania obrazów:", error);
      }
    };

    fetchImages();
  }, [selectedTypes]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, name] : prev.filter((type) => type !== name)
    );
  };

  const handleLike = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index].likes += 1;
      return newImages;
    });
  };

  return (
    <>
      <h1>Kategorie zdjęć</h1>
      <div className="checkboxes">
        {["car", "flower", "animals"].map((category, idx) => (
          <label key={idx} className="toggle-label">
            {category === "car" ? "Auta" : category === "flower" ? "Kwiaty" : "Zwierzęta"}
            <div className="toggle-switch">
              <input
                type="checkbox"
                name={category}
                checked={selectedTypes.includes(category)}
                onChange={handleCheckboxChange}
              />
              <span className="slider"></span>
            </div>
          </label>
        ))}
      </div>

      <div className="Container">
        {images.map((item, index) => (
          <div key={index}>
            <img src={item.url} alt={item.alt} />
            <p>Pobrania: {item.likes}</p>
            <button onClick={() => handleLike(index)}>Pobierz</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
