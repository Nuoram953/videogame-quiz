"use client";
import { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getGameById, search } from "./api";
import { debounce } from "@mui/material/utils";

export default function Home() {
  const [suggestion, setSuggestion] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    id: number;
  } | null>();
  const [gameToFind, setGameToFind] = useState<{
    label: string;
    id: number;
  } | null>();

  useEffect(() => {
    async function init() {
      const data = await getGameById(1942);
      const game = data[0];
      setGameToFind({ label: game.name, id: game.id });
    }
    init();
  }, []);

  const debouncedSetter = useMemo(
    () => debounce((value: string) => onChangeInput(value), 500),
    [],
  );

  const onChangeInput = async (value: string) => {
    setSearchString(value);

    const data = await search(value);
    const modifiedData = data
      .map((item: any) => ({
        ...item,
        label: item.name,
      }))
      .filter(
        (item: any, index: any, array: any) =>
          array.findIndex((other: any) => other.label === item.label) === index,
      );

    setSuggestion(modifiedData);
  };

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center">
        {gameToFind && (
          <p>
            game to find: {gameToFind.label}{" "}
            {gameToFind.id != 0 && gameToFind.id}
          </p>
        )}
        <h1> Videogame quiz </h1>
        <Autocomplete
          loading
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
            setSelectedOption(newValue);
          }}
          onReset={(event: any) => {
            setSelectedOption(null);
            setSearchString("");
          }}
        />
        {selectedOption && (
          <p>
            selected game: {selectedOption.label}{" "}
            {selectedOption.id != 0 && selectedOption.id}
          </p>
        )}
      </div>
    </>
  );
}
