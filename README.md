# dna-resizing-iframe-embed

## Brief
Custom, responsive widgets are added into existing web pages but the height changes depending on the size of the containing space.
These iframes need to display as if the content was a native part of the containing page.
Each widget is designed with fixed ratio views for mobile and desktop

## Solution
Wrap a simple JS function as part of a HTML embed code that will calculate the appropriate height of the eidget, creat e a new iframe, set it's height and render into a target div.

Target breakpoints are set for mobile and desktop views and the corresponding heights updated, the default spec was decided as most common by the widget designers.

These values are used to calcualte the ratio and therefore height required from the width of the container div as it sits in the webpage


