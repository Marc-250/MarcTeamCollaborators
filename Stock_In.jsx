import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  ArrowDownCircle,
  Boxes,
  Save,
  Warehouse,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

function StockIn() {
  const [spareparts, setSpareparts] = useState([]);
  const [Spare_Part_Id, setSpare_Part_Id] = useState("");
  const [StockInQuantity, setStockInQuantity] = useState("");
  const [UnitPrice, setUnitPrice] = useState("");

  const API = "http://localhost:9000/api";

  // FETCH SPARE PARTS
  const fetchSpareParts = () => {
    axios
      .get(`${API}/spare-parts`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSpareparts(res.data);
        } else if (Array.isArray(res.data.data)) {
          setSpareparts(res.data.data);
        } else {
          setSpareparts([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setSpareparts([]);
      });
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  // STOCK IN FUNCTION
  const stockIn = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/stock-in`, {
        Spare_Part_Id,
        StockInQuantity: Number(StockInQuantity),
        UnitPrice: Number(UnitPrice),
        TotalPrice: Number(StockInQuantity) * Number(UnitPrice),
      });

      console.log(res.data);
      alert("Stock Added Successfully");

      setSpare_Part_Id("");
      setStockInQuantity("");
      setUnitPrice("");

      fetchSpareParts();
    } catch (err) {
      console.log(err);
      alert("Failed to Add Stock");
    }
  };

  const totalPrice =
    Number(StockInQuantity || 0) * Number(UnitPrice || 0);

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

      {/* LEFT SIDE */}
      <div className="relative flex-col justify-center hidden w-1/2 px-16 overflow-hidden text-white lg:flex">

        <div className="absolute bg-blue-500 rounded-full w-96 h-96 blur-3xl opacity-20 top-10 left-10"></div>
        <div className="absolute bg-green-500 rounded-full w-80 h-80 blur-3xl opacity-20 bottom-10 right-10"></div>

        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold leading-tight">
            STOCK IN
            <br />
            MANAGEMENT SYSTEM
          </h1>

          <p className="mt-6 text-xl leading-9 text-blue-100">
            Efficiently manage incoming spare parts and update inventory in real time using the modern Smart Inventory Management System.
          </p>

          <div className="grid grid-cols-1 gap-6 mt-12">

            <div className="flex items-center gap-5 p-5 border bg-white/10 rounded-2xl backdrop-blur-lg border-white/10">
              <div className="p-4 bg-blue-600 rounded-2xl">
                <ArrowDownCircle size={35} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Stock In Tracking</h2>
                <p className="text-blue-100">Record all incoming stock accurately.</p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-5 border bg-white/10 rounded-2xl backdrop-blur-lg border-white/10">
              <div className="p-4 bg-green-600 rounded-2xl">
                <Warehouse size={35} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Warehouse Management</h2>
                <p className="text-blue-100">Organize inventory with ease.</p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-5 border bg-white/10 rounded-2xl backdrop-blur-lg border-white/10">
              <div className="p-4 bg-purple-600 rounded-2xl">
                <ShieldCheck size={35} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Secure Inventory</h2>
                <p className="text-blue-100">Maintain safe and reliable stock records.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">

        <form
          onSubmit={stockIn}
          className="w-full max-w-2xl p-10 border shadow-2xl bg-white/10 backdrop-blur-2xl border-white/20 rounded-3xl"
        >

          <div className="mb-10 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto bg-green-600 rounded-full shadow-2xl">
              <ArrowDownCircle size={50} className="text-white" />
            </div>

            <h2 className="mt-6 text-5xl font-extrabold text-white">
              Stock In Form
            </h2>

            <p className="mt-3 text-lg text-blue-100">
              Add incoming spare parts into inventory.
            </p>
          </div>

          {/* SPARE PART */}
          <div className="mb-7">
            <label className="text-lg font-bold text-white">Select Spare Part</label>
            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <Package className="text-white" size={24} />
              <select
                value={Spare_Part_Id}
                onChange={(e) => setSpare_Part_Id(e.target.value)}
                className="w-full ml-4 text-lg text-white bg-transparent outline-none"
                required
              >
                <option className="text-black" value="">
                  Select Spare Part
                </option>
                {spareparts.map((p) => (
                  <option
                    className="text-black"
                    key={p.Spare_Part_Id}
                    value={p.Spare_Part_Id}
                  >
                    {p.Spare_Part_Id} - {p.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mb-7">
            <label className="text-lg font-bold text-white">Stock Quantity</label>
            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <Boxes className="text-white" size={24} />
              <input
                className="w-full ml-4 text-lg text-white bg-transparent outline-none"
                type="number"
                placeholder="Enter quantity"
                value={StockInQuantity}
                onChange={(e) => setStockInQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* UNIT PRICE */}
          <div className="mb-7">
            <label className="text-lg font-bold text-white">Unit Price</label>
            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <DollarSign className="text-white" size={24} />
              <input
                className="w-full ml-4 text-lg text-white bg-transparent outline-none"
                type="number"
                placeholder="Enter unit price"
                value={UnitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* TOTAL PRICE */}
          <div className="mb-10">
            <label className="text-lg font-bold text-white">Total Price</label>
            <div className="flex items-center px-5 py-4 mt-3 border bg-white/20 border-white/20 rounded-2xl">
              <DollarSign className="text-white" size={24} />
              <input
                className="w-full ml-4 text-lg text-white bg-transparent outline-none"
                type="number"
                value={totalPrice}
                readOnly
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="flex items-center justify-center w-full gap-3 py-5 text-xl font-bold text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 rounded-2xl"
          >
            <Save size={26} />
            Add Stock
          </button>

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

export default StockIn;
