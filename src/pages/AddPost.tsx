import { useState } from "react";
import NavBar from "../components/NavBar";

const AddPost = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...images, URL.createObjectURL(e.target.files[0])]);
    e.target.value = ""; //reset input, allows for duplicate files
  };

  const handleSubmit = () => {};
  return (
    <div id="post-form">
      <NavBar />
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <label>Choose images: </label>
        <input type="file" onChange={handleImageUpload} />
        <div className="image-container">
          {images.map((image) => {
            return (
              <div key={image}>
                <img src={image} alt="preview" />
                <button
                  onClick={() => {
                    setImages(images.filter((storedImage) => storedImage != image));
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
        <label>Add location: </label>
        <input type="text" placeholder="add location..." required />
        <label>Add Caption: </label>
        <textarea />
        <button type="submit">upload</button>
      </form>
    </div>
  );
};

export default AddPost;
