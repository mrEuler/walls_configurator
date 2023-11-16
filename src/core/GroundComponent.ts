import { Loader, TEXTURE } from "@g.frame/common.loaders";
import { ViewerModule } from "@g.frame/core";
import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export class GroundComponent extends ViewerModule {
    private mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
    constructor(private loader: Loader<any>) {
        super();

        this.mesh = new Mesh(
            new PlaneGeometry(100, 100),
            new MeshBasicMaterial({ color: 'white' })
        );
        this.mesh.rotateX(-Math.PI / 2);

        this.addObject(this.mesh);

        this.loader.addResources([
            {
                type: TEXTURE,
                url: require('../assets/images/satelite_img.png'),
                name: 'satelite_image'
            }
        ]);
    }

    prepareResources() {
        this.mesh.material.map = this.loader.getResource('satelite_image');
        this.mesh.material.needsUpdate = true;
    }
}