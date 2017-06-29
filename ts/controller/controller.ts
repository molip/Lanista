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
				new View.NewsPage(() => { Model.state.advancePhase(); }).show();
				break;
			case Model.Phase.Event:
				showEventUI(Model.state.getEventsForDay(Model.state.getDay()));
				break;
			case Model.Phase.Fight:
				new View.FightPage().show();
				break;
		}

		updateHUD();
	}

	function showEventUI(events: Model.Event[])
	{
		Util.assert(events.length == 1);

		if (events[0].type == 'fight')
			new View.ArenaPage(events[0]).show();
		else
			Util.assert(false);
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

	export function onSkipDayClicked()
	{
		Model.state.skipToNextDay(true);
		View.ludus.updateObjects();
	}

	function onHomeTriggerClicked()
	{
		let page = new View.HomePage();
		page.show();
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
		let page = new View.StoragePage();
		page.show();
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
		View.showInfo('Arena', 'TODO.');
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
		if (evt.keyCode == 27) // Escape.
		{
			if (View.Page.Current)
			{
				View.Page.hideCurrent();
			}
			else if (View.isTransitioning())
			{
				View.cancelTransition();
				Model.state.cancelNight();
			}
		}
	}
}
