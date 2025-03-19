"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { subDays, format } from "date-fns";

const ranges = {
  "7d": subDays(new Date(), 7),
  "30d": subDays(new Date(), 30),
  all: null,
};

const COLORS = ["#eca743", "#a4372e"];

const Analytics = ({ portfolioId }) => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    if (!portfolioId) return;
    fetch(`/api/portfolio/analytics?portfolioId=${portfolioId}`)
      .then((res) => res.json())
      .then((dt) => {
        setData(dt);
      })
      .catch(console.error);
  }, [portfolioId]);

  if (!data) return <p className="text-center py-10">Loading analytics...</p>;
  if (data && data.message)
    return <p className="text-center py-10">{data.message}</p>;

  const filteredViews = data.events?.filter(
    (e) =>
      e.type === "page_view" &&
      (range === "all" ? true : new Date(e.timestamp) >= ranges[range])
  );

  const filteredClicks = data.clicks?.filter((e) =>
    range === "all" ? true : new Date(e.timestamp) >= ranges[range]
  );

  const dateCounts = {};
  filteredViews.forEach((e) => {
    const day = format(new Date(e.timestamp), "yyyy-MM-dd");
    dateCounts[day] = (dateCounts[day] || 0) + 1;
  });

  const lineData = Object.keys(dateCounts).map((date) => ({
    date,
    views: dateCounts[date],
  }));

  return (
    <div className="rounded-lg shadow space-y-8 mt-8">
      <h2 className="text-2xl font-semibold text-gray-100">
        Portfolio Analytics
      </h2>

      {/* Range Filter */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(ranges).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded text-sm ${
              range === r
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {r === "7d" && "Last 7 days"}
            {r === "30d" && "Last 30 days"}
            {r === "all" && "All time"}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div>
        <h4 className="text-lg font-medium mb-2 text-gray-100">
          Page Views Over Time
        </h4>
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div>
        <h4 className="text-lg font-medium mb-2 text-gray-100">
          Device Distribution
        </h4>
        <div className="w-full h-52 sm:h-64 flex justify-center">
          <ResponsiveContainer width="80%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Desktop", value: data.devices.desktop },
                  { name: "Mobile", value: data.devices.mobile },
                ]}
                dataKey="value"
                outerRadius={80}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Referrers */}
      <div>
        <h4 className="text-lg font-medium mb-2 text-gray-100">
          Top Referrers
        </h4>
        <ul className="list-disc ml-6 space-y-1 text-gray-300">
          {data.referrers.slice(0, 5).map((ref, idx) => (
            <li key={idx}>{ref || "Direct / None"}</li>
          ))}
        </ul>
      </div>

      {/* Clicks */}
      <div>
        <h4 className="text-lg font-medium mb-2 text-gray-100">
          Recent Clicks
        </h4>
        <ul className="divide-y divide-gray-700 text-gray-300">
          {filteredClicks.slice(0, 10).map((click, idx) => (
            <li
              key={idx}
              className="py-2 flex justify-between text-sm sm:text-base"
            >
              <span>{click.value}</span>
              <span className="text-xs text-gray-500">
                {new Date(click.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* User Agents */}
      <div>
        <h4 className="text-lg font-medium mb-2 text-gray-100">User Agents</h4>
        <ul className="list-disc ml-6 space-y-1 text-gray-300 text-sm sm:text-base">
          {data.userAgents.slice(0, 5).map((ua, idx) => (
            <li key={idx}>{ua}</li>
          ))}
        </ul>
      </div>

      {/* IPs */}
      <div>
        <h4 className="text-lg font-medium mb-2 text-gray-100">
          Unique Visitor IPs
        </h4>
        <ul className="list-disc ml-6 space-y-1 text-gray-300 text-sm sm:text-base">
          {data.ips.slice(0, 5).map((ip, idx) => (
            <li key={idx}>{ip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
