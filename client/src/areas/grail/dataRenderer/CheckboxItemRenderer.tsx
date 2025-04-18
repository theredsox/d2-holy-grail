import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import { GrailManager } from "../GrailManager";
import { Item } from "../../../common/definitions/union/Item";
import { ItemNameRenderer } from "./ItemNameRenderer";
import { IItemProps } from "./CheckboxItemRenderer";
import styled from "styled-components";
import { Util } from "../../../common/utils/Util";
import { ItemImageRenderer } from "./ItemImageRenderer";

export interface IItemProps {
  item: Item;
  itemName: string;
  ancestorKeys: string[];
}

interface IItemState {
  item: Item;
}

export class CheckboxItemRenderer extends React.Component<
  IItemProps,
  IItemState
> {
  public constructor(props: IItemProps) {
    super(props);
    this.state = {
      item: this.props.item
    };
  }

  public render() {
    return (
      <RootContainer>
        <Checkbox
          disabled={GrailManager.current.isReadOnly}
          checked={!!this.state.item.wasFound}
          onChange={event => this.onItemCheckBoxChanged(this.state.item, event)}
          style={{ padding: "2px" }}
          value={this.props.itemName}
        />
        { Util.hasImage(this.props) &&
          <ItemImageRenderer
            itemName={this.props.itemName}
            item={this.props.item}
            ancestorKeys={this.props.ancestorKeys}
          />
        }
        <ItemNameRenderer
          itemName={this.props.itemName}
          item={this.props.item}
          ancestorKeys={this.props.ancestorKeys}
        />
      </RootContainer>
    );
  }

  private onItemCheckBoxChanged = (item: Item, event: any) => {
    item.wasFound = event.target.checked;
    this.setState({ item: this.state.item });
    GrailManager.current.updateGrailCache();
  };
}

const RootContainer = styled.div`
  display: flex;
  align-items: center;
`;
