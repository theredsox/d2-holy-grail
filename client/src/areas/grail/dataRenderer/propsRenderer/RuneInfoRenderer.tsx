import * as React from "react";
import { IRuneInfo } from "../../../../common/definitions/api/IRuneInfo";
import { Api } from "../../../../common/utils/Api";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { ItemInfosContainer, ItemInfosDetails, NoMarginList } from "./CommonStyles";

export interface IRuneInfoRendererProps {
  runeName: string;
}

interface IRuneInfoRendererState {
  runeInfos?: IRuneInfo;
}

export class RuneInfoRenderer extends React.PureComponent<
  IRuneInfoRendererProps,
  IRuneInfoRendererState
> {
  public constructor(props: IRuneInfoRendererProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    Api.getRune(this.props.runeName).subscribe(res =>
      this.setState({ runeInfos: res.data })
    );
  }

  public render() {
    const runeInfos = this.state.runeInfos;

    if (!runeInfos) {
      return null;
    }

    return (
      <ItemInfosContainer>
        <ItemInfosDetails>
          <div>
            <RuneContainer key={runeInfos.number}>
            <img
                src={`${
                process.env.PUBLIC_URL
                }/images/runes/${runeInfos.name.toLowerCase()}-d2r.png`}
                alt={runeInfos.name}
                title={runeInfos.name}
            />
            </RuneContainer>
          </div>
          <div>
            <Typography variant="h6">
              <StyledSpan>Rune #{runeInfos.number} - Required Level: {runeInfos.clevel}</StyledSpan>
            </Typography>
            <NoMarginList>
              {runeInfos.props.map(
                RuneInfoRenderer.renderRuneProps
              )}
            </NoMarginList>
          </div>
        </ItemInfosDetails>
      </ItemInfosContainer>
    );
  }

  private static renderRuneProps(
    prop: string | { description: string; props: string[] }
  ) {
    if (typeof prop === "string") {
      return <li key={prop}>{prop as string}</li>;
    }

    const objProps = prop as { description: string; props: string[] };

    return (
      <li key={"top" + objProps.description}>
        {objProps.description}
        <NoMarginList>
          {objProps.props.map(p => (
            <li key={"child" + p}>{p}</li>
          ))}
        </NoMarginList>
      </li>
    );
  }
}

const RuneContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0px;
  margin-bottom: ${p => p.theme.spacing(1)}px;
  span {
    padding-left: ${p => p.theme.spacing(1)}px;
  }
`;

const StyledSpan = styled.span`
  font-size: 1.20rem;
  padding-left: 10px;
`;