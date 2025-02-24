import React, { useState } from "react";
import { useFormContext, FieldError } from "react-hook-form";
import {
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui";
import { FormItemProps } from "@/types";
import { OpenEye, ClosedEye } from "@/components/icons";

export const FormItem: React.FC<FormItemProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options = [],
  className = "",
  inputClass = "",
  errorClass = "",
  showPasswordButton = true,
  termsAndConditions,
  required = false,
  rows = 10,
  value,
  withForgetPasswordLink = false,
  onForgetPasswordClick = () => {},
  disabled = false,
}) => {
  const {
    register,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const error = errors[name] as FieldError | undefined;
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-xs text-black uppercase">
          {label}
        </Label>
      )}
      {type === "select" ? (
        <Select
          {...register(name)}
          onValueChange={(value) => {
            setValue(name, value);
            trigger(name);
          }}
        >
          <SelectTrigger className={`   ${inputClass}`}>
            <span>
              {options.find((elem) => elem.value === getValues(name))?.label ||
                "Select"}
            </span>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-black"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === "radio" ? (
        <Label
          htmlFor={name}
          className="flex flex-row gap-2 items-center text-base"
          onClick={() => {
            setValue(name, value);
            trigger(name);
          }}
        >
          <input
            {...register(name)}
            type="radio"
            name={name}
            value={value}
            className="hidden"
            checked={getValues(name) === value}
          />
          <span
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
              ${
                getValues(name) === value
                  ? "border-primary bg-white dark:bg-secondary"
                  : "border-gray-50"
              }
                hover:border-secondary dark:hover:border-white transition-all`}
          >
            {getValues(name) === value && (
              <span className="w-3 h-3 bg-primary rounded-full"></span>
            )}
          </span>
          {value}
        </Label>
      ) : type === "checkbox" ? (
        <div className="flex items-center gap-2">
          <Checkbox
            id={name}
            {...register(name)}
            onCheckedChange={(val) => {
              setValue(name, val);
              trigger(name);
            }}
            className={`form-checkbox ${inputClass}`}
          />
          <Label
            htmlFor={name}
            className="cursor-pointer text-xs text-secondary dark:text-white"
          >
            {termsAndConditions}
          </Label>
        </div>
      ) : type === "textarea" ? (
        <Textarea
          id={name}
          {...register(name)}
          placeholder={required ? `${placeholder} *` : placeholder}
          className={`py-2 px-4 border w-full resize-none ${inputClass}`}
          rows={rows}
        />
      ) : (
        <div className="relative">
          <Input
            disabled={disabled}
            id={name}
            type={type === "password" && showPassword ? "text" : type}
            {...register(name)}
            placeholder={required ? `${placeholder} *` : placeholder}
            className={`py-2 px-4 border w-full ${inputClass}`}
          />
          {type === "password" && showPasswordButton && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute end-3 top-1/2 transform -translate-y-1/2 text-sm"
            >
              {showPassword ? (
                <OpenEye className="w-4 h-4 dark:fill-white" />
              ) : (
                <ClosedEye className="w-4 h-4 dark:fill-white" />
              )}
            </button>
          )}
        </div>
      )}
      {withForgetPasswordLink && (
        <button
          onClick={onForgetPasswordClick}
          className="self-end text-xs text-secondary dark:text-white"
        >
          Forget Password
        </button>
      )}
      {error && (
        <span className={`text-red-500 text-sm ${errorClass}`}>
          {error.message}
        </span>
      )}
    </div>
  );
};
