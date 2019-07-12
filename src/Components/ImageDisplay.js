import React from 'react';

//
//Functinal component to display the image 
//  Input: blobObject
//  Output: A image component
//

function ImageDisplay(props) {
  let imageUrl=''
  if(props.imageData){
      imageUrl = URL.createObjectURL(props.imageData); //To generate DOMString containing URL (using URL webAPI by mozilla)
  }

    return (
        <img src={imageUrl} alt="PDF not loaded"/>
    );
  }

export default ImageDisplay