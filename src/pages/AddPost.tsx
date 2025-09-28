import { useState } from "react";
import NavBar from "../components/NavBar";
import { arrayUnion, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddPost = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const imageURLS: string[] = [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImages([...images, { file, preview: URL.createObjectURL(file) }]);
    e.target.value = ""; //reset input, allows for duplicate files
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevent form reloads
    const postRef = doc(collection(db, "posts")); //create document in posts collection
    //grab doc id
    const postId = postRef.id;
    //upload images
    for (const image of images) {
      const storageRef = ref(storage, `postImages/${postId}/${image.file.name}`);
      await uploadBytes(storageRef, image.file);
      const url = await getDownloadURL(storageRef);
      imageURLS.push(url);
    }
    //TODO: add postid to user, and posts
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { posts: arrayUnion(postId) }, { merge: true });
    //TODO: add post details  to posts
    await setDoc(postRef, {
      name: user.displayName,
      images: imageURLS,
      date: serverTimestamp(),
      caption: caption,
      location: location,
    });
    alert("Post uploaded successful!");
    //TODO: reset form
    setImages([]);
    setCaption("");
    setLocation("");
  };
  return (
    <div id="post-form">
      <NavBar />
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <label>Choose images: </label>
        <input type="file" onChange={handleImageUpload} />
        <div className="image-container">
          {images.map((image, i) => {
            return (
              <div key={i}>
                <img src={image.preview} alt="preview" />
                <div
                  onClick={() => {
                    setImages(images.filter((storedImage) => storedImage != image));
                  }}
                >
                  X
                </div>
              </div>
            );
          })}
        </div>
        <label>Add location: </label>
        <input
          value={location}
          type="text"
          placeholder="add location..."
          onChange={handleLocationChange}
          required
        />
        <label>Add Caption: </label>
        <textarea value={caption} onChange={handleCaptionChange} />
        <button type="submit">upload</button>
      </form>
    </div>
  );
};

export default AddPost;
