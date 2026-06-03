import { Button } from "@/components/ui/button";

function BulkActionsBar({ selectedCount, selectedIds }: Props) {
  return (
    <div className="flex items-center justify-between w-full border rounded-lg px-4 py-2 bg-slate-50">
      <span className="font-medium">{selectedCount} selected</span>

      <div className="flex gap-2">
        <Button variant="outline">Bulk Update</Button>

        <Button variant="outline">Assign Agent</Button>
        <Button variant="outline">Change Status</Button>
        <Button variant="outline">Add to Campaign</Button>
        <Button variant="outline">Create Task</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  );
}
