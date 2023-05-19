## WebGL overlay

[#1008](https://github.com/openseadragon/openseadragon/issues/1008)

<span style="color:#051094;font-weight:bold;font-size:larger;">jetic83</span>

There are several plugins for SVG and Canvas overlays (fabricjs, paper, canvas, svg...).

**I experience significant slowness when using them with a lot of objects** (e.g. **100k** rectangles in my deep zoom image).

**However, <mark>WebGL can render 100k</mark>** rectangles easily and fast (e.g. **with three.js**).

Are there also **plugins** for WebGL overlays?

And is there a **reason why** there is no WebGL ovlerlay (maybe this is not possible)?

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

It seems like it should definitely be possible... I think just no one has done it. Whoever wants to try, I'm guessing starting with [OpenSeadragonCanvasOverlay](https://github.com/altert/OpenSeadragonCanvasOverlay) would probably be easiest. Maybe do an **OpenSeadragonThreeJsOverlay** or something...

<span style="color:#051094;font-weight:bold;font-size:larger;">thejohnhoffer</span>

Hi there &ndash; I've just <mark>**developed a small plugin**</mark> that runs openSeadragon tiles through **WebGL**. With two OpenSeadragon `tileSources`, you can run your WebGL on just the top tileSource.

Checkout the demo here [OpenSeadragon WebGL Overlay](http://via.hoff.in/demo/overlay/)

With any `tileSource` as a texture, you get any WebGL GLSL shaders run on top of an OpenSeadragon `tileSource`. It renders the WebGL layer via the OpenSeadragon `drawer`, but has the effect of a WebGL overlay for generating rectangles.

Check out the plugin here: [viaWebGL + openSeadragonGL](http://via.hoff.in/)

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

I assume given the architecture of your plugin that it's **only possible to modify the tiles**, but **not possible to overlay original geometry** on top of the OSD world, is that correct?

I guess if you had a **WebGL overlay** that did zooming and panning and drew its own images directly to the screen that would handle that case.

Of course [#68](https://github.com/openseadragon/openseadragon/issues/68) is another thing, but possibly related.

<span style="color:#051094;font-weight:bold;font-size:larger;">thejohnhoffer</span>

Yes &ndash; my plugin just acts on the tiles.

For overlaying original geometry, I'd use a second (empty) `tileSource` layer.

It could even be a simple black image, or a repeated black tile.

Looking at it now, you would want to send the `Tile.bounds` as two `uniform vec2` to GLSL shaders for each tile that you render.

My plugin has support for sending custom variables like that into your <mark>**shaders**</mark> using WebGL's native API.

[A demo of WebGL run per tile](http://via.hoff.in/demo/rect/) as if the TiledImage were one canvas

Shaders...

WebGL GLSL vertex shader, etc.

<span style="color:#051094;font-weight:bold;font-size:larger;">r10a</span>

I know it's been two years but I have created a WebGL Threejs overlay for OpenSeaDragon.

### [Repo](https://fervent-snyder-c66537.netlify.com/)

### [OpenSeadragonThreejsOverlay](https://github.com/slntRohit/OpenSeadragonThreejsOverlay)

<span style="color:#051094;font-weight:bold;font-size:larger;">jetic83</span>

The disadvantage of e.g. the fabricjs plugin was that is becomes very slow if is has to render e.g. 5000+ different objects on the image (e.g. annotating cell nuclei on a pathology image). Then, navigation with OSD becomes slow and uncomfortable. Can you render more 5000+ objects on the image in a small region?

<span style="color:#051094;font-weight:bold;font-size:larger;">r10a</span>

### I was able to render 130k objects comfortably in my own project [Histolomaps](https://github.com/NCBI-Hackathons/HistoloMaps).

(Which I think is pretty similar to your project). There were some fps drops, but I think I can get them out with optimizations.

### During benchmarking the threejs library, I went up to a million objects with some fps drops.

<mark>**Threejs renders webgl using the GPU.**</mark> So I think 5000+ objects will be very easy.

What the hell is image flipping?

<span style="color:#051094;font-weight:bold;font-size:larger;">jetic83</span>

Nice!

Flipping is the latest feature of OSD

### [#1441](https://github.com/openseadragon/openseadragon/pull/1441)

Yes, @iangilman, when those basic controls (rotation, flipping) are supported, I strongly recommend to include this in the plugin list. The performance difference to e.g. fabricjs with a mass of objects is significant.

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

I'd say go ahead and add it to the plugin list already, since it's already useful to people who don't need rotation and flipping support (though of course support for those features would be great!). Please make a pull request on:

[https://github.com/openseadragon/site-build/blob/0d63cdab413a0be9832c75fbce14f475c6386e95/www/index.html#L151](https://github.com/openseadragon/site-build/blob/0d63cdab413a0be9832c75fbce14f475c6386e95/www/index.html#L151)

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

@Aiosa are your tiles in PNG format with transparency? That's the first step.

I see you've also filed [thejohnhoffer/viaWebGL#10](https://github.com/thejohnhoffer/viaWebGL/issues/10), which is good, since it sounds like the issue may be specific to that plugin.

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

My understanding of [https://github.com/thejohnhoffer/viaWebGL](https://github.com/thejohnhoffer/viaWebGL) is that it doesn't convert the entire drawing process to WebGL; it just allows you to <mark>**use WebGL shaders to modify the tiles.**</mark> @thejohnhoffer

<span style="color:#051094;font-weight:bold;font-size:larger;">Aiosa</span>

The transparency works without a plugin &ndash; it already worked, I am not the official author of that project I am just improving performance and user experience (original project here: [https://github.com/cesekova/openseadragon_project](https://github.com/cesekova/openseadragon_project)).

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

Yes, having a **WebGL renderer** would be awesome! There's discussion about that in [#68](https://github.com/openseadragon/openseadragon/issues/68) and [#1482](https://github.com/openseadragon/openseadragon/issues/1482), but as far as I know there hasn't been any progress on making it happen. I expect it'll be a good chunk of work.

And yes, it would be great if we had a better mechanism for creating/using tile data on the fly. Some discussion about that in [#119](https://github.com/openseadragon/openseadragon/issues/119) and [#1707](https://github.com/openseadragon/openseadragon/issues/1707). I believe it's possible at the moment, but not very smooth...

<span style="color:#051094;font-weight:bold;font-size:larger;">Aiosa</span>

so far the best solution I know of (including available code for OSD I found) is in my small **WebGL module** within a <mark>**Pathology Viewer**</mark> I develop.

It uses several ways of binding WebGL to the TiledImage instance, including the new [data pipeline](https://github.com/openseadragon/site-build/pull/258) that [will get released](https://github.com/openseadragon/openseadragon/pull/2148) in the next OSD version. Unlike all solutions you can find it also supports caching (with the new API).

Follow [https://github.com/RationAI/pathopus/tree/development/modules/webgl](https://github.com/RationAI/pathopus/tree/development/modules/webgl) this link to the module. The [webGLToOSDBridge.js](https://github.com/RationAI/pathopus/blob/development/modules/webgl/webGLToOSDBridge.js) file contains logics of **binding the WebGL rendering** to the TiledImage instance. Maybe you will find the WebGL library useful as well :) The small advantage (or downside, depends) is that it uses no library, just vanilla JS and WebGL.

IMHO it is already tested on far greater chunks of data than you will ever encounter so performance shouldn't be a problem.

### [#1008](https://github.com/openseadragon/openseadragon/issues/1008#:~:text=data%20pipeline%20that-,will%20get%20released,-in%20the%20next)

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

@BeebBenjamin it sounds like you are basing your positioning off of the `viewer.viewport.getBounds()` which gives you the target bounds for the animation, not the current bounds. To get the exact current bounds for this frame, use `viewer.viewport.getBounds(true)`.

<span style="color:#051094;font-weight:bold;font-size:larger;">BeebBenjamin</span>

Thanks so much, this has fixed the issue for panning and zooming in, however, zooming out still looks janky...

I had a hunch, and `viewer.viewport.getZoom` was the culprit. This is now set to `true` and gets the current zoom! Many thanks for your replies. The project at the Bodleian is called **ARCHiOx** and as part of it we are researching WebGL either directly or abstracted via things like **Threejs** and **PixiJS** to render normal maps with interactive lighting. Hopefully I will be able to share the output of our research with the community soon!

<span style="color:#051094;font-weight:bold;font-size:larger;">iangilman</span>

BTW, for anyone interested in **WebGL overlays**, you might like to know that <mark>**@rsimon**</mark> is adding them to [https://recogito.github.io/annotorious/](https://recogito.github.io/annotorious/):

[https://twitter.com/aboutgeo/status/1547896108273152000](https://twitter.com/aboutgeo/status/1547896108273152000)

<span style="color:#051094;font-weight:bold;font-size:larger;">rsimon</span>

thanks @iangilman for pinging me. Yes, I'm working on a <mark>**WebGL overlay plugin**</mark> (2D only, not 2.5D!) It's running pretty well by now. It handles rotation, but I still need to look into flip. (Shouldn't be a big change though.) Here's my latest test with 11.5k overlays (a mix of polygons and rectangles). I haven't tested out the limitations yet, but it looks like you can safely draw significantly more shapes than that. (I did make a simple test with one million rectangles when I started. Seemed to work ok.)

[https://twitter.com/aboutgeo/status/1549460230152536069](https://twitter.com/aboutgeo/status/1549460230152536069)

I'm using [PixiJS](https://pixijs.com/) for rendering, BTW, rather than WebGL directly, which seems to abstract away many of the low-level details. (You're essentially dealing with a simple scene graph.) In my case, I'm attaching the render call to the OSD update-viewport event.

Yes, the WebGL overlay code will provide the basis for the next major release of <mark>**[Annotorious](https://annotorious.com/).**</mark>

But I'm planning to make things more modular this time, and hoping to release the overlay drawing feature as a separate OSD plugin that can be used without Annotorious, too.

<br>
