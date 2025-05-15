//import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { GLTFFileLoader } from '@babylonjs/loaders/glTF/glTFFileLoader';
import { RegisterSceneLoaderPlugin } from '@babylonjs/core/Loading/sceneLoader';
import type { ISceneLoaderPluginExtensions } from '@babylonjs/core/Loading/sceneLoader';

/**
 * VRM/VCI ファイルを読み込めるようにする
 * 拡張子を変更しただけ
 */
export class VRMFileLoader extends GLTFFileLoader {
    //name: string;
    //extensions: string | ISceneLoaderPluginExtensions;

    constructor() {
        super();

        (this.name as string) = 'vrm';
        (this.extensions as ISceneLoaderPluginExtensions) = {
            '.vrm': { isBinary: true, mimeType: 'model/gltf-binary' },
            '.vci': { isBinary: true, mimeType: 'model/gltf-binary' },
        };
    }

    public createPlugin() {
        return new VRMFileLoader();
    }
}

if (RegisterSceneLoaderPlugin) {
    RegisterSceneLoaderPlugin(new VRMFileLoader());
}
