import * as Cesium from 'cesium'
import { getUTC8Time } from '../utils/time';

export enum PositionType {
    Sampled,
    Constant,
    Callback
} 

export default class CEntity extends Cesium.Entity{

    private _coordinates: Cesium.Cartesian3[]
    positionType: PositionType;
    targetObj: object;
    targetProperty: string;
    eventPositionChanged: Cesium.Event;  // 似乎不是很有必要
    children: CEntity[];

    constructor(coordinates: Cesium.Cartesian3[],options?: Cesium.Entity.ConstructorOptions) {
        super(options)

        this._coordinates = coordinates;
        this.positionType = PositionType.Constant;
        this.targetObj = this; // 目标代表所要更新的对象与属性
        this.targetProperty = 'position';
        this.eventPositionChanged = new Cesium.Event();
        this.children = [];
    }

    active() {
        this.children.forEach((child) => (child.show = true))
    }

    deactive() {
        this.children.forEach((child) => (child.show = false))
    }

    set coordinates(coordinates: Cesium.Cartesian3[]) {
        this._coordinates = coordinates
        this.updateTarget(coordinates)    // 更新目标
        this.eventPositionChanged.raiseEvent(coordinates)
    }

    get coordinates() {
        return this._coordinates;
    }

    setTarget(obj: object,propertyName: string) {
        this.targetObj = obj;
        this.targetProperty = propertyName
    }

    set property(p: Cesium.Property | Cesium.Cartesian3 | Cesium.Cartesian3[]) {
        //@ts-expect-error no error
        this.targetObj[this.targetProperty] = p
    }

    get property() {
        //@ts-expect-error no error
        return this.targetObj[this.targetProperty]
    }

    // 传入的coordinates与property所需要对象的关系，初始化关系
    mapToTarget(coordinates: Cesium.Cartesian3[]): Cesium.Cartesian3 | Cesium.Cartesian3[] | Cesium.Property {
        return coordinates[0]
    }

    makePositionType(positionType: PositionType) {
        if(positionType !== this.positionType) {
            if(positionType === PositionType.Callback) {
                this.property = new Cesium.CallbackProperty(()=>{
                    return this.mapToTarget(this._coordinates)
                },false)
            }else if(positionType === PositionType.Sampled) {
                this.property = new Cesium.SampledPositionProperty()
            }
        }

        this.positionType = positionType;
    }

    // 更新目标
    updateTarget(coordinates: Cesium.Cartesian3[]) {
        if(this.positionType === PositionType.Constant) {
            this.property = this.mapToTarget(coordinates)
        }else if(this.positionType === PositionType.Callback) {
            //pass
        }else if(this.positionType === PositionType.Sampled) {
            const prop = this.property as Cesium.SampledPositionProperty;
            // 只有mapToTarget返回值为 Cartesian3才可以用sampled
            prop.addSample(Cesium.JulianDate.addSeconds(getUTC8Time(),1,new Cesium.JulianDate()),this.mapToTarget(coordinates) as Cesium.Cartesian3)   //小心
        }
    }
}