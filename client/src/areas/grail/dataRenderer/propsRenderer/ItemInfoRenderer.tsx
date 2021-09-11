import * as React from "react";
import { Api } from "../../../../common/utils/Api";
import { IItemInfo } from "../../../../common/definitions/api/IItemInfo";
import { ItemInfosContainer, ItemInfosDetails, NoMarginList } from "./CommonStyles";
import styled from "styled-components";

export interface IItemInfoRendererProps {
  itemName: string;
}

interface IItemInfoRendererState {
  itemInfos?: IItemInfo;
}

export class ItemInfoRenderer extends React.PureComponent<
  IItemInfoRendererProps,
  IItemInfoRendererState
> {
  public constructor(props: IItemInfoRendererProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    Api.getItem(this.props.itemName).subscribe(res =>
      this.setState({ itemInfos: res.data })
    );
  }

  public render() {
    const itemInfos = this.state.itemInfos;

    if (!itemInfos) {
      return null;
    }

    return (
      <ItemInfosContainer>
        <ItemInfosDetails>
          <div>
            {itemInfos.image && (
              <StyledImg
                src={`${process.env.PUBLIC_URL}/images/${itemInfos.image}`}
                alt={this.props.itemName}
              />
            )}
          </div>
          <div>
            <NoMarginList>
              <li key={itemInfos.type}>{'Item Type: ' + itemInfos.type}</li>
              {itemInfos.props.map(p => (
                <li key={p}>{p}</li>
              ))}
            </NoMarginList>
          </div>
        </ItemInfosDetails>
      </ItemInfosContainer>
    );
  }
}

const StyledImg = styled.img`
  max-height: 250px;
`;