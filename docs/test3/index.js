/**
 * @file index.js
 */

class SceneCreator {
    constructor() {
    }

    start() {
        const canvas = document.getElementById('main-canvas');
        const engine = new BABYLON.Engine(canvas);
        this.createScene(engine);
    }

    async createScene(engine) {
        const scene = new BABYLON.Scene(engine);
        scene.useRightHandedSystem = true;

        await scene.debugLayer.show({
            globalRoot: document.getElementById('wrapper'),
        });

        const camera = new BABYLON.ArcRotateCamera('camera1',
            0, 0, 3,
            new BABYLON.Vector3(0, 1.2, 0),
            scene);
        camera.wheelDeltaPercentage = 0.01;
        camera.minZ = 0.3;
        camera.setPosition(new BABYLON.Vector3(0, 1.2, 3));
        camera.attachControl();

        new BABYLON.HemisphericLight(
            'light1',
            new BABYLON.Vector3(-0.2, -0.8, -1),
            scene
        );

        window.addEventListener('resize', () => {
            engine.resize();
        });

        engine.runRenderLoop(() => {
            scene.render();
        });

        const folder = './';
        const name = 'AliciaSolid.vrm';
        //const name = 'mobshiro.vrm';
        //const name = 'mob10.vrm';
        await BABYLON.SceneLoader.AppendAsync(folder, name, scene);
        console.log('LoadAsync success');

        const _setBound = () => { // for .vrm model made by Vroid Studio
            for (const mesh of scene.meshes) {
                const size = 9;
                mesh.buildBoundingInfo(
                    new BABYLON.Vector3(-size, -size, -size),
                    new BABYLON.Vector3( size,  size,  size),
                );
            }
        };
        _setBound();

        scene.onBeforeRenderObservable.add(() => {
            const ang = (Date.now() % 4000) / 4000 * 2 * Math.PI;
            const deltaTime = engine.getDeltaTime();
            const vrmManagers = scene.metadata?.vrmManagers || [];
            for (const manager of vrmManagers) {
                {
                    const bone = manager.humanoidBone.leftUpperArm;
                    bone.rotation = new BABYLON.Vector3(0, Math.sin(ang), 0);
                }
                {
                    const bone = manager.humanoidBone.leftUpperLeg;
                    bone.rotation = new BABYLON.Vector3(Math.sin(ang), 0, 0);
                }

                manager.humanoidBone.hips.position.set(Math.sin(ang) * 0.25, 0, 0);
// expression
                manager.morphing('Joy', (Math.sin(ang) + 1) * 0.5);
                manager.morphing('happy', (Math.sin(ang) + 1) * 0.5);

                manager.update(deltaTime);
            }
        });

        let fileCount = 1;
        document.getElementById('file-input').addEventListener('change', (evt) => {
            const file = evt.target.files[0];
            console.log(`loads ${file.name} ${file.size} bytes`);
            const currentMeshCount = scene.meshes.length;
            BABYLON.SceneLoader.Append('file:', file, scene, () => {
                console.log(`loaded ${file.name}`);
                for (let i = currentMeshCount; i < scene.meshes.length; i++) {
                    scene.meshes[i].translate(BABYLON.Vector3.Right(), 1.5 * fileCount);
                }
                fileCount++;
                _setBound();
            });
        });

    }
}

const creator = new SceneCreator();
creator.start();

