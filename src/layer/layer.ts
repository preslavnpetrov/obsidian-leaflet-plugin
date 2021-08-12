import { BaseMapType, LayerGroup } from "src/@types";

export abstract class Layer<T extends L.Layer> {
    map: BaseMapType;
    layer: string;

    get mapLayer() {
        if (!this.layer) {
            return this.map.mapLayers[0];
        }
        return (
            this.map.mapLayers?.find(({ id }) => id === this.layer) ??
            this.map.mapLayers[0]
        );
    }

    abstract leafletInstance: T;
    abstract get group(): L.LayerGroup;

    show() {
        if (this.group) {
            this.group.addLayer(this.leafletInstance);
        }
    }
    hide() {
        this.group && this.group.removeLayer(this.leafletInstance);
    }

    checkAndAddToMap() {
        if (this.map.isLayerRendered(this.layer)) {
            this.show();
        } else if (this.layer) {
            this.map.on(`layer-ready-for-features`, (layer: LayerGroup) => {
                if (layer.id === this.layer) this.show();
            });
        } else {
            this.map.on("first-layer-ready", (layer: LayerGroup) => {
                this.layer = layer.id;
                this.show();
            });
        }
    }
    remove() {
        this.group && this.group.removeLayer(this.leafletInstance);
    }
}
