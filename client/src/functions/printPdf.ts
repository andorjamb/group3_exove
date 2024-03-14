import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * @param {HTMLDivElement} root  - the div container element to be printed
 * @param {string} name - userId
 *
 */

export async function printMultiPdf(elArray:HTMLDivElement[], name:string | undefined) {
 console.log("type of elArray passed in:", typeof elArray);
  let pdf = new jsPDF("portrait", "px", "a4");
  let displacement = 1;
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
 // console.log("pdf doc internal height:", pdfHeight);

 //************ */
// const awaitPDF = await (
    elArray.forEach((el:HTMLDivElement, i:number) => {
    ////////
    html2canvas(el).then((canvas) => {
      let imageData = canvas.toDataURL("image/png");
      let imageSize = pdf.getImageProperties(imageData); //size without scaling
      const convertedHeight = (imageSize.height * pdfWidth) / imageSize.width; //gives height of one converted image
      if(i>0){displacement += convertedHeight};  //halve or scale according to resized image dimenensions
      console.log("converted image height:", convertedHeight);
      console.log(' ///////////------->  current displacement height', displacement);
      let totalDocPages = Math.ceil(elArray.length * convertedHeight/pdfHeight);
      console.log("totalDocPages needed", totalDocPages);

     if(displacement+convertedHeight > pdfHeight){
        pdf.addPage();//adds page break
        displacement = 16;
      } 
      pdf.addImage(imageData,
        "PNG",
        0,
        displacement,
        pdfWidth,
        convertedHeight
      );
      
    });
    //////////
    
})

//*******
setTimeout(()=>{pdf.save(`report_${name}`)}, 2000);

//).then(()=>pdf.save(`report_${name}`))
}
