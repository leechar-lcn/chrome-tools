const style = `
position: fixed;
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

let enable = false

const createElement = () => {
	const div = document.createElement('div')

	div.innerText = 'AutoFill'
	div.style.cssText = style

	document.body.append(div)

	return div
}

const controllAllForm = use => {
	const FORMELEMENT = 'input,textarea,select,radio'

	const allForm = [...document.querySelectorAll(FORMELEMENT)].filter(
		ele => ele.type !== 'submit' && (ele.className !== '' || ele.id !== '')
	)

	// TODO use 为true时，给所有表单的右上角添加一个浮窗按钮，文本为 【记住】。use 为 false 时，把所有表单的浮窗去掉。
	if (use) {
	} else {
	}
}

const onClick = e => {
	e.target.style.backgroundColor = (enable = !enable) ? 'blue' : 'gray'
	controllAllForm(enable)
}

createElement().addEventListener('click', onClick)
