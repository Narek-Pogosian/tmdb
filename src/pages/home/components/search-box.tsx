import { sortAndFilterByPopularity } from "@/lib/utils";
import { SearchResult } from "@/types";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebounce(query, 500);

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () => api.getSearchResults(debouncedValue),
    enabled: !!debouncedValue.trim(),
    select: (data) => sortAndFilterByPopularity(data.results, 5),
  });

  const navigate = useNavigate();
  const handleSelect = (value: SearchResult) => {
    if (value) navigate(`/${value.media_type}/${value.id}`);
  };

  return (
    <Combobox
      as="div"
      className="relative z-30"
      onChange={handleSelect}
      defaultValue={null}
      nullable
    >
      <Combobox.Input
        type="search"
        autoComplete="off"
        placeholder="Search for movie, tv show or person"
        className="w-full px-6 py-3 transition-shadow duration-300 bg-white dark:bg-neutral-900 font-semibold border border-neutral-300 dark:border-neutral-800 rounded-full outline-none focus:ring-2 ring-secondary-600"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query.trim() && (results || isLoading) && (
        <Combobox.Options
          className="absolute w-full overflow-y-auto border border-neutral-300 dark:border-neutral-800 shadow-md dark:shadow-lg -translate-x-1/2 rounded-lg max-h-80 sm:left-0 sm:translate-x-0 bg-white dark:bg-neutral-900 left-1/2 scrollbar-thin top-14 space-y-1"
          hold={false}
        >
          {isLoading ? (
            <ComboBoxLoading />
          ) : isError || !results || results.length == 0 ? (
            <ComboBoxError />
          ) : (
            results.map((item) => (
              <ComboBoxListItem item={item} key={item.id} />
            ))
          )}
        </Combobox.Options>
      )}
    </Combobox>
  );
}

function ComboBoxListItem({ item }: { item: SearchResult }) {
  return (
    <Combobox.Option
      key={item.id}
      value={item}
      className={({ active }) =>
        `flex items-center justify-between max-w-full gap-2 cursor-pointer px-4 h-16 ${
          active ? "bg-neutral-100 dark:bg-white/5" : ""
        }`
      }
    >
      <div className="flex items-center w-4/5 gap-2">
        <img
          width={40}
          height={48}
          src={`https://www.themoviedb.org/t/p/w220_and_h330_face/${
            item.poster_path ? item.poster_path : item.profile_path
          }`}
        />
        <span className="text-sm font-semibold truncate">
          {item.name ?? item.title}
        </span>
      </div>
      <p className="text-sm capitalize text-grey-400">{item.media_type}</p>
    </Combobox.Option>
  );
}

function ComboBoxError() {
  return <p className="px-2 py-4">Nothing Found</p>;
}

function ComboBoxLoading() {
  return (
    <>
      {new Array(10).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </>
  );
}
