## What is X3D?

**Extensible 3D Graphics (X3D)**

Imagine you're playing a video game or using a virtual reality headset, and you see all these cool 3D objects and environments around you. Extensible 3D Graphics, or X3D for short, is kind of like the language these 3D worlds are written in. It's a way for computers to understand and display 3D graphics that can range from simple shapes to complex, interactive worlds.

One cool thing about X3D is that it's extensible, which means it's designed to be easily added to and improved over time. This is important because as technology gets better, we want to be able to do more with our 3D graphics, like making them look more realistic or behave in new ways.

X3D is used in a lot of different areas, like video games, virtual reality, scientific visualization (like showing how molecules move or how the planets orbit), and even in art and design. It's a powerful tool that lets creators bring their imaginations to life in a 3D space.

## What is X3Dom?

[X3DOM](https://github.com/x3dom/x3dom) (pronounced "X-Freedom") is a cool technology that brings 3D graphics to the web, using X3D. Imagine you're browsing the internet and, instead of just seeing flat images and text, you can interact with 3D models right inside your web browser – that's what X3DOM allows you to do.

Here's how it works:

1. **Integration with Web Pages**: X3DOM is a framework that integrates X3D content directly into HTML5 web pages. This means you can have 3D graphics as a part of a website, just like photos or videos.

2. **No Need for Special Plugins**: In the past, if you wanted to see 3D stuff on a website, you often needed to install extra software or plugins in your browser. X3DOM is cool because it doesn't require any of that. It works directly in your web browser using something called WebGL, which is a standard for displaying 3D graphics on the web.

3. **Easy to Use for Web Developers**: For people who make websites, X3DOM makes it easier to add 3D content. They can use the X3D format to create the 3D models and scenes, and then include them in a webpage just like they would with a video or image.

4. **Interactive 3D Experiences**: With X3DOM, you can not only see 3D models on a website but also interact with them. You can rotate them, zoom in and out, and sometimes even change their appearance or how they behave.

5. **Bringing 3D to the Everyday Web**: X3DOM is part of a movement to make 3D graphics a regular part of the web experience, just like text, images, and videos are today. It opens up a lot of possibilities for education, entertainment, online shopping (like seeing products in 3D), and much more.

In summary, X3DOM is a tool that makes it easier and more accessible to have interactive 3D graphics on web pages, without needing extra software, making the web a more dynamic and visually engaging place.

## Cube Example in x3dom

[X3Dom.html](X3Dom.html)

```html
<script src='https://www.x3dom.org/download/x3dom.js'></script>
<link rel='stylesheet' href='https://www.x3dom.org/download/x3dom.css'></link>
```

```html
<x3d width='500px' height='400px'>
    <scene>
        <shape>
            <appearance>
                <material diffuseColor='0 1 1'></material>
            </appearance>
            <box></box>
        </shape>
    </scene>
</x3d>
```

### 3D Content:

- The `<x3d>` tag defines the 3D space where your object will be displayed, with specified width and height.
- Inside the `<x3d>` tag, a `<scene>` tag is used to contain all 3D objects and elements.
- The `<shape>` tag defines the actual 3D object. In this case, it's a simple box (cube).
- The `<appearance>` and `<material>` tags are used to define how the surface of the box looks, like its color.

### Displaying a Cube:

- The `<box>` tag inside `<shape>` creates a simple 3D cube.

You'll see a 3D cube that you can interact with – rotate, zoom in and out. You can create more complex 3D scenes by adding more shapes, lights, and animations.

## Planet Orbit Simulation in x3dom

`x3dom` is a framework that enables integration of 3D content into HTML5 web pages using the X3D standard.

This example will create a simple solar system model with a few planets orbiting around the sun. Keep in mind that this is a basic representation and may not be accurate in terms of scale or orbital mechanics.

[planets.html](planets.html)

This code sets up a basic 3D scene with the sun and two planets.

The `timeSensor` node is used to create an animation loop, and `orientationInterpolator` nodes define how each planet should move.

The `route` elements link the time sensor to the interpolators and then to the transforms of the planets to create the orbital movement.

The orbits are simplified and circular for the purposes of this demonstration. In a more advanced simulation, you could add more planets, adjust their sizes, colors, and orbits to be more realistic.

<br>
