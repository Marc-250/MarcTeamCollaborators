import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowUpCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

function StockOut() {
  const API = "http://localhost:9000/api";

  const [spareparts, setSpareparts] = useState([]);
  const [stockOutList, setStockOutList] = useState([]);

  const [Spare_Part_Id, setSpare_Part_Id] = useState("");
  const [StockOutQuantity, setStockOutQuantity] = useState("");
  const [StockOutUnitPrice, setStockOutUnitPrice] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);

  // ================= FETCH SPARE PARTS =================
  const fetchSpareParts = async () => {
    try {
      const res = await axios.get(`${API}/spare-parts`);

      setSpareparts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setError("Failed to load spare parts");
    }
  };

  // ================= FETCH STOCK OUT =================
  const fetchStockOut = async () => {
    try {
      const res = await axios.get(`${API}/stock-out`);

      if (Array.isArray(res.data.result)) {
        setStockOutList(res.data.result);
      } else {
        setStockOutList([]);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load stock out records");
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await fetchSpareParts();
      await fetchStockOut();

      setLoading(false);
    };

    loadData();
  }, []);

  // ================= SELECTED PART =================
  const selectedPart = spareparts.find(
    (p) => Number(p.Spare_Part_Id) === Number(Spare_Part_Id)
  );

  // ================= TOTAL PRICE =================
  const totalPrice =
    Number(StockOutQuantity || 0) *
    Number(StockOutUnitPrice || 0);

  // ================= CLEAR FORM =================
  const clearForm = () => {
    setSpare_Part_Id("");
    setStockOutQuantity("");
    setStockOutUnitPrice("");
    setEditingId(null);
  };

  // ================= CREATE & UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (!selectedPart) {
        setError("Please select spare part");
        return;
      }

      if (
        Number(StockOutQuantity) >
        Number(selectedPart.Quantity)
      ) {
        setError("Not enough stock available");
        return;
      }

      const payload = {
        Spare_Part_Id,
        StockOutQuantity,
        StockOutUnitPrice,
        StockOutTotalPrice: totalPrice,
      };

      // UPDATE
      if (editingId) {
        await axios.put(
          `${API}/stock-out/${editingId}`,
          payload
        );

        setSuccess("Stock out updated successfully");
      }

      // CREATE
      else {
        await axios.post(`${API}/stock-out`, payload);

        setSuccess("Stock out added successfully");
      }

      clearForm();

      fetchStockOut();
      fetchSpareParts();

    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
        "Operation failed"
      );
    }
  };

  // ================= DELETE =================
  const deleteStockOut = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/stock-out/${id}`);

      setSuccess("Deleted successfully");

      fetchStockOut();
      fetchSpareParts();

    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  // ================= EDIT =================
  const editStockOut = (item) => {
    setEditingId(item.Stock_Out_Id);

    setSpare_Part_Id(item.Spare_Part_Id);
    setStockOutQuantity(item.StockOutQuantity);
    setStockOutUnitPrice(item.StockOutUnitPrice);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-3xl font-bold text-white bg-black">
        Loading Stock Out System...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-slate-900 via-red-900 to-pink-900">

      {/* HEADER */}
      <div className="mb-10 text-center text-white">

        <h1 className="flex items-center justify-center gap-3 text-5xl font-extrabold">
          <ArrowUpCircle size={45} />
          STOCK OUT MANAGEMENT
        </h1>

        <p className="mt-4 text-lg text-red-100">
          Manage outgoing spare parts inventory system
        </p>
      </div>

      {/* ALERTS */}
      <div className="w-full mb-6">

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-2xl">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 text-green-700 bg-green-100 border border-green-400 rounded-2xl">
            ✅ {success}
          </div>
        )}
      </div>

      {/* FORM SECTION */}
      <div className="w-full p-8 mb-10 bg-white shadow-2xl rounded-3xl">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold text-red-700">
            {editingId
              ? "UPDATE STOCK OUT"
              : "ADD STOCK OUT"}
          </h2>

          {editingId && (
            <button
              onClick={clearForm}
              className="flex items-center gap-2 px-4 py-2 text-white bg-gray-600 rounded-xl hover:bg-gray-700"
            >
              <X size={18} />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >

          {/* SPARE PART */}
          <div>
            <label className="block mb-2 font-bold text-gray-700">
              Spare Part
            </label>

            <select
              value={Spare_Part_Id}
              onChange={(e) =>
                setSpare_Part_Id(e.target.value)
              }
              className="w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">
                Select Spare Part
              </option>

              {spareparts.map((p) => (
                <option
                  key={p.Spare_Part_Id}
                  value={p.Spare_Part_Id}
                >
                  {p.Name} (Stock: {p.Quantity})
                </option>
              ))}
            </select>
          </div>

          {/* QUANTITY */}
          <div>
            <label className="block mb-2 font-bold text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              value={StockOutQuantity}
              onChange={(e) =>
                setStockOutQuantity(e.target.value)
              }
              className="w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* UNIT PRICE */}
          <div>
            <label className="block mb-2 font-bold text-gray-700">
              Unit Price
            </label>

            <input
              type="number"
              value={StockOutUnitPrice}
              onChange={(e) =>
                setStockOutUnitPrice(e.target.value)
              }
              className="w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* TOTAL */}
          <div>
            <label className="block mb-2 font-bold text-gray-700">
              Total Price
            </label>

            <input
              value={totalPrice}
              readOnly
              className="w-full p-4 font-bold text-white bg-red-600 rounded-2xl"
            />
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">

            <button className="w-full p-4 text-lg font-bold text-white transition-all duration-300 bg-red-700 shadow-xl rounded-2xl hover:bg-red-800">
              {editingId
                ? "UPDATE STOCK OUT"
                : "ADD STOCK OUT"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full p-8 bg-white shadow-2xl rounded-3xl">

        <h2 className="mb-8 text-3xl font-bold text-red-700">
          STOCK OUT HISTORY
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border border-collapse">

            <thead className="text-white bg-red-700">

              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">SPARE PART</th>
                <th className="p-4">QUANTITY</th>
                <th className="p-4">UNIT PRICE</th>
                <th className="p-4">TOTAL PRICE</th>
                <th className="p-4">DATE</th>
                <th className="p-4">ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {stockOutList.length > 0 ? (
                stockOutList.map((s) => (

                  <tr
                    key={s.Stock_Out_Id}
                    className="text-center border-b hover:bg-gray-100"
                  >
                    <td className="p-4">
                      {s.Stock_Out_Id}
                    </td>

                    <td className="p-4">
                      {
                        spareparts.find(
                          (p) =>
                            Number(p.Spare_Part_Id) ===
                            Number(s.Spare_Part_Id)
                        )?.Spare_Part_Id || "Unknown"
                      }
                    </td>

                    <td className="p-4">
                      {s.StockOutQuantity}
                    </td>

                    <td className="p-4">
                      {s.StockOutUnitPrice}
                    </td>

                    <td className="p-4">
                      {s.StockOutTotalPrice}
                    </td>

                    <td className="p-4">
                      {s.StockOutDate}
                    </td>

                    <td className="p-4">

                      <div className="flex items-center justify-center gap-3">

                        {/* EDIT */}
                        <button
                          onClick={() => editStockOut(s)}
                          className="p-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            deleteStockOut(
                              s.Stock_Out_Id
                            )
                          }
                          className="p-3 text-white bg-red-600 rounded-xl hover:bg-red-700"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-6 text-lg text-center text-gray-500"
                  >
                    No stock out records found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default StockOut;