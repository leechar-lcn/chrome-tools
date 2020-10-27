/*
 * @version: v0.0.1
 */

// @ts-ignore
let enable = false;
// @ts-ignore
const v1 = uuid.v1;

const FORMELEMENT = "input,textarea,select,radio";

const ua = navigator.userAgent;
const isMac = /Mac/i.test(ua);
const isWin = /windows/i.test(ua);

const rightFormElement = (ele: HTMLElement) => {
  if (ele.tagName === "A" || ele.tagName === "P") return false;
  return FORMELEMENT.indexOf(ele.tagName.toLocaleLowerCase()) !== -1;
};

const setCache = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

const getCache = (key: string) => {
  return localStorage.getItem(key);
};

const clearCache = (key: string) => {
  return localStorage.removeItem(key);
};

/** 给下一个兄弟元素注入索引 */
const injectPathForNextElement = (
  ele: HTMLElement,
  path: string,
  paths: string[]
) => {
  if (!ele) return;
  if (rightFormElement(ele)) {
    let lastPath = Number(path.slice(-1)) + 1;
    let finalPath = path.slice(0, -1) + lastPath;
    paths.push(finalPath);
    ele.dataset.autofillPath = finalPath;
  } else {
    injectPathForNextElement(
      ele.nextElementSibling as HTMLElement,
      path,
      paths
    );
  }
};

/** 给所有表单元素注入 dom 层级索引 */
const injectPathForFormElement = (
  children: HTMLElement[],
  path: string,
  paths: string[] = []
) => {
  Array.from(children).forEach((item, i) => {
    const { children: itemChild } = item;

    if (itemChild && itemChild.length) {
      injectPathForFormElement(itemChild as any, path + "-" + i, paths);
    }

    if (!item.dataset.autofillPath) {
      if (rightFormElement(item)) {
        paths.push(path);
        item.dataset.autofillPath = path;
      }
    }

    injectPathForNextElement(
      item.nextElementSibling as HTMLElement,
      path,
      paths
    );
  });

  return paths;
};

// @ts-ignore
const eventTarget = new Event("input", { bubbles: true });

/** 恢复数据 */
const restoreDataFromStorage = (paths: string[]) => {
  paths.forEach((path) => {
    const target = document.querySelector(`[data-autofill-path="${path}"]`);
    if (target) {
      let cache = getCache(path);
      if (cache) {
        // @ts-ignore
        target.value = cache;
        target.dispatchEvent(eventTarget);
      }
    }
  });
};

/** 创建触发器 */
const createTrigger = () => {
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

/** 点击记住 */
const onRemember = (id: string) => {
  const target = document.querySelector(
    `[data-autofill="${id}"]`
  ) as HTMLElement;
  if (target) {
    const key = target.dataset.autofillPath;
    // @ts-ignore
    setCache(key, target.value);
  }
};

/** 点击清除 */
const onClear = (id: string) => {
  const target = document.querySelector(
    `[data-autofill="${id}"]`
  ) as HTMLElement;
  if (target) {
    const key = target.dataset.autofillPath;

    if (key) {
      clearCache(key);
    }
  }
};

const onClick = (e: MouseEvent) => {
  // @ts-ignore
  e.target.style.backgroundColor = (enable = !enable) ? "blue" : "gray";
  controllFloatWindow(enable);
};

/** 创建浮窗 */
const createFloatWindow = (x: number, y: number, id: string) => {
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

/** 控制浮窗的显示状态 */
const controllFloatWindow = (use: boolean) => {
  const allForm = [...document.querySelectorAll(FORMELEMENT)]
    .filter((ele: any) => ele.type !== "submit")
    .map((ele: any) => {
      if (!ele.dataset.autofill) {
        ele.dataset.autofill = v1();
      }

      return ele;
    }) as HTMLElement[];

  allForm.forEach((ele) => {
    const id = ele.dataset.autofill;

    if (use) {
      const { x, y } = ele.getBoundingClientRect();
      createFloatWindow(x, y, id!);
    } else {
      let target = document.getElementById(id!);
      target && (target.style.display = "none");
    }
  });
};

const toggleTrigger = () => {
  const status = $(trigger).css("display");
  const display = status === "block" ? "none" : "block";

  $(trigger).css({ display });

  if (display === "none" && enable) {
    controllFloatWindow((enable = false));
    $(trigger).css({ backgroundColor: "gray" });
  }
};

// [ctrl/command] + shift + key
const keydown = (e: KeyboardEvent) => {
  if (isMac) {
    const { metaKey, key, shiftKey } = e;
    if (metaKey && shiftKey && key.toLocaleLowerCase() === "f") {
      e.preventDefault();
      toggleTrigger();
    }
  }
};

const paths = injectPathForFormElement(document.body.children as any, "0");
restoreDataFromStorage(paths);

const trigger = createTrigger();
trigger.addEventListener("click", onClick);

window.addEventListener("resize", () => controllFloatWindow(enable));
window.addEventListener("keydown", keydown);

console.log(isMac);
