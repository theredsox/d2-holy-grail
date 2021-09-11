import * as React from "react";
import Typography, {
  TypographyProps
} from "@material-ui/core/Typography/Typography";
import { Util } from "../../../common/utils/Util";
import { CheckboxItemRenderer } from "./CheckboxItemRenderer";
import { ThemeStyle } from "@material-ui/core/styles/createTypography";
import { GrailManager } from "../GrailManager";
import { CountItemRenderer } from "./CountItemRenderer";
import { LevelRenderer } from "./LevelRenderer";
import styled, { css } from "styled-components";
import ImageRenderer from "./propsRenderer/ImageRenderer";

export interface ILevels {
  level?: number;
  variantLevel?: number;
}

export interface IDataRendererProps {
  data: any;
  ancestorKeys?: string[];
  levels?: ILevels;
  isRecursive?: boolean;
  modifyLevels?: (level: ILevels, key: string) => ILevels;
}

function getDataRendererTypography(level: number): StyledLevelRenderer {
  switch (level) {
    case 1:
      return Level1Renderer;
    case 2:
      return Level2Renderer;
    case 3:
      return Level3Renderer;
    case 4:
      return Level4Renderer;
    default:
      return BaseDataRenderer;
  }
}

export const DataRenderer: React.FunctionComponent<
  IDataRendererProps
> = props => {
  if (!props.data) {
    return null;
  }

  const levels = props.levels || { level: 0, variantLevel: 0 };
  if (!levels.level) {
    levels.level = 0;
  }
  if (!levels.variantLevel) {
    levels.variantLevel = 0;
  }

  const DataRendererTypography = getDataRendererTypography(levels.level);

  const uniques = props.ancestorKeys && props.ancestorKeys.indexOf("Uniques") > -1;
  const level1sets = levels.level == 1 && props.ancestorKeys && props.ancestorKeys.indexOf("Sets") > -1;
  const fullWidthClass = !level1sets ? "FullWidth" : "";

  return (
    <DataRendererTypography
      component="div"
      variant={mapLevelToTypographyVariant(levels.variantLevel)}
      root={props.isRecursive ? undefined : true.toString()}
      className={uniques ? "uniquesLayout" : ""}
    >
      {Object.keys(props.data).map(key => {
        return (
          <DataContainer key={`dc-${key}-${levels.level}`}>
            { level1sets && (
                <ImageRenderer
                  itemName={`${
                    process.env.PUBLIC_URL
                  }/images/sets/${key.replace(/ /g, "-").replace(/'/g, "")}.png`}
                  item={props.data}>
                </ImageRenderer>
              )
            }
            <div key={`${key}-${levels.level}`} className={`${fullWidthClass}`}>
              {
                <NextData
                  levelKey={key}
                  nextData={props.data[key]}
                  ancestorKeys={props.ancestorKeys}
                  levels={levels}
                  modifyLevels={props.modifyLevels}
                />
              }
            </div>
          </DataContainer>
        );
      })}
    </DataRendererTypography>
  );
};

const NextData: React.FunctionComponent<{
  levelKey: string;
  nextData: any;
  ancestorKeys: string[];
  levels: ILevels;
  modifyLevels: (level: ILevels, key: string) => ILevels;
}> = props => {
  if (Util.isItem(props.nextData)) {
    return GrailManager.current.settings.useItemCountMode ? (
      <CountItemRenderer
        ancestorKeys={props.ancestorKeys}
        itemName={props.levelKey}
        item={props.nextData}
      />
    ) : (
      <CheckboxItemRenderer
        ancestorKeys={props.ancestorKeys}
        itemName={props.levelKey}
        item={props.nextData}
      />
    );
  }

  return (
    <LevelRenderer
      levelKey={props.levelKey}
      ancestorKeys={props.ancestorKeys}
      nextData={props.nextData}
      levels={getNextLevels(props.levels, props.levelKey, props.modifyLevels)}
    />
  );
};

const getNextLevels = (
  levels: ILevels,
  key: string,
  modifyLevels?: (levels: ILevels, key: string) => ILevels
): ILevels => {
  const nextLevels: ILevels = {
    level: levels.level + 1,
    variantLevel: levels.variantLevel + 1
  };

  if (!modifyLevels) {
    return nextLevels;
  }

  return modifyLevels(nextLevels, key);
};

const mapLevelToTypographyVariant = (level: number): ThemeStyle => {
  switch (level) {
    case 0:
      return "h5";
    case 1:
      return "h6";
    case 2:
      return "subtitle1";
    case 3:
      return "body1";
    default:
      return "body2";
  }
};

interface IStyledLevelRendererProps {
  // note: must be all lowercase and a string because the Typography components writes it on the dom element
  // if it's not all lowercase and a boolean react will write a warning to the console
  root: string;
}
type StyledLevelRenderer = React.ComponentType<
  TypographyProps & IStyledLevelRendererProps
>;

const BaseDataRenderer: StyledLevelRenderer = styled(Typography)<
  IStyledLevelRendererProps
>`
  && {
    text-transform: capitalize;
    text-align: left;
    ${p =>
      p.root
        ? css`
            
          `
        : null}
  }
`;

const Level1Renderer: StyledLevelRenderer = styled(BaseDataRenderer)<
  IStyledLevelRendererProps
>`
  && {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 0px;
    width: calc(100vw - 217px);

    & > * {
      border: 1px solid #dcdcdc;
      box-shadow: rgb(13 13 13 / 20%) 0px 4px 8px 0px;
      flex: 0 0 100%;
      padding: 10px;
    }

    @media (min-width: 900px) {
      &:not(.uniquesLayout) {
        gap: 10px 5px;
      }

      &:not(.uniquesLayout) > * {
        flex: 0 0 calc(50% - 5px)
      }
    }

    @media (min-width: 1000px) {
      &.uniquesLayout {
        gap: 10px 5px;
      }

      &.uniquesLayout > * {
        flex: 0 0 calc(50% - 5px)
      }
    }

    @media (min-width: 1350px) {
      &:not(.uniquesLayout) > * {
        flex: 0 0 calc(33.3333% - 5px)
      }
    }

    @media (min-width: 1700px) {
      &.uniquesLayout > * {
        flex: 0 0 calc(33.3333% - 5px)
      }
    }
    
    @media (min-width: 1700px) {
      &:not(.uniquesLayout) > * {
        flex: 0 0 calc(25% - 5px)
      }
    }

    @media (min-width: 2100px) {
      &.uniquesLayout > * {
        flex: 0 0 calc(25% - 5px)
      }
    }
  }
`;

const Level2Renderer: StyledLevelRenderer = styled(BaseDataRenderer)<
  IStyledLevelRendererProps
>`
  && {
    padding: 0px;

    @media (min-width: 650px) {
      &.uniquesLayout {
        flex-wrap: wrap;
        display: flex;
      }
    }
  }
`;

const Level3Renderer: StyledLevelRenderer = styled(BaseDataRenderer)<
  IStyledLevelRendererProps
>`
  && {
    padding-left: ${p => p.theme.spacing(1) * 0.75}px;
  }
`;

const Level4Renderer: StyledLevelRenderer = styled(BaseDataRenderer)<
  IStyledLevelRendererProps
>`
  && {
    display: flex;
    flex-wrap: wrap;
    & > * {
      flex: 0 0 100%;
    }

    @media (min-width: 530px) {
      & > * {
        flex: 0 0 50%;
      }
    }

    @media (min-width: 695px) {
      & > * {
        flex: 0 0 33.3333%;
      }
    }

    @media (min-width: 860px) {
      & > * {
        flex: 0 0 25%;
      }
    }
  }
`;

const DataContainer = styled.div`
  display: flex;
  flex: 0 0 calc(50% - 5px);
`;

const ImageContainer = styled.div`
  max-width: 150px;
  overflow: hidden;
  text-indent: -145px;
  max-height: 200px;
  margin-left: 20px;
`;

const Image = styled.img`
  object-fit: scale-down;
  width: 300px;
  height: 100%;
`;