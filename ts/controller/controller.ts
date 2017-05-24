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

		window.setInterval(Controller.onTick, 1000);

		window.addEventListener('keydown', Controller.onKeyDown);
		window.addEventListener('resize', View.updateLayout);

		if (Model.state.fight)
			showFightPage();
	}

	export function setSpeed(speed: number)
	{
		Model.state.setSpeed(speed);
		View.updateSpeedButtons();
	}

	export function onResize()
	{
		View.updateLayout();
	}

	export function onTick()
	{
		if (View.Page.Current)
			return;

		if (View.isTransitioning())
			return;

		switch (Model.state.phase)
		{
			case Model.Phase.Day:
				View.enable(true);
				if (Model.state.update(1))
					View.ludus.updateObjects();
				break;
			case Model.Phase.Dawn:
				View.enable(false);
				startTransition(false);
				break;
			case Model.Phase.Dusk:
				View.enable(false);
				startTransition(true);
				break;
			case Model.Phase.News:
			case Model.Phase.Event:
				new View.NewsPage(() => { Model.state.advancePhase(); }).show();
				break;
		}

		updateHUD();
	}

	function startTransition(dusk: boolean)
	{
		View.startTransition(new View.Transition(dusk, () => { Model.state.advancePhase(); }));
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
			View.updateSpeedButtons();
			Controller.onTick();
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

	function showFightPage()
	{
		let page = new View.FightPage();
		page.show();
	}

	export function updateHUD()
	{
		let money = ' Money: ' + Util.formatMoney(Model.state.getMoney());
		let time = Model.state.getTimeString();
		View.setHUDText(money, time);
	}

	export function onKeyDown(evt: KeyboardEvent)
	{
		if (evt.keyCode == 27)
			View.Page.hideCurrent();
	}
}
