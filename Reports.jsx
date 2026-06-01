import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  Coins,
  Search,
} from "lucide-react";

export default function Reports() {
  const API = "http://localhost:9000/api";

  const [spareParts, setSpareParts] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // SEARCH STATES
  const [spareSearch, setSpareSearch] = useState("");
  const [stockInSearch, setStockInSearch] = useState("");
  const [stockOutSearch, setStockOutSearch] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [resSpare, resIn, resOut] = await Promise.all([
          axios.get(`${API}/spare-parts`),
          axios.get(`${API}/stock-in`),
          axios.get(`${API}/stock-out`),
        ]);

        setSpareParts(Array.isArray(resSpare.data) ? resSpare.data : []);

        setStockIn(
          Array.isArray(resIn.data.result) ? resIn.data.result : []
        );

        setStockOut(
          Array.isArray(resOut.data.result) ? resOut.data.result : []
        );
      } catch (err) {
        console.log("API Error:", err);
        setError("Failed to load reports. Please try again.");
        setSpareParts([]);
        setStockIn([]);
        setStockOut([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= HELPERS =================
  const getSparePartName = (id) => {
    const part = spareParts.find(
      (p) => String(p.Spare_Part_Id) === String(id)
    );
    return part ? part.Name : "Unknown";
  };

  // FORMAT RWF
  const formatRWF = (amount) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // ================= FILTERS =================
  const filteredSpareParts = spareParts.filter((p) =>
    `${p.Spare_Part_Id} ${p.Name} ${p.Category} ${p.Quantity}`
      .toLowerCase()
      .includes(spareSearch.toLowerCase())
  );

  const filteredStockIn = stockIn.filter((s) =>
    `${s.Stock_In_Id} 
     ${getSparePartName(s.Spare_Part_Id)} 
     ${s.StockInQuantity} 
     ${s.UnitPrice} 
     ${s.TotalPrice}`
      .toLowerCase()
      .includes(stockInSearch.toLowerCase())
  );

  const filteredStockOut = stockOut.filter((s) =>
    `${s.Stock_Out_Id} 
     ${getSparePartName(s.Spare_Part_Id)} 
     ${s.StockOutQuantity} 
     ${s.StockOutUnitPrice} 
     ${s.StockOutTotalPrice}`
      .toLowerCase()
      .includes(stockOutSearch.toLowerCase())
  );

  // ================= TOTALS =================
  const totalSpareParts = spareParts.length;

  const totalStockIn = stockIn.reduce(
    (sum, item) => sum + Number(item.StockInQuantity || 0),
    0
  );

  const totalStockOut = stockOut.reduce(
    (sum, item) => sum + Number(item.StockOutQuantity || 0),
    0
  );

  const totalSales = stockOut.reduce(
    (sum, item) => sum + Number(item.StockOutTotalPrice || 0),
    0
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-blue-700 bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8 font-bold bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100">

      {/* ERROR */}
      {error && (
        <div className="p-4 mb-6 text-white bg-red-600 rounded-xl">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-3 text-5xl font-extrabold text-blue-900">
          <FileText size={45} />
           REPORTS OF INVETORY MANAGEMENT SYSTEM 
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Stock Inventory Management System Overview
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-4">

        <div className="p-6 text-white bg-blue-700 shadow-2xl rounded-3xl">
          <Package size={40} />
          <h2 className="mt-4 text-4xl font-extrabold">{totalSpareParts}</h2>
          <p>TOTAL SPARE PARTS</p>
        </div>

        <div className="p-6 text-white bg-green-700 shadow-2xl rounded-3xl">
          <ArrowDownCircle size={40} />
          <h2 className="mt-4 text-4xl font-extrabold">{totalStockIn}</h2>
          <p>TOTAL STOCK IN</p>
        </div>

        <div className="p-6 text-white bg-red-700 shadow-2xl rounded-3xl">
          <ArrowUpCircle size={40} />
          <h2 className="mt-4 text-4xl font-extrabold">{totalStockOut}</h2>
          <p>TOTAL STOCK OUT</p>
        </div>

        <div className="p-6 text-white bg-purple-700 shadow-2xl rounded-3xl">
          <Coins size={40} />
          <h2 className="mt-4 text-3xl font-extrabold">
            {formatRWF(totalSales)}
          </h2>
          <p>TOTAL SALES</p>
        </div>
      </div>

      {/* SPARE PARTS */}
      <div className="p-6 mb-10 bg-white shadow-2xl rounded-3xl">
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <h2 className="text-2xl text-blue-700">
            SPARE PARTS REPORT
          </h2>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute text-gray-500 left-3 top-3"
              size={18}
            />
            <input
              type="text"
              placeholder="Search spare parts..."
              value={spareSearch}
              onChange={(e) => setSpareSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="text-white bg-blue-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">NAME</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">QUANTITY</th>
              </tr>
            </thead>

            <tbody>
              {filteredSpareParts.map((p) => (
                <tr
                  key={p.Spare_Part_Id}
                  className="text-center border-b hover:bg-gray-100"
                >
                  <td className="p-3">{p.Spare_Part_Id}</td>
                  <td className="p-3">{p.Name}</td>
                  <td className="p-3">{p.Category}</td>
                  <td className="p-3">{p.Quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK IN */}
      <div className="p-6 mb-10 bg-white shadow-2xl rounded-3xl">
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <h2 className="text-2xl text-green-700">
            STOCK IN REPORT
          </h2>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute text-gray-500 left-3 top-3"
              size={18}
            />
            <input
              type="text"
              placeholder="Search stock in..."
              value={stockInSearch}
              onChange={(e) => setStockInSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="text-white bg-green-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">SPARE PART</th>
                <th className="p-3">QUANTITY</th>
                <th className="p-3">UNIT PRICE</th>
                <th className="p-3">TOTAL PRICE</th>
                <th className="p-3">DATE</th>
              </tr>
            </thead>

            <tbody>
              {filteredStockIn.map((s) => (
                <tr
                  key={s.Stock_In_Id}
                  className="text-center border-b hover:bg-gray-100"
                >
                  <td className="p-3">{s.Stock_In_Id}</td>
                  <td className="p-3">
                    {getSparePartName(s.Spare_Part_Id)}
                  </td>
                  <td className="p-3">{s.StockInQuantity}</td>
                  <td className="p-3">
                    {formatRWF(s.UnitPrice)}
                  </td>
                  <td className="p-3">
                    {formatRWF(s.TotalPrice)}
                  </td>
                  <td className="p-3">{s.StockInDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK OUT */}
      <div className="p-6 mb-10 bg-white shadow-2xl rounded-3xl">
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <h2 className="text-2xl text-red-700">
            STOCK OUT REPORT
          </h2>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute text-gray-500 left-3 top-3"
              size={18}
            />
            <input
              type="text"
              placeholder="Search stock out..."
              value={stockOutSearch}
              onChange={(e) => setStockOutSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="text-white bg-red-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">SPARE PART</th>
                <th className="p-3">QUANTITY</th>
                <th className="p-3">UNIT PRICE</th>
                <th className="p-3">TOTAL PRICE</th>
                <th className="p-3">DATE</th>
              </tr>
            </thead>

            <tbody>
              {filteredStockOut.map((s) => (
                <tr
                  key={s.Stock_Out_Id}
                  className="text-center border-b hover:bg-gray-100"
                >
                  <td className="p-3">{s.Stock_Out_Id}</td>
                  <td className="p-3">
                    {getSparePartName(s.Spare_Part_Id)}
                  </td>
                  <td className="p-3">{s.StockOutQuantity}</td>
                  <td className="p-3">
                    {formatRWF(s.StockOutUnitPrice)}
                  </td>
                  <td className="p-3">
                    {formatRWF(s.StockOutTotalPrice)}
                  </td>
                  <td className="p-3">{s.StockOutDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}