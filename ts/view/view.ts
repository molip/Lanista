"use strict";

namespace View 
{
	export function init()
	{
		View.Canvas.init();
	}

	export function getCanvas(): HTMLCanvasElement
	{
		return <HTMLCanvasElement>document.getElementById("canvas_ludus");
	}

	export function showInfo(title: string, description: string)
	{
		let page = new Page(title);
		page.div.innerHTML = '<p>' + description + '</p>';
		page.show();
	}

	export function setHUDText(text: string)
	{
		document.getElementById('hud_span').innerText = text;
	}
}