import Cookies from "universal-cookie";
import { SAVED_SEARCHES_COOKIE } from "utils/constants";

let data = {};

const useData = () => {
  const cookies = new Cookies();

  const search = ({ query = "", filter = "", pageSize = 10, pageNo = 1 }) => {
    let results = [];

    if (query)
      results = data
        .filter(({ title }) => {
          if (typeof title !== "string") return null;
          return title.toLowerCase().match(query.toLocaleLowerCase());
        })
        ?.splice(0, 20)
        .map((res) => {
          return res;
        });

    return results;
  };

  const saveSearch = (query) => {
    const searches = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];
    cookies.set(SAVED_SEARCHES_COOKIE, [...searches, query]);
  };

  const removeSearch = (query) => {
    const searches = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];
    cookies.set(SAVED_SEARCHES_COOKIE, [
      ...searches.filter((v) => v === query),
    ]);
  };

  const isSavedSearch = (query) => {};

  return { search, saveSearch, removeSearch };
};

export default useData;
