import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { forwardRef, useImperativeHandle } from "react";

const schema = z.object({
  title: z
    .string()
    .min(1, {
      message: "请输入属性名",
    })
    .max(20, {
      message: "属性名长度不能超过20",
    }),
  nodeType: z.enum(
    ["object", "array", "string", "integer", "number", "boolean", "null"],
    {
      message: "请输入属性类型",
    }
  ),
  pattern: z.string().optional(),
});

type SchemaType = z.infer<typeof schema>;

const BasicPropsForm = forwardRef(
  (
    {
      onSubmit,
    }: {
      onSubmit: (data: SchemaType) => void;
    },
    ref
  ) => {
    const form = useForm<SchemaType>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        nodeType: "null",
      },
    });

    useImperativeHandle(ref, () => ({
      reset: form.reset,
    }));

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-2 flex flex-col gap-y-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="mr-2">title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter title" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nodeType"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="mr-2">nodeType</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="nodeType" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {[
                        "object",
                        "array",
                        "string",
                        "integer",
                        "number",
                        "boolean",
                        "null",
                      ].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">保存</Button>
        </form>
      </Form>
    );
  }
);

export default BasicPropsForm;
