export interface IVRMVector3 {
    x: number;
    y: number;
    z: number;
}


/**
 * @see https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_vrm-1.0/schema/VRMC_vrm.expressions.expression.morphTargetBind.schema.json
 */
export interface IVRM1MorphTargetBind {
/**
 * (vrm0.0 mesh)
 */
    node: number;
    index: number;
/**
 * vrm1.0 0-1, (vrm0.0 0-100)
 */
    weight: number;
}

/**
 * @see https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_vrm-1.0/schema/VRMC_vrm.expressions.expression.schema.json
 */
export interface IVRM1Expression {
    morphTargetBinds: IVRM1MorphTargetBind[];
    materialColorBinds: Object[]; // not supported
    textureTransformBinds: Object[]; // not supported
    isBinary: boolean;
    overrideBlink: 'none' | 'block' | 'blend'; // not supported
    overrideLookAt: 'none' | 'block' | 'blend'; // not supported
    overrideMouth: 'none' | 'block' | 'blend'; // not supported
}

/**
 *
 */
export interface IVRM1Expressions {
    preset: { [key: string]: IVRM1Expression };
    custom: { [key: string]: IVRM1Expression };
}

/**
 * extensions.VRM
 */
export interface IVRM {
    exporterVersion: string;
    specVersion: string;
    meta: IVRMMeta | IVRM1Meta;
    humanoid: IVRMHumanoid;
    firstPerson: IVRMFirstPerson;
/**
 * vrm0.0 expression
 */
    blendShapeMaster?: IVRMBlendShapeMaster;
/**
 * vrm1.0 expression
 */
    expressions?: IVRM1Expressions;
    secondaryAnimation: IVRMSecondaryAnimation;
    materialProperties: IVRMMaterialProperty[];
}

/**
 * extensions.VRM.meta
 */
export interface IVRMMeta {
    title: string;
    version: string;
    author: string;
    contactInformation?: string;
    reference?: string;
    texture?: number;
}

/**
 * @see https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_vrm-1.0/meta.md
 */
export interface IVRM1Meta {
    metaVersion: number;
    name: string;
    version?: string;
    authors: string[];
    copyrightInformation?: string;
    contactInformation?: string;
    refereces?: string[];
    thirdPartyLicenses?: string[];
    thumbnailImage: any;
    licenseUrl: string;
    avatarPermission?: string;
    allowExcessivelyViolentUsage?: boolean;
    allowExcessivelySexualUsage?: boolean;
    commercialUsage: string;
    allowPoliticalOrReligiousUsage: boolean;
    allowAntisocialOrHateUsage: boolean;
    creditNotation: string;
    allowRedistribution: boolean;
    modification: string;
    otherLicenseUrl: string;
}

/**
 * extensions.VRM.humanoid
 */
export interface IVRMHumanoid {
    humanBones: (IVRMHumanoidBone[]) | { [key: string]: IVRMHumanoidBone };
    armStretch?: number;
    legStretch?: number;
    upperArmTwist?: number;
    lowerArmTwist?: number;
    upperLegTwist?: number;
    lowerLegTwist?: number;
    feetSpacing?: number;
    hasTranslationDoF?: boolean;
}

export interface IVRMHumanoidBone {
    bone: string;
    node: number;
    useDefaultValues: boolean;
    min?: IVRMVector3;
    max?: IVRMVector3;
    center?: IVRMVector3;
    axisLength?: number;
}

export interface IVRMFirstPersonMeshAnnotation {
    mesh: number;
    firstPersonFlag: string;
}

export interface IVRMFirstPersonDegreeMap {
    curve: number[];
    xRange: number;
    yRange: number;
}

/**
 * extensions.VRM.firstPerson
 */
export interface IVRMFirstPerson {
    firstPersonBone: number;
    firstPersonBoneOffset: IVRMVector3;
    meshAnnotations: IVRMFirstPersonMeshAnnotation[];
    lookAtTypeName: 'Bone' | 'BlendShape';
    lookAtHorizontalInner: IVRMFirstPersonDegreeMap;
    lookAtHorizontalOuter: IVRMFirstPersonDegreeMap;
    lookAtVerticalDown: IVRMFirstPersonDegreeMap;
    lookAtVerticalUp: IVRMFirstPersonDegreeMap;
}

/**
 * extensions.VRM.blendShapeMaster
 */
export interface IVRMBlendShapeMaster {
    blendShapeGroups: IVRMBlendShapeGroup[];
}

export interface IVRMBlendShapeGroup {
    name: string;
    presetName: string;
    binds: IVRMBlendShapeBind[];
    materialValues: IVRMBlendShapeMaterialBind[];
    isBinary: boolean;
}

export interface IVRMBlendShapeBind {
    mesh: number;
    index: number;
    weight: number;
}

export interface IVRMBlendShapeMaterialBind {
    materialName: string;
    propertyName: string;
    targetValue: number[];
}

export interface IVRMSecondaryAnimationSpring {
    comment: string;
    stiffiness: number;
    gravityPower: number;
    gravityDir: IVRMVector3;
    dragForce: number;
/**
 * patch2 optional
 */
    center?: number;
    hitRadius: number;
    bones: number[];
    colliderGroups: number[];
}

export interface IVRMSecondaryAnimationCollider {
    offset: IVRMVector3;
    radius: number;
}

export interface IVRMSecondaryAnimationColliderGroup {
    node: number;
    colliders: IVRMSecondaryAnimationCollider[];
}

/**
 * extensions.VRM.secondaryAnimation
 */
export interface IVRMSecondaryAnimation {
    boneGroups: IVRMSecondaryAnimationSpring[];
    colliderGroups: IVRMSecondaryAnimationColliderGroup[];
}

/**
 * @since patch2
 */
export interface IVRM1SphereCollider {
    offset: number[];
    radius: number;
}

/**
 * @see https://github.com/vrm-c/vrm-specification/tree/master/specification/VRMC_springBone-1.0#vrmc_springbonecolliders
 * @since patch2
 */
export interface IVRM1CapsuleCollider {
    offset: number[];
    radius: number;
/**
 * node local coordinate
 */
    tail: number[];
}

/**
 * @since patch2
 */
export interface IVRM1SpringBoneShape {
    sphere?: IVRM1SphereCollider;
    capsule?: IVRM1CapsuleCollider;
}

/**
 * @since patch2
 */
export interface IVRM1Collider {
    node: number;
    shape: IVRM1SpringBoneShape;
}

/**
 * @since patch2
 */
export interface IVRM1ColliderGroup {
    name: string;
    colliders: number[];
}

/**
 * @see https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_springBone-1.0/schema/VRMC_springBone.joint.schema.json
 * @since patch2
 */
export interface IVRM1Joint {
    node: number;
/**
 * @default 0
 */
    hitRadius?: number;
/**
 * @default 1
 */
    stiffness?: number;
/**
 * @default 0
 */
    gravityPower?: number;
/**
 * @default [0, -1, 0]
 */
    gravityDir?: [number, number, number];
/**
 * @default 0.5
 */
    dragForce?: number;
}

/**
 * @see https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_springBone-1.0/schema/VRMC_springBone.spring.schema.json
 * @since patch2
 */
export interface IVRM1Spring {
    name: string;
    joints: IVRM1Joint[];
    colliderGroups: number[];
/**
 * index of node
 */
    center: number;
}

/**
 * @since patch2
 */
export interface IVRM1SpringBone {
/**
 * string. not number.
 */
    specVersion: "1.0";
    colliders: IVRM1Collider[];
    colliderGroups: IVRM1ColliderGroup[];
    springs: IVRM1Spring[];
}

export enum IVRMMaterialPropertyShader {
    VRM_USE_GLTFSHADER = 'VRM_USE_GLTFSHADER',
    VRMMToon = 'VRM/MToon',
    VRMUnlitTransparentZWrite = 'VRM/UnlitTransparentZWrite',
}

export interface IVRMMaterialPropertyFloatProperties {
    _Cutoff?: number;
    _BumpScale?: number;
    _ReceiveShadowRate?: number;
    _ShadingGradeRate?: number;
    _ShadeShift?: number;
    _ShadeToony?: number;
    _LightColorAttenuation?: number;
    _IndirectLightIntensity?: number;
    _RimLightingMix?: number;
    _RimFresnelPower?: number;
    _RimLift?: number;
    _OutlineWidth?: number;
    _OutlineScaledMaxDistance?: number;
    _OutlineLightingMix?: number;
    _UvAnimScrollX?: number;
    _UvAnimScrollY?: number;
    _UvAnimRotation?: number;
    _DebugMode?: number;
    _BlendMode?: number;
    _OutlineWidthMode?: number;
    _OutlineColorMode?: number;
    _CullMode?: number;
    _OutlineCullMode?: number;
    _SrcBlend?: number;
    _DstBlend?: number;
    _ZWrite?: number;
    [prop: string]: number | undefined;
}

export type IVRMVectorMaterialProperty = [number, number, number, number];

export interface IVRMMaterialPropertyVectorProperties {
    _Color?: IVRMVectorMaterialProperty;
    _ShadeColor?: IVRMVectorMaterialProperty;
    _MainTex?: IVRMVectorMaterialProperty;
    _ShadeTexture?: IVRMVectorMaterialProperty;
    _BumpMap?: IVRMVectorMaterialProperty;
    _ReceiveShadowTexture?: IVRMVectorMaterialProperty;
    _ShadingGradeTexture?: IVRMVectorMaterialProperty;
    _RimColor?: IVRMVectorMaterialProperty;
    _RimTexture?: IVRMVectorMaterialProperty;
    _SphereAdd?: IVRMVectorMaterialProperty;
    _EmissionColor?: IVRMVectorMaterialProperty;
    _EmissionMap?: IVRMVectorMaterialProperty;
    _OutlineWidthTexture?: IVRMVectorMaterialProperty;
    _OutlineColor?: IVRMVectorMaterialProperty;
    _UvAnimMaskTexture?: IVRMVectorMaterialProperty;
    [prop: string]: IVRMVectorMaterialProperty | undefined;
}

export interface IVRMMaterialPropertyTextureProperties {
    _MainTex?: number;
    _ShadeTexture?: number;
    _BumpMap?: number;
    _ReceiveShadowTexture?: number;
    _ShadingGradeTexture?: number;
    _RimTexture?: number;
    _SphereAdd?: number;
    _EmissionMap?: number;
    _OutlineWidthTexture?: number;
    _UvAnimMaskTexture?: number;
    [prop: string]: number | undefined;
}

export interface IVRMMaterialPropertyKeywordMap {
    _NORMALMAP?: boolean;
    _ALPHATEST_ON?: boolean;
    _ALPHABLEND_ON?: boolean;
    _ALPHAPREMULTIPLY_ON?: boolean;
}

export interface IVRMMaterialPropertyTagMap {
    RenderType?: 'Opaque' | 'TransparentCutout' | 'Transparent';
}

/**
 * extensions.VRM.materialProperties
 */
export interface IVRMMaterialProperty {
    name: string;
    shader: IVRMMaterialPropertyShader;
    renderQueue: number;
    floatProperties: IVRMMaterialPropertyFloatProperties;
    vectorProperties: IVRMMaterialPropertyVectorProperties;
    textureProperties: IVRMMaterialPropertyTextureProperties;
    keywordMap: IVRMMaterialPropertyKeywordMap;
    tagMap: IVRMMaterialPropertyTagMap;
}
