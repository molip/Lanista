"use strict";

namespace View 
{
	export let Width = 1280;
	export let Height = 720;

	export function init()
	{
		View.Canvas.init();
		View.updateLayout();
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

	export function updateLayout()
	{
		let width = document.documentElement.clientWidth;
		let height = document.documentElement.clientHeight;
		let offset = new Point(0, 0);
		let scale = 1;

		let sx = width / View.Width;
		let sy = height / View.Height;
		let imageAspect = View.Width / View.Height;

		if (sx < sy)
		{
			let devHeight = width / imageAspect;
			offset = new Point(0, (height - devHeight) / 2);
			scale = sx;
		}
		else 
		{
			let devWidth = height * imageAspect;
			offset = new Point((width - devWidth) / 2, 0);
			scale = sy;
		}

		let div = document.getElementById('master_div');
		div.style.top = offset.y.toString() + 'px';
		div.style.bottom = offset.y.toString() + 'px';
		div.style.left = offset.x.toString() + 'px';
		div.style.right = offset.x.toString() + 'px';
		div.style.fontSize = (scale * 20).toString() + 'px';

		View.Canvas.draw();
	}
}
