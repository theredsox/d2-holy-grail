import { Drawer, List } from "@material-ui/core";
import * as React from "react";
import { IMenuProps } from "./Menu";
import styled from "styled-components";
import { ListProps } from "@material-ui/core/List";

export interface IMenuProps {
  onClose(): any;
  isOpen?: boolean;
}

export const Menu: React.FunctionComponent<IMenuProps> = props => {
  return (
    <Drawer
      anchor="right"
      open={!!props.isOpen}
      onClose={() => props.onClose()}
    >
      <div tabIndex={0} role="button">
        <ListContainer>
          <StyledList>{props.children}</StyledList>
        </ListContainer>
      </div>
    </Drawer>
  );
};

const ListContainer = styled.div`
  width: 300px;
`;

const StyledList: React.ComponentType<ListProps> = styled(List)`
  && {
    padding-top: 4px;
    padding-bottom: 4px;
    & .MuiListItem-root {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
`;