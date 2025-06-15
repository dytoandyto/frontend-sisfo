"use client"

import { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  User,
  HardDrive,
  Package,
  FolderSync
} from "lucide-react";
import PostTable from "@/components/posts/PostTable";
import AnalytiChart from "@/components/dashboard/AnalyticChart";

export default function Home() {
  const [dashboard, setDashboard] = useState({
    total_users: 0,
    total_loans: 0,
    total_returns: 0,
    total_items: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // atau dari cookie jika kamu simpan di cookie
    fetch("http://127.0.0.1:8000/api/admin/dashboard", {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboard({
          total_users: data.total_users ?? 0,
          total_loans: data.total_loans ?? 0,
          total_returns: data.total_returns ?? 0,
          total_items: data.total_items ?? 0,
        });
      });
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
        <DashboardCard
          title="Users"
          count={dashboard.total_users}
          icon={<User className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Items"
          count={dashboard.total_items}
          icon={<Package className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Loans"
          count={dashboard.total_loans}
          icon={<HardDrive className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Returns"
          count={dashboard.total_returns}
          icon={<FolderSync className="text-slate-500" size={72} />}
        />
      </div>
      <AnalytiChart />
    </>
  );
}