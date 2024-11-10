const defaultImage = "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"

const ImageWithFallback = ({ src, alt, defaultSrc, style}) => {

    const handleError = (event) => {
        if(defaultSrc == null)defaultSrc = defaultImage
        event.target.src = defaultSrc;
    };
  
    return (
      <img src={src} alt={alt} onError={handleError} style={style} />
    );
  };

export default ImageWithFallback