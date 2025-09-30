import { useState } from "react";
import NavBar from "../components/NavBar";
import { collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { cities } from "../data/locations";

const AddPost = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const cityOptions = Object.values(cities).flat();
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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    //add postid to user, and posts
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userPostRef = doc(db, "users", user.uid, "posts", postId);
    await setDoc(userPostRef, {});
    //get profile pic
    const userDocSnap = await getDoc(userRef);
    let profilePicURL = "";
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      profilePicURL = data.image;
    }
    //add post details  to posts
    await setDoc(postRef, {
      name: user.displayName,
      images: imageURLS,
      date: serverTimestamp(),
      caption: caption,
      location: location,
      likes: 0,
      profilePic: profilePicURL,
      coverPic: imageURLS[0],
      uid: user.uid,
    });

    alert("Post uploaded successful!");
    //TODO: reset form
    setImages([]);
    setCaption("");
    setLocation("");
  };
  return (
    <div id="post-form-container">
      <NavBar />
      <form id="post-form" onSubmit={handleSubmit}>
        <h1>Add Post</h1>
        <label htmlFor="image-upload" className="upload-img-button">
          Choose Images
        </label>
        <input id="image-upload" type="file" onChange={handleImageUpload} />
        <div className="images-container">
          {images.map((image, i) => {
            return (
              <div key={i}>
                <div className="image-topbar">
                  <div
                    className="delete-img"
                    onClick={() => {
                      setImages(images.filter((storedImage) => storedImage != image));
                    }}
                  >
                    <AiOutlineCloseSquare />
                  </div>
                  <div>{i + 1}</div>
                </div>
                <img className="preview-img" src={image.preview} alt={`image ${i} preview`} />
              </div>
            );
          })}
        </div>
        <label>Add location: </label>
        <select onChange={handleLocationChange}>
          <option value="">Select a city</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <label>Add Caption: </label>
        <textarea className="caption" value={caption} onChange={handleCaptionChange} />
        <button type="submit">upload</button>
      </form>
    </div>
  );
};

export default AddPost;
