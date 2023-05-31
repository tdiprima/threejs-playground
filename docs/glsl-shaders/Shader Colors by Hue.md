## ¿Qué es esto?

```glsl
// Fragment Shader
uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 color = vec3(0.0);
  float t = mod(uTime, 1.0);
  float hue = fract(t * 6.0);

  if (hue < 0.1667) {
    // red - magenta
    color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.0, 1.0), hue * 6.0);
  } else if (hue < 0.3333) {
    // magenta - blue
    color = mix(vec3(1.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), (hue - 0.1667) * 6.0);
  } else if (hue < 0.5) {
    // blue - cyan
    color = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), (hue - 0.3333) * 6.0);
  } else if (hue < 0.6667) {
    // cyan - green
    color = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (hue - 0.5) * 6.0);
  } else if (hue < 0.8333) {
    // green - yellow
    color = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (hue - 0.6667) * 6.0);
  } else {
    // yellow - red
    color = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (hue - 0.8333) * 6.0);
  }

  gl_FragColor = vec4(color, 1.0);
}
```

<br>

## If hue, then color

This code is a fragment shader, which is a small program that determines the color of each pixel in a computer-generated image. Let's break it down step by step:

1. The fragment shader takes a variable called "hue" as input. Think of "hue" as a number that represents a color on a rainbow.

2. The code uses if-else statements to check the value of "hue" and determine the corresponding color for that hue value.

3. The first if statement checks if "hue" is less than 0.1667 (which is approximately **one-sixth** of the way through the rainbow). <span style="font-size:27px;">🌈</span>

    ```js
    let x = 1 / 6;
    let res = 0;

    // Loop 5 times, print 6
    for (let i = 0; i < 5; i++) {
      if (i === 0) {
        console.log(x.toFixed(4))
        res = x + x;
      } else {
        res = res + x;
      }
      console.log(res.toFixed(4));
    }

    // 0.1667
    // 0.3333
    // 0.5000
    // 0.6667
    // 0.8333
    // 1.0000
    ```

    <br>

    If it is, it assigns a color that is a mix between red (`vec3(1.0, 0.0, 0.0)`) and a shade of pink (`vec3(1.0, 0.0, 1.0)`). The specific shade is determined by multiplying the hue by `6.0`.

4. The following if-else statements work similarly. Each one checks if "hue" falls within a certain **range** and assigns a different color based on that range.

    The colors are **gradually transitioning** from one to another as the value of "hue" increases.

5. The last `else` statement handles the case where "hue" is greater than or equal to `0.8333`.

    In this case, it assigns a color that is a mix between yellow (`vec3(1.0, 1.0, 0.0)`) and red (`vec3(1.0, 0.0, 0.0)`).

6. The **"mix"** function is used to blend two colors together based on a specified **ratio.**

    ```glsl
    start = 0.1667;
    actual = hue;
    ratio = (actual - start) * 6;
    color = mix(vec3(1.0, 0.0, 1.0), vec3(0.0, 0.0, 1.0), ratio);
    ```

    The ratio is calculated by subtracting the starting point of the hue range (e.g., 0.1667) from the actual hue value and then multiplying it by 6.0.

In summary, this shader takes a **hue** value and **maps** it to a specific color on the rainbow, smoothly transitioning between different colors as the hue value increases.

## Why is it 6 and not 7?

Great question! The reason why the code multiplies the hue value by 6.0 instead of 7.0 is because the color spectrum (rainbow) is divided into six equal sections in this shader. Each section represents a range of hues that correspond to a specific color transition.

By multiplying the hue value by 6.0, the code ensures that the hue value is **scaled to fit** within the range of 0 to 6.

This allows the code to calculate the ratio of the hue within each section and smoothly transition between the colors.

If the code were to use 7.0 instead, it would mean dividing the spectrum into seven sections. However, in this particular shader, the developer has chosen to work with six sections, each covering approximately one-sixth of the rainbow. Multiplying the hue value by 6.0 provides a simple and consistent way to map the hue to the appropriate color transition within the six sections.

<br>
