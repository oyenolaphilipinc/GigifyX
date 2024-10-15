import React, { useEffect, useState } from "react";
import { categories } from "../../../utils/categories";
import ImageUpload from "../../../components/ImageUpload";
import axios from "axios";
import {
  ADD_GIG_ROUTE,
  GET_GIG_BY_ID_ROUTE,
  HOST,
  UPDATE_GIG_ROUTE,
} from "../../../utils/constants";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const EditGig = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const { gigId } = router.query;
  const [files, setFiles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: "",
    category: "",
    description: "",
    time: 0,
    revisions: 0,
    feature: "",
    price: 0,
    shortDesc: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };

  const removeFeature = (index) => {
    const clonedFeatures = [...features];
    clonedFeatures.splice(index, 1);
    setFeatures(clonedFeatures);
  };

  const editGig = async () => {
    const { title, category, description, time, revisions, price, shortDesc } = data;
    if (
      category &&
      description &&
      features.length &&
      files.length &&
      price > 0 &&
      shortDesc.length &&
      time > 0 &&
      title &&
      revisions > 0
    ) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const gigData = {
        title,
        description,
        category,
        time,
        revisions,
        price,
        shortDesc,
        features,
      };

      try {
        const response = await axios.put(
          `${UPDATE_GIG_ROUTE}/${gigId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${cookies.jwt}`,
            },
            params: gigData,
          }
        );

        if (response.status === 200) {
          router.push("/seller/gigs");
        }
      } catch (error) {
        console.error("Error updating gig:", error);
      }
    }
  };

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const {
          data: { gig },
        } = await axios.get(`${GET_GIG_BY_ID_ROUTE}/${gigId}`);
        setData({ ...gig, time: gig.revisions });
        setFeatures(gig.features);

        const filePromises = gig.images.map((image) => {
          const url = HOST + "/uploads/" + image;
          return fetch(url).then(async (response) => {
            const contentType = response.headers.get("content-type");
            const blob = await response.blob();
            return new File([blob], image, { type: contentType });
          });
        });

        const fetchedFiles = await Promise.all(filePromises);
        setFiles(fetchedFiles);
      } catch (ex) {
        console.error("Error fetching gig:", ex);
      }
    };
    if (gigId) {
      fetchGig();
    }
  }, [gigId]);

  const inputClassName = "block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500";
  const labelClassName = "block mb-2 text-sm font-medium text-gray-900";

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">Edit Gig</h1>
      <h3 className="text-xl sm:text-2xl text-gray-900 mb-6">
        Enter the details to edit the gig
      </h3>
      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Gig Title
            </label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              id="title"
              className={inputClassName}
              placeholder="e.g. I will do something I'm really good at"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className={labelClassName}>
              Select a Category
            </label>
            <select
              name="category"
              id="category"
              className={inputClassName}
              onChange={handleChange}
              value={data.category}
            >
              {categories.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Gig Description
          </label>
          <textarea
            name="description"
            id="description"
            className={`${inputClassName} h-32`}
            placeholder="Write a short description"
            value={data.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="delivery" className={labelClassName}>Delivery Time</label>
            <input
              type="number"
              className={inputClassName}
              id="delivery"
              name="time"
              value={data.time}
              onChange={handleChange}
              placeholder="Minimum Delivery Time"
            />
          </div>
          <div>
            <label htmlFor="revision" className={labelClassName}>
              Revisions
            </label>
            <input
              type="number"
              id="revision"
              className={inputClassName}
              placeholder="Max Number of Revisions"
              name="revisions"
              value={data.revisions}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="features" className={labelClassName}>
              Features
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                id="features"
                className={inputClassName}
                placeholder="Enter a Feature Name"
                name="feature"
                value={data.feature}
                onChange={handleChange}
              />
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-md"
                onClick={addFeature}
              >
                Add
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <li
                  key={feature + index.toString()}
                  className="flex items-center py-1 px-2 text-sm bg-gray-100 rounded-md"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() => removeFeature(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label htmlFor="image" className={labelClassName}>
              Gig Images
            </label>
            <ImageUpload files={files} setFile={setFiles} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="shortDesc" className={labelClassName}>
              Short Description
            </label>
            <input
              type="text"
              className={inputClassName}
              id="shortDesc"
              placeholder="Enter a short description"
              name="shortDesc"
              value={data.shortDesc}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClassName}>
              Gig Price ($)
            </label>
            <input
              type="number"
              className={inputClassName}
              id="price"
              placeholder="Enter a price"
              name="price"
              value={data.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <button
            className="w-full sm:w-auto px-5 py-3 text-white bg-[#1DBF73] hover:bg-[#18a164] rounded-md transition-colors"
            type="button"
            onClick={editGig}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGig;