const { Color, Num, Noise, Context, Anim } = bljs;
const { HSlider, TextInput, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const model = {
  text: "Distort",
  fontSize: 100,
  res: 1,
  z: 0,
  offset: 10,
  speed: 0.1,
  scale: 0.01,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 440, 440);
const canvas = new Canvas(panel, 20, 20, 400, 200);
const context = canvas.context;
Context.extendContext(context);

const buffer = new bljs.Canvas(null, 400, 200);
buffer.context.clearWhite();
buffer.context.font = model.fontSize + "px Arial";
buffer.context.textAlign = "center";
buffer.context.fillText(model.text, 200, 80);
let imageData = buffer.context.getImageData(0, 0, 400, 200).data;

new TextInput(panel, 20, 240, "Distort", event => {
  model.text = event.detail;
  buffer.context.clearWhite();
  buffer.context.fillText(model.text, 200, 80);
  imageData = buffer.context.getImageData(0, 0, 400, 200).data;
});

new HSlider(panel, 20, 280, "Offset", model.offset, 0, 100)
  .bind(model, "offset");

new HSlider(panel, 20, 320, "Speed", model.speed, 0.01, 0.5)
  .setDecimals(2)
  .bind(model, "speed");

new HSlider(panel, 20, 360, "Noise Scale", model.scale, 0, 0.1)
  .setDecimals(3)
  .bind(model, "scale");

/////////////////////////////
// VIEW
/////////////////////////////

const anim = new Anim(render);
anim.run();

render();
function render(fps) {
  const scale = model.scale;
  context.clearWhite();
  for (let x = 0; x < 400; x += model.res) {
    for (let y = 0; y < 200; y += model.res) {
      const n = Noise.perlin(x * scale, y * scale, model.z) * Math.PI - Math.PI / 2;
      const xx = Math.round(x + Math.cos(n) * model.offset);
      const yy = Math.round(y + Math.sin(n) * model.offset);
      if (xx >= 0 && xx < 400 && yy >= 0 && yy < 200) {
        const index = (yy * 400 + xx) * 4;
        if (imageData[index] < 255) {
          context.fillStyle = Color.gray(imageData[index]);
          context.fillRect(x, y, model.res, model.res);
        }
      }
    }
  }
  model.z += model.speed;
}
