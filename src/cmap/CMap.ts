// import * from 'cesium'
import * as Cesium from 'cesium'

export class CMap {

    viewer: Cesium.Viewer;
    dsMap: Map<string,Cesium.DataSource>

    constructor(container: Element | string) {
        this.viewer = new Cesium.Viewer(container)
        this.dsMap = new Map();
    }

    getDS(name: string) {
        if(!this.dsMap.has(name)) {
            const ds = new Cesium.CustomDataSource(name)
            this.viewer.dataSourceDisplay.dataSources.add(ds);
        }

        return this.dsMap.get(name)
    }
}


// export default new CMap('cesiumContainer')