import React, { Component } from 'react';
import ImageDisplay from './ImageDisplay';

var pdftoimg
var imageData

//
// Functionality: Allows user to upload the pdf files and generates the images of evey single page
// Concept of Implementation: Use pdfjsLib by mozilla to read pdf files and render the data
//                            on to canvas then save the image of canvas as a blob or base64 
//                            as per need. 
//                            

export default class PdfUploader extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            fileLoaded: false
        })
        this.getFile = this.getFile.bind(this)
        this.renderPage = this.renderPage.bind(this)
    }

    //
    // Including the pdfjsLib provided by mozilla for reading/parsing the pdf files
    //
    componentDidMount() {
        pdftoimg = window.pdfjsLib;
    }

    //
    // Read the pdf data and render in the 
    // {READ this CONCEPT TO UNDERSTAND why I have seperated the 
    // renderPage fuction inoder to access PdfUploader class members}
    //

    getFile = (e) => {
        const file = e.currentTarget.files[0]
        let renderPage = this.renderPage
        let fileReader = new FileReader();
        this.setState({fileLoaded:false})
        fileReader.onload = function (data) {
            pdftoimg.getDocument(fileReader.result).then((pdf) => {
                pdf.getPage(1).then((page) => {
                    renderPage(page)
                });
            });
        };
        fileReader.readAsArrayBuffer(file);
    }

    //Render the pdf data on canvas
    renderPage = (page) => {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //

        var canvas = this.refs.canvas;
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var filesaver = require('blob');

        //
        // Render PDF page into canvas context
        //

        var task = page.render({ canvasContext: context, viewport: viewport })
        task.promise.then(() => {

            canvas.toBlob((image) => {
                imageData = new filesaver([image, { type: 'image/jpeg' }])
                this.setState({ fileLoaded: true })
            })
        });


    }

    render() {
        return (
            <div>
                <input type="file"
                    name="imgUpload"
                    accept='.pdf'
                    onChange={this.getFile} />
                    {/* First display the canvas to display pdf data till image is saved 
                    then display the images generated */}
                {this.state.fileLoaded ?
                    <ImageDisplay imageData={imageData} /> // Implementation to display the image from blob object 
                    :
                    <canvas name="canvas" ref="canvas" />
                }
            </div>
        )
    }

}