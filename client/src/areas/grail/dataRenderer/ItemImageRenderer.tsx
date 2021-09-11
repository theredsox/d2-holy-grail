import * as React from "react";
import { Item } from "../../../common/definitions/union/Item";
import { IItemImageProps } from "./ItemImageRenderer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IGrailAreaRouterParams, RouteManager } from "../../../RouteManager";
import { FC } from "react";
import { GrailManager } from "../GrailManager";

export interface IItemImageProps {
  item: Item;
  itemName: string;
  ancestorKeys: string[];
}

type Props = IItemImageProps & RouteComponentProps<IGrailAreaRouterParams>;

const ItemImageRendererInternal: FC<Props> = props => {
  const item = props.item;
  const itemName = props.itemName;
  const itemPath = [...(props.ancestorKeys || []), itemName].join("-");

  return (
    <>
        <img
            src={`${
                process.env.PUBLIC_URL
            }/images/runes/${itemName.toLowerCase()}-d2r.png`}
            alt={itemName}
            title={itemName}
            onClick={openDialog}
            style={{
                cursor: "pointer",
                marginRight: "10px",
                height: "32px"
              }}
        />
    </>
  );

  function openDialog() {
    updateQuery(true);
  }
  
  function updateQuery(appendItemPath: boolean) {
    const query = RouteManager.getQuery(props);
  
    delete query.itemPath;
    delete query.itemName;
  
    if (appendItemPath) {
      query.itemPath = itemPath;
    }
  
    RouteManager.updateQuery(props, query);
  }
  
  function closeDialog(changedProps: { itemNote: string; isPerfect: boolean }) {
    if (
      changedProps &&
      (changedProps.itemNote !== item.note ||
        changedProps.isPerfect !== item.isPerfect)
    ) {
      item.note = changedProps.itemNote;
      item.isPerfect = changedProps.isPerfect;
      GrailManager.current.updateGrailCache();
    }
  
    updateQuery(false);
  }
};

export const ItemImageRenderer = withRouter(ItemImageRendererInternal);