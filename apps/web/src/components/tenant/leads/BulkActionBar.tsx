import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
type Props = {
  selectedCount?: number;
  selectedIds?: number[];
  open: boolean;
  onClose: () => void;
};
export function BulkActionsBar({
  selectedCount,
  selectedIds,
  open,
  onClose,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[1200px] max-w-[90vw]  p-0 overflow-hidden"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <SheetTitle className="text-lg font-bold">Bulk Actions</SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
}
