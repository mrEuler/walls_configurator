import { ButtonComponent, ButtonComponentFactory } from "@g.frame/components.buttons";
import { InputComponent } from "@g.frame/components.input";
import { Factory, ViewerModule } from "@g.frame/core";
import { InputType } from "@g.frame/input";
import { PlaneGeometry, Vector2, Vector3 } from "three";

export class UIComponent extends ViewerModule {

    private button1: ButtonComponent;
    private button2: ButtonComponent;
    private startDrawings: ButtonComponent;
    private finishDrawings: ButtonComponent;
    private changeAxis: ButtonComponent;
    private setHeight: ButtonComponent;
    private setAngle: ButtonComponent;

    constructor(private factory: Factory<any>) {
        super();

        // Everything here can be changed to more effective way of storing all the elements
        // and process the conditions of the UI state
        // for now it's OK 

        // Just in case all the UI is rendered in WebGL and sticked to the camera view

        this.button1 = this.createButton('Top view', 'button1');
        this.button1.uiObject.position.set(-0.99, 0.65, -1);

        this.button2 = this.createButton('Reset Drawing', 'resetDraw');
        this.button2.uiObject.position.set(-0.99, 0.55, -1);

        const startDrawings = this.startDrawings = this.createButton('Start drawing', 'startDraw');
        startDrawings.uiObject.position.set(-0.99, 0.55, -1);

        const finishDrawings = this.finishDrawings = this.createButton('Finish drawing', 'finishDraw');
        finishDrawings.uiObject.position.set(-0.99, 0.45, -1);

        const changeAxis = this.changeAxis = this.createButton('Change axis', 'changeAxis');
        changeAxis.uiObject.position.set(-0.99, 0.55, -1);

        const setHeight = this.setHeight = this.createButton('Set height', 'setHeight');
        setHeight.uiObject.position.set(-0.99, 0.45, -1);

        const setAngle = this.setAngle = this.createButton('Set angle', 'setAngle');
        setAngle.uiObject.position.set(-0.99, 0.35, -1);
    }

    setState(state: 'initial' | 'drawing' | 'drawingDone') {
        switch(state) {
            case "initial":
                this.button2.uiObject.visible = false;
                this.startDrawings.uiObject.visible = true;
                this.finishDrawings.uiObject.visible = false;
                this.changeAxis.uiObject.visible = false;
                this.setHeight.uiObject.visible = false;
                this.setAngle.uiObject.visible = false;
                break;
            case "drawing":
                this.button2.uiObject.visible = true;
                this.startDrawings.uiObject.visible = false;
                this.finishDrawings.uiObject.visible = true;
                this.changeAxis.uiObject.visible = false;
                this.setHeight.uiObject.visible = false;
                this.setAngle.uiObject.visible = false;
                break;
            case "drawingDone":
                this.button2.uiObject.visible = false;
                this.startDrawings.uiObject.visible = false;
                this.finishDrawings.uiObject.visible = false;
                this.changeAxis.uiObject.visible = true;
                this.setHeight.uiObject.visible = true;
                this.setAngle.uiObject.visible = true;
                break;
        }
    }

    createButton(text: string, eventName: string) {
        const button = this.factory.getFactory(ButtonComponent)({
            text: {
                margin: {
                    top: 20,
                    bottom: 20,
                    left: 50,
                    right: 50
                },
                value: text,
                lineHeight: 20,
                autoWrapping: true,
                autoWrappingHorizontal: true
            },
            bordRadius: 0.05 * 0.66,
            background: {
                color: 'white',
                radius: 100
            },
            size: new Vector3(1 * 0.66, 0.5 * 0.66, 0.01),
            sizePx: new Vector2(400, 200),
            type: 'flat'
        });
        this.addObject(button);
        button.uiObject.scale.setZ(0.01);
        button.on('click', () => this.fire(eventName));

        return button;
    }





}