import styled, { css } from "styled-components";

export const Container = styled.div`
  min-height: 50px;
  width: 500px;

  border-radius: 32px;

  background-color: white;

  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  box-shadow: ${({ theme }) => theme.boxShadow};

  ${({ open }) =>
    open &&
    css`
      border-radius: 16px;
      box-shadow: ${({ theme }) => theme.boxShadowHover};
    `};
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;

export const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      border-radius: 50%;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    `}
`;

export const IconGroup = styled.div`
  display: flex;

  ${StyledIcon} {
    margin: 4px;
    &:last-of-type {
      border-left: 1px solid ${({ theme }) => theme.colors.borderColor};
    }
  }
`;

export const StyledInput = styled.input`
  margin-right: 12px;
  width: 100%;
  height: 32px;
  border: none;

  :focus {
    outline: none;
  }
`;

export const OptionsContainer = styled.div``;

export const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 4px 12px 4px 0px;

  max-height: 400px;
  overflow-y: scroll;

  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:last-of-type {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`;

export const OptionTitle = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  margin-right: 24px;
`;

export const OptionActions = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);

  cursor: pointer;

  &:hover {
    color: rgba(0, 0, 0, 0.8);
  }
`;
