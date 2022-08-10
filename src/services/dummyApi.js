import Cookies from "universal-cookie";
import { SAVED_SEARCHES_COOKIE } from "utils/constants";
import data from "./data.json";

// I prefer to do these as classes exposing them as dependencies.
// Tends to be a good pattern when using redux (sagas, epics etc.
const useApi = () => {
  const cookies = new Cookies();

  function quickSearch({ query }) {
    const savedSearches = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];

    let matchingSavedSearches = savedSearches.filter((keyword) =>
      keyword.toLowerCase().match(query.toLocaleLowerCase())
    );

    let matchingNewSearches = !!query
      ? data
          .filter(({ title }) => {
            if (typeof title !== "string") return null;
            return title.toLowerCase().match(query.toLocaleLowerCase());
          })
          .filter(({ title }) => !matchingSavedSearches.includes(title))
          .slice(0, 10)
      : [];

    return [
      ...matchingSavedSearches.map((keyword, i) => ({
        show_id: Math.random(),
        title: keyword,
        isSaved: true,
      })),
      ...matchingNewSearches,
    ];
  }

  function fetchResults({ query = "", pageSize = 10, pageNo = 1 }) {
    let results = [];

    let metadata = {
      searchTime: 0,
      totalResults: 0,
    };

    const savedSearches = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];

    if (query) {
      let start = performance.now();

      results = data.filter(({ title }) => {
        if (typeof title !== "string") return null;
        return title.toLowerCase().match(query.toLocaleLowerCase());
      });

      let end = performance.now();

      if (!!results.length) {
        metadata.searchTime = end - start;
        metadata.totalResults = results.length;
      }

      results = results
        .slice((pageNo - 1) * pageSize, pageNo * pageSize)
        .map((res) => ({ ...res, isSaved: savedSearches.includes(res.title) }))
        .sort((a, b) => (a.isSaved < b.isSaved ? 1 : -1));
    }

    return { results, metadata };
  }

  function saveSearch(keyword) {
    const keywords = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];
    cookies.set(
      SAVED_SEARCHES_COOKIE,
      Array.from(new Set(keywords).add(keyword))
    );
  }

  function removeSearch(keyword) {
    const keywords = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];

    cookies.set(
      SAVED_SEARCHES_COOKIE,
      keywords.filter((k) => k !== keyword)
    );
  }

  function isSavedSearch(keyword) {
    const keywords = cookies.get(SAVED_SEARCHES_COOKIE) ?? [];
    return keywords.includes(keyword);
  }

  return {
    quickSearch,
    fetchResults,
    saveSearch,
    removeSearch,
    isSavedSearch,
  };
};

export default useApi;
