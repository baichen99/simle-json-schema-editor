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
import { forwardRef, useImperativeHandle, useState } from "react";
import { Switch } from "components/ui/switch";
import { Tag, TagInput } from "emblor";

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
  required: z.boolean().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  enum: z.array(z.string()).optional(),
});

type SchemaType = z.infer<typeof schema>;

const StringPropsForm = forwardRef(
  (
    {
      onSubmit,
    }: {
      onSubmit: (data: SchemaType) => void;
    },
    ref
  ) => {
    const [enumValue, setEnumValue] = useState<Tag[]>([]);
    const [activeEnumIndex, setActiveEnumIndex] = useState<number | null>(null);
    const form = useForm<SchemaType>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        nodeType: "string",
        pattern: "",
        required: false,
        minLength: -1,
        maxLength: -1,
        enum: [],
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
            name="required"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="mr-2">required</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
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
              <FormItem>
                <FormLabel>nodeType</FormLabel>
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
          <FormField
            control={form.control}
            name="pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>pattern</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter pattern" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>minLength</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter minLength" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>maxLength</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please enter maxLength" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>enum</FormLabel>
                <FormControl>
                  {/* https://emblor.jaleelbennett.com/styling */}
                  <TagInput
                    styleClasses={{
                      inlineTagsContainer: "flex flex-wrap gap-2 p-0",
                      input: "h-full w-full",
                    }}
                    {...field}
                    placeholder="Please enter enum"
                    activeTagIndex={activeEnumIndex}
                    setActiveTagIndex={setActiveEnumIndex}
                    tags={enumValue}
                    setTags={(newEnum) => {
                      setEnumValue(newEnum);
                      form.setValue(
                        "enum",
                        newEnum.map((item) => item.text)
                      );
                    }}
                  />
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

export default StringPropsForm;
