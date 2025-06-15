'use client';

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const availableFilters = [
  { value: "per_day", label: "Per Hari" },
  { value: "per_month", label: "Per Bulan" },
  { value: "per_year", label: "Per Tahun" },
];

const availableData = [
  { value: "loans", label: "Loans" },
  { value: "returns", label: "Returns" },
  { value: "items", label: "Items" },
];

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const AnalyticChart = () => {
  const [filter, setFilter] = useState("per_day");
  const [dataType, setDataType] = useState("loans");
  const [date, setDate] = useState(getToday());
  const [chartData, setChartData] = useState<[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/admin/analytic/${date}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    })
      .then(res => res.json())
      .then(resData => {
        // Mapping array dari backend ke format recharts
        const labels = resData[filter]?.labels || [];
        const loans = resData[filter]?.loans || [];
        const returns = resData[filter]?.returns || [];
        const items = resData[filter]?.items || [];
        const dataArr = labels.map((label: string, idx: number) => ({
          name: label,
          loans: loans[idx] ?? 0,
          returns: returns[idx] ?? 0,
          items: items[idx] ?? 0,
        }));
        setChartData(dataArr);
      })
      .finally(() => setLoading(false));
  }, [filter, date]);
  console.log(chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisa Data</CardTitle>
        <CardDescription>
          Pilih filter dan tanggal untuk melihat perkembangan data.
        </CardDescription>
        <div className="flex gap-4 mt-2">
          <Select onValueChange={setFilter} defaultValue={filter}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Pilih Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableFilters.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={setDataType} defaultValue={dataType}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Pilih Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableData.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-2 h-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart width={1100} height={300} data={chartData}>
              <Line type='monotone' dataKey={dataType} stroke='#8884d8' />
              <CartesianGrid stroke='#ccc' />
              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} domain={[0, 'dataMax']}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        {loading && <div className="text-center text-sm mt-2">Loading...</div>}
      </CardContent>
    </Card>
  );
};

export default AnalyticChart;