//const image_extraction = require('image_extraction.js');
/*
Plan for how to plot spectra: pick a horizontal line of pixels to measure the
intensity. We'll determine the left most pixels to be 740 nm and the right most
pixels to be 380 nm. We'll call the percent length down the line proportional
to the percent change in wavelength. The image will always be 1000x1000 but
I'll just call the width anyway. */
//pixels = extract_pixels(context);
//let intensity = get_intensity_of_line(pixels, line);
//let width = footage.width;
/*intensity = Array(1000);
for (let i =0; i<intensity.length; i++){
    intensity[i] = 255;
}
This function will consist of an array of ordered pairs. So we will loop thorugh
the line and assign each pixel a wavelength assuming a linear relationship
between pixel location and wavelength. So the general expression we want is
wavelength = 740-(380+740)(location/width). Based on the way image_extraction.js
was written, the intensity will always be an array of 1000 integer elements.
This returns an array of the form [{x:wavelength, y:intensity},...]
*/
function make_spectra (intensity){
    let spectrum = Array(intensity.length);
    for (let i = 0; i<intensity.length; i++){
        spectrum[i] = {x: 740-((740-380)*(i/(intensity.length-1))), y:intensity[i]};
   }
   return spectrum;
}
//console.log(make_spectra(intensity,intensity.length));
function get_spectrum(pix, line) {
  return make_spectra(get_intensity_of_line(pix, line))
}

function get_box_spectrum(pix) {
  footage_wrapper = document.getElementById("video_footage_wrapper")
  size_of_x = footage_wrapper.clientWidth
  size_of_y = footage_wrapper.clientHeight
  ymin = Math.floor(1000 * m_area.offsetTop / size_of_y)
  ymax = Math.floor(1000 * (m_area.offsetTop + m_area.clientHeight) / size_of_y)
  xmin = Math.floor(1000 * m_area.offsetLeft / size_of_x)
  xmax = Math.floor(1000 * (m_area.offsetLeft + m_area.clientWidth) / size_of_x)
  console.log(xmax, xmin)
  return make_spectra(get_intensity_of_box(pix, ymin, ymax, xmin, xmax))



}
