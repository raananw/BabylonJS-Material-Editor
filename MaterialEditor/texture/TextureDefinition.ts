﻿module RW.TextureEditor {
    export class TextureDefinition {

        private _isEnabled: boolean;
        public init: boolean;
        public numberOfImages: number;
        //public babylonTextureType: BabylonTextureType;
        public propertyInMaterial: string;
        public canvasId: string;

        public textureVariable: BABYLON.Texture;

        constructor(public name: string, private _material: BABYLON.StandardMaterial) {
            this.propertyInMaterial = this.name.toLowerCase() + "Texture";
            this.canvasId = this.name + "Canvas";
            this.numberOfImages = 1;
            if (this._material[this.propertyInMaterial]) {
                this.enabled(true);
                this.initFromMaterial();
            } else {
                this.enabled(false);
                this.init = false;
                //clean canvas
                var canvasElement = <HTMLCanvasElement> document.getElementById(this.canvasId + "-0");
                if (canvasElement) {
                    var context = canvasElement.getContext("2d");
                    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
                }
            }
        }

        private initTexture() {
            if (this.textureVariable) {
                this.textureVariable.dispose();
            }
            var canvasElement = <HTMLCanvasElement> document.getElementById(this.canvasId + "-0");
            var base64 = canvasElement.toDataURL();
            this.textureVariable = new BABYLON.Texture(base64, this._material.getScene(), false, undefined, undefined, undefined, undefined, base64, false);
            if (this.name != "reflection") {
                this.coordinatesMode(CoordinatesMode.EXPLICIT);
            } else {
                this.coordinatesMode(CoordinatesMode.PLANAR);
            }
            //this.babylonTextureType = BabylonTextureType.NORMAL;
            this.init = true;
        }

        private initFromMaterial() {
            //update canvas
            this.textureVariable = this._material[this.propertyInMaterial]
            //TODO since deleteBuffer = false, material[texture]._buffer is the base64 image. Update the canvas with it!
            this.init = true;
        }

        public coordinatesMode(mode: CoordinatesMode) {
            if (angular.isDefined(mode)) {
                this.textureVariable.coordinatesMode = mode;
                if (mode === CoordinatesMode.CUBIC) {
                    this.numberOfImages = 6;
                } else {
                    this.numberOfImages = 1;
                }
            } else {
                return this.textureVariable ? this.textureVariable.coordinatesMode : 0;
            }
        }

        public enabled(enabled: boolean) {
            if (angular.isDefined(enabled)) {
                if (enabled) {
                    if (this.textureVariable)
                        this._material[this.propertyInMaterial] = this.textureVariable;
                    this._isEnabled = true;
                } else {
                    if (this._material[this.propertyInMaterial]) {
                        this._material[this.propertyInMaterial].dispose();
                        this._material[this.propertyInMaterial] = null;
                    }
                    this._isEnabled = false;
                }

            } else {
                return this._isEnabled ? 1 : 0;
            }
        }

        public canvasUpdated() {
            this.initTexture();
            if (this._isEnabled) {
                this._material[this.propertyInMaterial] = this.textureVariable;
            }
        }

        //TODO implement video support etc'. At the moment only dynamic is supported.

        /*public setBabylonTextureType(type: BabylonTextureType) {
            this.babylonTextureType = type;
            if (type === BabylonTextureType.CUBE) {
                this.coordinatesMode(CoordinatesMode.CUBIC);
            }
        }*/

        //for ng-repeat
        public getCanvasNumber = () => {
            return new Array(this.numberOfImages);
        }
    }
} 