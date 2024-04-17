// import * from 'cesium'
import * as Cesium from 'cesium'
import CEntity from './entity/CEntity';


export type CMapEventType = 'entitySelected'

export default class CMap {

    viewer: Cesium.Viewer;
    dsMap: Map<string, Cesium.DataSource>;
    eventMap: Map<string, (() => void)[]>;

    constructor(container: Element | string) {
        const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
            url:
                "http://192.166.26.10:8080/geoserver/gwc/service/wmts?layer=world_img&tilematrixset={TileMatrixSet}&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={TileMatrixSet}:{TileMatrix}&TileCol={TileCol}&TileRow={TileRow}",
            layer: "world_img",
            style: "default",
            format: "image/png",
            tileMatrixSetID: "EPSG:900913"
        })
        this.viewer = new Cesium.Viewer(container, {
            baseLayer: new Cesium.ImageryLayer(imageryProvider, {}),
        })
        Cesium.CesiumTerrainProvider.fromUrl('http://192.166.26.10:8080/terrain').then((terrainProvider: Cesium.TerrainProvider) => {
            this.viewer.terrainProvider = terrainProvider
        })
        this.dsMap = new Map();
        this.eventMap = new Map([   // 初始化
            ["entitySelected", []]
        ]);
    }

    getDS(name: string) {
        if (!this.dsMap.has(name)) {
            const ds = new Cesium.CustomDataSource(name)
            this.viewer.dataSourceDisplay.dataSources.add(ds);
        }

        return this.dsMap.get(name)
    }

    addEventListener(t: CMapEventType, callback: (entity: CEntity) => void) {
        if(t === 'entitySelected') {
            const eventHandler = new Cesium.ScreenSpaceEventHandler();
            eventHandler.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const entity = this.viewer.scene.pick(e.position)
                if (entity && entity.id) {
                    // callback(entity.id)
                    const fns = this.eventMap.get(t) as ((entity: CEntity) => void)[];
                    fns.forEach((fn => {
                        fn(entity)
                    }))
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }

        return () => {
            // eventHandler.destroy()
            this.removeEventListener(t, callback)
        }
    }

    removeEventListener(t: CMapEventType, callback: (entity: CEntity) => void) {
        const fns = this.eventMap.get(t) as [];
        this.eventMap.set(t, fns.filter(value => value != callback))
    }
}


// export default new CMap('cesiumContainer')