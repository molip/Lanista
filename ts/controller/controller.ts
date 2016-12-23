"use strict";

namespace Controller
{
	export function onLoad()
	{
		Data.validate();
		Model.init();
		View.init();
		Controller.Canvas.init();

		updateHUD();

		window.setInterval(Controller.onTick, 100);

		window.addEventListener('keydown', Controller.onKeyDown);
		window.addEventListener('resize', View.updateLayout);

		document.getElementById('reset_btn').addEventListener('click', Controller.onResetClicked);
		document.getElementById('debug_btn').addEventListener('click', Controller.onDebugClicked);

		if (Model.state.fight)
			onArenaTriggerClicked();
	}

	export function onResize()
	{
		View.updateLayout();
	}

	export function onTick()
	{
		if (Model.state.update(0.1))
		{
			View.ludus.updateObjects();
			updateHUD();
		}
	}

	export function onBuildingTriggerClicked(id: string)
	{
		var handlers: { [key: string]: any; } = {
			'home': onHomeTriggerClicked,
			'barracks': onBarracksTriggerClicked,
			'kennels': onKennelsTriggerClicked,
			'storage': onStorageTriggerClicked,
			'weapon': onWeaponTriggerClicked,
			'armour': onArmourTriggerClicked,
			'training': onTrainingTriggerClicked,
			'surgery': onSurgeryTriggerClicked,
			'lab': onLabTriggerClicked,
			'merch': onMerchTriggerClicked,
			'arena': onArenaTriggerClicked,
		};
		Util.assert(handlers[id]);
		handlers[id]();
	}

	export function onResetClicked()
	{
		if (confirm('Reset game?'))
		{
			Model.resetState();
			updateHUD();
			View.ludus.initObjects();
		}
	}

	export function onDebugClicked()
	{
		new View.DebugPage().show();
	}

	function onHomeTriggerClicked()
	{
		View.showInfo('Home', 'TODO: general stats etc. go here.');
	}

	function onBarracksTriggerClicked()
	{
		let page = new View.BarracksPage();
		page.show();
	}

	function onKennelsTriggerClicked()
	{
		let page = new View.KennelsPage();
		page.show();
	}

	function onStorageTriggerClicked()
	{
		View.showInfo('Storage', 'TODO.');
	}

	function onWeaponTriggerClicked()
	{
		View.showInfo('Weapon', 'TODO.');
	}

	function onArmourTriggerClicked()
	{
		View.showInfo('Armour', 'TODO.');
	}

	function onTrainingTriggerClicked()
	{
		View.showInfo('Training', 'TODO.');
	}

	function onSurgeryTriggerClicked()
	{
		View.showInfo('Surgery', 'TODO.');
	}

	function onLabTriggerClicked()
	{
		View.showInfo('Lab', 'TODO.');
	}

	function onMerchTriggerClicked()
	{
		View.showInfo('Merch', 'TODO.');
	}

	function onArenaTriggerClicked()
	{
		let page = new View.ArenaPage();
		page.show();
	}
	
	export function onTownTriggerClicked()
	{
		Shop.showShopsPage();
	}

	export function updateHUD()
	{
		var text = 'Money: ' + Util.formatMoney(Model.state.getMoney());
		View.setHUDText(text);
	}

	export function onKeyDown(evt: KeyboardEvent)
	{
		if (evt.keyCode == 27)
			View.Page.hideCurrent();
	}
}
