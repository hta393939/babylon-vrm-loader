import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { GLTFFileLoader } from '@babylonjs/loaders/glTF/glTFFileLoader';
import { RegisterSceneLoaderPlugin } from '@babylonjs/core/Loading/sceneLoader';

/**
 * VRM/VCI ファイルを読み込めるようにする
 * 拡張子を変更しただけ
 */
export class VRMFileLoader extends GLTFFileLoader {
    public readonly name = 'vrm';
    public readonly extensions = {
        '.vrm': { isBinary: true, mimeType: 'model/gltf-binary' },
        '.vci': { isBinary: true, mimeType: 'model/gltf-binary' },
    };

    public createPlugin() {
        return new VRMFileLoader();
    }
}

if (RegisterSceneLoaderPlugin) {
    RegisterSceneLoaderPlugin(new VRMFileLoader());
}
