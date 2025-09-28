import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

const dateRanges = [
  { label: 'Last 7 days', value: '7', days: 7 },
  { label: 'Last 30 days', value: '30', days: 30 },
  { label: 'Last 90 days', value: '90', days: 90 },
];

interface AdminDashboardHeaderProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export function AdminDashboardHeader({ dateRange, onDateRangeChange }: AdminDashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="font-display text-3xl font-bold text-coffee-dark">Dashboard</h1>
      
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dateRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
