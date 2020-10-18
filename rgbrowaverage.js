/**
This method will essentially convert RGB pixels in an image to a grayscale for a
specified section of a specified row.
pixelArray is an array of the form [row][column][color] where the indices of
color are
**/
function rowRGBAverage (pixelArray, rowNumber, startIndex, endIndex){
     let pixelRGBAverage = new Array(3);
    //Assumed that pixelArray is of the form [row][column][color]
    let pixelSum = 0;
     for (let index = startIndex; index < endIndex+1; index++){
            for (let color = 0; color < 3; color++){
              pixelSum += pixelArray[rowNumber][index][color]
              //sum all of the RGB values together in that pixel
            }
            pixelAverage = pixelSum/3;
            pixelSum = 0;
            //divide them by the total number of pixels in that row
            pixelArray[rowNumber][index].fill(pixelAverage);
            //replaces the pixel's RGB values with their average
     }
     //return a row of average rgb values
     return pixelArray[rowNumber];
}
console.log(rowRGBAverage(array, 2, 0, 2));
