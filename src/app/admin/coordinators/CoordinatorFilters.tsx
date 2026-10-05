"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const statusLabels: Record<string, string> = {
  all: "All Statuses",
  active: "Active",
  inactive: "Inactive",
};

const joinedLabels: Record<string, string> = {
  all: "Any Time",
  last7: "Last 7 Days",
  thismonth: "This Month",
  thisyear: "This Year",
};

const sortLabels: Record<string, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  revenue_desc: "Highest Revenue",
  donors_desc: "Most Donors",
};

export function CoordinatorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentStatus: string = searchParams.get("status") || "all";
  const currentJoined: string = searchParams.get("joined") || "all";
  const currentSort: string = searchParams.get("sort") || "newest";

  return (
    <div className="flex flex-row gap-3 items-end flex-wrap">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Status</span>
        <Select
          value={currentStatus}
          onValueChange={(val) => handleFilterChange("status", val)}
        >
          <SelectTrigger className="h-9 w-[130px] text-sm">
            <span>{statusLabels[currentStatus] ?? currentStatus}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Joined</span>
        <Select
          value={currentJoined}
          onValueChange={(val) => handleFilterChange("joined", val)}
        >
          <SelectTrigger className="h-9 w-[130px] text-sm">
            <span>{joinedLabels[currentJoined] ?? currentJoined}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Time</SelectItem>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="thismonth">This Month</SelectItem>
            <SelectItem value="thisyear">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Sort By</span>
        <Select
          value={currentSort}
          onValueChange={(val) => handleFilterChange("sort", val)}
        >
          <SelectTrigger className="h-9 w-[140px] text-sm">
            <span>{sortLabels[currentSort] ?? currentSort}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="revenue_desc">Highest Revenue</SelectItem>
            <SelectItem value="donors_desc">Most Donors</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
