const { Num, Context, Anim } = bljs;
const { Panel, Canvas, Button, HSlider } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const lines = [];
const model = {
  width: 400,
  height: 400,
  speed: 0.01,
  fl: 300,
  z: 500,
};
let line;

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, model.width + 180, model.height + 40);
const canvas = new Canvas(panel, 160, 20, model.width, model.height);
const context = canvas.context;
Context.extendContext(context);

new Button(panel, 20, 20, "Clear", clear);
new HSlider(panel, 20, 60, "Speed", model.speed, -0.1, 0.1)
  .setDecimals(2)
  .setWidth(120)
  .bind(model, "speed");
new HSlider(panel, 20, 100, "Perspective", model.fl, 50, 1000)
  .setWidth(120)
  .bind(model, "fl");
new HSlider(panel, 20, 140, "Z", model.z, 00, 1000)
  .setWidth(120)
  .bind(model, "z");

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();

function render() {
  const sin = Math.sin(model.speed);
  const cos = Math.cos(model.speed);
  context.clearWhite();
  context.save();
  context.translate(model.width / 2, model.height / 2);
  lines.forEach(line => {
    line.forEach(p => {
      const x = p.x * cos - p.z * sin;
      const z = p.z * cos + p.x * sin;
      p.x = x;
      p.z = z;
    });
  });

  lines.forEach(line => {
    for (let i = 0; i < line.length - 1; i++) {
      const p0 = line[i];
      const p1 = line[i + 1];
      if (p0.z + model.z < -model.fl || p1.z + model.z < -model.fl) {
        continue;
      }
      let scale = model.fl / ( model.fl + p0.z + model.z);
      context.beginPath();
      context.lineWidth = scale;
      context.moveTo(p0.x * scale, p0.y * scale);
      scale = model.fl / ( model.fl + p1.z + model.z);
      context.lineTo(p1.x * scale, p1.y * scale);
      context.stroke();
    }
  });

  context.restore();
}

canvas.addEventListener("mousedown", onMouseDown);

function onMouseDown(event) {
  line = [];
  lines.push(line);

  const x = event.clientX - canvas.getBoundingClientRect().left - model.width / 2;
  const y = event.clientY - canvas.getBoundingClientRect().top - model.height / 2;
  line.push({x, y, z: -model.z});
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(event) {
  const x = event.clientX - canvas.getBoundingClientRect().left - model.width / 2;
  const y = event.clientY - canvas.getBoundingClientRect().top - model.height / 2;
  line.push({x, y, z: -model.z});
}

function onMouseUp() {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

function clear() {
  lines.length = 0;
}
