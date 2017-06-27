# react-slider
This is a slider component for React. It is similar to the HTML input type 'range'.

# Props
Takes in 6 props:
- min: Number defines minimum range value. Default is 0.
- max: Number defines maximum range value. Default is 10.
- onScrub: Function called during the sliding event. It receives a parameter containing the current value. Default is empty.
- onRelease: Function called at the end of the sliding event. It receives a parameter containing the final value on release. Default is empty.
- exactValues: Boolean enables exact range values for slider when set to true. Default is false.
- decimalPlaces: Number defines the number of decimal places for rounding when exactValues is set to true. Default is 2.

# Style  
- The Slider is styled to fill 100% of its parent element's width.
- Works for both Portait and Landscape modes
