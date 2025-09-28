import { useState } from "react";
import NavBar from "../components/NavBar";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
const user = auth.currentUser;

function UpdateProfile() {
  const [image, setImage] = useState<{ file: File; preview: string }>();
  const [bio, setBio] = useState<string>();
  if (user == null) return;

  const userRef = doc(db, "users", user.uid);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImage({ file, preview: URL.createObjectURL(file) });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //update profile image if image exists
    if (image) {
      //TODO: delete old profile image
      const storageRef = ref(storage, `profileImages/${user.uid}/${image.file.name}`);
      await uploadBytes(storageRef, image.file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(userRef, {
        image: url,
      });
      console.log("here");
    }
    //update bio if bio exists
    if (bio) {
      await updateDoc(userRef, {
        bio: bio,
      });
    }
  };
  return (
    <div>
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        <label>Choose Profile Image: </label>
        <input onChange={handleImageUpload} type="file" />
        <label>Bio: </label>
        <textarea value={bio} onChange={handleBioChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
