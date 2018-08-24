import React, { Component } from 'react';
import Lightbox from 'react-images';

class Picture extends Component {
  constructor() {
    super();

    this.state = {
      lightboxIsOpen: false,
    };

    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
  }

  openLightbox() {
    this.setState({
      lightboxIsOpen: true,
    });
  }

  closeLightbox() {
    this.setState({
      lightboxIsOpen: false,
    });
  }

  render() {
    const { images } = this.props;
    console.log(images);
    const { lightboxIsOpen } = this.state;
    return (
      <div className="section">
        <a onClick={() => this.openLightbox()}>查看</a>
        <Lightbox images={images} isOpen={lightboxIsOpen} onClose={this.closeLightbox} />
      </div>
    );
  }
}

export default Picture;
