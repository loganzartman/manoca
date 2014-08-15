precision mediump float;
//vertex shader attributes
varying vec4 vColor;
varying vec2 vTextureCoord;

//samplers
uniform sampler2D u_texture;
uniform sampler2D u_normals;

//shading values
uniform vec2 Resolution;
uniform vec3 LightPos;
uniform vec4 LightColor;
uniform vec4 AmbientColor;
uniform vec3 Falloff;

void main() {
	//diffuse
	vec4 DiffuseColor = texture2D(u_texture, vTextureCoord);

	//normal map
	vec3 NormalMap = texture2D(u_normals, vTextureCoord).rgb;

	//delta pos of light
	vec3 LightDir = vec3(LightPos.xy - (gl_FragCoord.xy / Resolution.xy), LightPos.z);

	//correct for aspect ratio
	LightDir.x *= Resolution.x / Resolution.y;

	//distance (for attenuation)
	float D = length(LightDir);

	//normalize vectors
	vec3 N = normalize(NormalMap * 2.0 - 1.0);
	vec3 L = normalize(LightDir);

	//premultiply light color with intensity
	//then perform N dot L
	vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);

	//premultiply ambient color with intensity
	vec3 Ambient = AmbientColor.rgb * AmbientColor.a;

	//attenuation
	float Attenuation = 1.0 / (Falloff.x + (Falloff.y*D) + (Falloff.z*D*D));

	//combine colors
	vec3 Intensity = Ambient + Diffuse * Attenuation;
	vec3 FinalColor = DiffuseColor.rgb * Intensity;
	gl_FragColor = vColor * vec4(FinalColor, DiffuseColor.a);
}