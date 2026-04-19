"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VictimRecord } from "@/lib/types";

function toCsvValue(value: string) {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function CsvDownloadButton({ victims }: { victims: VictimRecord[] }) {
  function handleDownload() {
    const headers = ["company", "group", "date", "country", "industry", "ransomware_type", "leak_url", "description"];
    const lines = victims.map((v) =>
      [v.company, v.group, v.date, v.country, v.industry, v.ransomware_type, v.leak_url, v.description]
        .map((field) => toCsvValue(field))
        .join(",")
    );

    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ransomware-attacks.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download CSV
    </Button>
  );
}
