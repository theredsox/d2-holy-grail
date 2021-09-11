import * as React from "react";
import styled from "styled-components";
import { Item } from "../../../../common/definitions/union/Item";
import Modal from "react-modal";

import "./ImageRendererStyles.css";

export interface IItemProps {
    item: Item;
    itemName: string;
}
  
interface IItemState {
    isOpen: boolean;
    item: Item;
}

export default class ImageRenderer extends React.Component<
    IItemProps,
    IItemState
> {
    public constructor(props: IItemProps) {
      super(props);
      this.state = {
        isOpen: false,
        item: this.props.item
      };
    }
  
    handleShowDialog = () => {
      this.setState({ isOpen: !this.state.isOpen, item: this.state.item });
      console.log('clicked' + this.state.isOpen);
    };
  
    render() {
      return (
        <ImageContainer>
          <Image src={this.props.itemName} onClick={this.handleShowDialog}/>
          {this.state.isOpen && (
            <Modal
                isOpen={this.state.isOpen}
                onRequestClose={this.handleShowDialog}
                contentLabel="Fullsize Image"
                overlayClassName="myoverlay"
                className="mycontent"
                appElement={document.getElementById('root') || undefined}
            >
              <FullsizeImage 
                  src={this.props.itemName} 
                  onClick={this.handleShowDialog}
              />
            </Modal>
          )}
        </ImageContainer>
      );
    }
  }

const ImageContainer = styled.div`
    margin-left: 20px;
    max-height: 200px;
    max-width: 150px;
    overflow: hidden;
    text-indent: -145px;
`;

const Image = styled.img`
    cursor: pointer;
    height: 100%;
    object-fit: scale-down;
    width: 300px;
`;

const FullsizeImage = styled.img`
    max-height: 100%;
    max-width: 100%;
    z-index: 1201;
`;