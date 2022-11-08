import { Component, Engine } from "../../../src/index";

export default class Raytracking extends Component {
  public scene: Scene = {
    camera: {
      point: {
        x: 0,
        y: 1.8,
        z: 10,
      },
      fieldOfView: 45,
      vector: {
        x: 0,
        y: 3,
        z: 0,
      },
    },
    lights: [
      {
        x: -30,
        y: -10,
        z: 20,
      },
    ],
    objects: [
      {
        type: "sphere",
        point: {
          x: 0,
          y: 3.5,
          z: -3,
        },
        color: {
          x: 155,
          y: 200,
          z: 155,
        },
        specular: 0.2,
        lambert: 0.7,
        ambient: 0.1,
        radius: 3,
      },
      {
        type: "sphere",
        point: {
          x: -4,
          y: 2,
          z: -1,
        },
        color: {
          x: 155,
          y: 155,
          z: 155,
        },
        specular: 0.1,
        lambert: 0.9,
        ambient: 0.0,
        radius: 0.2,
      },
      {
        type: "sphere",
        point: {
          x: -4,
          y: 3,
          z: -1,
        },
        color: {
          x: 255,
          y: 255,
          z: 255,
        },
        specular: 0.2,
        lambert: 0.7,
        ambient: 0.1,
        radius: 0.1,
      },
    ]
  }
  public data: ImageData
  public planet1: number = 0;
  public planet2: number = 0;

  constructor(x: Engine, y?: Component) {
    super(x, y)
    this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }

  render(scene: Scene) {
    let eyeVector = Vector.unitVector(Vector.subtract(this.scene.camera.vector, this.scene.camera.point)),
      vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
      vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),
      fovRadians = (Math.PI * (this.scene.camera.fieldOfView / 2)) / 180,
      heightWidthRatio = this.canvas.height / this.canvas.width,
      halfWidth = Math.tan(fovRadians),
      halfHeight = heightWidthRatio * halfWidth,
      cameraWidth = halfWidth * 2,
      cameraHeight = halfHeight * 2,
      pixelWidth = cameraWidth / (this.canvas.width - 1),
      pixelHeight = cameraHeight / (this.canvas.height - 1)
    let index: number, color: Vector
    let ray = {
      point: this.scene.camera.point,
      vector: Vector.ZERO
    } as Ray
    for (let x = 0; x < this.canvas.width; x++) {
      for (let y = 0; y < this.canvas.height; y++) {
        let xcomp = Vector.scale(vpRight, x * pixelWidth - halfWidth),
          ycomp = Vector.scale(vpUp, y * pixelHeight - halfHeight);

        ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

        // use the vector generated to raytrace the scene, returning a color
        // as a `{x, y, z}` vector of RGB values
        color = this.trace(ray, scene, 0)!;
        (index = x * 4 + y * this.canvas.width * 4), (this.data.data[index + 0] = color!.x);
        console.log(index)
        this.data.data[index + 1] = color!.y;
        this.data.data[index + 2] = color!.z;
        this.data.data[index + 3] = 255;
      }
    }
    this.ctx.putImageData(this.data, 0, 0)
  }

  trace(ray: Ray, scene: Scene, depth: number): Vector | void {
    if (depth > 3) return;
    let distObject = this.intersectScene(ray, scene);

    // If we don't hit anything, fill this pixel with the background color -
    // in this case, white.
    if (distObject[0] === Infinity) {
      return Vector.WHITE;
    }

    let dist = distObject[0],
      object = distObject[1];

    // The `pointAtTime` is another way of saying the 'intersection point'
    // of this ray into this object. We compute this by simply taking
    // the direction of the ray and making it as long as the distance
    // returned by the intersection check.
    let pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist!));

    return this.surface(
      ray,
      scene,
      object!,
      pointAtTime,
      this.sphereNormal(object!, pointAtTime),
      depth
    );
  }

  intersectScene(ray: Ray, scene: Scene) {
    let closest = [Infinity, null] as [number, Object | null];
    // But for each object, we check whether it has any intersection,
    // and compare that intersection - is it closer than `Infinity` at first,
    // and then is it closer than other objects that have been hit?
    for (let i = 0; i < scene.objects.length; i++) {
      let object = scene.objects[i],
        dist = this.sphereIntersection(object, ray);
      if (dist !== undefined && dist < closest[0]!) {
        closest = [dist, object];
      }
    }
    return closest;
  }

  sphereIntersection(sphere: Object, ray: Ray) {
    let eye_to_center = Vector.subtract(sphere.point, ray.point),
      // picture a triangle with one side going straight from the camera point
      // to the center of the sphere, another side being the vector.
      // the final side is a right angle.
      //
      // This equation first figures out the length of the vector side
      v = Vector.dotProduct(eye_to_center, ray.vector),
      // then the length of the straight from the camera to the center
      // of the sphere
      eoDot = Vector.dotProduct(eye_to_center, eye_to_center),
      // and compute a segment from the right angle of the triangle to a point
      // on the `v` line that also intersects the circle
      discriminant = sphere.radius * sphere.radius - eoDot + v * v;
    // If the discriminant is negative, that means that the sphere hasn't
    // been hit by the ray
    if (discriminant < 0) {
      return;
    } else {
      // otherwise, we return the distance from the camera point to the sphere
      // `Math.sqrt(dotProduct(a, a))` is the length of a vector, so
      // `v - Math.sqrt(discriminant)` means the length of the the vector
      // just from the camera to the intersection point.
      return v - Math.sqrt(discriminant);
    }
  }

  sphereNormal(sphere: Object, pos: Vector) {
    return Vector.unitVector(Vector.subtract(pos, sphere.point));
  }

  surface(ray: Ray, scene: Scene, object: Object, pointAtTime: Vector, normal: Vector, depth: number) {
    let b = object.color,
      c = Vector.ZERO,
      lambertAmount = 0;

    // **[Lambert shading](http://en.wikipedia.org/wiki/Lambertian_reflectance)**
    // is our pretty shading, which shows gradations from the most lit point on
    // the object to the least.
    if (object.lambert) {
      for (var i = 0; i < scene.lights.length; i++) {
        let lightPoint = scene.lights[i];
        // First: can we see the light? If not, this is a shadowy area
        // and it gets no light from the lambert shading process.
        if (!this.isLightVisible(pointAtTime, scene, lightPoint)) continue;
        // Otherwise, calculate the lambertian reflectance, which
        // essentially is a 'diffuse' lighting system - direct light
        // is bright, and from there, less direct light is gradually,
        // beautifully, less light.
        let contribution = Vector.dotProduct(
          Vector.unitVector(Vector.subtract(lightPoint, pointAtTime)),
          normal
        );
        // sometimes this formula can return negatives, so we check:
        // we only want positive values for lighting.
        if (contribution > 0) lambertAmount += contribution;
      }
    }

    // **[Specular](https://en.wikipedia.org/wiki/Specular_reflection)** is a fancy word for 'reflective': rays that hit objects
    // with specular surfaces bounce off and acquire the colors of other objects
    // they bounce into.
    if (object.specular) {
      // This is basically the same thing as what we did in `render()`, just
      // instead of looking from the viewpoint of the camera, we're looking
      // from a point on the surface of a shiny object, seeing what it sees
      // and making that part of a reflection.
      let reflectedRay = {
        point: pointAtTime,
        vector: Vector.reflectThrough(ray.vector, normal),
      };
      var reflectedColor = this.trace(reflectedRay, scene, ++depth);
      if (reflectedColor) {
        c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
      }
    }

    // lambert should never 'blow out' the lighting of an object,
    // even if the ray bounces between a lot of things and hits lights
    lambertAmount = Math.min(1, lambertAmount);

    // **Ambient** colors shine bright regardless of whether there's a light visible -
    // a circle with a totally ambient blue color will always just be a flat blue
    // circle.
    return Vector.add3(
      c,
      Vector.scale(b, lambertAmount * object.lambert),
      Vector.scale(b, object.ambient)
    );
  }

  isLightVisible(pt: Vector, scene: Scene, light: Vector) {
    let distObject = this.intersectScene(
      {
        point: pt,
        vector: Vector.unitVector(Vector.subtract(pt, light)),
      },
      scene
    );
    return distObject[0] > -0.005;
  }

  logic() {
    this.planet1 += 0.1;
    this.planet2 += 0.2;

    // set the position of each moon with some trig.
    this.scene.objects[1].point.x = Math.sin(this.planet1) * 3.5;
    this.scene.objects[1].point.z = -3 + Math.cos(this.planet1) * 3.5;

    this.scene.objects[2].point.x = Math.sin(this.planet2) * 4;
    this.scene.objects[2].point.z = -3 + Math.cos(this.planet2) * 4;
    this.render(this.scene)
    console.log("hi")
  }
}

interface Ray {
  point: Vector,
  vector: Vector
}

interface XYZ {
  x: number,
  y: number,
  z: number
}
interface Object {
  type: string,
  point: XYZ,
  color: XYZ,
  specular: number,
  lambert: number,
  ambient: number,
  radius: number,
}

interface Scene {
  camera: {
    point: XYZ,
    vector: XYZ,
    fieldOfView: number
  },
  lights: XYZ[],
  objects: Object[]
}

// https://tmcw.github.io/literate-raytracer/
let Vector = {
  UP: { x: 0, y: 0, z: 0 } as Vector,
  ZERO: { x: 0, y: 0, z: 0 } as Vector,
  WHITE: { x: 255, y: 255, z: 255 } as Vector,
  ZEROcp: (): Vector => { return { x: 0, y: 0, z: 0 } },
  dotProduct: (a: Vector, b: Vector): number => {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
  },
  crossProduct: (a: Vector, b: Vector): Vector => {
    return {
      x: (a.y * b.z) - (a.z * b.y),
      y: (a.z * b.x) - (a.x * b.z),
      z: (a.x * b.y) - (a.y * b.x)
    };
  },
  scale: (a: Vector, t: number): Vector => {
    return {
      x: a.x * t,
      y: a.y * t,
      z: a.z * t
    };
  },
  unitVector: (a: Vector): Vector => {
    return Vector.scale(a, 1 / Vector.length(a))
  },
  add: (a: Vector, b: Vector): Vector => {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z
    };
  },
  add3: (a: Vector, b: Vector, c: Vector): Vector => {
    return {
      x: a.x + b.x + c.x,
      y: a.y + b.y + c.y,
      z: a.z + b.z + c.z
    };
  },
  subtract: (a: Vector, b: Vector): Vector => {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z
    };
  },
  length: (a: Vector): number => {
    return Math.sqrt(Vector.dotProduct(a, a));
  },
  reflectThrough: (a: Vector, normal: Vector): Vector => {
    let d = Vector.scale(normal, Vector.dotProduct(a, normal));
    return Vector.subtract(Vector.scale(d, 2), a);
  }
}

type Vector = XYZ