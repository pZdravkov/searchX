import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useApi from "services/dummyApi";

import Autocomplete from "components/Autocomplete";

import {
  Container,
  SectionContainer,
  ResultContainer,
  ResultDescription,
  ResultTitle,
  MetadataContainer,
  PaginationContainer,
  PaginationBtn,
  PaginationNumber,
} from "./ResultsPage.style";

const ResultsPage = () => {
  const {
    results,
    metadata,
    query,
    pageNo,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    handleNext,
    handlePrev,
  } = usePaginatedResults();

  return (
    <Container>
      <SectionContainer>
        <Autocomplete defaultQuery={query} />
      </SectionContainer>
      <SectionContainer>
        <MetadataContainer>
          {`About ${
            metadata.totalResults
          } results (${metadata.searchTime.toFixed(1)} miliseconds)`}
        </MetadataContainer>
        {results.map((res) => (
          <ResultContainer key={res.show_id} isSaved={res.isSaved}>
            <ResultTitle>{res.title}</ResultTitle>
            <ResultDescription>{res.description}</ResultDescription>
          </ResultContainer>
        ))}
      </SectionContainer>
      <SectionContainer>
        <PaginationContainer>
          <PaginationBtn disabled={!hasPrevPage} onClick={handlePrev}>
            <span className="material-symbols-outlined">navigate_before</span>
          </PaginationBtn>
          {Array.apply(null, Array(totalPages)).map((_, i) => (
            <PaginationNumber
              key={`item_${i}`}
              href={`/results?q=${query}&pageNo=${i + 1}&pageSize=${pageSize}`}
              selected={parseInt(pageNo) === i + 1}
            >
              {i + 1}
            </PaginationNumber>
          ))}

          <PaginationBtn disabled={!hasNextPage} onClick={handleNext}>
            <span className="material-symbols-outlined">navigate_next</span>
          </PaginationBtn>
        </PaginationContainer>
      </SectionContainer>
    </Container>
  );
};

const usePaginatedResults = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const { fetchResults } = useApi();

  const query = searchParams.get("q");
  const pageNo = searchParams.get("pageNo");
  const pageSize = searchParams.get("pageSize");

  const { results, metadata } = useMemo(
    () => fetchResults({ query, pageNo }) ?? {},
    [query, pageNo, fetchResults]
  );

  const hasNextPage = pageSize * pageNo < metadata.totalResults;
  const hasPrevPage = pageNo > 1;
  const totalPages = Math.ceil(metadata.totalResults / pageSize);

  const handleNext = useCallback(() => {
    const nextPage = parseInt(pageNo) + 1;
    setSearchParams({ q: query, pageNo: nextPage, pageSize });
  }, [query, pageNo, pageSize, setSearchParams]);

  const handlePrev = useCallback(() => {
    const prevPage = parseInt(pageNo) - 1;
    setSearchParams({ q: query, pageNo: prevPage, pageSize });
  }, [query, pageNo, pageSize, setSearchParams]);

  return {
    results,
    metadata,
    query,
    pageNo,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    handleNext,
    handlePrev,
  };
};

export default ResultsPage;
