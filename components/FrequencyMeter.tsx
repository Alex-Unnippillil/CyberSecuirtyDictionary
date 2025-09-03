import React, { useEffect, useRef, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface FrequencyMeterProps {
  term: string;
}

const FrequencyMeter: React.FC<FrequencyMeterProps> = ({ term }) => {
  const [data, setData] = useState<number[]>([]);

  const prevTermRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevTermRef.current === term) return;
    prevTermRef.current = term;
    async function fetchFrequency() {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?ml=${encodeURIComponent(term)}&md=f&max=20`,
        );
        const json = await response.json();
        const frequencies = json
          .map((item: any) => {
            const tag = (item.tags || []).find((t: string) =>
              t.startsWith("f:"),
            );
            return tag ? parseFloat(tag.slice(2)) : null;
          })
          .filter((n: number | null): n is number => n !== null);
        setData(frequencies);
      } catch (err) {
        console.error("Failed to fetch frequency data", err);
      }
    }
    fetchFrequency();
  }, [term]);

  const chartData = data.map((value, index) => ({ index, value }));

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
