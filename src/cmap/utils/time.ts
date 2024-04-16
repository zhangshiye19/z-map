import * as Cesium from 'cesium'

export function getUTC8Time() {
    return Cesium.JulianDate.addHours(Cesium.JulianDate.now(),8,new Cesium.JulianDate())
}