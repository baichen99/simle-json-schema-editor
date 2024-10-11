import JsonView from "@uiw/react-json-view";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FileJson } from "lucide-react";

type Props = {
  value: object;
};

const JsonViewSheet = ({ value }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>
        <FileJson className="w-8 h-8 rounded hover:bg-slate-500 hover:text-slate-200" />
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>JSON View</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <JsonView value={value} />
      </SheetContent>
    </Sheet>
  );
};

export default JsonViewSheet;
