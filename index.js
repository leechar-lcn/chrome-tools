let enable = false;
const v1 = uuid.v1;

const createElement = () => {
  const div = document.createElement("div");
  div.innerText = "AutoFill";
  div.style.cssText = `
	position: fixed;
	z-index: 99999999;
	right: 50px;
	bottom: 50px;
	text-align: center;
	line-height: 80px;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background-color: gray;
	color: #fff;
	cursor: pointer;
	box-shadow: rgb(101 82 255) 0 0 10px;
	user-select: none;
	`;

  document.body.append(div);

  return div;
};

const onRemember = (id) => {
  console.log(id);
};

const onClear = (id) => {
  console.log(id);
};

const createFloatWindow = (x, y, id) => {
  let div = document.getElementById(id);

  if (!div) {
    div = document.createElement("div");
    document.body.append(div);
  }

  div.id = id;
  div.style.cssText = `
	width: 100px;
	height:	40px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	z-index: 999999;
	left: ${x}px;
	top: ${y - 40}px;
	background: blue;
	color: #fff;
`;

  const remember = $(
    `<span style="margin-right: 10px;padding-right: 10px;border-right: 1px solid #ddd;cursor: pointer">记住</span>`
  ).on("click", () => onRemember(id));

  const clear = $(`<span style="cursor: pointer">清除</span>`).on("click", () =>
    onClear(id)
  );

  $(div).html("");
  $(div).append(remember, clear);

  return div;
};

const controllAllForm = (use) => {
  const FORMELEMENT = "input,textarea,select,radio";

  const allForm = [...document.querySelectorAll(FORMELEMENT)]
    .filter(
      (ele) => ele.type !== "submit" && (ele.className !== "" || ele.id !== "")
    )
    .map((ele) => {
      if (!ele.dataset.autofill) {
        ele.dataset.autofill = v1();
      }

      return ele;
    });

  allForm.forEach((ele) => {
    const id = ele.dataset.autofill;
    if (use) {
      const { x, y } = ele.getBoundingClientRect();
      createFloatWindow(x, y, id);
    } else {
      let target = document.getElementById(id);
      target && (target.style.display = "none");
    }
  });
};

const onClick = (e) => {
  e.target.style.backgroundColor = (enable = !enable) ? "blue" : "gray";
  controllAllForm(enable);
};

createElement().addEventListener("click", onClick);

window.addEventListener("resize", () => controllAllForm(enable));
window.addEventListener("popstate", () => {
  console.log(1);
  enable = false;
  controllAllForm(false);
});
