import DashboardCard from "@/components/dashboard/DashboardCard"
import { Newspaper,Folders, User, MessageCircle } from "lucide-react";
import PostTable from "@/components/posts/PostTable";
import AnalytiChart from "@/components/dashboard/AnalyticChart";  

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
        <DashboardCard
          title="Post"
          count={100}
          icon={<Newspaper className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Categories"
          count={100}
          icon={<Folders className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Users"
          count={300}
          icon={<User className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Post"
          count={100}
          icon={<Newspaper className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Comments"
          count={100}
          icon={<MessageCircle className="text-slate-500" size={72} />}
        />
      </div>
      <AnalytiChart/>
      <PostTable title="Latest Post" limit={5}/>
    </>
  )
}
