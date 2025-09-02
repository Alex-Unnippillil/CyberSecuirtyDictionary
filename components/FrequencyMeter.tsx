import React, { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import useSWR from "swr";

interface FrequencyMeterProps {
  term: string;
}

const FrequencyMeter: React.FC<FrequencyMeterProps> = ({ term }) => {
  const { data } = useSWR<any[]>(
    term
      ? `https://api.datamuse.com/words?ml=${encodeURIComponent(term)}&md=f&max=20`
      : null,
    { refreshInterval: 86400000 }
  );

  const chartData = useMemo(() => {
    const frequencies = (data || [])
      .map((item: any) => {
        const tag = (item.tags || []).find((t: string) => t.startsWith("f:"));
        return tag ? parseFloat(tag.slice(2)) : null;
      })
      .filter((n: number | null): n is number => n !== null);
    return frequencies.map((value: number, index: number) => ({ index, value }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FrequencyMeter;
