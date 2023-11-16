import { BoxGeometry, Color, HemisphereLight, Mesh, MeshBasicMaterial, PointLight, Texture, Vector2 } from 'three';
import { Bootstrap, Factory, ModulesProcessor, Tween } from '@g.frame/core';
import { DesktopModule, OrbitControls } from '@g.frame/desktop';
import { InputModule, InputType } from '@g.frame/input';
import { ActionController, ActionControllerEventName } from '@g.frame/common.action_controller';
import { Loader } from '@g.frame/common.loaders';
import { GroundComponent } from './GroundComponent';
import { UIComponent } from './UIComponent';
import { ButtonComponent, ButtonComponentFactory } from '@g.frame/components.buttons';
import { WallsPainter } from './WallsPainter';
import { BuildingComponent } from './BuildingComponent';


export class MainView extends Bootstrap {
    private actionController: ActionController;
    private uiComponent: UIComponent;
    private ground: GroundComponent;
    private wallsPainter: WallsPainter;
    private buildings: Array<BuildingComponent> = [];

    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        // this.actionController = modulesProcessor.agents.get(ActionController);
        const loader = modulesProcessor.agents.get(Loader);

        const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];

        orbitControls.object.position.set(0, 100, 0);
        orbitControls.target.set(0, 0, 0);
        orbitControls.update();

        // component, that shows satelite image
        this.ground = new GroundComponent(loader);
        this.addObject(this.ground);

        // all buttons are stored and processed here
        this.uiComponent = new UIComponent(modulesProcessor.agents.get(Factory));
        this.addObject(this.uiComponent, null, modulesProcessor.viewer.camera);

        // component to draw outline of future walls
        this.wallsPainter = new WallsPainter(modulesProcessor.agents.get(ActionController), modulesProcessor.agents.get(Factory));
        this.addObject(this.wallsPainter)


        // some lightsources
        //for reflection
        const light = new PointLight();
        this.addObject(light);
        light.position.set(50,50,50);
        // for general ambient light
        const hemisphere = new HemisphereLight();
        this.addObject(hemisphere);

        // loading all the resources
        loader.load().then(() => {

            this.ground.prepareResources();

            let building;
            let axis = 0;
            let angle = 0;
            let points;

            this.uiComponent.setState('initial')
            this.uiComponent.on('button1', () => {
                orbitControls.object.position.set(0, 100, 0);
                orbitControls.target.set(0, 0, 0);
                orbitControls.update();
            });

            this.uiComponent.on('resetDraw', () => {
                this.wallsPainter.reset();
            });

            this.uiComponent.on('startDraw', () => {
                this.wallsPainter.enable(false);
                this.wallsPainter.setInterectionPlane(this.ground.uiObject);
                this.wallsPainter.reset();
                this.uiComponent.setState('drawing')

            });
            this.uiComponent.on('finishDraw', () => {
                this.wallsPainter.enable(false);
                points = this.wallsPainter.getArrayOfPoints();
                this.wallsPainter.reset();
                const buildingHeight = 1;
                building = new BuildingComponent(loader.getResource('satelite_image'), points, buildingHeight);
                this.addObject(building);
                this.buildings.push(building)
                this.uiComponent.setState('drawingDone');

            });


            this.uiComponent.on('changeAxis', () => {
                axis++;
                if (axis > points.length - 1) axis = 0
                building.setRoofAngle(-angle * Math.PI / 180, axis)
            });
            this.uiComponent.on('setHeight', () => {
                const buildingHeight = +prompt('Enter building height (min) in meters:');
                building.setHeight(buildingHeight);
            });
            this.uiComponent.on('setAngle', () => {
                angle = +prompt('Enter angle in degrees 0-89:');
                building.setRoofAngle(-angle * Math.PI / 180, axis)
            });

            this.wallsPainter.setInterectionPlane(this.ground.uiObject);
        });


    }

}
