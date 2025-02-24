import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui";
import { FieldErrors } from "react-hook-form";
import { countries } from "@/mock";

type MobileAndCountry = {
  mobileNumber: {
    number: string;
    countryCode: string;
  };
};

export const MobileAndCountryCodeFormInput = ({
  onChange,
  values,
  errors,
  trigger,
  className,
  autocomplete,
}: {
  onChange: (name: string, value: string) => void;
  values: (name: string) => string;
  errors: FieldErrors<MobileAndCountry>;
  trigger: (name: string) => void;
  className?: string;
  autocomplete?: string;
}) => {
  return (
    <div
      className={`flex flex-col gap-2 w-full md:w-1/2    text-start ${className}`}
    >
      <Label
        htmlFor="phone"
        className={"text-xs text-black uppercase"}
      >
        Mobile Number
      </Label>
      <div className="flex flex-row items-center  border dark:border-white/50 rounded-md">
        <Select
          onValueChange={(value) => {
            onChange("mobileNumber.countryCode", value);
            trigger("mobileNumber.countryCode");
          }}
          defaultValue={values("mobileNumber.countryCode")}
        >
          <SelectTrigger
            className="w-fit min-w-14  text-black    border-none shadow-none"
            hideIcon={true}
          >
            <span>
              {values("mobileNumber.countryCode") || "Select Country"}
            </span>
          </SelectTrigger>
          <SelectContent className="">
            {countries.map((country) => (
              <SelectItem
                key={country.dialCode}
                value={country.dialCode}
                className=" text-black"
              >
                {country.name} ({country.dialCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="dark:text-white text-secondary font-thin opacity-50">
          |
        </span>
        {/* Phone Number Input */}
        <Input
          type="tel"
          value={values("mobileNumber.number")}
          onChange={(e) => {
            onChange("mobileNumber.number", e.target.value);
            trigger("mobileNumber.number");
          }}
          placeholder={"Mobile Number"}
          className={`  text-black min-h-12 border-none
            text-start placeholder:
            `}
            autoComplete={autocomplete}
        />
      </div>
      {errors?.mobileNumber?.number ? (
        <span className="text-red-500">
          {errors.mobileNumber?.number.message}
        </span>
      ) : errors.mobileNumber?.countryCode ? (
        <span className="text-red-500">
          {errors.mobileNumber?.countryCode.message}
        </span>
      ) : null}
    </div>
  );
};
