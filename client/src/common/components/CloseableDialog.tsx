import * as React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle, { DialogTitleProps } from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Icon, { IconProps } from "@material-ui/core/Icon/Icon";
import { ISettingsDialogProps } from "./CloseableDialog";
import styled from "styled-components";

export interface ISettingsDialogProps {
  onDialogClosed: () => any;
  title: string;
  actions?: () => JSX.Element;
  className?: string;
}

export const CloseableDialog: React.FunctionComponent<
  ISettingsDialogProps
> = props => {
  return (
    <Dialog open={true} onClose={() => props.onDialogClosed()}>
      <StyledDialogTitle id="form-dialog-title">{props.title}</StyledDialogTitle>
      <DialogContent>
        <div className={props.className}>
          <CloseIcon onClick={() => props.onDialogClosed()}>close</CloseIcon>
          {props.children}
        </div>
      </DialogContent>
      {props.actions && <DialogActions>{props.actions()}</DialogActions>}
    </Dialog>
  );
};

const StyledDialogTitle: React.ComponentType<DialogTitleProps> = styled(DialogTitle)`
  && {
    padding-bottom: 8px;
    text-decoration: underline;
  }
`;

const CloseIcon: React.ComponentType<IconProps> = styled(Icon)`
  && {
    position: absolute;
    top: ${p => p.theme.spacing(1)}px;
    right: ${p => p.theme.spacing(1)}px;
    cursor: pointer;
  }
`;
