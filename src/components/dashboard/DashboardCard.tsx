import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    title: string;
    icon: React.ReactElement<LucideIcon>;
    count: number;
}

const DashboardCard = ({ title, count, icon }: DashboardCardProps) => {
    return (
        <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0 border-0 shadow-none ">
            <CardContent className="">
                <h3 className="text-xl text-center mb-2 font-bold text-slate-500 dark:text-slate-200">
                    {title}
                </h3>
                <div className="flex gap-3 justify-center items-center">
                    <span className="text-slate-500">{icon}</span>
                    <h3 className="text-3xl font-semibold text-slate-500 dark:text-slate-200">
                        {count}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;