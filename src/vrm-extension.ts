import type { Material } from '@babylonjs/core/Materials/material';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Nullable } from '@babylonjs/core/types';
import type { IGLTFLoaderExtension, IMaterial, IMeshPrimitive } from '@babylonjs/loaders/glTF/2.0';
import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0';
import { VRMManager } from './vrm-manager';
import { VRMMaterialGenerator } from './vrm-material-generator';
import type { IVRM1SpringBone, IVRMSecondaryAnimation, IVRMSecondaryAnimationColliderGroup, IVRMSecondaryAnimationSpring } from './vrm-interfaces';

/**
 * `extensions` に入る拡張キー
 */
const NAME = 'VRM';
/**
 * `extensions` vrm1.0 key
 */
const NAME1 = 'VRMC_vrm';
/**
 * `extensions` spring bone key
 */
const SPRINGBONENAME1 = 'VRMC_springBone';

/**
 * VRM 拡張を処理する
 * [Specification](https://github.com/vrm-c/vrm-specification/tree/master/specification/0.0)
 */
export class VRM implements IGLTFLoaderExtension {
    /**
     * @inheritdoc
     */
    public readonly name = NAME;
    /**
     * @inheritdoc
     */
    public enabled = true;
    /**
     * この Mesh index 以降が読み込み対象
     */
    private meshesFrom = 0;
    /**
     * この TransformNode index 以降が読み込み対象
     */
    private transformNodesFrom = 0;
    /**
     * この Material index 以降が読み込み対象
     */
    private materialsFrom = 0;

    /**
     * @inheritdoc
     */
    public constructor(private loader: GLTFLoader) {
        // GLTFLoader has already added rootMesh as __root__ before load extension
        // @see glTFLoader._loadData
        this.meshesFrom = this.loader.babylonScene.meshes.length - 1;
        this.transformNodesFrom = this.loader.babylonScene.transformNodes.length;
        this.materialsFrom = this.loader.babylonScene.materials.length;
    }

    /**
     * @inheritdoc
     */
    public dispose(): void {
        (this.loader as any) = null;
    }

    /**
     * @inheritdoc
     */
    public onReady() {
        const vrm0ext = this.loader.gltf?.extensions?.[NAME];
        const vrm1ext = this.loader.gltf?.extensions?.[NAME1];
        if (!vrm0ext && !vrm1ext) {
            return;
        }

        const scene = this.loader.babylonScene;
        scene.metadata = scene.metadata || {};
        scene.metadata.vrmManagers = scene.metadata.vrmManagers || [];

        if (vrm0ext) { // for vrm0.0
            const manager = new VRMManager(vrm0ext, this.loader.babylonScene, this.meshesFrom, this.transformNodesFrom, this.materialsFrom);
            scene.metadata.vrmManagers.push(manager);
            this.loader.babylonScene.onDisposeObservable.add(() => {
                // Scene dispose 時に Manager も破棄する
                manager.dispose();
                this.loader.babylonScene.metadata.vrmManagers = [];
            });
            return;
        }

        { // for vrm1.0
            const springBone1 = this.loader.gltf?.extensions?.[SPRINGBONENAME1];
            vrm1ext.secondaryAnimation = this.fallbackSpringBone(springBone1);

            const manager = new VRMManager(vrm1ext, this.loader.babylonScene, this.meshesFrom, this.transformNodesFrom, this.materialsFrom);
            scene.metadata.vrmManagers.push(manager);
            this.loader.babylonScene.onDisposeObservable.add(() => {
                // Scene dispose 時に Manager も破棄する
                manager.dispose();
                this.loader.babylonScene.metadata.vrmManagers = [];
            });
        }

    }

/**
 * make VRM0.0 from VRM1.0
 * @since patch2
 * @param springBone1
 */
    private fallbackSpringBone(springBone1?: IVRM1SpringBone) {
        const secondaryAnimation0: IVRMSecondaryAnimation = {
            boneGroups: [],
            colliderGroups: [],
        };

        if (!springBone1) {
            return secondaryAnimation0;
        }

        for (const collider1 of springBone1.colliders) {
            const group0: IVRMSecondaryAnimationColliderGroup = {
                node: collider1.node,
                colliders: []
            };
            const body = collider1.shape?.sphere || collider1.shape?.capsule;
            if (body) {
                const collider0 = {
                    offset: {
                        x: body.offset[0],
                        y: body.offset[1],
                        z: body.offset[2],
                    },
                    radius: body.radius,
                };
                group0.colliders.push(collider0);
            }
            secondaryAnimation0.colliderGroups.push(group0);
        }

        for (const spring1 of springBone1.springs) {
            const spring0: IVRMSecondaryAnimationSpring = {
                comment: '',
                hitRadius: 0,
                dragForce: 0.5,
                gravityPower: 0,
                gravityDir: {
                    x: 0,
                    y: -1,
                    z: 0,
                },
                stiffiness: 1,
                bones: [],
                colliderGroups: []
            };
            for (const joint of spring1.joints) {
                Object.assign(spring0, joint);
                if (Array.isArray(joint.gravityDir)) {
                    spring0.gravityDir = {
                        x: joint.gravityDir[0],
                        y: joint.gravityDir[1],
                        z: joint.gravityDir[2],
                    };
                }
                if (Number.isFinite(joint.stiffness)) {
                    spring0.stiffiness = joint.stiffness as number;
                }
                if (spring0.bones.length === 0) { // root only
                    spring0.bones.push(joint.node);
                }
            }

            const collider = new Set<number>();
            for (const index of (spring1.colliderGroups || [])) {
                const colliderGroup = springBone1.colliderGroups?.[index] || [];
                for (const colliderIndex of (colliderGroup.colliders || [])) {
                    collider.add(colliderIndex);
                }
            }
            spring0.colliderGroups = Array.from(collider);

            secondaryAnimation0.boneGroups.push(spring0);
        }

        return secondaryAnimation0;
    }

    /**
     * @inheritdoc
     */
    public _loadVertexDataAsync(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh) {
        if (!primitive.extras || !primitive.extras.targetNames) {
            return null;
        }
        // まだ MorphTarget が生成されていないので、メタ情報にモーフターゲット情報を入れておく
        babylonMesh.metadata = babylonMesh.metadata || {};
        babylonMesh.metadata.vrmTargetNames = primitive.extras.targetNames;
        return null;
    }

    /**
     * @inheritdoc
     */
    public _loadMaterialAsync(context: string, material: IMaterial, mesh: Mesh, babylonDrawMode: number, assign: (babylonMaterial: Material) => void): Nullable<Promise<Material>> {
        // ジェネレータでマテリアルを生成する
        return new VRMMaterialGenerator(this.loader).generate(context, material, mesh, babylonDrawMode, assign);
    }
}

// ローダーに登録する
GLTFLoader.RegisterExtension(NAME, (loader) => new VRM(loader));
