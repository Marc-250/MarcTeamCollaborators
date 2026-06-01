import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  Menu,
  X,
  FileText,
  Bell,
  UserCircle2,
  Search,
  LogOut,
  Settings,
  BarChart3,
  Activity,
  TrendingUp,
  Wallet,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function Menubar() {
  const [open, setOpen] = useState(true);

  const API = "http://localhost:9000/api";

  const [spareParts, setSpareParts] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= MENUS =================
  const menus = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={24} />,
      link: "/dashboard",
    },
    {
      title: "Spare Parts",
      icon: <Package size={24} />,
      link: "/Spare-Parts",
    },
    {
      title: "Stock In",
      icon: <ArrowDownCircle size={24} />,
      link: "/Stock-In",
    },
    {
      title: "Stock Out",
      icon: <ArrowUpCircle size={24} />,
      link: "/Stock-Out",
    },
    {
      title: "Reports",
      icon: <FileText size={24} />,
      link: "/reports",
    },
  ];

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [resSpare, resIn, resOut] = await Promise.all([
          axios.get(`${API}/spare-parts`),
          axios.get(`${API}/stock-in`),
          axios.get(`${API}/stock-out`),
        ]);

        setSpareParts(
          Array.isArray(resSpare.data)
            ? resSpare.data
            : []
        );

        setStockIn(
          Array.isArray(resIn.data.result)
            ? resIn.data.result
            : []
        );

        setStockOut(
          Array.isArray(resOut.data.result)
            ? resOut.data.result
            : []
        );
      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= TOTALS =================
  const totalSpareParts = spareParts.length;

  const totalStockIn = stockIn.reduce(
    (sum, item) =>
      sum + Number(item.StockInQuantity || 0),
    0
  );

  const totalStockOut = stockOut.reduce(
    (sum, item) =>
      sum + Number(item.StockOutQuantity || 0),
    0
  );

  const totalSales = stockOut.reduce(
    (sum, item) =>
      sum + Number(item.StockOutTotalPrice || 0),
    0
  );

  // ================= PRODUCT STATUS =================
  const productStatus = spareParts.map((part) => {
    const quantity = Number(part.Quantity || 0);

    let status = "BALANCED";
    let color = "bg-blue-100 text-blue-700";
    let icon = <CheckCircle size={18} />;

    if (quantity <= 5) {
      status = "LOW STOCK";
      color = "bg-red-100 text-red-700";
      icon = <XCircle size={18} />;
    } else if (quantity <= 15) {
      status = "MEDIUM STOCK";
      color = "bg-yellow-100 text-yellow-700";
      icon = <AlertTriangle size={18} />;
    }

    return {
      ...part,
      status,
      color,
      icon,
    };
  });

  // ================= NOTIFICATIONS =================
  const lowStockNotifications = productStatus.filter(
    (product) => Number(product.Quantity) <= 5
  );

  // ================= FORMAT MONEY =================
  const formatRWF = (amount) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-4xl font-black text-blue-700">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-black bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* SIDEBAR */}
      <div
        className={`${
          open ? "w-72" : "w-24"
        } bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 text-white shadow-2xl transition-all duration-300`}
      >

        {/* TOP */}
        <div className="flex items-center justify-between p-5 border-b border-blue-800">
          {open && (
            <div>
              <h1 className="text-2xl">
                STOCK INVENTORY
              </h1>

              <p className="text-blue-200">
                MANAGEMENT SYSTEM
              </p>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="p-3 bg-blue-700 rounded-2xl hover:bg-blue-600"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* PROFILE */}
        <div className="flex flex-col items-center mt-10">
          <div className="p-5 bg-white rounded-full text-slate-900">
            <UserCircle2 size={65} />
          </div>

          {open && (
            <>
              <h2 className="mt-5 text-2xl">
                MarcIT-250
              </h2>

              <p className="text-blue-200">
                SmartPack Garage
              </p>
            </>
          )}
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-4 px-4 mt-12">
          {menus.map((menu, index) => (
            <a
              key={index}
              href={menu.link}
              className="flex items-center gap-4 p-4 transition rounded-2xl hover:bg-blue-700"
            >
              {menu.icon}

              {open && (
                <span className="text-lg">
                  {menu.title}
                </span>
              )}
            </a>
          ))}

          <button className="flex items-center gap-4 p-4 bg-gray-800 rounded-2xl hover:bg-gray-700">
            <Settings size={24} />

            {open && (
              <span className="text-lg">
                Settings
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 p-4 mt-3 text-lg text-white bg-red-700 rounded-2xl hover:bg-red-600"
          >
            <LogOut size={22} />
            {open && "LOGOUT"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">

        {/* NAVBAR */}
        <div className="flex items-center justify-between px-8 py-5 bg-white shadow-xl">

          {/* SEARCH */}
          <div className="flex items-center bg-gray-100 rounded-2xl px-5 py-4 w-[420px]">
            <Search className="text-gray-500" size={22} />

            <input
              type="text"
              placeholder="SEARCH INVENTORY..."
              className="w-full ml-4 text-lg bg-transparent outline-none"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

         
            

            {/* USER */}
            <div className="flex items-center gap-4 p-3 bg-white border rounded-2xl shadow-lg">
              <div className="p-3 text-white bg-blue-700 rounded-full">
                <UserCircle2 size={38} />
              </div>

              <div>
                <h2 className="text-lg text-gray-800">
                  Administrator
                </h2>

                <p className="text-sm text-gray-500">
                  smartpack56@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-10">

          {/* DASHBOARD */}
          <div className="p-10 bg-white shadow-2xl rounded-[35px]">

            <h1 className="text-3xl text-blue-900">
              SMART PARK INVENTORY MANAGEMENT SYSTEM
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Monitor stock levels and live inventory
              balance from database records.
            </p>

            {/* STATISTICS */}
            <div className="grid grid-cols-1 gap-8 mt-14 md:grid-cols-2 xl:grid-cols-4">

              {/* SPARE PARTS */}
              <div className="p-8 text-white shadow-2xl bg-gradient-to-r from-blue-600 to-blue-900 rounded-3xl">
                <Package size={55} />

                <h2 className="mt-6 text-5xl">
                  {totalSpareParts}
                </h2>

                <p className="mt-3 text-lg">
                  TOTAL PRODUCTS
                </p>
              </div>

              {/* STOCK IN */}
              <div className="p-8 text-white shadow-2xl bg-gradient-to-r from-green-600 to-emerald-800 rounded-3xl">
                <ArrowDownCircle size={55} />

                <h2 className="mt-6 text-5xl">
                  {totalStockIn}
                </h2>

                <p className="mt-3 text-lg">
                  STOCK IN
                </p>
              </div>

              {/* STOCK OUT */}
              <div className="p-8 text-white shadow-2xl bg-gradient-to-r from-red-600 to-pink-800 rounded-3xl">
                <ArrowUpCircle size={55} />

                <h2 className="mt-6 text-5xl">
                  {totalStockOut}
                </h2>

                <p className="mt-3 text-lg">
                  STOCK OUT
                </p>
              </div>

              {/* SALES */}
              <div className="p-8 text-white shadow-2xl bg-gradient-to-r from-purple-700 to-indigo-900 rounded-3xl">
                <Wallet size={55} />

                <h2 className="mt-6 text-3xl">
                  {formatRWF(totalSales)}
                </h2>

                <p className="mt-3 text-lg">
                  TOTAL SALES
                </p>
              </div>
            </div>

            {/* PRODUCTS STATUS TABLE */}
            <div className="mt-14">

              <div className="flex items-center gap-4 mb-8">
                <BarChart3
                  className="text-blue-700"
                  size={40}
                />

                <h2 className="text-4xl text-blue-900">
                  PRODUCT CURRENT STATUS
                </h2>
              </div>

              <div className="overflow-x-auto">

                <table className="w-full overflow-hidden bg-white shadow-xl rounded-3xl">

                  <thead className="text-white bg-gradient-to-r from-blue-700 to-indigo-800">
                    <tr>
                      <th className="p-5 text-left">
                        PRODUCT
                      </th>

                      <th className="p-5 text-left">
                        CATEGORY
                      </th>

                      <th className="p-5 text-left">
                        CURRENT QUANTITY
                      </th>

                      <th className="p-5 text-left">
                        STATUS
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {productStatus.map((product) => (
                      <tr
                        key={product.Spare_Part_Id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-5 text-lg text-gray-800">
                          {product.Name}
                        </td>

                        <td className="p-5 text-gray-600">
                          {product.Category}
                        </td>

                        <td className="p-5 text-blue-700">
                          {product.Quantity}
                        </td>

                        <td className="p-5">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${product.color}`}
                          >
                            {product.icon}

                            {product.status}
                          </div>
                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

            {/* EXTRA CARDS */}
            <div className="grid grid-cols-1 gap-8 mt-14 lg:grid-cols-3">

              <div className="p-8 bg-white border shadow-xl rounded-3xl">
                <Activity className="text-blue-700" size={50} />

                <h2 className="mt-5 text-2xl text-gray-800">
                  LIVE INVENTORY TRACKING
                </h2>

                <p className="mt-4 leading-8 text-gray-600">
                  Automatically monitor all products
                  using real-time database values.
                </p>
              </div>

              <div className="p-8 bg-white border shadow-xl rounded-3xl">
                <TrendingUp className="text-green-700" size={50} />

                <h2 className="mt-5 text-2xl text-gray-800">
                  SMART STOCK ANALYTICS
                </h2>

                <p className="mt-4 leading-8 text-gray-600">
                  Detect low stock and balanced
                  inventory automatically.
                </p>
              </div>

              <div className="p-8 bg-white border shadow-xl rounded-3xl">
                <Wallet className="text-purple-700" size={50} />

                <h2 className="mt-5 text-2xl text-gray-800">
                  SALES MANAGEMENT
                </h2>

                <p className="mt-4 leading-8 text-gray-600">
                  Track business revenue and stock
                  movement in Rwandan Francs.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}