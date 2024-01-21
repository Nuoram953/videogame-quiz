"use client";
import { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getGameById, search } from "./api";
import { debounce } from "@mui/material/utils";
import Hint from "./components/hint";

export default function Home() {
  const [suggestion, setSuggestion] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [hasFound, setHasFound] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    id: number;
    slug: string;
  } | null>();
  const [gameToFind, setGameToFind] = useState<{
    label: string;
    id: number;
    slug: string;
  } | null>();
  const [hints, setHints] = useState(0);

  useEffect(() => {
    async function init() {
      const data = await getGameById(1942);
      setGameToFind(data[0]);
      setHints(3);
    }
    init();
  }, []);

  useEffect(() => {
    compareAnswers();
  }, [selectedOption, hints]);

  const debouncedSetter = useMemo(
    () => debounce((value: string) => onChangeInput(value), 500),
    [],
  );

  const compareAnswers = () => {
    if (selectedOption && selectedOption?.id == gameToFind?.id) {
      return setHasFound(true);
    }

    setHasFound(false);
  };

  const onChangeInput = async (value: string) => {
    setSearchString(value);

    const data = await search(value);
    const modifiedData = data
      .map((item: any) => ({
        ...item,
        label: item.name,
        slug: item.slug,
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
        {Array.from({ length: hints }, (_, index) => (
          <Hint key={index} name={`test ${index}`} game={gameToFind} />
        ))}
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
            setSelectedOption({
              ...selectedOption,
              label: newValue.label,
              id: newValue.id,
              slug: newValue.slug,
            });
          }}
          onReset={(event: any) => {
            setSearchString("");
          }}
          isOptionEqualToValue={(option, value) => {
            return option.label == value;
          }}
        />
        {selectedOption && (
          <p>
            selected game: {selectedOption.label}{" "}
            {selectedOption.id != 0 && selectedOption.id}
          </p>
        )}
        {hasFound && <p>Congratulation! You found the game</p>}
      </div>
    </>
  );
}
