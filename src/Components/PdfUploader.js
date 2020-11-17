import React, { Component } from 'react';
import ImageDisplay from './ImageDisplay';

var pdftoimg
var imageData=[]

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
            var typedarray = new Uint8Array(this.result);
            pdftoimg.getDocument(typedarray).promise.then((pdf) => {
                let numOfPages = pdf.numPages
                console.log(numOfPages)
                for (let i =0;i<numOfPages;i++){
                    pdf.getPage(1).then((page) => {
                        renderPage(page)
                    });
                }
            });
        };
        fileReader.readAsArrayBuffer(file);
    }

    //Render the pdf data on canvas
    renderPage = (page) => {
        console.log("in e")
        var scale = 2.5;
        var filesaver = require('blob');
        var canvas = document.createElement("canvas");
        var viewport = page.getViewport({ scale: scale, });
        var context = canvas.getContext('2d');
        //
        // Prepare canvas using PDF page dimensions
        //
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        let task = page.render(renderContext)
        task.promise.then(() => {

            canvas.toBlob((image) => {
                imageData.push(new filesaver([image, { type: 'image/jpeg' }]))
                this.setState({ fileLoaded: true })
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
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
                    {this.state.fileLoaded &&
                    imageData.map((image)=>{
                        return <ImageDisplay imageData={image} /> // Implementation to display the image from blob object 
                    })
                    }
            </div>
        )
    }

}