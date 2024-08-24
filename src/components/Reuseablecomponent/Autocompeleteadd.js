import React, { useState, useEffect, useMemo } from "react";
import { AutoComplete } from "@com/ui/autocomplete";

export const Autocompeleteadd = ({
  options,
  placeholder,
  emptyMessage,
  defautValues,
  value,
  onValueChange,
  variable,
  disabled,
  setarray,
  isLoading = false,
}) => {
  const [takeinput, setTakeinput] = useState();

  useEffect(() => {
    if (takeinput) {
      setarray((prev) => ({
        ...prev,
        [variable]: [...(prev?.companyName || []), takeinput],
      }));
    }
  }, [takeinput, setarray, variable]);

  const memoizedOptions = useMemo(() => options, [options]);
  return (
    <AutoComplete
      options={memoizedOptions}
      placeholder="Select Comapany Name..."
      emptyMessage="No Company Name Found."
      value={value}
      defaultValue={defautValues}
      takeinput={takeinput}
      setTakeinput={setTakeinput}
      onValueChange={onValueChange}
    />
  );
};
