"use strict";
/// <reference types="../spine/spine-webgl" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var spine;
(function (spine) {
    var custom;
    (function (custom) {
        var TextureAttachment = /** @class */ (function (_super) {
            __extends(TextureAttachment, _super);
            function TextureAttachment(name, texture) {
                var _this = _super.call(this, name) || this;
                _this.offsetX = 0.0;
                _this.offsetY = 0.0;
                _this.rotation = 0.0;
                _this.x = 0.0;
                _this.y = 0.0;
                _this.scaleX = 1.0;
                _this.scaleY = 1.0;
                _this.color = new spine.Color(1, 1, 1, 1);
                /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
                 *
                 * See {@link #updateOffset()}. */
                _this.offset = spine.Utils.newFloatArray(8);
                _this.uvs = spine.Utils.newFloatArray(8);
                _this.texture = texture;
                // Read texture dimensions.
                var image = texture.getImage();
                if (image instanceof HTMLImageElement) {
                    var htmlImage = image;
                    _this.width = htmlImage.width;
                    _this.height = htmlImage.height;
                }
                else if (image instanceof ImageBitmap) {
                    var bitmapImage = image;
                    _this.width = bitmapImage.width;
                    _this.height = bitmapImage.height;
                }
                _this.uvs[0] = 0.0;
                _this.uvs[1] = 1.0;
                _this.uvs[2] = 0.0;
                _this.uvs[3] = 0.0;
                _this.uvs[4] = 1.0;
                _this.uvs[5] = 0.0;
                _this.uvs[6] = 1.0;
                _this.uvs[7] = 1.0;
                // this.uvs[0] = 1.0;
                // this.uvs[1] = 1.0;
                // this.uvs[2] = 0.0;
                // this.uvs[3] = 1.0;
                // this.uvs[4] = 0.0;
                // this.uvs[5] = 0.0;
                // this.uvs[6] = 1.0;
                // this.uvs[7] = 0.0;
                _this.updateOffset();
                return _this;
            }
            TextureAttachment.prototype.copy = function () {
                throw new Error("Method not implemented.");
            };
            /** Calculates the {@link #offset} using the texture settings. Must be called after changing texture settings. */
            TextureAttachment.prototype.updateOffset = function () {
                // let localX = -this.width / 2 * this.scaleX;
                // let localY = -this.height / 2 * this.scaleY;
                var localX = -this.width / 2 * this.scaleX + this.offsetX * this.scaleX;
                var localY = -this.height / 2 * this.scaleY + this.offsetY * this.scaleY;
                var localX2 = localX + this.width * this.scaleX;
                var localY2 = localY + this.height * this.scaleY;
                var radians = this.rotation * Math.PI / 180;
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var x = this.x;
                var y = this.y;
                var localXCos = localX * cos + x;
                var localXSin = localX * sin;
                var localYCos = localY * cos + y;
                var localYSin = localY * sin;
                var localX2Cos = localX2 * cos + x;
                var localX2Sin = localX2 * sin;
                var localY2Cos = localY2 * cos + y;
                var localY2Sin = localY2 * sin;
                var offset = this.offset;
                offset[0] = localXCos - localYSin;
                offset[1] = localYCos + localXSin;
                offset[2] = localXCos - localY2Sin;
                offset[3] = localY2Cos + localXSin;
                offset[4] = localX2Cos - localY2Sin;
                offset[5] = localY2Cos + localX2Sin;
                offset[6] = localX2Cos - localYSin;
                offset[7] = localYCos + localX2Sin;
            };
            /** Transforms the attachment's four vertices to world coordinates.
           *
           * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
           * Runtimes Guide.
           * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
           * @param offset The `worldVertices` index to begin writing values.
           * @param stride The number of `worldVertices` entries between the value pairs written. */
            TextureAttachment.prototype.computeWorldVertices = function (bone, worldVertices, offset, stride) {
                var vertexOffset = this.offset;
                var x = bone.worldX, y = bone.worldY;
                var a = bone.a, b = bone.b, c = bone.c, d = bone.d;
                var offsetX = 0, offsetY = 0;
                offsetX = vertexOffset[0];
                offsetY = vertexOffset[1];
                worldVertices[offset] = offsetX * a + offsetY * b + x; // br
                worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
                offset += stride;
                offsetX = vertexOffset[2];
                offsetY = vertexOffset[3];
                worldVertices[offset] = offsetX * a + offsetY * b + x; // bl
                worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
                offset += stride;
                offsetX = vertexOffset[4];
                offsetY = vertexOffset[5];
                worldVertices[offset] = offsetX * a + offsetY * b + x; // ul
                worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
                offset += stride;
                offsetX = vertexOffset[6];
                offsetY = vertexOffset[7];
                worldVertices[offset] = offsetX * a + offsetY * b + x; // ur
                worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
            };
            return TextureAttachment;
        }(spine.Attachment));
        custom.TextureAttachment = TextureAttachment;
    })(custom = spine.custom || (spine.custom = {}));
})(spine || (spine = {}));
