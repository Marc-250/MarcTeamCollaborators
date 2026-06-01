import { useState } from "react";
import axios from "axios";
import {
  Package,
  Boxes,
  Layers3,
  Save,
  Wrench,
  ShieldCheck,
} from "lucide-react";

function Spare_Part() {
  const [Quantity, setQuantity] = useState("");
  const [Name, setName] = useState("");
  const [Category, setCategory] = useState("");

  const spareParts = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:9000/api/spare-part",
        {
          Name,
          Quantity,
          Category,
        }
      );

      console.log(res.data);

      alert("Spare Part Added Successfully");

      setName("");
      setCategory("");
      setQuantity("");
    } catch (err) {
      console.log(err);
      alert("Failed to Add Spare Part");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* LEFT SIDE */}
      <div className="relative flex-col justify-center hidden w-1/2 px-16 overflow-hidden text-white lg:flex">
        {/* Background Blur */}
        <div className="absolute bg-blue-500 rounded-full w-96 h-96 blur-3xl opacity-20 top-10 left-10"></div>

        <div className="absolute bg-purple-500 rounded-full w-80 h-80 blur-3xl opacity-20 bottom-10 right-10"></div>

        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold leading-tight">
            STOCK INVENTORY
            <br />
            MANAGEMENT SYSTEM
          </h1>

          <p className="mt-6 text-xl leading-9 text-blue-100">
            Manage spare parts inventory efficiently with
            modern tracking, organized stock management,
            and real-time updates.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-6 mt-12">
            {/* Feature */}
            <div className="flex items-center gap-5 p-5 border bg-white/10 rounded-2xl backdrop-blur-lg border-white/10">
              <div className="p-4 bg-blue-600 rounded-2xl">
                <Package size={35} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Spare Parts Tracking
                </h2>

                <p className="text-blue-100">
                  Track and organize all spare parts.
                </p>
              </div>
            </div>

            {/* Feature */}
            <div className="flex items-center gap-5 p-5 border bg-white/10 rounded-2xl backdrop-blur-lg border-white/10">
              <div className="p-4 bg-green-600 rounded-2xl">
                <Boxes size={35} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Inventory Management
                </h2>

                <p className="text-blue-100">
                  Manage quantities and stock movement.
                </p>
              </div>
            </div>

            {/* Feature */}
            <div className="flex items-center gap-5 p-5 border bg-white/10 rounded-2xl backdrop-blur-lg border-white/10">
              <div className="p-4 bg-purple-600 rounded-2xl">
                <ShieldCheck size={35} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Secure Data System
                </h2>

                <p className="text-blue-100">
                  Safe and reliable inventory records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <form
          onSubmit={spareParts}
          className="w-full max-w-2xl p-10 border shadow-2xl bg-white/10 backdrop-blur-2xl border-white/20 rounded-3xl"
        >
          {/* Title */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto bg-blue-600 rounded-full shadow-2xl">
              <Wrench size={50} className="text-white" />
            </div>

            <h2 className="mt-6 text-5xl font-extrabold text-white">
              Spare Part Form
            </h2>

            <p className="mt-3 text-lg text-blue-100">
              Add and manage spare parts inventory.
            </p>
          </div>

          {/* NAME */}
          <div className="mb-7">
            <label className="text-lg font-bold text-white">
              Spare Part Name
            </label>

            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <Package className="text-white" size={24} />

              <input
                className="w-full ml-4 text-lg text-white bg-transparent outline-none placeholder:text-gray-200"
                type="text"
                placeholder="Enter spare part name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mb-7">
            <label className="text-lg font-bold text-white">
              Quantity
            </label>

            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <Boxes className="text-white" size={24} />

              <input
                className="w-full ml-4 text-lg text-white bg-transparent outline-none placeholder:text-gray-200"
                type="number"
                placeholder="Enter quantity"
                value={Quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-10">
            <label className="text-lg font-bold text-white">
              Category
            </label>

            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <Layers3 className="text-white" size={24} />

              <input
                className="w-full ml-4 text-lg text-white bg-transparent outline-none placeholder:text-gray-200"
                type="text"
                placeholder="Enter category"
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="flex items-center justify-center w-full gap-3 py-5 text-xl font-bold text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-2xl"
          >
            <Save size={26} />
            Add Spare Part
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-200">
              Smart Inventory Management System © 2026
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Spare_Part;