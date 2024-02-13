## Calculate Standard Deviation

You can calculate the standard deviation of an array of numbers in JavaScript using the Array `reduce` method to find the mean (average) of the array and then to find the variance (the average of the squared differences from the mean). The standard deviation is the square root of the variance. 

Here's how you could do it for the `heights` array:

```javascript
const heights = [160, 162, 163, 167, 170, 171, 172, 175, 178, 180];

// Step 1: Calculate the mean
const mean = heights.reduce((acc, val) => acc + val, 0) / heights.length;

// Step 2: Calculate the variance
const variance = heights.reduce((acc, val) => acc + ((val - mean) ** 2), 0) / heights.length;

// Step 3: Calculate the standard deviation
const standardDeviation = Math.sqrt(variance);

console.log(standardDeviation);
```

In this code:

1. We first calculate the mean of the heights.
2. We then use the mean to calculate the variance.
3. Finally, we take the square root of the variance to find the standard deviation.

## See also

<span style="color:#59acf3;font-size:larger;">mathematics.js, histogram.html</span>

<br>
