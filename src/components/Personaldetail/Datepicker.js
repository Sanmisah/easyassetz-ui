import React, { useState, useImperativeHandle, forwardRef } from "react";
import { PopoverTrigger, PopoverContent, Popover } from "@com/ui/popover";
import { Calendar } from "@com/ui/calendar";
import { Input } from "@com/ui/input";
import { Button } from "@com/ui/button";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import InputMask from "react-input-mask";

const Datepicker = forwardRef(({ value, onChange }, ref) => {
  const [stringDate, setStringDate] = useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );
  const [date, setDate] = useState(value || null);
  const [errorMessage, setErrorMessage] = useState("");

  useImperativeHandle(ref, () => ({
    clear() {
      setStringDate("");
      setDate(null);
      onChange(null);
    },
  }));

  const handleDateChange = (e) => {
    const value = e.target.value;
    setStringDate(value);

    if (value.length === 10) {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date());
      if (!isNaN(parsedDate)) {
        setErrorMessage("");
        setDate(parsedDate);
        onChange(parsedDate);
      } else {
        setErrorMessage("Invalid Date");
        setDate(null);
        onChange(null);
      }
    } else {
      setErrorMessage("");
      setDate(null);
      onChange(null);
    }
  };

  return (
    <Popover>
      <div className="relative w-[470px]">
        <InputMask
          mask="99/99/9999"
          value={stringDate}
          onChange={handleDateChange}
        >
          {(inputProps) => <Input type="text" {...inputProps} />}
        </InputMask>
        {errorMessage && (
          <div className="absolute bottom-[-1.75rem] left-0 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;
            setDate(selectedDate);
            setStringDate(format(selectedDate, "dd/MM/yyyy"));
            setErrorMessage("");
            onChange(selectedDate);
          }}
          defaultMonth={date}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});

export default Datepicker;
