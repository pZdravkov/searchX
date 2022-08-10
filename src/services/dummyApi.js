import Cookies from "universal-cookie";
import { SAVED_SEARCHES_COOKIE } from "utils/constants";
import data from "./data.json";

// This is some random API to retrieve and store data
// Usually I do these as class dependencies which works nicely with Redux

// The text search capabilities are very basic as I did no have time to improve further,
// but its doing the job so so

const useApi = () => {
  const cookies = new Cookies();

  // Returns a combination of saved and new searches to mimic the desired behaviour
  // of the autocomplete
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
    ].slice(0, 10);
  }

  // Strict fetch with pagination and querying
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

  // Some utilty functions to work with cookies, usually it would do it as a separate service or hooks
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
