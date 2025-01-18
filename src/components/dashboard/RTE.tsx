import React, { useMemo } from "react";
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
        render={({ field: { onChange, value } }) => {
          const editorInitConfig = useMemo(
            () => ({
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
                "directionality",
              ],
              directionality: "ltr",
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | ",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }),
            []
          );

          return (
            <BundledEditor
              id={name}
              initialValue={defaultValue}
              value={value}
              onEditorChange={onChange}
              init={editorInitConfig} // Prevent config changes from re-mounting
            />
          );
        }}
      />
    </div>
  );
};

export default RTE;
