# chart.js-Preview-Slider
A Chart.js plugin to have preview chart and zoom/slider use
Works both for timescale and serial x-axes.

# Preview chart
- add a canvas element with id="canvasPreview", encapsuled in a div
- add option preview:{id:'yourPreviewCanvaid'}

# Slider on Preview chart
- add div with id="slider encapsuled in another div
- add option slider:{id:'idOfSliderDiv'}
-> You can now play with slider

# Mouse/touch event 
- click/move to navigate in main chart 
- double click to zoom on focus area in main chart 

# preset slider position according screen width
- add option slider:{id:'idOfSliderDiv','autostart':true}

# To improve:
- left to right y-axes alignement between main and preview Chart

Please use basic example.

