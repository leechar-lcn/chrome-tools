let enable = false
const v1 = uuid.v1

const FORMELEMENT = 'input,textarea,select,radio'

const rightFormElement = ele => {
	if (ele.tagName === 'A' || ele.tagName === 'P') return false
	return FORMELEMENT.indexOf(ele.tagName.toLocaleLowerCase()) !== -1
}

// 给下一个兄弟元素注入索引
const injectPathForNextElement = (ele, path, paths) => {
	if (!ele) return
	if (rightFormElement(ele)) {
		let lastPath = Number(path.slice(-1)) + 1
		let finalPath = path.slice(0, -1) + lastPath
		paths.push(finalPath)
		ele.dataset.autofillPath = finalPath
	} else {
		injectPathForNextElement(ele.nextElementSibling, path, paths)
	}
}

// 给所有表单元素注入 dom 层级索引
const injectPathForFormElement = (children, path, paths = []) => {
	Array.from(children).forEach((item, i) => {
		const { children: itemChild } = item
		injectPathForNextElement(item.nextElementSibling, path, paths)

		if (itemChild && itemChild.length) {
			injectPathForFormElement(itemChild, path + '-' + i, paths)
		} else {
			if (!item.dataset.autofillPath) {
				if (rightFormElement(item)) {
					paths.push(path)
					item.dataset.autofillPath = path
				}
			}
		}
	})

	return paths
}

// 恢复数据
const restoreDataFromStorage = paths => {
	paths.forEach(path => {
		const target = document.querySelector(`[data-autofill-path="${path}"]`)
		if (target) {
			let cache = localStorage.getItem(path)
			if (cache) {
				target.value = cache
			}
		}
	})
}

// 创建启动按钮
const createElement = () => {
	const div = document.createElement('div')
	div.innerText = 'AutoFill'
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
	`

	document.body.append(div)

	return div
}

// 记住
const onRemember = id => {
	const target = document.querySelector(`[data-autofill="${id}"]`)
	if (target) {
		const key = target.dataset.autofillPath
		localStorage.setItem(key, target.value)
	}
}

// 清除
const onClear = id => {
	const target = document.querySelector(`[data-autofill="${id}"]`)
	if (target) {
		const key = target.dataset.autofillPath
		localStorage.removeItem(key)
	}
}

// 记住和清楚的浮窗
const createFloatWindow = (x, y, id) => {
	let div = document.getElementById(id)

	if (!div) {
		div = document.createElement('div')
		document.body.append(div)
	}

	div.id = id
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
`

	const remember = $(
		`<span style="margin-right: 10px;padding-right: 10px;border-right: 1px solid #ddd;cursor: pointer">记住</span>`
	).on('click', () => onRemember(id))

	const clear = $(`<span style="cursor: pointer">清除</span>`).on('click', () =>
		onClear(id)
	)

	$(div).html('')
	$(div).append(remember, clear)

	return div
}

// 控制浮窗的显示状态
const controllAllForm = use => {
	const allForm = [...document.querySelectorAll(FORMELEMENT)]
		.filter(
			ele => ele.type !== 'submit' && (ele.className !== '' || ele.id !== '')
		)
		.map(ele => {
			if (!ele.dataset.autofill) {
				ele.dataset.autofill = v1()
			}

			return ele
		})

	allForm.forEach(ele => {
		const id = ele.dataset.autofill

		if (use) {
			const { x, y } = ele.getBoundingClientRect()
			createFloatWindow(x, y, id)
		} else {
			let target = document.getElementById(id)
			target && (target.style.display = 'none')
		}
	})
}

// autofill 点击事件
const onClick = e => {
	e.target.style.backgroundColor = (enable = !enable) ? 'blue' : 'gray'
	controllAllForm(enable)
}

// 延迟处理逻辑
// let timer = null
// new MutationObserver(() => {
// 	if (timer) clearTimeout(timer)

// 	timer = setTimeout(() => {
// 		const paths = injectPathForFormElement(document.body.children, '0')
// 		restoreDataFromStorage(paths)
// 	}, 1000)
// }).observe(document.body, { childList: true })

const paths = injectPathForFormElement(document.body.children, '0')
restoreDataFromStorage(paths)
createElement().addEventListener('click', onClick)
window.addEventListener('resize', () => controllAllForm(enable))
