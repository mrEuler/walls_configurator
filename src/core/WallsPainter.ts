import { ActionController, ActionControllerEventName } from "@g.frame/common.action_controller";
import { TextComponent } from "@g.frame/components.text";
import { Factory, ViewerModule } from "@g.frame/core";
import { BufferGeometry, Euler, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D, Quaternion, SphereGeometry, Vector2, Vector3 } from "three";

export class WallsPainter extends ViewerModule {

    private interactionPlane: Object3D;
    private moveEventHandler: (event: any) => void;
    private buttonDownEventHandler: (event: any) => void;
    private points: Array<Mesh<SphereGeometry, MeshBasicMaterial>> = [];
    private line: Line<BufferGeometry, LineBasicMaterial>;
    private labels: Array<TextComponent> = [];
    constructor(private actionController: ActionController, private factory: Factory<any>) {
        super();

        this.line = new Line(new BufferGeometry(), new LineBasicMaterial({ color: 'red', linewidth: 20 }));
        this.addObject(this.line);
    }

    reset() {
        this.points.forEach(point => {
            this.removeObject(point);
        });
        this.points = [];
        this.updateLine();
        this.enable(true);
    }

    setInterectionPlane(obj: Object3D) {
        this.interactionPlane = obj;
    }

    enable(enable: boolean) {
        if (!this.interactionPlane) return;
        if (enable) {
            this.actionController.on(ActionControllerEventName.click, this.interactionPlane, this.buttonDownEventHandler = (event) => {
                const pos: Vector3 = event.data.intersection.point.clone();
                pos.y += 0.1; // to remove overlappings

                if (this.points.length > 2 && pos.distanceTo(this.points[0].position) < 1) {
                    this.points.push(this.points[0]);
                    this.updateLine();
                    this.enable(false);
                    return;
                } else {
                    this.addNewPoint(pos, event.data.intersection.uv);
                }
            });
            this.actionController.on(ActionControllerEventName.move, this.interactionPlane, this.moveEventHandler = (event) => {
                // for future needs
            });
        } else {
            if (this.moveEventHandler) this.actionController.off(ActionControllerEventName.move, null, this.moveEventHandler);
            if (this.buttonDownEventHandler) this.actionController.off(ActionControllerEventName.click, null, this.buttonDownEventHandler)
        }
    }

    addNewPoint(position: Vector3, uv: Vector2) {
        const mesh = new Mesh(new SphereGeometry(0.5), new MeshBasicMaterial({ color: 'red' }));
        mesh.position.copy(position);
        mesh.userData.uvGround = uv;
        this.addObject(mesh);
        this.points.push(mesh);

        this.updateLine();
    }

    updateLine() {
        const positions = this.points.map(obj => obj.position);
        this.line.geometry.setFromPoints(positions);

        // remove previous labels
        this.labels.forEach(obj => {
            this.removeObject(obj);
        });

        // generate new labels
        this.points.forEach((current, i, arr) => {
            if (i === arr.length - 1) return; // skip the last one, because it's duplicate of the first

            let next = i < (arr.length - 1) ? arr[i + 1] : arr[0]; // next goes the
            const position = current.position.clone().lerp(next.position, 0.5);

            const distance = Math.round(current.position.distanceTo(next.position) * 100) / 100; // distance in meters with 2 digits after period


            const label = this.factory.getFactory(TextComponent)({
                size: new Vector2(3, 1.5),
                pxSize: new Vector2(80, 40),
                background: {
                    color: '#fff'
                },
                text: {
                    margin: {
                        right: 25,
                        left: 23,
                        top: 10,
                        bottom: 10
                    },
                    value: `${distance} m`,
                    lineHeight: 40,
                    style: {

                        size: '38px',
                        color: '#000'
                    },
                    autoWrapping: true,
                    autoWrappingHorizontal: true
                }
            });
            this.addObject(label);
            this.labels.push(label);
            const q = new Quaternion();
            // rotate to correspond the line
            q.setFromUnitVectors(new Vector3(-1, 0, 0), next.position.clone().sub(current.position).normalize());
            // rotate to face upwards
            q.multiply(new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)));

            label.uiObject.position.copy(position);
            // aply quaternion to label
            label.uiObject.quaternion.copy(q);
            label.uiObject.position.y += 0.01;
        })

    }

    getArrayOfPoints() {
        return this.points.map(obj => {
            return {
                position: obj.position.clone().sub(new Vector3(0, 0.1, 0)),
                uvGround: obj.userData.uvGround
            }
        });
    }


}