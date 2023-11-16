import { ViewerModule } from "@g.frame/core";
import { BufferAttribute, BufferGeometry, Line3, Mesh, MeshPhongMaterial, Shape, ShapeGeometry, Texture, Vector2, Vector3 } from "three";

export function r4d(n: number) {
    return Math.round(n * 10000)
}

export class BuildingComponent extends ViewerModule {
    private roof: Mesh<ShapeGeometry, MeshPhongMaterial>;
    private floor: Mesh<ShapeGeometry, MeshPhongMaterial>;
    private walls: Mesh<BufferGeometry, MeshPhongMaterial>;
    private originalRoofBufferPositions: ArrayLike<number>;

    constructor(private roofTexture: Texture, private positions: Array<{ position: Vector3, uvGround: Vector2 }>, private height: number) {
        super();
        const shape = new Shape();
        const uvBuffer = [];
        positions.forEach((pos, i) => {
            if (i === 0) shape.moveTo(pos.position.x, pos.position.z);
            else shape.lineTo(pos.position.x, pos.position.z);
        });
        this.positions.pop();
        let geometry = new ShapeGeometry(shape);
        const attrPos = geometry.getAttribute('position').array;
        this.originalRoofBufferPositions = attrPos;
        
        // applying correct UV set
        for (let i = 0; i < attrPos.length; i += 3) {
            const [x, y, z] = [attrPos[i], attrPos[i + 1], attrPos[i + 2]];
            const origPos = positions.filter(pos => (r4d(pos.position.x) === r4d(x) && r4d(pos.position.z) === r4d(y)))[0];
            if (origPos) {
                uvBuffer.push(origPos.uvGround.x);
                uvBuffer.push(origPos.uvGround.y);
            } else {
                console.error("Didn't find the orig pos", attrPos, i, positions);
            }
        }
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvBuffer), 2))

        // Roof
        this.roof = new Mesh(geometry, new MeshPhongMaterial({ map: roofTexture, side: 2 }));
        this.addObject(this.roof);
        this.roof.position.y = height;
        this.roof.rotateX(Math.PI / 2);
        
        // Floor
        this.floor = new Mesh(geometry.clone(), new MeshPhongMaterial({ color: 'brown', side: 2 }));
        this.addObject(this.floor);
        this.floor.position.y = 0.01;
        this.floor.rotateX(Math.PI / 2);

        // Walls
        this.walls = new Mesh(new BufferGeometry(), new MeshPhongMaterial({ color: 'brown', side: 2 }));
        this.addObject(this.walls);
        this.walls.rotateX(Math.PI / 2);
        this.walls.position.y = height;

        // process the roof to 0 angle and 0 axis angle
        this.setRoofAngle(0, 0);
    }

    setHeight(height: number) {
        this.roof.position.y = height;
        this.walls.position.y = height;
        this.height = height
        this.updateWalls();
    }


    setRoofAngle(rad: number = -Math.PI / 8, axisStartIndex: number = 0) {
        const axisStart = this.positions[axisStartIndex].position.clone();
        const axisEnd = axisStartIndex === this.positions.length - 1 ? this.positions[0].position.clone() : this.positions[axisStartIndex + 1].position.clone();
        axisStart.y = axisStart.z;
        axisStart.z = 0;
        axisEnd.y = axisEnd.z;
        axisEnd.z = 0;
        const positions = this.originalRoofBufferPositions;
        const line = new Line3().set(axisStart, axisEnd);
        const positionsNew = [];
        for (let i = 0; i < positions.length; i += 3) {
            let [x, y, z] = [positions[i], positions[i + 1], positions[i + 2]];
            const point = new Vector3(x, y, z);
            const out = new Vector3();
            // getting the closest point to rotational axis 
            line.closestPointToPoint(point, true, out);
            // callculating the new height position for every point
            z = Math.tan(rad) * point.distanceTo(out);
            positionsNew.push(x, y, z);
        }
        this.roof.geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionsNew), 3))
        this.updateWalls();
    }

    updateWalls() {
        const wallsVertices = [];
        const roofPosInOrder = [];

        const roofBuffer = this.roof.geometry.getAttribute('position').array;

        this.positions.forEach(pos => {
            const vec3 = pos.position.clone();
            for (let i = 0; i < roofBuffer.length; i += 3) {
                const [x, y, z] = [roofBuffer[i], roofBuffer[i + 1], roofBuffer[i + 2]];
                if (r4d(pos.position.x) === r4d(x) && r4d(pos.position.z) === r4d(y)) {
                    roofPosInOrder.push([x, y, z]);
                    continue;
                }

            }
        });

        for (let i = 0; i < roofPosInOrder.length; i++) {
            const current = roofPosInOrder[i];
            const next = i === roofPosInOrder.length - 1 ? roofPosInOrder[0] : roofPosInOrder[i + 1];
            // generating array for future buffer, just rectangle for each line
            wallsVertices.push(current[0], current[1], this.height, ...current, ...next);
            wallsVertices.push(current[0], current[1], this.height, ...next, next[0], next[1], this.height);
        }

        this.walls.geometry.setAttribute('position', new BufferAttribute(new Float32Array(wallsVertices), 3));
        // generating normals to reflect some light
        this.walls.geometry.computeVertexNormals();

    }
}