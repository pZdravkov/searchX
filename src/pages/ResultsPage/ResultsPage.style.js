import styled, { css } from "styled-components";

export const Container = styled.div`
  padding: 24px;
`;

export const SectionContainer = styled.div`
  padding: 24px;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  }
`;

export const ResultContainer = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 24px;
  }
`;

export const ResultTitle = styled.div`
  font-size: 20px;
  cursor: pointer;
`;

export const ResultDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryBody};
`;

export const MetadataContainer = styled.div`
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 12px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;

  div {
    &:first-of-type {
      margin-right: 12px;
    }

    &:last-of-type {
      margin-left: 12px;
    }
  }
`;

export const PaginationBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `};
`;

export const PaginationNumber = styled.a`
  margin: 0px 6px;
  text-decoration: none;
  color: black;

  ${({ selected }) =>
    selected &&
    css`
      color: red;
    `};
`;
