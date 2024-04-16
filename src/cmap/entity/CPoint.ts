import * as Cesium from 'cesium'
import CEntity from "./CEntity";


export class CPoint extends CEntity {

    constructor(coordinates: Cesium.Cartesian3[],options?: Cesium.Entity.ConstructorOptions) {

        super(coordinates,{
            point: {
                color: Cesium.Color.BLUE
            },
            ...options
        })
    }
}