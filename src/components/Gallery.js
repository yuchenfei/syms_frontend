import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import Lightbox from 'react-images';

class Gallery extends Component {
  constructor() {
    super();

    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
    };

    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
  }

  openLightbox(index, event) {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true,
    });
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  gotoPrevious() {
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage - 1,
    });
  }

  gotoNext() {
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage + 1,
    });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index,
    });
  }

  handleClickImage() {
    const { images } = this.props;
    const { currentImage } = this.state;
    if (currentImage === images.length - 1) return;

    this.gotoNext();
  }

  renderGallery() {
    const { images } = this.props;

    if (!images) return;

    const gallery = images.map((obj, i) => {
      return (
        <a
          href={obj.src}
          className={css(classes.thumbnail, classes[obj.orientation])}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          onClick={e => this.openLightbox(i, e)}
        >
          <img alt="" src={obj.src} className={css(classes.source)} />
        </a>
      );
    });

    return <div className={css(classes.gallery)}>{gallery}</div>;
  }

  render() {
    const {
      heading,
      subheading,
      images,
      preventScroll,
      showThumbnails,
      spinner,
      spinnerColor,
      spinnerSize,
      theme,
    } = this.props;
    const { currentImage, lightboxIsOpen } = this.state;
    return (
      <div className="section">
        {heading && <h2>{heading}</h2>}
        {subheading && <p>{subheading}</p>}
        {this.renderGallery()}
        <Lightbox
          currentImage={currentImage}
          images={images}
          isOpen={lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.gotoImage}
          onClose={this.closeLightbox}
          preventScroll={preventScroll}
          showThumbnails={showThumbnails}
          spinner={spinner}
          spinnerColor={spinnerColor}
          spinnerSize={spinnerSize}
          theme={theme}
        />
      </div>
    );
  }
}

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
  // eslint-disable-next-line react/require-default-props
  heading: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  images: PropTypes.array,
  // eslint-disable-next-line react/require-default-props
  showThumbnails: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  subheading: PropTypes.string,
};

const gutter = {
  small: 2,
  large: 4,
};
const classes = StyleSheet.create({
  gallery: {
    marginRight: -gutter.small,
    overflow: 'hidden',

    '@media (min-width: 500px)': {
      marginRight: -gutter.large,
    },
  },

  // anchor
  thumbnail: {
    boxSizing: 'border-box',
    display: 'block',
    float: 'left',
    lineHeight: 0,
    paddingRight: gutter.small,
    paddingBottom: gutter.small,
    overflow: 'hidden',

    '@media (min-width: 500px)': {
      paddingRight: gutter.large,
      paddingBottom: gutter.large,
    },
  },

  // orientation
  landscape: {
    width: '30%',
  },
  square: {
    paddingBottom: 0,
    width: '40%',

    '@media (min-width: 500px)': {
      paddingBottom: 0,
    },
  },

  // actual <img />
  source: {
    border: 0,
    display: 'block',
    height: 'auto',
    maxWidth: '100%',
    width: 'auto',
  },
});

export default Gallery;
