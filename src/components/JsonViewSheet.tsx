import JsonView from "@uiw/react-json-view";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileJson } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  value: object;
};

const JsonViewSheet = ({ value }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FileJson className="w-8 h-8 rounded hover:bg-slate-500 hover:text-slate-200" />
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">JSON View</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <JsonView value={value} />
      </SheetContent>
    </Sheet>
  );
};

export default JsonViewSheet;
