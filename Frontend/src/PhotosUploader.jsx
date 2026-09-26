import axios from "axios";
import { useState } from "react";
import Image from "./Image.jsx";

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    setError("");
    if (!photoLink.trim()) return;

    try {
      setLoading(true);
      const { data } = await axios.post("/upload-by-link", { link: photoLink.trim() });
      onChange((prev) => [...prev, data]);
      setPhotoLink("");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to add this image.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadPhoto(ev) {
    const files = Array.from(ev.target.files || []);
    if (!files.length) return;

    setError("");
    const data = new FormData();
    files.forEach((file) => data.append("photos", file));

    try {
      setLoading(true);
      const { data: filenames } = await axios.post("/upload", data);
      onChange((prev) => [...prev, ...filenames]);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to upload photos.");
    } finally {
      setLoading(false);
      ev.target.value = "";
    }
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    onChange(addedPhotos.filter((photo) => photo !== filename));
  }

  function selectAsMainPhoto(ev, filename) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter((photo) => photo !== filename)]);
  }

  return (
    <>
      <div className="flex gap-2">
        <input value={photoLink} onChange={(ev) => setPhotoLink(ev.target.value)}
          type="url" placeholder="Add image URL..." />
        <button type="button" onClick={addPhotoByLink}
          className="bg-gray-200 px-4 rounded-2xl" disabled={loading}>
          Add
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {loading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}

      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.map((link) => (
          <div className="h-32 flex relative" key={link}>
            <Image className="rounded-2xl w-full object-cover" src={link} alt="" />
            <button type="button" onClick={(ev) => removePhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-60 rounded-2xl py-2 px-3"
              aria-label="Remove photo">
              ✕
            </button>
            <button type="button" onClick={(ev) => selectAsMainPhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-60 rounded-2xl py-2 px-3"
              aria-label="Make main photo">
              {link === addedPhotos[0] ? "★" : "☆"}
            </button>
          </div>
        ))}

        <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-gray-600">
          <input type="file" multiple accept="image/*" className="hidden" onChange={uploadPhoto} />
          <span className="text-2xl">↑</span> Upload
        </label>
      </div>
    </>
  );
}
