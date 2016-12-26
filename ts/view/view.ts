"use strict";

namespace View 
{
	export let Width = 1280;
	export let Height = 720;
	export let ludus: Ludus;

	let speeds = [0, 1, 10, 60];

	export function init()
	{
		View.ludus = new Ludus();
		View.updateLayout();

		document.getElementById('reset_btn').addEventListener('click', Controller.onResetClicked);
		document.getElementById('debug_btn').addEventListener('click', Controller.onDebugClicked);

		for (let i = 0; i < speeds.length; ++i)
		{
			document.getElementById('speed_label_' + i).innerText = 'x' + speeds[i];
			let button = document.getElementById('speed_btn_' + i);
			button.addEventListener('click', () => { Controller.setSpeed(speeds[i]); });
		}

		updateSpeedButtons();
	}

	export function showInfo(title: string, description: string)
	{
		let page = new Page(title);
		page.div.innerHTML = '<p>' + description + '</p>';
		page.show();
	}

	export function setHUDText(money: string, time: string)
	{
		document.getElementById('hud_money_span').innerText = money;
		document.getElementById('hud_time_span').innerText = time;
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

		View.ludus.draw();
	}

	export function updateSpeedButtons()
	{
		for (let i = 0; i < speeds.length; ++i)
		{
			let button = <HTMLInputElement>document.getElementById('speed_btn_' + i);
			button.checked = Model.state.speed == speeds[i];
		}
	}
}
