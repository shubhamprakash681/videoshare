import React from "react";
import { Label } from "../ui/label";
import { Control, Controller } from "react-hook-form";
import { uploadVideoSchema } from "@/schema";
import BundledEditor from "../ui/rte/BundledEditor";
import { z } from "zod";

type VideoUploadInputs = z.infer<typeof uploadVideoSchema>;
type RTEProps = {
  label: string;
  name: "description";
  control: Control<VideoUploadInputs>;
  defaultValue: string;
};
const RTE: React.FC<RTEProps> = ({ label, name, control, defaultValue }) => {
  return (
    <div className="w-full">
      <Label htmlFor={name}>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <BundledEditor
            id={name}
            initialValue={defaultValue}
            onEditorChange={onChange}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist",
                "anchor",
                "autolink",
                "help",
                "image",
                "link",
                "lists",
                "searchreplace",
                "table",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        )}
      />
    </div>
  );
};

export default RTE;
