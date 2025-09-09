import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  error, 
  options = [], 
  placeholder,
  required = false,
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select
            name={name}
            value={value}
            onChange={onChange}
            error={error}
            {...props}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={error}
            {...props}
          />
        );
      default:
        return (
          <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={error}
            {...props}
          />
        );
    }
  };

  return (
<div className="space-y-2">
      <Label htmlFor={name} className="text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderInput()}
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1 px-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;