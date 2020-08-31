import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";

import Delete from "@material-ui/icons/Delete";
import { delete as axiosDelete } from "axios";

export default class DeleteLinkButton extends Component {
  deleteLink = () => {
    const link = this.props.link;
    axiosDelete(`/api/links/delete`, {
      params: {
        id: link.shortCode,
      },
    }).then(() => {
      if (this.props.reload) {
        this.props.reload();
      }
    });
  };
  render() {
    return (
      <div>
        <IconButton onClick={this.deleteLink}>
          <Delete style={{ color: "red" }}></Delete>
        </IconButton>
      </div>
    );
  }
}
