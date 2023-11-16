import { MainView } from './core/MainView';
import { ModulesProcessor } from '@g.frame/core';
import { Vector3 } from 'three';
import { DesktopModule } from '@g.frame/desktop';
import { MobileModule } from '@g.frame/mobile';
import { WindowComponentModule } from '@g.frame/components.window';
import { ButtonsComponentModule } from '@g.frame/components.buttons';
import { TextComponentModule } from '@g.frame/components.text';

import { InputModule } from '@g.frame/input';
import { InputComponentModule } from '@g.frame/components.input';
import { LoadersModule } from '@g.frame/common.loaders';


class App {
    private framework: ModulesProcessor;
    constructor() {
        this.framework = new ModulesProcessor({
            modules: [
                new DesktopModule(),
                new MobileModule(),
                new WindowComponentModule(),
                new InputComponentModule(),
                new ButtonsComponentModule(),
                new TextComponentModule(),

                new InputModule(),
                new LoadersModule(),
            ],
            viewerConfig: {
                renderer: {
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: false,
                    sortObjects: false,
                    shadowMapEnabled: false,
                    clearColor: 0x222222,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    autoResize: true,
                    containerID: 'app',
                    onWindowResize: true,
                },
                scene: {
                    overrideMaterial: null,
                },
                camera: {
                    fov: 75,
                    near: 0.1,
                    far: 10000,
                    position: new Vector3(0, 0, 10),
                    target: new Vector3(0, 0, 0),
                }
            },
            bootstrap: new MainView()
        });
        this.init();
    }

    init() {


    }
}

new App();
