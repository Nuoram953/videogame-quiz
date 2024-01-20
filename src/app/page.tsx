"use client";
import { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getGameById, search } from "./api";
import { debounce } from "@mui/material/utils";

export default function Home() {
  const [suggestion, setSuggestion] = useState([]);
  const [searchString, setSearchString] = useState("");

  const debouncedSetter = useMemo(
    () => debounce((value: string) => onChangeInput(value), 500),
    [],
  );

  const onChangeInput = async (value: string) => {
    if (!value) {
      return;
    }

    setSearchString(value);

    const data = await search(value);
    const modifiedData = data
      .map((item) => ({
        ...item,
        label: item.name,
      }))
      .filter(
        (item, index, array) =>
          array.findIndex((other) => other.label === item.label) === index,
      );
    setSuggestion(modifiedData);

    console.log(data);
  };

  return (
    <>
      <h1> Videogame quiz </h1>
      <Autocomplete
        id="combo-box-demo"
        options={suggestion}
        filterOptions={(x) => x}
        value={searchString}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Videogame"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
        onInputChange={(event: any, newValue: any | null) =>
          debouncedSetter(newValue)
        }
        onChange={(event: any, newValue: any | null) => {
          setSearchString(searchString);
        }}
      />
    </>
  );
}
