/// <reference types="../spine/spine-webgl" />

module spine.custom {
  export class TextureAttachment extends spine.Attachment {

    texture: Texture;
    width: number;
    height: number;

    offsetX: number = 0.0;
    offsetY: number = 0.0;
    rotation: number = 0.0;
    x: number = 0.0;
    y: number = 0.0;
    scaleX: number = 1.0;
    scaleY: number = 1.0;

    color: Color = new Color(1, 1, 1, 1);

    /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
     *
     * See {@link #updateOffset()}. */
    offset = Utils.newFloatArray(8);

    uvs = Utils.newFloatArray(8);

    constructor(name: string, texture: Texture) {
      super(name);
      this.texture = texture;

      // Read texture dimensions.
      const image = texture.getImage();
      if (image instanceof HTMLImageElement) {
        const htmlImage = <HTMLImageElement>image;
        this.width = htmlImage.width;
        this.height = htmlImage.height;
      } else if (image instanceof ImageBitmap) {
        const bitmapImage = <ImageBitmap>image;
        this.width = bitmapImage.width;
        this.height = bitmapImage.height;
      }

			this.uvs[0] = 0.0;
			this.uvs[1] = 1.0;
			this.uvs[2] = 0.0;
			this.uvs[3] = 0.0;
			this.uvs[4] = 1.0;
			this.uvs[5] = 0.0;
			this.uvs[6] = 1.0;
			this.uvs[7] = 1.0;

      // this.uvs[0] = 1.0;
      // this.uvs[1] = 1.0;
      // this.uvs[2] = 0.0;
      // this.uvs[3] = 1.0;
      // this.uvs[4] = 0.0;
      // this.uvs[5] = 0.0;
      // this.uvs[6] = 1.0;
      // this.uvs[7] = 0.0;

      this.updateOffset();
    }

    copy(): Attachment {
      throw new Error("Method not implemented.");
    }

    /** Calculates the {@link #offset} using the texture settings. Must be called after changing texture settings. */
    updateOffset(): void {
      // let localX = -this.width / 2 * this.scaleX;
      // let localY = -this.height / 2 * this.scaleY;
      let localX = -this.width / 2 * this.scaleX + this.offsetX * this.scaleX;
      let localY = -this.height / 2 * this.scaleY + this.offsetY * this.scaleY;
      let localX2 = localX + this.width * this.scaleX;
      let localY2 = localY + this.height * this.scaleY;
      let radians = this.rotation * Math.PI / 180;
      let cos = Math.cos(radians);
      let sin = Math.sin(radians);
      let x = this.x;
      let y = this.y;
      let localXCos = localX * cos + x;
      let localXSin = localX * sin;
      let localYCos = localY * cos + y;
      let localYSin = localY * sin;
      let localX2Cos = localX2 * cos + x;
      let localX2Sin = localX2 * sin;
      let localY2Cos = localY2 * cos + y;
      let localY2Sin = localY2 * sin;
      let offset = this.offset;
      offset[0] = localXCos - localYSin;
      offset[1] = localYCos + localXSin;
      offset[2] = localXCos - localY2Sin;
      offset[3] = localY2Cos + localXSin;
      offset[4] = localX2Cos - localY2Sin;
      offset[5] = localY2Cos + localX2Sin;
      offset[6] = localX2Cos - localYSin;
      offset[7] = localYCos + localX2Sin;
    }

    /** Transforms the attachment's four vertices to world coordinates.
   *
   * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
   * Runtimes Guide.
   * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
   * @param offset The `worldVertices` index to begin writing values.
   * @param stride The number of `worldVertices` entries between the value pairs written. */
    computeWorldVertices(bone: Bone, worldVertices: spine.ArrayLike<number>, offset: number, stride: number) {
      let vertexOffset = this.offset;
      let x = bone.worldX, y = bone.worldY;
      let a = bone.a, b = bone.b, c = bone.c, d = bone.d;
      let offsetX = 0, offsetY = 0;

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
    }
  }
}