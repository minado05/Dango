import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { onAuthStateChanged, type User } from "firebase/auth";

function UpdateProfile() {
  const [image, setImage] = useState<{ file: File; preview: string }>();
  const [bio, setBio] = useState<string>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // cleanup listener
  }, []);
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
      <div className="back-arrow">
        <Link to={`/account/${user.uid}`}>
          <IoIosArrowBack />
          Account
        </Link>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        <label htmlFor="profile-pic-upload" className="upload-img-button">
          Choose Profile Image
        </label>
        <input id="profile-pic-upload" onChange={handleImageUpload} type="file" />
        <label>Bio: </label>
        <textarea value={bio} onChange={handleBioChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
