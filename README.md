# Aether Energy Test Project
Author Oleksii Maksymov

## Links
* [live demo](https://mreuler.github.io/walls_configurator/index.html) It's live, so no need to download and install it
* [three.js](https://threejs.org/) 3D library to use WebGL
* [g.frame](https://github.com/mrEuler/g.frame) Framework above three.js

## General comments
* This application is built using g.frame framework, that works above three.js
* All UI is done in WebGL, just as a showcase. It's not responsive right now, but can be.
* Satelite image was downloaded with curl, to serve it on GH Pages. Area is aroound 100x100 meters in US.
* Currently the is possible to create only one building after page refreshment, but easy to change in codebase, to create many and edit many.
* Polishing and adding cool features always possible, but it requires more time, and the border is only your/my imagination
* Feel free to open issues, if you have question regarding the code

## Code structure
* `index.ts` -- Main file, that creates an instance of ModuleProcessor of g.frame; inits viewer: camera, renderer, controls, etc; initializes all the modules;
    * `core/MainView.ts` -- File with main logic, creates instances of the components for this application;
    * `core/GroundComponent.ts` -- Component, that represents surface with satelite image. Also is used for raycasting furing walls drawing;
    * `core/UIComponent.ts` -- Component, that represents UI elements, that are rendered within WebGL, so they are not HTML elements. Always like to use WebGL components, when there is a future possibility for WebXR (VR) integration
    * `core/WallsPainter.ts` -- Component, that serves as a logic and view to create outline of future walls. Renders spheres for points, line between points as a perimeter, labels (@g.frame/TextComponent) to show measurements in WebGL.
    * `core/BuilidngComponent.ts` -- Building model, generates floor, walls and roof as 3d elements. Processes building height, angle of the roof and axis for that angle (axis is here is a vector between 2 points from WallsPainter)


## How to start
Use node.js version 16 and above.
```
npm i
npm run start
```
open https://localhost:8718