/**
 *
 * The NormalMapFilter class uses the pixel values from the specified texture (called the normal map) to perform a normal mapping of an object.
 * You can use this filter to create lighting
 * @class NormalMapFilter
 * @contructor
 * @param texture {Texture} The texture used for the normal map * must be power of 2 texture at the moment
 */
PIXI.NormalMapFilter = function(texture)
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];
    texture.baseTexture._powerOf2 = false;

    // set the uniforms
    this.uniforms = {
        u_normals:       {type: 'sampler2D', value:texture},
        Resolution:      {type: '2f', value:{x:500.0, y:500.0}},
        LightPos:        {type: '3f', value:{x:0.5, y:0.5, z:0.075}},
        LightColor:      {type: '4f', value:{x: 1.0, y:0.8, z:0.6, w:1.0}},
        AmbientColor:    {type: '4f', value:{x: 0.1, y:0.2, z:0.1, w:0.2}},
        Falloff:         {type: '3f', value:{x:0.4, y:3.0, z:20.0}},
        dimensions:      {type: '4fv', value:[0,0,0,0]}
    };

    if(texture.baseTexture.hasLoaded)
    {
        /*this.uniforms.mapDimensions.value.x = texture.width;
        this.uniforms.mapDimensions.value.y = texture.height;*/
    }
    else
    {
        this.boundLoadedFunction = this.onTextureLoaded.bind(this);

        texture.baseTexture.on('loaded', this.boundLoadedFunction);
    }

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec4 vColor;',
        'varying vec2 vTextureCoord;',

        'uniform sampler2D uSampler;',
        'uniform sampler2D u_normals;',

        'uniform vec4 dimensions;',
        'uniform vec3 LightPos;',
        'uniform vec4 LightColor;',
        'uniform vec4 AmbientColor;',
        'uniform vec3 Falloff;',

        'void main(void) {',
        '   vec4 DiffuseColor = texture2D(uSampler, vTextureCoord);',

        '   vec3 NormalMap = texture2D(u_normals, vTextureCoord*2.5).rgb;',
        '   NormalMap.g = 1.0 - NormalMap.g;',

        '   vec3 LightDir = vec3(LightPos.xy - (gl_FragCoord.xy / dimensions.xy), LightPos.z);',

        '   LightDir.x *= dimensions.x / dimensions.y;',

        '   float D = length(LightDir);',

        '   vec3 N = normalize(NormalMap * 2.0 - 1.0);',
        '   vec3 L = normalize(LightDir);',

        '   vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);',

        '   vec3 Ambient = AmbientColor.rgb * AmbientColor.a;',

        '   float Attenuation = 1.0 / (Falloff.x + (Falloff.y*D) + (Falloff.z*D*D));',

        '   vec3 Intensity = Ambient + Diffuse * Attenuation;',
        '   vec3 FinalColor = DiffuseColor.rgb * Intensity;',
        '   gl_FragColor = vColor * vec4(FinalColor, DiffuseColor.a);',
        '}'
    ];
};

PIXI.NormalMapFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.NormalMapFilter.prototype.constructor = PIXI.NormalMapFilter;

PIXI.NormalMapFilter.prototype.onTextureLoaded = function()
{
    /*this.uniforms.mapDimensions.value.x = this.uniforms.normalMap.value.width;
    this.uniforms.mapDimensions.value.y = this.uniforms.normalMap.value.height;*/

    this.uniforms.u_normals.value.baseTexture.off('loaded', this.boundLoadedFunction);
};

/**
 * The texture used for the displacemtent map * must be power of 2 texture at the moment
 *
 * @property map
 * @type Texture
 */
Object.defineProperty(PIXI.NormalMapFilter.prototype, 'map', {
    get: function() {
        return this.uniforms.normalMap.value;
    },
    set: function(value) {
        this.uniforms.normalMap.value = value;
    }
});

/**
 * The multiplier used to scale the displacement result from the map calculation.
 *
 * @property scale
 * @type vec3
 */
Object.defineProperty(PIXI.NormalMapFilter.prototype, 'LightPos', {
    get: function() {
        return this.uniforms.LightPos.value;
    },
    set: function(value) {
        this.uniforms.LightPos.value = value;
    }
});